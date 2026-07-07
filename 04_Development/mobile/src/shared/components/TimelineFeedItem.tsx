import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export type TimelineItemType = 'ai-insight' | 'note' | 'voice-memo' | 'photo';

interface TimelineFeedItemProps {
  type: TimelineItemType;
  title: string;
  time: string;
  content?: string;
  tags?: string[];
  duration?: string;
  showTimelineTrack?: boolean;
}

export function TimelineFeedItem({
  type,
  title,
  time,
  content,
  tags,
  duration,
  showTimelineTrack = false,
}: TimelineFeedItemProps) {
  const isAI = type === 'ai-insight';

  const renderLeftTrack = () => {
    if (!showTimelineTrack) return null;
    
    let icon = 'edit-note';
    let bg = 'bg-white';
    let iconColor = colors.primary;
    let shadow = 'shadow-sm border border-outline-variant';

    if (isAI) {
      icon = 'lightbulb';
      bg = 'bg-secondary';
      iconColor = colors['on-secondary'];
      shadow = 'shadow-md';
    } else if (type === 'voice-memo') {
      icon = 'mic';
    } else if (type === 'photo') {
      icon = 'image';
    }

    return (
      <View className="z-10 w-12 items-center">
        <View className={`w-10 h-10 rounded-full ${bg} items-center justify-center ${shadow}`}>
          <MaterialIcons name={icon as any} size={20} color={iconColor} />
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (isAI) {
      return (
        <View className={`flex-1 bg-white rounded-[24px] p-lg shadow-sm ${!showTimelineTrack ? 'border border-secondary-container/30' : ''}`}>
          <View className={`flex-col md:flex-row md:items-center justify-between gap-4 mb-4`}>
            <View className={showTimelineTrack ? 'flex-row justify-between w-full items-start' : ''}>
              <View className="flex-row items-center self-start px-3 py-1 bg-secondary/10 rounded-full mb-2">
                <Text className="text-secondary text-label-xs font-bold uppercase tracking-wider">AI Insight</Text>
              </View>
              {showTimelineTrack && <Text className="font-label-xs text-outline">{time}</Text>}
              {!showTimelineTrack && <Text className="font-headline-md text-[32px] text-primary leading-tight font-bold">{title}</Text>}
            </View>
            {!showTimelineTrack && (
              <View className="bg-surface-container px-3 py-1.5 rounded-full self-start">
                <Text className="text-caption-sm text-on-surface-variant">{time}</Text>
              </View>
            )}
          </View>
          {showTimelineTrack && <Text className="font-title-sm text-primary mb-sm font-medium">{title}</Text>}
          
          <Text className="text-body-md text-on-surface-variant leading-relaxed mb-4">{content}</Text>
          
          {tags && tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {tags.map((tag, i) => (
                <View key={i} className="bg-secondary-container px-4 py-1.5 rounded-full">
                  <Text className="text-on-secondary-container text-label-xs font-medium">{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      );
    }

    if (type === 'voice-memo') {
      return (
        <View className="flex-1 bg-white rounded-[24px] p-6 shadow-sm border border-outline-variant/10">
          <View className="flex-row justify-between items-center mb-6">
            {!showTimelineTrack ? (
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-error-container rounded-full items-center justify-center">
                  <MaterialIcons name="play-arrow" size={24} color={colors['on-error-container']} />
                </View>
                <Text className="font-title-sm text-primary font-bold">{title}</Text>
              </View>
            ) : (
              <Text className="font-label-xs text-outline">Voice Memo</Text>
            )}
            <Text className="text-caption-sm text-on-surface-variant">{time}</Text>
          </View>
          
          <View className="h-12 flex-row items-center gap-[4px] mb-4">
            {showTimelineTrack && (
              <View className="w-12 h-12 rounded-full bg-primary items-center justify-center mr-4">
                <MaterialIcons name="play-arrow" size={24} color={colors['on-primary']} />
              </View>
            )}
            <View className="flex-1 h-12 flex-row items-center gap-1">
              {[12, 20, 8, 24, 32, 16, 20, 12, 28, 16].map((h, i) => (
                <View key={i} className={`w-1 rounded-full ${showTimelineTrack ? 'bg-primary/20' : 'bg-secondary'}`} style={{ height: h }} />
              ))}
            </View>
            {duration && <Text className="font-label-xs text-outline">{duration}</Text>}
          </View>

          {content && (
            <View className="p-md bg-surface-container-lowest rounded-xl border border-outline-variant/30 mb-4">
              <Text className="italic text-on-surface-variant font-body-md">"{content}"</Text>
            </View>
          )}

          {tags && tags.length > 0 && (
            <View className="flex-row gap-2">
              {tags.map((tag, i) => (
                <View key={i} className="bg-surface-container px-3 py-1 rounded-full">
                  <Text className="text-label-xs text-on-surface-variant">{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      );
    }

    if (type === 'photo') {
      return (
        <View className="flex-1 bg-white rounded-[24px] overflow-hidden shadow-sm border border-outline-variant/10">
          <View className="p-lg">
            <View className="flex-row justify-between items-center mb-sm">
              {!showTimelineTrack ? (
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="image" size={24} color={colors.secondary} />
                  <Text className="font-title-sm text-primary font-bold">{title}</Text>
                </View>
              ) : (
                <Text className="font-label-xs text-outline">{title}</Text>
              )}
              <Text className="font-label-xs text-outline">{time}</Text>
            </View>
            {content && <Text className="font-body-md text-on-surface mb-md">{content}</Text>}
          </View>
          <View className="flex-row gap-xs px-2 pb-2 h-48">
            <View className="flex-1 bg-surface-variant rounded-xl items-center justify-center">
               <MaterialIcons name="image" size={40} color={colors.outline} />
            </View>
            <View className="flex-1 bg-surface-variant rounded-xl items-center justify-center">
               <MaterialIcons name="image" size={40} color={colors.outline} />
            </View>
          </View>
        </View>
      );
    }

    // Note type
    return (
      <View className="flex-1 bg-white rounded-[24px] p-6 shadow-sm border border-outline-variant/10">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-row items-center gap-2">
            {!showTimelineTrack && <MaterialIcons name="edit-note" size={24} color={colors.secondary} />}
            <Text className="font-title-sm text-primary font-bold">{title}</Text>
          </View>
          <Text className="text-caption-sm text-on-surface-variant">{time}</Text>
        </View>
        
        <View className="border-l-4 border-secondary-container pl-4 my-4">
          <Text className="italic text-on-surface-variant font-body-md">"{content}"</Text>
        </View>
        
        <View className="flex-row items-center justify-between">
          <View className="flex-row gap-2">
            {tags?.map((tag, i) => (
              <View key={i} className="bg-surface-container px-3 py-1 rounded-full">
                <Text className="text-label-xs text-on-surface-variant">{tag}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity>
            <Text className="text-secondary text-label-xs font-bold">View Full Note</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (showTimelineTrack) {
    return (
      <View className="flex-row gap-lg relative">
        {renderLeftTrack()}
        {renderContent()}
      </View>
    );
  }

  return (
    <View className="relative md:pl-16 w-full">
      {renderContent()}
    </View>
  );
}
