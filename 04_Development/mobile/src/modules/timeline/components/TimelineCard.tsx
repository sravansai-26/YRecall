import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';
import { Capture } from '../../captures/services/api';
import { format } from 'date-fns';
import { AudioPlayer } from '../../../shared/components/AudioPlayer';
import { MemoryRenderer } from './previews';

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
    return <MemoryRenderer capture={capture} variant="compact" onPress={onPress} />;
  };

  return (
    <View className="mb-4">
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={() => onPress(capture)}
        className="bg-surface-container-lowest rounded-[28px] p-5 shadow-sm overflow-hidden"
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
              <View className="bg-surface-container-high px-3 py-1.5 rounded-lg">
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
                className="bg-secondary-container/50 px-3 py-1.5 rounded-lg flex-row items-center gap-1"
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
