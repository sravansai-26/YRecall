import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Stack as ExpoStack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { capturesApi } from '../../../src/modules/captures/services/api';
import { colors } from '../../../src/shared/theme/colors';

export default function CameraCaptureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'on' | 'off' | 'auto'>('off');
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', marginBottom: 20 }}>We need your permission to show the camera</Text>
        <Pressable onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={{ color: 'white' }}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8, // Compression
          exif: true,
          base64: false,
        });
        setPreviewUri(photo.uri);
      } catch (e) {
        console.error(e);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const handleRetake = () => {
    setPreviewUri(null);
  };

  const handleUpload = async () => {
    if (!previewUri) return;
    
    setIsUploading(true);
    try {
      const filename = previewUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      
      const file = {
        uri: previewUri,
        name: filename,
        type,
      };
      
      await capturesApi.createMedia({
        type: 'image',
        file: file,
      });
      console.log('Upload successful');
      router.back();
    } catch (error) {
      console.error('Failed to upload photo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (previewUri) {
    return (
      <View style={styles.container}>
        <ExpoStack.Screen options={{ headerShown: false }} />
        <Image source={{ uri: previewUri }} style={styles.preview} />
        
        <View style={[styles.previewControls, { paddingBottom: insets.bottom + 20 }]}>
          <Pressable onPress={handleRetake} style={styles.iconBtn}>
            <Text style={styles.btnText}>Retake</Text>
          </Pressable>
          <Pressable onPress={handleUpload} style={styles.primaryBtn} disabled={isUploading}>
            <Text style={styles.btnText}>{isUploading ? 'Uploading...' : 'Use Photo'}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoStack.Screen options={{ headerShown: false }} />
      
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        enableTorch={flash === 'on'}
        ref={cameraRef}
      >
        {/* Top Controls */}
        <View style={[styles.topControls, { paddingTop: insets.top + 10 }]}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="close" size={28} color="white" />
          </Pressable>
          <Pressable onPress={toggleFlash} style={styles.iconBtn}>
            <Ionicons 
              name={flash === 'on' ? 'flash' : flash === 'auto' ? 'flash-outline' : 'flash-off'} 
              size={24} 
              color="white" 
            />
          </Pressable>
        </View>

        {/* Bottom Controls */}
        <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 40 }]}>
          <View style={styles.placeholderBtn} />
          
          <Pressable 
            onPress={takePicture} 
            style={[styles.captureBtn, isCapturing && { opacity: 0.5 }]}
            disabled={isCapturing}
          >
            <View style={styles.captureBtnInner} />
          </Pressable>
          
          <Pressable onPress={toggleCameraFacing} style={styles.iconBtn}>
            <Ionicons name="camera-reverse-outline" size={32} color="white" />
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  preview: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  permissionBtn: {
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  previewControls: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  iconBtn: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  placeholderBtn: {
    width: 52,
    height: 52,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'white',
  },
  primaryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 24,
  },
  btnText: {
    color: 'white',
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 16,
  }
});