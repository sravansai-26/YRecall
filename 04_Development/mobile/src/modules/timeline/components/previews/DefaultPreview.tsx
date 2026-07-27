import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../src/shared/theme/colors';
import { PreviewProps } from './types';

export const DefaultPreview: React.ComponentType<PreviewProps> = ({ capture, variant }) => {
  const isCompact = variant === 'compact';

  return (
    <View className="mb-2">
      <View className={`flex-row items-center gap-3 bg-surface-variant/30 p-4 rounded-2xl border border-outline-variant/10 ${isCompact ? 'mb-3' : 'mb-4'}`}>
         <View className="w-10 h-10 rounded-full bg-surface-variant items-center justify-center">
           <MaterialIcons name="bookmark" size={20} color={colors.primary} />
         </View>
         <View className="flex-1">
           <Text className="text-body-md text-on-surface font-medium" numberOfLines={1}>
             {capture.title || 'Unknown Capture'}
           </Text>
           <Text className="text-caption-sm text-on-surface-variant uppercase mt-1">
             {capture.type}
           </Text>
         </View>
      </View>
      {capture.summary && (
        <Text className="text-body-md text-on-surface" numberOfLines={isCompact ? 3 : undefined}>
          {capture.summary}
        </Text>
      )}
    </View>
  );
};
