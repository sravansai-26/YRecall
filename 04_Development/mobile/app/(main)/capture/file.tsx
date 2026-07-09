import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Stack as ExpoStack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { capturesApi } from '../../../src/modules/captures/services/api';
import { colors } from '../../../src/shared/theme/colors';

interface SelectedFile {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error';
}

export default function FileCaptureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return 'document-outline';
    if (mimeType.includes('pdf')) return 'document-text';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('video')) return 'videocam';
    if (mimeType.includes('audio')) return 'musical-notes';
    if (mimeType.includes('text')) return 'document-text-outline';
    if (mimeType.includes('spreadsheet') || mimeType.includes('csv') || mimeType.includes('excel')) return 'grid';
    return 'document';
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles: SelectedFile[] = result.assets.map(asset => ({
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType,
          size: asset.size,
          uploadStatus: 'pending'
        }));
        
        setFiles(prev => [...prev, ...newFiles]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    let hasErrors = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || file.uploadStatus === 'success') continue;

      setFiles(prev => {
        const next = [...prev];
        if (next[i]) next[i]!.uploadStatus = 'uploading';
        return next;
      });

      try {
        await capturesApi.createMedia({
          type: 'document',
          file: {
            uri: file.uri,
            name: file.name,
            type: file.mimeType || 'application/octet-stream',
          }
        });
        
        setFiles(prev => {
          const next = [...prev];
          if (next[i]) next[i]!.uploadStatus = 'success';
          return next;
        });
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        hasErrors = true;
        setFiles(prev => {
          const next = [...prev];
          if (next[i]) next[i]!.uploadStatus = 'error';
          return next;
        });
      }
    }

    setIsUploading(false);
    
    if (!hasErrors) {
      setTimeout(() => router.back(), 500);
    }
  };

  return (
    <View style={styles.container}>
      <ExpoStack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Upload Files',
          headerStyle: { backgroundColor: colors['surface-container-lowest'] },
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
              <Ionicons name="arrow-back" size={24} color={colors['on-surface']} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={pickFile} style={{ padding: 8 }}>
              <Ionicons name="add" size={24} color={colors.primary} />
            </Pressable>
          )
        }}
      />
      
      {files.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={64} color={colors['surface-container-highest']} />
          <Text style={styles.emptyTitle}>No files selected</Text>
          <Text style={styles.emptySubtitle}>Upload documents, PDFs, or any other file type to your memory.</Text>
          
          <Pressable style={styles.browseBtn} onPress={pickFile}>
            <Text style={styles.browseBtnText}>Browse Files</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView style={styles.fileList} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
          {files.map((file, index) => (
            <View key={`${file.uri}-${index}`} style={styles.fileCard}>
              <View style={styles.fileIconContainer}>
                <Ionicons name={getFileIcon(file.mimeType)} size={32} color={colors.primary} />
              </View>
              
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                <Text style={styles.fileMeta}>
                  {formatSize(file.size)} • {file.mimeType?.split('/')[1]?.toUpperCase() || 'FILE'}
                </Text>
              </View>
              
              {file.uploadStatus === 'uploading' ? (
                <ActivityIndicator color={colors.primary} />
              ) : file.uploadStatus === 'success' ? (
                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              ) : file.uploadStatus === 'error' ? (
                <Pressable onPress={uploadFiles}>
                  <Ionicons name="refresh-circle" size={28} color={colors.error} />
                </Pressable>
              ) : (
                <Pressable onPress={() => removeFile(index)} style={{ padding: 4 }}>
                  <Ionicons name="close" size={24} color={colors['on-surface-variant']} />
                </Pressable>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {files.length > 0 && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Pressable 
            style={[styles.uploadBtn, isUploading && { opacity: 0.7 }]} 
            onPress={uploadFiles}
            disabled={isUploading}
          >
            <Text style={styles.uploadBtnText}>
              {isUploading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['surface-container-lowest'],
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: 'PublicSans_700Bold',
    fontSize: 20,
    color: colors['on-surface'],
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'PublicSans_400Regular',
    fontSize: 14,
    color: colors['on-surface-variant'],
    textAlign: 'center',
    marginBottom: 32,
  },
  browseBtn: {
    backgroundColor: colors['surface-container-high'],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseBtnText: {
    fontFamily: 'PublicSans_600SemiBold',
    color: colors['on-surface'],
    fontSize: 16,
  },
  fileList: {
    flex: 1,
    padding: 16,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors['surface-container'],
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  fileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fileInfo: {
    flex: 1,
    marginRight: 16,
  },
  fileName: {
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 16,
    color: colors['on-surface'],
    marginBottom: 4,
  },
  fileMeta: {
    fontFamily: 'PublicSans_500Medium',
    fontSize: 12,
    color: colors['on-surface-variant'],
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: colors['surface-container-lowest'],
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors['surface-container'],
  },
  uploadBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadBtnText: {
    fontFamily: 'PublicSans_700Bold',
    color: 'white',
    fontSize: 16,
  }
});