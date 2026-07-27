import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../src/shared/theme/colors';
import { AudioPlayer } from '../../../../shared/components/AudioPlayer';
import { PreviewProps } from './types';

export const MediaPreview: React.ComponentType<PreviewProps> = ({ capture, variant }) => {
  const isCompact = variant === 'compact';
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  if (capture.type === 'image' || capture.type === 'video') {
    return (
      <View className="mb-2">
        {capture.file_url ? (
          isCompact ? (
            <Image 
              source={{ uri: capture.file_url }} 
              className="w-full h-56 rounded-2xl bg-surface-variant mb-3"
              resizeMode="cover"
            />
          ) : (
            <>
              <TouchableOpacity activeOpacity={0.9} onPress={() => setIsFullscreenImage(true)}>
                <View className="rounded-[28px] overflow-hidden bg-surface-container-low mb-6">
                  {capture.type === 'video' ? (
                    <View className="w-full relative" style={{ aspectRatio: 16/9 }}>
                      <Image 
                        source={{ uri: capture.file_url }}
                        className="w-full h-full bg-black"
                        resizeMode="cover"
                      />
                      <View className="absolute inset-0 items-center justify-center bg-black/30">
                        <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center backdrop-blur-md border-white/30">
                          <MaterialIcons name="play-arrow" size={36} color={colors.white} />
                        </View>
                      </View>
                    </View>
                  ) : (
                    <>
                      <Image 
                        source={{ uri: capture.file_url }}
                        className="w-full"
                        style={{ aspectRatio: 4/3 }}
                        resizeMode="cover"
                      />
                      <View className="absolute bottom-4 right-4 bg-black/50 w-8 h-8 rounded-full items-center justify-center backdrop-blur-md">
                        <MaterialIcons name="fullscreen" size={20} color={colors.white} />
                      </View>
                    </>
                  )}
                </View>
              </TouchableOpacity>

              <Modal visible={isFullscreenImage} transparent={true} animationType="fade">
                <View className="flex-1 bg-black">
                  <TouchableOpacity 
                    className="absolute top-12 left-4 z-50 w-10 h-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-md"
                    onPress={() => setIsFullscreenImage(false)}
                  >
                    <MaterialIcons name="close" size={24} color={colors.white} />
                  </TouchableOpacity>
                  <Image 
                    source={{ uri: capture.file_url }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>
              </Modal>
            </>
          )
        ) : (
          <View className={`w-full ${isCompact ? 'h-56' : 'h-72'} rounded-2xl bg-surface-variant mb-3 items-center justify-center`}>
            <MaterialIcons name={capture.type === 'video' ? "videocam" : "image"} size={48} color={colors.outline} />
          </View>
        )}
        
        {/* Only render OCR and Summary in compact mode. MemoryRenderer handles full mode. */}
        {isCompact && capture.ocr_text && (
          <View className="bg-surface-variant/30 p-3 rounded-xl mb-3">
            <Text className="text-body-sm text-on-surface-variant italic" numberOfLines={2}>
              "{capture.ocr_text}"
            </Text>
          </View>
        )}
        {isCompact && capture.summary && (
          <Text className="text-body-md text-on-surface" numberOfLines={3}>
            {capture.summary}
          </Text>
        )}
      </View>
    );
  }

  if (capture.type === 'voice' || capture.type === 'audio') {
    return (
      <View className="mb-2">
        {capture.file_url ? (
          isCompact ? (
            <AudioPlayer url={capture.file_url} />
          ) : (
            <View className="mb-6 rounded-[28px] overflow-hidden bg-surface-container-low p-6">
              <AudioPlayer url={capture.file_url} />
            </View>
          )
        ) : (
           <View className="flex-row items-center gap-3 bg-surface-variant/50 p-3 rounded-2xl mb-3">
             <View className="w-10 h-10 rounded-full bg-outline-variant items-center justify-center">
               <MaterialIcons name="mic-off" size={24} color={colors.surface} />
             </View>
             <Text className="text-body-sm text-on-surface-variant italic">Audio unavailable</Text>
           </View>
        )}
        {/* Only render Transcript and Summary in compact mode. MemoryRenderer handles full mode. */}
        {isCompact && capture.transcript && (
          <View className="bg-surface-variant/30 p-4 rounded-xl mt-3">
            <Text className="text-body-md text-on-surface italic" numberOfLines={3}>
              "{capture.transcript}"
            </Text>
          </View>
        )}
        {isCompact && capture.summary && (
          <Text className="text-body-md text-on-surface mt-3">
            {capture.summary}
          </Text>
        )}
      </View>
    );
  }

  return null;
};
