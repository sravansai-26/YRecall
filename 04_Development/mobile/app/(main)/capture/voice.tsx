import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Text, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { Stack as ExpoStack, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { capturesApi } from '../../../src/modules/captures/services/api';
import { colors } from '../../../src/shared/theme/colors';

export default function VoiceCaptureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recording) recording.stopAndUnloadAsync();
      if (sound) sound.unloadAsync();
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
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
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

  const pauseRecording = async () => {
    if (!recording) return;
    try {
      await recording.pauseAsync();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
      pulseAnim.stopAnimation();
    } catch (err) {
      console.error('Failed to pause recording', err);
    }
  };
  
  const resumeRecording = async () => {
    if (!recording) return;
    try {
      await recording.startAsync();
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
    if (!recording) return;
    try {
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      pulseAnim.stopAnimation();
      
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      
      const uri = recording.getURI();
      setAudioUri(uri);
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playRecording = async () => {
    if (!audioUri) return;
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      setSound(sound);
      await sound.playAsync();
    } catch (err) {
      console.error('Failed to play sound', err);
    }
  };
  
  const deleteRecording = () => {
    setAudioUri(null);
    setDuration(0);
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
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
      router.back();
    } catch (error) {
      console.error('Failed to upload voice:', error);
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