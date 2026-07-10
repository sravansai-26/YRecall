import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Text, Animated } from 'react-native';
import { useAudioRecorder, useAudioPlayer, RecordingPresets, requestRecordingPermissionsAsync, AudioModule } from 'expo-audio';
import { Stack as ExpoStack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { capturesApi } from '../../../src/modules/captures/services/api';
import { colors } from '../../../src/shared/theme/colors';

export default function VoiceCaptureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // For playback
  const player = useAudioPlayer(audioUri);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startRecording = async () => {
    try {
      if (audioUri) setAudioUri(null);
      
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) return;

      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
      
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
        ])
      ).start();
      
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const pauseRecording = () => {
    try {
      recorder.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
      pulseAnim.stopAnimation();
    } catch (err) {
      console.error('Failed to pause recording', err);
    }
  };
  
  const resumeRecording = () => {
    try {
      recorder.record();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
        ])
      ).start();
    } catch (err) {
      console.error('Failed to resume recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      pulseAnim.stopAnimation();
      
      recorder.stop();
      
      const uri = recorder.uri;
      setAudioUri(uri);
      
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playRecording = () => {
    if (!audioUri) return;
    try {
      player.play();
    } catch (err) {
      console.error('Failed to play sound', err);
    }
  };
  
  const deleteRecording = () => {
    setAudioUri(null);
    setDuration(0);
  };

  const handleUpload = async () => {
    if (!audioUri) return;
    setIsUploading(true);
    
    try {
      const filename = audioUri.split('/').pop() || 'recording.m4a';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `audio/${match[1]}` : `audio/m4a`;
      
      await capturesApi.createMedia({
        type: 'voice',
        file: {
          uri: audioUri,
          name: filename,
          type,
        }
      });
      
      console.log('Voice upload successful');
      require('react-native').ToastAndroid?.show('Voice note saved successfully', require('react-native').ToastAndroid.SHORT);
      router.back();
    } catch (error) {
      console.error('Failed to upload voice:', error);
      require('react-native').ToastAndroid?.show('Failed to save voice note', require('react-native').ToastAndroid.LONG);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ExpoStack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Voice Recorder',
          headerStyle: { backgroundColor: colors['surface-container-lowest'] },
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
              <Ionicons name="arrow-back" size={24} color={colors['on-surface']} />
            </Pressable>
          ),
          headerRight: () => audioUri ? (
            <Pressable onPress={handleUpload} disabled={isUploading}>
              <Text style={[styles.headerBtnText, isUploading && { opacity: 0.5 }]}>
                {isUploading ? 'Uploading...' : 'Save'}
              </Text>
            </Pressable>
          ) : null
        }}
      />
      
      <View style={styles.content}>
        <Text style={styles.timer}>{formatTime(duration)}</Text>
        
        {/* Fake Waveform UI for now */}
        <View style={styles.waveformContainer}>
          {Array.from({ length: 40 }).map((_, i) => (
            <Animated.View 
              key={i} 
              style={[
                styles.waveBar, 
                { 
                  height: isRecording && !isPaused ? 10 + Math.random() * 80 : 4,
                  opacity: isRecording ? 1 : 0.3
                }
              ]} 
            />
          ))}
        </View>

        <View style={styles.controlsContainer}>
          {audioUri ? (
            // After Recording Controls
            <>
              <Pressable style={styles.sideBtn} onPress={deleteRecording}>
                <Ionicons name="trash-outline" size={28} color={colors.error} />
              </Pressable>
              
              <Pressable style={styles.mainPlayBtn} onPress={playRecording}>
                <Ionicons name="play" size={40} color="white" />
              </Pressable>
              
              <View style={styles.sideBtnPlaceholder} />
            </>
          ) : (
            // During Recording Controls
            <>
              {isRecording ? (
                <Pressable 
                  style={styles.sideBtn} 
                  onPress={isPaused ? resumeRecording : pauseRecording}
                >
                  <Ionicons name={isPaused ? "play" : "pause"} size={28} color={colors['on-surface']} />
                </Pressable>
              ) : (
                <View style={styles.sideBtnPlaceholder} />
              )}
              
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Pressable 
                  style={[styles.mainRecordBtn, isRecording && { backgroundColor: colors.error }]} 
                  onPress={isRecording ? stopRecording : startRecording}
                >
                  <Ionicons name={isRecording ? "square" : "mic"} size={40} color="white" />
                </Pressable>
              </Animated.View>
              
              <View style={styles.sideBtnPlaceholder} />
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['surface-container-lowest'],
  },
  headerBtnText: {
    color: colors.primary,
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 16,
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontFamily: 'PublicSans_700Bold',
    fontSize: 64,
    color: colors['on-surface'],
    marginBottom: 60,
    fontVariant: ['tabular-nums'],
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  waveBar: {
    width: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 40,
  },
  mainRecordBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainPlayBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors['secondary-container'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors['surface-container-high'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideBtnPlaceholder: {
    width: 56,
    height: 56,
  }
});