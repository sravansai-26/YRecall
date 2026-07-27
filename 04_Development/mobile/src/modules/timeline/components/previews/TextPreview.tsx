import React from 'react';
import { View, Text } from 'react-native';
import { PreviewProps } from './types';

export const TextPreview: React.ComponentType<PreviewProps> = ({ capture, variant }) => {
  const isCompact = variant === 'compact';

  if (!capture.content_text && !capture.summary) {
    return null;
  }

  return (
    <View className="mb-2">
      {capture.content_text && (
        <Text 
          className="text-body-md text-on-surface mb-2" 
          numberOfLines={isCompact ? 5 : undefined}
        >
          {capture.content_text}
        </Text>
      )}
      {capture.summary && capture.content_text !== capture.summary && (
        <View className="bg-surface-variant/30 p-4 rounded-xl mt-2">
          <Text className="text-body-sm text-on-surface-variant font-medium mb-1">AI SUMMARY</Text>
          <Text className="text-body-md text-on-surface" numberOfLines={isCompact ? 3 : undefined}>
            {capture.summary}
          </Text>
        </View>
      )}
    </View>
  );
};
