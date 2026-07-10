import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';

interface Props {
  insight: {
    id: string;
    text: string;
    type: string;
  };
  isLoading?: boolean;
}

export function InsightCard({ insight, isLoading }: Props) {
  if (isLoading) {
    return (
      <View className="bg-surface-container-low rounded-3xl p-4 mb-3 border border-outline-variant/30 flex-row items-center gap-4 shadow-sm">
        <View className="w-12 h-12 bg-surface-container-highest rounded-full animate-pulse" />
        <View className="flex-1 gap-2">
          <View className="h-4 w-full bg-surface-container-highest rounded-full animate-pulse" />
          <View className="h-4 w-2/3 bg-surface-container-highest rounded-full animate-pulse" />
        </View>
      </View>
    );
  }

  const getIcon = () => {
    switch(insight.type) {
      case 'pattern': return 'brain';
      case 'productivity': return 'chart-line';
      default: return 'lightbulb-on-outline';
    }
  };

  return (
    <View className="bg-surface-container-low rounded-3xl p-4 mb-3 border border-outline-variant/30 flex-row items-center gap-4 shadow-sm">
      <View className="w-12 h-12 rounded-full bg-secondary-container items-center justify-center">
        <MaterialCommunityIcons name={getIcon()} size={24} color={colors['on-secondary-container']} />
      </View>
      <View className="flex-1">
        <Text className="font-body-md text-on-surface leading-relaxed">
          {insight.text}
        </Text>
      </View>
    </View>
  );
}
