import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Share, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, TopAppBar } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCapture, useRelatedMemories, useDeleteCapture } from '../../../src/shared/hooks/useTimeline';
import { format } from 'date-fns';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AudioPlayer } from '../../../src/shared/components/AudioPlayer';
import Markdown from 'react-native-markdown-display';

export default function MemoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: capture, isLoading, error } = useCapture(id || '');
  const { data: relatedData } = useRelatedMemories(id || '');
  const deleteMutation = useDeleteCapture();
  
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  const handleShare = async () => {
    if (!capture) return;
    try {
      const message = capture.summary || capture.content_text || capture.title || 'Check out this memory from YRecall!';
      const url = capture.file_url || undefined;
      await Share.share({
        message: url ? `${message}\n${url}` : message,
        title: capture.title || 'YRecall Memory',
      });
    } catch (error: any) {
      Alert.alert('Error sharing', error.message);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Memory",
      "Are you sure you want to delete this memory? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteMutation.mutate(id as string, {
              onSuccess: () => {
                router.back();
              },
              onError: () => {
                Alert.alert("Error", "Failed to delete the memory.");
              }
            });
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <Screen scrollable={false}>
        <View className="flex-row items-center px-margin-mobile h-14 bg-surface">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (error || !capture) {
    return (
      <Screen scrollable={false}>
        <View className="flex-row items-center px-margin-mobile h-14 bg-surface">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center p-6">
          <MaterialIcons name="error-outline" size={48} color={colors.error} className="mb-4" />
          <Text className="font-title-sm text-on-surface text-center mb-2">Failed to load memory</Text>
          <TouchableOpacity onPress={() => router.back()} className="px-6 py-3 bg-primary rounded-full mt-4">
            <Text className="text-on-primary font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  const time = format(new Date(capture.created_at), 'MMMM d, yyyy • h:mm a');
  const relatedMemories: any[] = relatedData ? (Array.isArray(relatedData) ? relatedData : (relatedData as any).data || []) : [];

  return (
    <Screen scrollable={false}>
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-margin-mobile h-14 bg-surface">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container">
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="font-title-sm font-bold text-primary">Memory Detail</Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={handleShare} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container">
            <MaterialIcons name="share" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} disabled={deleteMutation.isPending} className="w-10 h-10 items-center justify-center rounded-full bg-error-container">
            {deleteMutation.isPending ? (
               <ActivityIndicator size="small" color={colors.error} />
            ) : (
               <MaterialIcons name="delete-outline" size={20} color={colors.error} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView className="flex-1 w-full max-w-7xl mx-auto" contentContainerStyle={{ paddingBottom: 100 }}>
        <Animated.View entering={FadeIn} className="px-margin-mobile pt-6">
          
          <View className="flex-row items-center justify-between mb-4">
            <View className="bg-surface-variant px-3 py-1.5 rounded-full flex-row items-center gap-1.5 border border-outline-variant/10">
              <MaterialIcons name="auto-awesome" size={14} color={colors.secondary} />
              <Text className="text-secondary text-label-xs font-bold uppercase tracking-wider">{capture.type}</Text>
            </View>
            <Text className="text-caption-sm text-on-surface-variant font-medium">{time}</Text>
          </View>

          <Text className="font-headline-md text-primary font-bold leading-tight mb-6 tracking-tight">
            {capture.title || (capture.type.charAt(0).toUpperCase() + capture.type.slice(1) + ' Capture')}
          </Text>

          {/* Original Content / Media */}
          {capture.file_url && (
            <View className="mb-6">
              <Text className="font-title-sm font-bold text-primary mb-3">Original Attachment</Text>
              <View className="rounded-[28px] overflow-hidden bg-surface-container-low border border-outline-variant/20">
                {capture.type === 'voice' || capture.type === 'audio' ? (
                  <View className="p-6">
                    <AudioPlayer url={capture.file_url} />
                  </View>
                ) : capture.type === 'image' ? (
                  <TouchableOpacity activeOpacity={0.9} onPress={() => setIsFullscreenImage(true)}>
                    <Image 
                      source={{ uri: capture.file_url }}
                      className="w-full"
                      style={{ aspectRatio: 4/3 }}
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-4 right-4 bg-black/50 w-8 h-8 rounded-full items-center justify-center backdrop-blur-md">
                      <MaterialIcons name="fullscreen" size={20} color={colors.white} />
                    </View>
                  </TouchableOpacity>
                ) : capture.type === 'video' ? (
                  <View className="w-full relative" style={{ aspectRatio: 16/9 }}>
                    {/* Placeholder for real native video player integration */}
                    <Image 
                      source={{ uri: capture.file_url }} // might not work if no thumbnail, fallback
                      className="w-full h-full bg-black"
                      resizeMode="cover"
                    />
                    <View className="absolute inset-0 items-center justify-center bg-black/30">
                      <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center backdrop-blur-md border border-white/30">
                         <MaterialIcons name="play-arrow" size={36} color={colors.white} />
                      </View>
                    </View>
                  </View>
                ) : capture.type === 'pdf' || capture.type === 'document' ? (
                  <View className="p-6 flex-row items-center gap-4 bg-surface-variant/30">
                    <View className="w-16 h-16 rounded-2xl bg-error-container items-center justify-center">
                      <MaterialIcons name="picture-as-pdf" size={32} color={colors.error} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-title-sm text-on-surface font-bold">Document Preview</Text>
                      <Text className="text-body-sm text-on-surface-variant mt-1">Tap to open in native viewer</Text>
                    </View>
                    <TouchableOpacity className="p-3 bg-surface rounded-full shadow-sm">
                      <MaterialIcons name="open-in-new" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View>
          )}

          {/* AI Summary */}
          {capture.summary && (
            <View className="bg-secondary-container/20 p-6 rounded-[28px] mb-6 border border-secondary/10 shadow-sm">
              <View className="flex-row items-center gap-2 mb-3">
                <View className="w-8 h-8 rounded-full bg-secondary-container items-center justify-center">
                  <MaterialIcons name="auto-awesome" size={16} color={colors.secondary} />
                </View>
                <Text className="font-title-sm font-bold text-secondary">AI Summary</Text>
              </View>
              <View className="markdown-container">
                <Markdown style={markdownStyles}>
                  {capture.summary}
                </Markdown>
              </View>
            </View>
          )}

          {/* Transcript / OCR / Text Content */}
          {(capture.content_text || capture.transcript || capture.ocr_text) && (
            <View className="bg-surface-container-lowest p-6 rounded-[28px] mb-6 border border-outline-variant/20 shadow-sm">
              <Text className="font-title-sm font-bold text-primary mb-3">
                {capture.transcript ? 'Transcript' : capture.ocr_text ? 'Scanned Text' : 'Content'}
              </Text>
              <View className="markdown-container">
                <Markdown style={markdownStyles}>
                  {capture.content_text || capture.transcript || capture.ocr_text || ''}
                </Markdown>
              </View>
            </View>
          )}

          {/* Entities */}
          {capture.entities && capture.entities.length > 0 && (
            <View className="mb-8">
              <Text className="font-title-sm font-bold text-primary mb-3">Extracted Knowledge</Text>
              <View className="flex-row flex-wrap gap-2">
                {capture.entities.map((entity: any, i: number) => (
                  <View key={i} className="bg-surface-container-high px-4 py-2.5 rounded-xl border border-outline-variant/20">
                    <Text className="text-on-surface-variant font-medium text-label-sm tracking-wide">{entity.entity_value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Related Memories */}
          {relatedMemories.length > 0 && (
            <View className="mb-6 pt-6 border-t border-outline-variant/20">
              <Text className="font-title-sm font-bold text-primary mb-4">Related Memories</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-margin-mobile px-margin-mobile">
                {relatedMemories.map((relatedCapture: any, i: number) => (
                  <TouchableOpacity 
                    key={i} 
                    onPress={() => router.push(`/(main)/memory/${relatedCapture.id}` as any)}
                    className="w-64 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 mr-4 shadow-sm"
                  >
                    <View className="flex-row items-center gap-2 mb-2">
                      <MaterialIcons 
                        name={relatedCapture.type === 'voice' ? 'mic' : relatedCapture.type === 'image' ? 'image' : 'bookmark'} 
                        size={16} 
                        color={colors.primary} 
                      />
                      <Text className="text-label-xs text-on-surface-variant uppercase tracking-wider">{relatedCapture.type}</Text>
                    </View>
                    <Text className="font-title-sm font-bold text-on-surface mb-1" numberOfLines={1}>
                      {relatedCapture.title || 'Memory'}
                    </Text>
                    <Text className="text-body-sm text-on-surface-variant" numberOfLines={2}>
                      {relatedCapture.summary || relatedCapture.content_text || ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

        </Animated.View>
      </ScrollView>

      {/* Fullscreen Image Modal */}
      {isFullscreenImage && capture.file_url && (
        <View className="absolute inset-0 bg-black z-50 flex-1">
          <View className="absolute top-12 left-4 z-50">
            <TouchableOpacity onPress={() => setIsFullscreenImage(false)} className="w-12 h-12 rounded-full bg-black/50 items-center justify-center">
              <MaterialIcons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: capture.file_url }}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
      )}
    </Screen>
  );
}

const markdownStyles = {
  body: {
    color: colors['on-surface'],
    fontSize: 16,
    lineHeight: 24,
  },
  strong: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  em: {
    fontStyle: 'italic',
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 0,
  }
} as any;
