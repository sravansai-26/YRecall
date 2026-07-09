import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stack as ExpoStack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { capturesApi } from '../../../src/modules/captures/services/api';
import { colors } from '../../../src/shared/theme/colors';

interface SelectedAsset {
  uri: string;
  type: 'image' | 'video';
  fileName?: string | null;
  mimeType?: string;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error';
}

export default function GalleryCaptureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [assets, setAssets] = useState<SelectedAsset[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    pickImages();
  }, []);

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const newAssets: SelectedAsset[] = result.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
          fileName: asset.fileName,
          mimeType: asset.mimeType,
          uploadStatus: 'pending'
        }));
        setAssets(prev => [...prev, ...newAssets]);
      } else if (assets.length === 0) {
        // User cancelled and we have no assets, go back
        router.back();
      }
    } catch (error) {
      console.error('Error picking images:', error);
    }
  };

  const removeAsset = (index: number) => {
    setAssets(prev => prev.filter((_, i) => i !== index));
    if (assets.length === 1) {
      router.back();
    }
  };

  const uploadAll = async () => {
    if (assets.length === 0) return;
    setIsUploading(true);

    let hasErrors = false;
    
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      if (!asset || asset.uploadStatus === 'success') continue;

      setAssets(prev => {
        const next = [...prev];
        if (next[i]) next[i]!.uploadStatus = 'uploading';
        return next;
      });

      try {
        const filename = asset.fileName || asset.uri.split('/').pop() || 'media.jpg';
        const fileType = asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg');
        
        await capturesApi.createMedia({
          type: asset.type,
          file: {
            uri: asset.uri,
            name: filename,
            type: fileType,
          }
        });
        
        setAssets(prev => {
          const next = [...prev];
          if (next[i]) next[i]!.uploadStatus = 'success';
          return next;
        });
      } catch (error) {
        console.error(`Upload failed for ${asset.uri}:`, error);
        hasErrors = true;
        setAssets(prev => {
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
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ExpoStack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Gallery Upload',
          headerStyle: { backgroundColor: colors['surface-container-lowest'] },
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
              <Ionicons name="arrow-back" size={24} color={colors['on-surface']} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={pickImages} style={{ padding: 8 }}>
              <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
            </Pressable>
          )
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {assets.map((asset, index) => (
          <View key={`${asset.uri}-${index}`} style={styles.assetContainer}>
            <Image source={{ uri: asset.uri }} style={styles.thumbnail} />
            
            {/* Status Overlay */}
            {asset.uploadStatus === 'uploading' && (
              <View style={styles.overlay}>
                <ActivityIndicator color="white" size="large" />
              </View>
            )}
            {asset.uploadStatus === 'success' && (
              <View style={[styles.overlay, { backgroundColor: 'rgba(16, 185, 129, 0.4)' }]}>
                <Ionicons name="checkmark-circle" size={40} color="white" />
              </View>
            )}
            {asset.uploadStatus === 'error' && (
              <View style={[styles.overlay, { backgroundColor: 'rgba(239, 68, 68, 0.4)' }]}>
                <Ionicons name="warning" size={40} color="white" />
                <Text style={{ color: 'white', marginTop: 4, fontWeight: 'bold' }}>Retry</Text>
              </View>
            )}
            
            {/* Remove Button */}
            {asset.uploadStatus !== 'uploading' && asset.uploadStatus !== 'success' && (
              <Pressable 
                style={styles.removeBtn} 
                onPress={() => removeAsset(index)}
              >
                <Ionicons name="close-circle" size={24} color="white" />
              </Pressable>
            )}
            
            {asset.type === 'video' && (
              <View style={styles.videoBadge}>
                <Ionicons name="videocam" size={16} color="white" />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      {assets.length > 0 && (
        <View style={styles.bottomBar}>
          <Text style={styles.countText}>{assets.length} items selected</Text>
          <Pressable 
            style={[styles.uploadBtn, isUploading && { opacity: 0.7 }]} 
            onPress={uploadAll}
            disabled={isUploading}
          >
            <Text style={styles.uploadBtnText}>
              {isUploading ? 'Uploading...' : 'Upload All'}
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
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  assetContainer: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors['surface-container'],
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
  },
  videoBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors['surface-container'],
    backgroundColor: colors['surface-container-lowest'],
  },
  countText: {
    fontFamily: 'PublicSans_500Medium',
    color: colors['on-surface'],
    fontSize: 16,
  },
  uploadBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  uploadBtnText: {
    color: 'white',
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 16,
  }
});