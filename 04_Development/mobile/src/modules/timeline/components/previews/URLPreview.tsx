import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../src/shared/theme/colors';
import { PreviewProps } from './types';

export const URLPreview: React.ComponentType<PreviewProps> = ({ capture, variant }) => {
  const ogImage = capture.url_metadata?.og_image || null;
  const title = capture.title || capture.url_metadata?.title || null;
  const domain = capture.url_metadata?.domain || null;
  const url = capture.url_metadata?.original_url || capture.content_text;

  // Client-side HTML scraping removed to prevent race conditions during FlashList recycling.

  const handlePress = () => {
    if (url && url.startsWith('http')) {
      Linking.openURL(url).catch(() => {});
    }
  };

  const isTimeline = variant === 'timeline';
  const isCompact = variant === 'compact' || isTimeline;

  // In timeline mode, we only render the cover graphic. MemoryRenderer handles the title/summary.
  if (isTimeline) {
    return (
      <View className="w-full h-56 bg-surface-variant/40 items-center justify-center relative">
           {ogImage ? (
              <Image 
                source={{ uri: ogImage }} 
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                transition={200}
              />
           ) : (
              <View className="absolute inset-0 items-center justify-center">
                 <View className="w-24 h-24 rounded-full bg-surface-container-lowest items-center justify-center shadow-sm border border-surface-variant/50">
                    <MaterialIcons name="public" size={40} color={colors.primary} />
                 </View>
              </View>
           )}
         <View className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded flex-row items-center gap-1 backdrop-blur-md">
            <MaterialIcons name="open-in-new" size={14} color={colors.white} />
            <Text className="text-white text-caption-sm font-bold">Open</Text>
         </View>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8} className="mb-2">
      <View className={`bg-surface-variant/30 rounded-2xl overflow-hidden ${isCompact ? 'mb-3' : 'mb-4'}`}>
        <View className="relative w-full overflow-hidden items-center justify-center bg-surface-variant/40" style={{ aspectRatio: 16/9, minHeight: 160 }}>
           {ogImage ? (
              <Image 
                source={{ uri: ogImage }} 
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                transition={200}
              />
           ) : (
              <View className="absolute inset-0 items-center justify-center">
                 <View className="w-24 h-24 rounded-full bg-surface-container-lowest items-center justify-center shadow-sm border border-surface-variant/50">
                    <MaterialIcons name="public" size={40} color={colors.primary} />
                 </View>
              </View>
           )}
           <View className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded flex-row items-center gap-1 backdrop-blur-md">
              <MaterialIcons name="open-in-new" size={14} color={colors.white} />
              <Text className="text-white text-caption-sm font-bold">Open</Text>
           </View>
        </View>
        
        <View className="p-4">
          <Text className="text-caption-sm text-tertiary font-bold uppercase tracking-wider mb-1" numberOfLines={1}>
            {domain || 'External Link'}
          </Text>
          <Text className="text-body-lg text-on-surface font-bold mb-1" numberOfLines={isCompact ? 1 : 2}>
            {title || 'Link Capture'}
          </Text>
          {!isCompact && url && (
            <Text className="text-body-md text-primary mt-1" numberOfLines={2}>
              {url}
            </Text>
          )}
          {isCompact && (capture.summary || capture.content_text) && (
             <Text className="text-body-md text-on-surface-variant mt-2" numberOfLines={3}>
               {capture.summary || capture.content_text}
             </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
