import React, { memo } from 'react';
import { View } from 'react-native';
import { Capture } from '../../captures/services/api';
import { MemoryRenderer } from './previews/MemoryRenderer';

interface TimelineCardProps {
  capture: Capture;
  onPress: (capture: Capture) => void;
}

export const TimelineCard = memo(({ capture, onPress }: TimelineCardProps) => {
  return (
    <MemoryRenderer 
      capture={capture} 
      variant="timeline" 
      onPress={() => onPress(capture)} 
    />
  );
});
