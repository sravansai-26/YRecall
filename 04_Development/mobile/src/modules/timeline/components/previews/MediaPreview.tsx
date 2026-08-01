import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../src/shared/theme/colors';
import { AudioPlayer } from '../../../../shared/components/AudioPlayer';
import { PreviewProps } from './types';
import { useVideoPlayer, VideoView } from 'expo-video';

export const MediaPreview: React.ComponentType<PreviewProps> = ({ capture, variant }) => {
  const isCompact = variant === 'compact';
  const isTimeline = variant === 'timeline';
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  const player = useVideoPlayer(capture.type === 'video' ? (capture.file_url || null) : null, player => {
    player.loop = true;
    player.pause();
  });

  if (capture.type === 'image' || capture.type === 'video' || capture.type === 'location') {
    return (
      <View className={isTimeline ? "" : "mb-2"}>
        {capture.file_url ? (
          isCompact || isTimeline ? (
            <View className={isTimeline ? "w-full h-56 bg-surface-variant relative" : "w-full h-56 rounded-2xl bg-surface-variant mb-3 relative"}>
              {capture.type === 'video' ? (
                <View className="w-full h-full" pointerEvents="none">
                  <VideoView 
                    style={{ width: '100%', height: '100%' }} 
                    player={player} 
                    nativeControls={false}
                    contentFit="cover"
                  />
                  <View className="absolute inset-0 items-center justify-center bg-black/10">
                    <View className="w-12 h-12 rounded-full bg-white/30 items-center justify-center backdrop-blur-md">
                      <MaterialIcons name="play-arrow" size={24} color={colors.white} />
                    </View>
                  </View>
                </View>
              ) : (
                <Image 
                  source={{ uri: capture.file_url }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
              )}
            </View>
          ) : (
            <>
              {capture.type === 'video' ? (
                <View className="rounded-[28px] overflow-hidden bg-surface-container-low mb-6">
                  <View className="w-full relative rounded-[28px] overflow-hidden" style={{ aspectRatio: 16/9 }}>
                    <VideoView 
                      style={{ width: '100%', height: '100%', backgroundColor: 'black' }} 
                      player={player} 
                      allowsPictureInPicture 
                    />
                  </View>
                </View>
              ) : (
                <TouchableOpacity activeOpacity={0.9} onPress={() => setIsFullscreenImage(true)}>
                  <View className="rounded-[28px] overflow-hidden bg-surface-container-low mb-6">
                    <Image 
                      source={{ uri: capture.file_url }}
                      className="w-full"
                      style={{ aspectRatio: 4/3 }}
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-4 right-4 bg-black/50 w-8 h-8 rounded-full items-center justify-center backdrop-blur-md">
                      <MaterialIcons name="fullscreen" size={20} color={colors.white} />
                    </View>
                  </View>
                </TouchableOpacity>
              )}

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
          <View className={`w-full ${isCompact || isTimeline ? 'h-56' : 'h-72'} ${isTimeline ? '' : 'rounded-2xl mb-3'} bg-surface-variant items-center justify-center`}>
            <MaterialIcons name={capture.type === 'video' ? "videocam" : capture.type === 'location' ? "map" : "image"} size={48} color={colors.outline} style={{ opacity: 0.5 }} />
          </View>
        )}
      </View>
    );
  }

  if (capture.type === 'voice' || capture.type === 'audio') {
    return (
      <View className="mb-2">
        {capture.file_url ? (
          isCompact || isTimeline ? (
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
      </View>
    );
  }

  return null;
};
