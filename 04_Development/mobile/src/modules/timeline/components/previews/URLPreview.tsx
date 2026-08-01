import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../src/shared/theme/colors';
import { PreviewProps } from './types';

export const URLPreview: React.ComponentType<PreviewProps> = ({ capture, variant }) => {
  const [ogImage, setOgImage] = useState<string | null>(capture.url_metadata?.og_image || null);
  const [title, setTitle] = useState<string | null>(capture.title || capture.url_metadata?.title || null);
  const [domain, setDomain] = useState<string | null>(capture.url_metadata?.domain || null);
  const [isLoading, setIsLoading] = useState(false);

  const url = capture.url_metadata?.original_url || capture.content_text;

  useEffect(() => {
    // Graceful fallback: If we don't have OG metadata, try to fetch it live (simple regex parsing for OG tags)
    const fetchMetadata = async () => {
      if (!url || !url.startsWith('http')) return;
      if (ogImage && title && domain) return; // Already have cached metadata

      try {
        setIsLoading(true);
        // We set a very short timeout so we don't block the UI
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        const html = await response.text();
        
        if (!ogImage) {
          const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i) || html.match(/<meta name="twitter:image" content="([^"]+)"/i);
          if (ogImageMatch && ogImageMatch[1]) setOgImage(ogImageMatch[1]);
        }
        
        if (!title) {
          const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i) || html.match(/<title>([^<]+)<\/title>/i);
          if (ogTitleMatch && ogTitleMatch[1]) setTitle(ogTitleMatch[1]);
        }

        if (!domain) {
          try {
            const urlObj = new URL(url);
            setDomain(urlObj.hostname);
          } catch (e) {}
        }
      } catch (error) {
        // Fallback silently
        if (!domain) {
          try {
            const urlObj = new URL(url);
            setDomain(urlObj.hostname);
          } catch (e) {}
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

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
      <View className="w-full bg-surface-variant overflow-hidden rounded-t-[32px] rounded-b-none">
        {ogImage ? (
          <Image 
            source={{ uri: ogImage }} 
            className="w-full h-48 bg-surface-variant"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-48 bg-surface-variant items-center justify-center">
            {isLoading ? (
               <ActivityIndicator color={colors.primary} />
            ) : (
               <View className="w-16 h-16 rounded-2xl bg-surface-container items-center justify-center shadow-sm">
                 <MaterialIcons name="link" size={32} color={colors.primary} />
               </View>
            )}
          </View>
        )}
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8} className="mb-2">
      <View className={`bg-surface-variant/30 rounded-2xl overflow-hidden ${isCompact ? 'mb-3' : 'mb-4'}`}>
        {ogImage ? (
          <Image 
            source={{ uri: ogImage }} 
            className={`w-full ${isCompact ? 'h-32' : 'h-48'} bg-surface-variant`}
            resizeMode="cover"
          />
        ) : (
          <View className={`w-full ${isCompact ? 'h-32' : 'h-48'} bg-surface-variant items-center justify-center`}>
            {isLoading ? (
               <ActivityIndicator color={colors.primary} />
            ) : (
               <MaterialIcons name="link" size={48} color={colors.outline} />
            )}
          </View>
        )}
        
        <View className="p-4">
          <Text className="text-caption-sm text-tertiary font-bold uppercase tracking-wider mb-1" numberOfLines={1}>
            {domain || 'External Link'}
          </Text>
          <Text className="text-body-lg text-on-surface font-bold mb-1" numberOfLines={isCompact ? 1 : 2}>
            {title || url || 'Link Capture'}
          </Text>
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
