import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../src/shared/theme/colors';
import { PreviewProps } from './types';
import { getPreviewRenderer } from './PreviewRegistry';
import Markdown from 'react-native-markdown-display';
import { formatDistanceToNow } from 'date-fns';
import { TextInput, ActivityIndicator } from 'react-native';
import { apiClient } from '../../../../../src/services/api';
import { useQueryClient } from '@tanstack/react-query';

const markdownStyles = {
  body: { color: colors['on-surface'], fontSize: 16, lineHeight: 24 },
  heading1: { color: colors.primary, marginTop: 16, marginBottom: 8 },
  code_inline: { backgroundColor: colors['surface-variant'], padding: 4, borderRadius: 4, fontFamily: 'monospace' },
};

export const MemoryRenderer: React.FC<PreviewProps> = ({ capture, variant, onPress }) => {
  const isTimeline = variant === 'timeline' || variant === 'compact';
  const queryClient = useQueryClient();
  
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(capture.title || '');
  const [isSavingTitle, setIsSavingTitle] = React.useState(false);

  const handleSaveTitle = async () => {
    if (!editedTitle.trim() || editedTitle.trim() === capture.title) {
        setIsEditingTitle(false);
        return;
    }
    
    setIsSavingTitle(true);
    try {
        await apiClient.put(`/captures/${capture.id}/title`, { title: editedTitle.trim() });
        queryClient.invalidateQueries({ queryKey: ['captures'] });
        queryClient.invalidateQueries({ queryKey: ['capture', capture.id] });
        setIsEditingTitle(false);
    } catch (e) {
        console.error("Failed to update title", e);
    } finally {
        setIsSavingTitle(false);
    }
  };

  
  const SpecificRenderer = getPreviewRenderer(capture.type);
  const timeAgoRaw = capture.created_at ? formatDistanceToNow(new Date(capture.created_at), { addSuffix: false }) : '';
  const timeAgo = timeAgoRaw ? `Captured ${timeAgoRaw} ago` : '';
  
  const title = capture.title || (capture.type.charAt(0).toUpperCase() + capture.type.slice(1) + ' Capture');
  const summaryText = capture.summary || capture.content_text || capture.ocr_text || capture.transcript || '';

  const getIcon = () => {
    switch (capture.type) {
      case 'note': return 'edit-note';
      case 'text': return 'short-text';
      case 'image': return 'image';
      case 'voice':
      case 'audio': return 'mic';
      case 'video': return 'videocam';
      case 'url':
      case 'link': return 'link';
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
      case 'url':
      case 'link': return '#00BFA5';
      case 'pdf':
      case 'document': return '#D32F2F';
      case 'automation': return colors.tertiary;
      default: return colors.primary;
    }
  };

  if (isTimeline) {
    const isLink = capture.type === 'url' || capture.type === 'link';
    
    // Media, Links, and Documents get a custom graphical layout
    if (capture.type === 'image' || capture.type === 'video' || capture.type === 'location' || capture.type === 'voice' || capture.type === 'audio' || isLink || capture.type === 'document') {
      return (
        <View className="mb-4">
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => onPress && onPress(capture)}
            className="bg-surface-container-lowest rounded-[32px] shadow-sm overflow-hidden"
          >
            {/* Top Media Section */}
            <View className="w-full relative">
              <SpecificRenderer capture={capture} variant="timeline" onPress={onPress} />
              
              {/* Time Badge */}
              <View className="absolute top-4 right-4 bg-surface-container-lowest/90 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 shadow-sm">
                <MaterialIcons name={getIcon()} size={14} color={colors.primary} />
                <Text className="font-label-sm font-bold text-primary text-[11px]">{timeAgo}</Text>
              </View>
            </View>
            
            {/* Bottom Text Section */}
            <View className="p-6 pt-4">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1 mr-2">
                  <Text className="font-title-md font-extrabold text-primary flex-1" numberOfLines={1}>{title}</Text>
                </View>
              </View>
              {summaryText ? (
                <Text className="text-body-md text-on-surface-variant leading-relaxed" numberOfLines={3}>{summaryText}</Text>
              ) : null}
              
              {/* Entities */}
              {capture.entities && capture.entities.length > 0 && (
                 <View className="flex-row gap-2 mt-4 flex-wrap">
                   {capture.entities.slice(0, 2).map((e: any, i: number) => (
                     <View key={i} className="bg-surface-variant/40 px-3 py-1 rounded-lg">
                       <Text className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{e.entity_value}</Text>
                     </View>
                   ))}
                 </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="mb-4">
        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={() => onPress && onPress(capture)}
          className="bg-surface-container-lowest rounded-[32px] p-6 shadow-sm overflow-hidden flex-row gap-4"
        >
          <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: `${getIconColor()}15` }}>
            <MaterialIcons name={getIcon()} size={20} color={getIconColor()} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              {isLink && <MaterialIcons name="link" size={14} color={colors.outline} />}
              <Text className="text-[10px] uppercase font-extrabold text-outline tracking-widest">
                {isLink ? 'ARTICLE SUMMARY' : `${capture.type.toUpperCase()} SUMMARY`}
              </Text>
            </View>
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1 mr-2">
                  <Text className="font-title-md font-extrabold text-primary flex-1" numberOfLines={1}>{title}</Text>
                </View>
            </View>
            {summaryText ? (
              <Text className="text-body-md text-on-surface-variant leading-relaxed" numberOfLines={4}>{summaryText}</Text>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // === DETAIL VIEW (FULL) ===
  return (
    <View className="w-full">
      <SpecificRenderer capture={capture} variant="detail" onPress={onPress} />

      {(capture.transcript || capture.ocr_text || capture.content_text) && (
        <View className="bg-surface-container-lowest border border-surface-variant/60 p-6 rounded-[32px] mb-6 shadow-sm mt-4">
          <View className="flex-row items-center mb-5 border-b border-surface-variant/50 pb-4">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
              <MaterialIcons name="auto-awesome" size={20} color={colors.primary} />
            </View>
            <Text className="font-title-md font-extrabold text-primary tracking-tight">YRecall View</Text>
          </View>
          <View className="markdown-container">
            <Markdown style={markdownStyles}>
              {capture.transcript || capture.ocr_text || capture.content_text || ''}
            </Markdown>
          </View>
        </View>
      )}

      {capture.entities && capture.entities.length > 0 && (
        <View className="mb-8 mt-2">
          <Text className="font-title-sm font-bold text-primary mb-3">Extracted Knowledge</Text>
          <View className="flex-row flex-wrap gap-2">
            {capture.entities.map((entity: any, i: number) => (
              <View key={i} className="bg-surface-container-high px-4 py-2.5 rounded-xl">
                <Text className="text-on-surface-variant font-medium text-label-sm tracking-wide">{entity.entity_value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
