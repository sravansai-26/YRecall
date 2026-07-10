import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard, Platform, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';
import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, Easing, withSpring } from 'react-native-reanimated';

export interface ComposerRef {
  focus: () => void;
}

interface ComposerProps {
  onSend: (message: string, attachedCaptureIds?: string[]) => void;
  isPending: boolean;
}

import * as ImagePicker from 'expo-image-picker';
import { capturesApi } from '../../captures/services/api';
import { Image, ActivityIndicator, Text } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

interface Attachment {
  id: string; // Temporary ID for UI
  uri: string;
  isUploading: boolean;
  captureId?: string; // Set after successful upload
  type?: 'image' | 'audio';
}

export const Composer = forwardRef<ComposerRef, ComposerProps>(({ onSend, isPending }, ref) => {
  const [query, setQuery] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingMode, setRecordingMode] = useState<'tap' | 'hold' | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      textInputRef.current?.focus();
    }
  }));

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const scale = useSharedValue(1);

  const startRecording = async (mode: 'tap' | 'hold') => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        require('react-native').Alert.alert('Permission needed', 'Please grant microphone permissions.');
        return;
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setRecordingMode(mode);
      setRecordingDuration(0);
      
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= 120) {
            stopRecording(mode); // auto-stop at 2 mins
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (err) {
      console.error('Failed to start recording', err);
      require('react-native').Alert.alert('Error', 'Failed to start recording.');
    }
  };

  const stopRecording = async (expectedMode: 'tap' | 'hold', cancel: boolean = false) => {
    if (!recording) return;
    
    // Clear timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    
    setRecording(null);
    setRecordingMode(null);
    
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (cancel || !uri) {
        setRecordingDuration(0);
        return;
      }

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists && fileInfo.size > 10 * 1024 * 1024) {
         require('react-native').Alert.alert('File too large', 'Audio recording must be under 10MB.');
         setRecordingDuration(0);
         return;
      }

      const file = {
        uri,
        type: 'audio/m4a',
        name: `audio-${Date.now()}.m4a`,
      };

      if (expectedMode === 'tap') {
        // Transcribe mode
        setIsProcessingAudio(true);
        try {
          const res = await capturesApi.transcribeMedia({ file });
          if (res.data?.text) {
             setQuery(prev => prev ? `${prev} ${res.data.text}` : res.data.text);
          }
        } catch (e) {
           require('react-native').Alert.alert('Transcription Failed', 'Could not transcribe audio. Please try again.');
        } finally {
           setIsProcessingAudio(false);
           setRecordingDuration(0);
        }
      } else {
        // Hold mode -> attach to composer
        const tempId = Date.now().toString();
        const newAttachment: Attachment = {
          id: tempId,
          uri,
          isUploading: true,
          type: 'audio',
        };
        setAttachments(prev => [...prev, newAttachment]);
        setRecordingDuration(0);
        
        try {
          const res = await capturesApi.createMedia({ type: 'voice', file });
          setAttachments(prev => prev.map(a => 
            a.id === tempId ? { ...a, isUploading: false, captureId: res.data.id } : a
          ));
        } catch (e) {
          setAttachments(prev => prev.filter(a => a.id !== tempId));
          require('react-native').Alert.alert('Upload Failed', 'Failed to upload audio attachment.');
        }
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setRecordingDuration(0);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSend = () => {
    const trimmed = query.trim();
    if ((!trimmed && attachments.length === 0) || isPending) return;
    
    // Check if any attachments are still uploading
    if (attachments.some(a => a.isUploading)) {
      require('react-native').Alert.alert('Uploading', 'Please wait for all attachments to finish uploading.');
      return;
    }

    const captureIds = attachments.map(a => a.captureId!).filter(Boolean);
    onSend(trimmed, captureIds);
    setQuery('');
    setAttachments([]);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const tempId = Date.now().toString();
      
      const newAttachment: Attachment = {
        id: tempId,
        uri: asset.uri,
        isUploading: true,
        type: 'image',
      };
      
      setAttachments(prev => [...prev, newAttachment]);

      try {
        const file = {
          uri: asset.uri,
          type: asset.mimeType || 'image/jpeg',
          name: asset.fileName || `image-${tempId}.jpg`,
        };
        const response = await capturesApi.createMedia({ type: 'image', file });
        
        setAttachments(prev => prev.map(a => 
          a.id === tempId ? { ...a, isUploading: false, captureId: response.data.id } : a
        ));
      } catch (err) {
        console.error('Failed to upload attachment', err);
        setAttachments(prev => prev.filter(a => a.id !== tempId));
        require('react-native').Alert.alert('Error', 'Failed to upload attachment.');
      }
    }
  };

  const hasText = query.trim().length > 0;

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedSendStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <View style={styles.outerContainer}>
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <View style={styles.attachmentsContainer}>
          {attachments.map(att => (
            <View key={att.id} style={styles.attachmentWrapper}>
              {att.type === 'audio' ? (
                 <View style={[styles.attachmentImage, { backgroundColor: colors['surface-container-highest'], justifyContent: 'center', alignItems: 'center' }]}>
                   <MaterialIcons name="mic" size={24} color={colors.primary} />
                 </View>
              ) : (
                 <Image source={{ uri: att.uri }} style={styles.attachmentImage} />
              )}
              {att.isUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator color={colors.white} />
                </View>
              )}
              <TouchableOpacity 
                style={styles.removeAttachmentButton}
                onPress={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
              >
                <MaterialIcons name="close" size={12} color={colors.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.inputContainer}>
        
        {/* Attachment Button */}
        <TouchableOpacity style={styles.iconButton} onPress={handlePickImage}>
          <MaterialIcons name="add" size={24} color={colors.outline} />
        </TouchableOpacity>
        
        {/* Input Field or Recording State */}
        {!recording && !isProcessingAudio ? (
          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            placeholder="Message YRecall..."
            placeholderTextColor={colors.outline}
            value={query}
            onChangeText={setQuery}
            multiline
            maxLength={2000}
          />
        ) : (
          <View style={styles.recordingContainer}>
            {isProcessingAudio ? (
              <Text style={styles.recordingText}>Processing...</Text>
            ) : (
              <>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>
                   Recording {formatDuration(recordingDuration)} / 2:00
                </Text>
                <TouchableOpacity onPress={() => stopRecording(recordingMode!, true)}>
                  <MaterialIcons name="close" size={20} color={colors.error} />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        
        {/* Actions Container */}
        <View style={styles.actionsContainer}>
          {!hasText && !isPending && attachments.length === 0 ? (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => {
                if (recording && recordingMode === 'tap') {
                   stopRecording('tap');
                } else if (!recording && !isProcessingAudio) {
                   startRecording('tap');
                }
              }}
              onLongPress={() => {
                if (!recording && !isProcessingAudio) {
                   startRecording('hold');
                }
              }}
              onPressOut={() => {
                if (recording && recordingMode === 'hold') {
                   stopRecording('hold');
                }
              }}
              delayLongPress={300}
            >
              <MaterialIcons name={recording ? "stop" : "mic"} size={24} color={recording ? colors.error : colors.outline} />
            </TouchableOpacity>
          ) : (
            <Animated.View style={animatedSendStyle}>
              <Pressable 
                onPress={handleSend}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isPending || (!hasText && attachments.length === 0)}
                style={[
                  styles.sendButton,
                  isPending || (!hasText && attachments.length === 0) ? styles.sendButtonDisabled : styles.sendButtonActive
                ]}
              >
                <MaterialIcons 
                  name={isPending ? "more-horiz" : "arrow-upward"} 
                  size={24} 
                  color={isPending || (!hasText && attachments.length === 0) ? colors['on-surface-variant'] : colors.white} 
                />
              </Pressable>
            </Animated.View>
          )}
        </View>

      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: colors.background,
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    minHeight: 48,
    paddingHorizontal: 6,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontFamily: 'PublicSans_400Regular',
    fontSize: 16,
    color: colors['on-surface'],
    minHeight: 36,
    maxHeight: 120,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 36,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    marginRight: 8,
  },
  recordingText: {
    flex: 1,
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 14,
    color: colors['on-surface'],
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: colors['surface-container-high'],
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  attachmentWrapper: {
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  attachmentImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    padding: 2,
  }
});
