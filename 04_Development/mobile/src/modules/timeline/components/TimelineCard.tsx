import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';
import { Capture } from '../../captures/services/api';
import { format } from 'date-fns';
import { AudioPlayer } from '../../../shared/components/AudioPlayer';
import Markdown from 'react-native-markdown-display'; // Reverted for timeline feed

interface TimelineCardProps {
  capture: Capture;
  onPress: (capture: Capture) => void;
}

export const TimelineCard = memo(({ capture, onPress }: TimelineCardProps) => {
  const time = format(new Date(capture.created_at), 'h:mm a');

  const getIcon = () => {
    switch (capture.type) {
      case 'note': return 'edit-note';
      case 'text': return 'short-text';
      case 'image': return 'image';
      case 'voice':
      case 'audio': return 'mic';
      case 'video': return 'videocam';
      case 'url': return 'link';
      case 'location': return 'location-on';
      case 'pdf':
      case 'document':
      case 'file': return 'insert-drive-file';
      case 'automation': return 'smart-toy';
      default: return 'bookmark';
    }
  };

  const getIconColor = () => {
    switch (capture.type) {
      case 'note': return colors.primary;
      case 'image': return colors.secondary;
      case 'voice':
      case 'audio': return colors.error;
      case 'url': return colors.tertiary;
      case 'pdf':
      case 'document': return '#D32F2F'; // Red for PDF
      case 'automation': return colors.tertiary;
      default: return colors.primary;
    }
  };

  const renderContent = () => {
    if (capture.type === 'image' || capture.type === 'video') {
      return (
        <View className="mb-2">
          {capture.file_url ? (
            <Image 
              source={{ uri: capture.file_url }} 
              className="w-full h-56 rounded-2xl bg-surface-variant mb-3 border border-outline-variant/10"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-56 rounded-2xl bg-surface-variant mb-3 items-center justify-center border border-outline-variant/10">
              <MaterialIcons name={capture.type === 'video' ? "videocam" : "image"} size={48} color={colors.outline} />
            </View>
          )}
          {capture.ocr_text && (
            <View className="bg-surface-variant/30 p-3 rounded-xl mb-3 border border-outline-variant/10">
              <Text className="text-body-sm text-on-surface-variant italic" numberOfLines={2}>
                "{capture.ocr_text}"
              </Text>
            </View>
          )}
          {capture.summary && (
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
            <View className="bg-surface-variant/30 p-3 rounded-xl border border-outline-variant/10">
              <Text className="text-body-md text-on-surface italic" numberOfLines={3}>
                "{capture.transcript}"
              </Text>
            </View>
          )}
        </View>
      );
    }

    if (capture.type === 'location') {
      return (
        <View className="mb-2">
          <View className="w-full h-32 bg-surface-variant/50 rounded-2xl items-center justify-center mb-3 border border-outline-variant/10">
             <MaterialIcons name="map" size={40} color={colors.outline} />
          </View>
          <Text className="text-body-md text-on-surface" numberOfLines={2}>
            {capture.content_text || 'Location captured'}
          </Text>
        </View>
      );
    }

    if (capture.type === 'url') {
      return (
        <View className="mb-2">
          <View className="flex-row items-center gap-3 bg-surface-variant/50 p-3 rounded-2xl mb-3 border border-outline-variant/10">
             <View className="w-10 h-10 rounded-full bg-tertiary-container items-center justify-center">
               <MaterialIcons name="link" size={20} color={colors.tertiary} />
             </View>
             <Text className="text-body-md text-on-surface flex-1 font-medium" numberOfLines={1}>
               {capture.title || capture.content_text || 'Web Link'}
             </Text>
          </View>
          {capture.summary && (
            <Text className="text-body-md text-on-surface-variant" numberOfLines={3}>
              {capture.summary}
            </Text>
          )}
        </View>
      );
    }
    
    if (capture.type === 'pdf' || capture.type === 'document' || capture.type === 'file') {
      return (
        <View className="mb-2">
          <View className="flex-row items-center gap-4 bg-surface-variant/50 p-4 rounded-2xl mb-3 border border-outline-variant/10">
             <View className="w-12 h-12 rounded-xl bg-error-container items-center justify-center shadow-sm">
               <MaterialIcons name="picture-as-pdf" size={24} color={colors.error} />
             </View>
             <View className="flex-1">
               <Text className="text-body-lg text-on-surface font-bold" numberOfLines={1}>
                 {capture.title || 'Document'}
               </Text>
               <Text className="text-body-sm text-on-surface-variant uppercase mt-1 tracking-wider">
                 {capture.type} • {format(new Date(capture.created_at), 'MMM d, yyyy')}
               </Text>
             </View>
          </View>
          {capture.summary && (
            <Text className="text-body-md text-on-surface-variant" numberOfLines={3}>
              {capture.summary}
            </Text>
          )}
        </View>
      );
    }

    // Default Text / Note
    return (
      <View className="mb-2">
        {capture.content_text && (
          <Text className="text-body-md text-on-surface leading-relaxed" numberOfLines={4}>
            {capture.content_text}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View className="mb-4">
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={() => onPress(capture)}
        className="bg-surface/80 rounded-[28px] p-5 shadow-sm border border-outline-variant/20 overflow-hidden"
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-center gap-2 flex-1 mr-4">
            <View className="w-8 h-8 rounded-full bg-surface-container-high items-center justify-center shadow-sm">
              <MaterialIcons name={getIcon()} size={16} color={getIconColor()} />
            </View>
            <Text className="font-title-sm text-primary font-bold flex-1" numberOfLines={1}>
              {capture.title || (capture.type.charAt(0).toUpperCase() + capture.type.slice(1) + ' Capture')}
            </Text>
          </View>
          <Text className="text-caption-sm text-on-surface-variant font-medium mt-1">{time}</Text>
        </View>

        {renderContent()}

        {/* AI Entities / Tags */}
        <View className="flex-row justify-between items-center mt-3">
          <View className="flex-row items-center gap-2 flex-1 flex-wrap">
            {capture.status === 'processing' && (
              <View className="bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant/20">
                <Text className="text-[10px] uppercase font-bold text-outline tracking-wider">Processing</Text>
              </View>
            )}
            {capture.entities && capture.entities.slice(0, 3).map((entity: any, i: number) => (
              <TouchableOpacity 
                key={i} 
                onPress={(e) => {
                  e.stopPropagation();
                  // We route to global search with the entity value for now, 
                  // as global Graph entity IDs are mapped separately.
                  // router.push(`/(main)/search?q=${encodeURIComponent(entity.entity_value)}`)
                }}
                className="bg-secondary-container/50 px-3 py-1.5 rounded-lg border border-secondary/10 flex-row items-center gap-1"
              >
                <MaterialIcons name="hub" size={10} color={colors.secondary} />
                <Text className="text-secondary text-[10px] font-bold uppercase tracking-wider">{entity.entity_value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});
