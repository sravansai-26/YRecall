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
  <View className="flex-col bg-surface-container-high p-4 rounded-[28px] mb-4 shadow-sm overflow-hidden relative">
  {/* Abstract Glassmorphic Background Elements */}
  <View className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-10 -mt-10" />
  <View className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full -ml-8 -mb-8" />
  
  <View className="flex-row items-center gap-4 mb-4 relative z-10">
  <TouchableOpacity 
  onPress={togglePlay}
  activeOpacity={0.8}
  className="w-12 h-12 rounded-full bg-primary items-center justify-center shadow-md"
  >
  <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={28} color={colors['on-primary']} />
  </TouchableOpacity>
  
  <View className="flex-1">
  <Text className="text-on-surface font-bold text-sm mb-0.5">Voice Note</Text>
  <Text className="text-on-surface-variant text-xs">YRecall Audio Player</Text>
  </View>
  <MaterialIcons name="graphic-eq" size={24} color={isPlaying ? colors.primary : colors.outline} />
  </View>
  
  <View className="flex-1 relative z-10 mt-1">
  <View className="h-1.5 bg-outline-variant/20 rounded-full overflow-hidden mb-2">
  <View 
  className="h-full bg-primary rounded-full" 
  style={{ width: `${(position / duration) * 100}%` }}
  />
  </View>
  <View className="flex-row justify-between">
  <Text className="text-[10px] text-on-surface-variant font-bold tracking-widest">{formatTime(position)}</Text>
  <Text className="text-[10px] text-on-surface-variant font-bold tracking-widest">{formatTime(duration)}</Text>
  </View>
  </View>
  </View>
  );
}
