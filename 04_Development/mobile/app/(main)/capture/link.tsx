import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Stack as ExpoStack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { capturesApi } from '../../../src/modules/captures/services/api';
import { colors } from '../../../src/shared/theme/colors';
import * as Clipboard from 'expo-clipboard';

export default function LinkCaptureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [url, setUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // Auto-paste URL if available
  useEffect(() => {
    const checkClipboard = async () => {
      const hasStr = await Clipboard.hasStringAsync();
      if (hasStr) {
        const str = await Clipboard.getStringAsync();
        if (str && (str.startsWith('http://') || str.startsWith('https://'))) {
          setUrl(str);
        }
      }
    };
    checkClipboard();
  }, []);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;  
    }
  };

  const handleSave = async () => {
    if (!url.trim()) return;
    
    let processedUrl = url.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }

    if (!isValidUrl(processedUrl)) {
      setError('Please enter a valid URL');
      return;
    }
    
    setError('');
    setIsUploading(true);
    
    try {
      await capturesApi.createUrl({
        url: processedUrl
      });
      console.log('URL saved successfully');
      router.back();
    } catch (err) {
      console.error('Failed to save URL:', err);
      setError('Failed to save link. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ExpoStack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Save Link',
          headerStyle: { backgroundColor: colors['surface-container-lowest'] },
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
              <Ionicons name="arrow-back" size={24} color={colors['on-surface']} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable 
              onPress={handleSave} 
              disabled={isUploading || !url.trim()}
              style={[
                styles.saveBtn,
                (!url.trim() || isUploading) && { opacity: 0.5 }
              ]}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
              )}
            </Pressable>
          )
        }}
      />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="link" size={48} color={colors.primary} />
        </View>
        
        <Text style={styles.title}>Save a Web Link</Text>
        <Text style={styles.subtitle}>
          YRecall will automatically extract the title, description, thumbnail, and author.
        </Text>
        
        <View style={[styles.inputContainer, error ? styles.inputError : null]}>
          <Ionicons name="globe-outline" size={20} color={colors['on-surface-variant']} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="https://example.com"
            placeholderTextColor={colors['on-surface-variant']}
            value={url}
            onChangeText={(text) => {
              setUrl(text);
              if (error) setError('');
            }}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
          {url.length > 0 && (
            <Pressable onPress={() => setUrl('')} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={20} color={colors['on-surface-variant']} />
            </Pressable>
          )}
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['surface-container-lowest'],
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    paddingTop: '20%',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'PublicSans_700Bold',
    fontSize: 24,
    color: colors['on-surface'],
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'PublicSans_400Regular',
    fontSize: 15,
    color: colors['on-surface-variant'],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors['surface-container'],
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    width: '100%',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: colors.error,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors['on-surface'],
    fontFamily: 'PublicSans_500Medium',
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
    fontFamily: 'PublicSans_500Medium',
    fontSize: 14,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveBtnText: {
    color: 'white',
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 14,
  }
});