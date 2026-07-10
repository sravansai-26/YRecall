import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';

interface Props {
  count: number;
  type: string;
  isLoading?: boolean;
}

export function StreakBadge({ count, type, isLoading }: Props) {
  if (isLoading) {
    return (
      <View className="h-9 w-28 bg-surface-container-highest rounded-full animate-pulse mr-2" />
    );
  }

  const getLabel = () => {
    switch(type) {
      case 'capture': return 'Captures';
      case 'reflect': return 'Reflections';
      default: return 'Streak';
    }
  };

  const isHot = count >= 3;

  return (
    <View className={`rounded-full px-3 py-1.5 flex-row items-center gap-1 mr-2 ${isHot ? 'bg-tertiary' : 'bg-primary-container'}`}>
      <MaterialCommunityIcons name="fire" size={16} color={isHot ? colors['on-tertiary'] : colors['on-primary-container']} />
      <Text className={`font-label-sm font-bold ${isHot ? 'text-on-tertiary' : 'text-on-primary-container'}`}>{count}</Text>
      <Text className={`font-label-sm ${isHot ? 'text-on-tertiary' : 'text-on-primary-container'}`}>{getLabel()}</Text>
    </View>
  );
}
