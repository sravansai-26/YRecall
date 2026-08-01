import React from 'react';
import { View, Text } from 'react-native';
import { PreviewProps } from './types';

export const TextPreview: React.ComponentType<PreviewProps> = ({ capture, variant }) => {
  const isCompact = variant === 'compact';

  // MemoryRenderer natively handles Text/Note layout for full variant.
  // We only render something here if it's compact mode.
  if (!isCompact) {
    return null;
  }

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

    </View>
  );
};
