import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, Image, ActivityIndicator, TextInput, BackHandler } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Stack as ExpoStack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { capturesApi } from '../../../src/modules/captures/services/api';
import { colors } from '../../../src/shared/theme/colors';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function CameraCaptureScreen() {
 const router = useRouter();
 const params = useLocalSearchParams();
 const insets = useSafeAreaInsets();
 
 const [cameraPermission, requestCameraPermission] = useCameraPermissions();
 const [micPermission, requestMicPermission] = useMicrophonePermissions();
 
 const [facing, setFacing] = useState<CameraType>('back');
 const [flash, setFlash] = useState<'on' | 'off' | 'auto'>('off');
 const [isCapturing, setIsCapturing] = useState(false);
 const [isRecording, setIsRecording] = useState(false);
 const [recordingTime, setRecordingTime] = useState(0);
 
 const [previewUri, setPreviewUri] = useState<string | null>(null);
 const [captureType, setCaptureType] = useState<'image' | 'video' | 'document'>('image');
 const [isUploading, setIsUploading] = useState(false);
 const [captureTitle, setCaptureTitle] = useState('');
 
 // The current active mode (picture, video, or scan)
 const [mode, setMode] = useState<'picture' | 'video' | 'scan'>(
    params.mode === 'video' ? 'video' : (params.mode === 'scan' ? 'scan' : 'picture')
 );
 
 const cameraRef = useRef<any>(null);
 const timerRef = useRef<NodeJS.Timeout | null>(null);
 const uploadIdRef = useRef<string | null>(null);

 const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
 };

 // Player for video preview
 const player = useVideoPlayer(previewUri || '', player => {
    player.loop = true;
    player.play();
 });

 useEffect(() => {
 if (!cameraPermission?.granted) requestCameraPermission();
 if (!micPermission?.granted) requestMicPermission();
 }, [cameraPermission, micPermission]);

 useEffect(() => {
    if (isRecording) {
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    } else {
        if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
 }, [isRecording]);

 useEffect(() => {
    const onBackPress = () => {
        if (previewUri) {
            setPreviewUri(null);
            return true; // Prevent default behavior (exiting screen)
        }
        if (isRecording) {
            // Stop recording before exiting or just prevent exit
            cameraRef.current?.stopRecording();
            setIsRecording(false);
            return true;
        }
        return false;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
 }, [previewUri, isRecording]);

 const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
 };

 if (!cameraPermission || !micPermission) {
 return <View style={styles.container} />;
 }

 if (!cameraPermission.granted || !micPermission.granted) {
 return (
 <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
 <Text style={{ color: 'white', marginBottom: 20 }}>We need camera and microphone permissions</Text>
 <Pressable onPress={() => { requestCameraPermission(); requestMicPermission(); }} style={styles.primaryBtn}>
 <Text style={{ color: 'white' }}>Grant Permissions</Text>
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
 setCaptureType(mode === 'scan' ? 'document' : 'image');
 setPreviewUri(photo.uri);
 uploadIdRef.current = generateUUID();
 } catch (e) {
 console.error(e);
 } finally {
 setIsCapturing(false);
 }
 }
 };

 const toggleRecording = async () => {
    if (!cameraRef.current) return;

    if (isRecording) {
        cameraRef.current.stopRecording();
        setIsRecording(false);
    } else {
        setIsRecording(true);
        try {
            const video = await cameraRef.current.recordAsync();
            setCaptureType('video');
            setPreviewUri(video.uri);
            uploadIdRef.current = generateUUID();
        } catch (e) {
            console.error("Recording failed", e);
            setIsRecording(false);
        }
    }
 };

 const handleCaptureAction = () => {
     if (mode === 'video') {
         toggleRecording();
     } else {
         takePicture();
     }
 };

 const pickFromGallery = async () => {
    try {
      const mediaTypes = mode === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setCaptureType(asset.type === 'video' ? 'video' : (mode === 'scan' ? 'document' : 'image'));
        setPreviewUri(asset.uri);
        uploadIdRef.current = generateUUID();
      }
    } catch (e) {
      console.error('Gallery error:', e);
    }
 };

 const handleRetake = () => {
 setPreviewUri(null);
 };

 const handleUpload = async () => {
 if (!previewUri) return;
 
 setIsUploading(true);

 try {
     const filename = previewUri.split('/').pop() || (captureType === 'video' ? 'video.mp4' : 'photo.jpg');
     const match = /\.(\w+)$/.exec(filename);
     let type = match ? `${captureType}/${match[1]}` : (captureType === 'video' ? 'video/mp4' : 'image/jpeg');
     
     const file = {
         uri: previewUri,
         name: filename,
         type,
     };
     
     await capturesApi.createMedia({
         type: captureType,
         file: file as any,
         upload_id: uploadIdRef.current || undefined,
         title: captureTitle.trim() || undefined
     });
     
     require('react-native').ToastAndroid?.show(`${captureType === 'video' ? 'Video' : 'Photo'} uploaded successfully`, require('react-native').ToastAndroid.SHORT);
     setIsUploading(false);
     router.back();
 } catch (error) {
     console.error('Failed to upload media:', error);
     import('react-native').then(({ Alert }) => {
         Alert.alert(
             'Upload Failed', 
             'We could not upload your capture. Please check your connection and try again.'
         );
     });
     setIsUploading(false);
 }
 };

 if (previewUri) {
 return (
 <View style={styles.container}>
 <ExpoStack.Screen options={{ headerShown: false }} />
 {captureType === 'image' || captureType === 'document' ? (
     <Image source={{ uri: previewUri }} style={styles.preview} />
 ) : (
     <VideoView style={styles.preview} player={player} allowsPictureInPicture />
 )}
 
 <View style={[styles.titleInputContainer, { top: insets.top + 20 }]}>
     <TextInput
         style={styles.titleInput}
         placeholder="Add a title (Optional)"
         placeholderTextColor="rgba(255,255,255,0.7)"
         value={captureTitle}
         onChangeText={setCaptureTitle}
         editable={!isUploading}
     />
 </View>
 
 <View style={[styles.previewControls, { paddingBottom: insets.bottom + 20 }]}>
 <Pressable onPress={handleRetake} style={styles.iconBtn}>
 <Text style={styles.btnText}>Retake</Text>
 </Pressable>
 <Pressable onPress={handleUpload} style={styles.primaryBtn} disabled={isUploading}>
 {isUploading ? (
     <ActivityIndicator color="white" />
 ) : (
     <Text style={styles.btnText}>Use {captureType === 'video' ? 'Video' : captureType === 'document' ? 'Scan' : 'Photo'}</Text>
 )}
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
 mode={mode === 'scan' ? 'picture' : mode}
 ref={cameraRef}
 />
 
 {/* Top Controls */}
 <View style={[styles.topControls, { paddingTop: insets.top + 10 }]} pointerEvents="box-none">
 <Pressable onPress={() => router.back()} style={styles.iconBtn} disabled={isRecording}>
 <Ionicons name="close" size={28} color="white" />
 </Pressable>
 {isRecording ? (
     <View style={styles.timerBadge}>
         <View style={styles.redDot} />
         <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
     </View>
 ) : (
     <Pressable onPress={toggleFlash} style={styles.iconBtn}>
     <Ionicons 
     name={flash === 'on' ? 'flash' : flash === 'auto' ? 'flash-outline' : 'flash-off'} 
     size={24} 
     color="white" 
     />
     </Pressable>
 )}
 </View>

 {/* Bottom Controls */}
 <View style={[styles.bottomControlsContainer, { paddingBottom: insets.bottom + 20 }]} pointerEvents="box-none">
     
    {/* Mode Selector */}
    {!isRecording && (
        <View style={styles.modeSelector}>
            <Pressable onPress={() => setMode('scan')}>
                <Text style={[styles.modeText, mode === 'scan' && styles.modeTextActive]}>SCAN</Text>
            </Pressable>
            <Pressable onPress={() => setMode('picture')}>
                <Text style={[styles.modeText, mode === 'picture' && styles.modeTextActive]}>PHOTO</Text>
            </Pressable>
            <Pressable onPress={() => setMode('video')}>
                <Text style={[styles.modeText, mode === 'video' && styles.modeTextActive]}>VIDEO</Text>
            </Pressable>
        </View>
    )}

    <View style={styles.bottomControls}>
        <Pressable onPress={pickFromGallery} style={styles.iconBtn} disabled={isRecording}>
          <Ionicons name="images-outline" size={28} color="white" />
        </Pressable>
        
        <Pressable 
        onPress={handleCaptureAction} 
        style={[styles.captureBtn, isCapturing && { opacity: 0.5 }]}
        disabled={isCapturing}
        >
        <View style={[styles.captureBtnInner, mode === 'video' && styles.captureBtnInnerVideo, isRecording && styles.captureBtnInnerRecording]} />
        </Pressable>
        
        <Pressable onPress={toggleCameraFacing} style={styles.iconBtn} disabled={isRecording}>
        <Ionicons name="camera-reverse-outline" size={32} color="white" />
        </Pressable>
    </View>
 </View>
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
 resizeMode: 'contain',
 },
 topControls: {
 position: 'absolute',
 top: 0,
 left: 0,
 right: 0,
 flexDirection: 'row',
 justifyContent: 'space-between',
 paddingHorizontal: 20,
 zIndex: 10,
 },
 titleInputContainer: {
 position: 'absolute',
 left: 20,
 right: 20,
 zIndex: 10,
 },
 titleInput: {
 backgroundColor: 'rgba(0,0,0,0.5)',
 color: 'white',
 fontFamily: 'PublicSans_600SemiBold',
 fontSize: 16,
 paddingHorizontal: 16,
 paddingVertical: 12,
 borderRadius: 12,
 },
 bottomControlsContainer: {
 position: 'absolute',
 bottom: 0,
 left: 0,
 right: 0,
 flexDirection: 'column',
 alignItems: 'center',
 zIndex: 10,
 },
 modeSelector: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
 },
 modeText: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 14,
 },
 modeTextActive: {
    color: 'white',
 },
 bottomControls: {
 flexDirection: 'row',
 justifyContent: 'space-around',
 alignItems: 'center',
 width: '100%',
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
 captureBtnInnerVideo: {
     backgroundColor: colors.error,
 },
 captureBtnInnerRecording: {
     borderRadius: 10,
     width: 32,
     height: 32,
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
 },
 timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
 },
 redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
 },
 timerText: {
    color: 'white',
    fontFamily: 'PublicSans_600SemiBold',
 }
});