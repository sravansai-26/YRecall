import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';

interface Props {
  summary: string | null;
  date: string | null;
  metrics: any;
  priorities: any[];
  isLoading?: boolean;
}

export function DailyBriefCard({ summary, date, metrics, priorities, isLoading }: Props) {
  if (isLoading) {
    return (
      <View className="bg-surface-container-low rounded-3xl p-5 mb-5 shadow-sm border border-outline-variant/30">
        <View className="h-6 w-1/3 bg-surface-container-highest rounded-full mb-4 animate-pulse" />
        <View className="h-4 w-full bg-surface-container-highest rounded-full mb-2 animate-pulse" />
        <View className="h-4 w-3/4 bg-surface-container-highest rounded-full animate-pulse" />
      </View>
    );
  }

  if (!summary) {
    return (
      <View className="bg-surface-container-low rounded-3xl p-5 mb-5 shadow-sm border border-outline-variant/30 flex-row items-center gap-3">
        <MaterialCommunityIcons name="brain" size={28} color={colors.secondary} />
        <Text className="font-body-md text-on-surface-variant flex-1">
          No brief available for today yet. Add some memories!
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-surface-container-low rounded-3xl p-5 mb-5 shadow-sm border border-outline-variant/30">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="auto-awesome" size={20} color={colors.primary} />
          <Text className="font-title-md font-bold text-primary">Daily Brief</Text>
        </View>
        <Text className="font-label-sm text-on-surface-variant">
          {new Date(date || '').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}
        </Text>
      </View>
      <Text className="font-body-md text-on-surface leading-relaxed">
        {summary}
      </Text>
    </View>
  );
}
