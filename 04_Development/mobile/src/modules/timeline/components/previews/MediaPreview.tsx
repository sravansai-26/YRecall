import React from 'react';
import { View, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../src/shared/theme/colors';
import { AudioPlayer } from '../../../../shared/components/AudioPlayer';
import { PreviewProps } from './types';

export const MediaPreview: React.ComponentType<PreviewProps> = ({ capture, variant }) => {
  const isCompact = variant === 'compact';

  if (capture.type === 'image' || capture.type === 'video') {
    return (
      <View className="mb-2">
        {capture.file_url ? (
          <Image 
            source={{ uri: capture.file_url }} 
            className={`w-full ${isCompact ? 'h-56' : 'h-72'} rounded-2xl bg-surface-variant mb-3 border border-outline-variant/10`}
            resizeMode="cover"
          />
        ) : (
          <View className={`w-full ${isCompact ? 'h-56' : 'h-72'} rounded-2xl bg-surface-variant mb-3 items-center justify-center border border-outline-variant/10`}>
            <MaterialIcons name={capture.type === 'video' ? "videocam" : "image"} size={48} color={colors.outline} />
          </View>
        )}
        {capture.ocr_text && (
          <View className="bg-surface-variant/30 p-3 rounded-xl mb-3 border border-outline-variant/10">
            <Text className="text-body-sm text-on-surface-variant italic" numberOfLines={isCompact ? 2 : undefined}>
              "{capture.ocr_text}"
            </Text>
          </View>
        )}
        {capture.summary && (
          <Text className="text-body-md text-on-surface" numberOfLines={isCompact ? 3 : undefined}>
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
          <AudioPlayer url={capture.file_url} />
        ) : (
           <View className="flex-row items-center gap-3 bg-surface-variant/50 p-3 rounded-2xl mb-3 border border-outline-variant/10">
             <View className="w-10 h-10 rounded-full bg-outline-variant items-center justify-center">
               <MaterialIcons name="mic-off" size={24} color={colors.surface} />
             </View>
             <Text className="text-body-sm text-on-surface-variant italic">Audio unavailable</Text>
           </View>
        )}
        {capture.transcript && (
          <View className="bg-surface-variant/30 p-4 rounded-xl mt-3 border border-outline-variant/10">
            <Text className="text-body-md text-on-surface italic" numberOfLines={isCompact ? 3 : undefined}>
              "{capture.transcript}"
            </Text>
          </View>
        )}
        {capture.summary && !isCompact && (
          <Text className="text-body-md text-on-surface mt-3">
            {capture.summary}
          </Text>
        )}
      </View>
    );
  }

  return null;
};
