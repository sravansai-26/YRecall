import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { colors } from '../theme/colors';
import { useAudioStore } from '../store/useAudioStore';

export function AudioPlayer({ url }: { url: string }) {
  const player = useAudioPlayer(url);
  const status = useAudioPlayerStatus(player);
  const { activePlayerUrl, setActivePlayerUrl } = useAudioStore();

  const isPlaying = status.playing;
  const position = status.currentTime || 0;
  const duration = status.duration || 1;

  useEffect(() => {
    if (activePlayerUrl && activePlayerUrl !== url && isPlaying) {
      player.pause();
    }
  }, [activePlayerUrl, isPlaying, url]);

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      setActivePlayerUrl(url);
      player.play();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className="flex-row items-center gap-3 bg-surface-variant/50 p-3 rounded-2xl mb-3 border border-outline-variant/10">
      <TouchableOpacity 
        onPress={togglePlay}
        className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-sm"
      >
        <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={24} color={colors['on-primary']} />
      </TouchableOpacity>
      
      <View className="flex-1">
        {/* Progress Bar Background */}
        <View className="h-1.5 bg-outline-variant/30 rounded-full overflow-hidden mb-1.5">
          <View 
            className="h-full bg-primary" 
            style={{ width: `${(position / duration) * 100}%` }}
          />
        </View>
        <View className="flex-row justify-between">
          <Text className="text-[10px] text-on-surface-variant font-medium tracking-wide">{formatTime(position)}</Text>
          <Text className="text-[10px] text-on-surface-variant font-medium tracking-wide">{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
}
