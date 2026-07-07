import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function FocusAndProductivity() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-xl">
        
        {/* Header Section */}
        <View className="mb-4">
          <Text className="font-headline-md text-[32px] text-primary font-bold tracking-tight mb-2">Cognitive Performance</Text>
          <Text className="font-body-md text-on-surface-variant max-w-2xl leading-relaxed">
            Your digital brain is processing patterns from your voice memos and notes to optimize your deep work cycles.
          </Text>
        </View>

        <View className="flex-col gap-lg">
          <View className="flex-col md:flex-row gap-lg">
            
            {/* Flow State Analysis (Clock Face) */}
            <View className="flex-[1.5] bg-surface-container-lowest/80 border border-outline-variant p-lg rounded-[24px] shadow-sm flex-col">
              <View className="flex-row justify-between items-start mb-6">
                <View>
                  <Text className="font-headline-md text-xl font-bold text-primary">Flow State Analysis</Text>
                  <Text className="text-body-sm text-on-surface-variant mt-1">Creativity peaks based on neuro-linguistic patterns</Text>
                </View>
                <View className="bg-secondary/10 px-3 py-1 rounded-full">
                  <Text className="font-bold text-[10px] text-secondary uppercase tracking-widest">AI Optimized</Text>
                </View>
              </View>

              <View className="flex-1 min-h-[300px] flex-row items-center justify-center relative py-6">
                
                {/* Clock Face Visual */}
                <View className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-outline-variant/30 flex items-center justify-center relative">
                  
                  {/* Decorative Clock Numbers */}
                  <Text className="absolute top-4 font-bold text-label-xs text-outline-variant">12</Text>
                  <Text className="absolute right-4 font-bold text-label-xs text-outline-variant">03</Text>
                  <Text className="absolute bottom-4 font-bold text-label-xs text-outline-variant">06</Text>
                  <Text className="absolute left-4 font-bold text-label-xs text-outline-variant">09</Text>

                  {/* Flow Segments Simulated with absolute positioning and rotation */}
                  {/* Note: React Native View styling is used to approximate the CSS segments */}
                  <View className="absolute inset-0 items-center justify-center opacity-80" style={{ transform: [{ rotate: '-90deg' }] }}>
                    {/* High Logic */}
                    <View className="absolute w-[120px] h-10 bg-secondary/40 rounded-full" style={{ right: '50%', transformOrigin: 'right', transform: [{ rotate: '10deg' }] }} />
                    {/* Deep Creative */}
                    <View className="absolute w-[140px] h-16 bg-primary/20 rounded-full" style={{ right: '50%', transformOrigin: 'right', transform: [{ rotate: '150deg' }] }} />
                    {/* Reflection */}
                    <View className="absolute w-[100px] h-8 bg-[#88d982]/40 rounded-full" style={{ right: '50%', transformOrigin: 'right', transform: [{ rotate: '280deg' }] }} />
                  </View>

                  {/* Central Indicator */}
                  <View className="items-center justify-center bg-surface-container-lowest w-24 h-24 rounded-full shadow-sm border border-outline-variant/20 z-10">
                    <Text className="font-headline-md text-[20px] font-bold text-primary">Peak</Text>
                    <Text className="text-body-md font-bold text-secondary mt-1">10:45 AM</Text>
                  </View>
                </View>

                {/* Side Stats */}
                <View className="absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-6 hidden md:flex">
                  <View className="items-end">
                    <Text className="font-bold text-[10px] text-outline-variant uppercase tracking-widest">Logic Density</Text>
                    <Text className="font-headline-md text-2xl font-bold text-primary">88%</Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-[10px] text-outline-variant uppercase tracking-widest">Verbosity</Text>
                    <Text className="font-headline-md text-2xl font-bold text-primary">4.2k <Text className="text-body-sm text-on-surface-variant font-normal">wpm</Text></Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-[10px] text-outline-variant uppercase tracking-widest">Clarity Score</Text>
                    <Text className="font-headline-md text-2xl font-bold text-primary">High</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Recall Speed Chart */}
            <View className="flex-[1] bg-surface-container-lowest/80 border border-outline-variant p-lg rounded-[24px] shadow-sm flex-col">
              <View className="mb-6">
                <Text className="font-headline-md text-xl font-bold text-primary">Recall Speed</Text>
                <Text className="text-body-sm text-on-surface-variant mt-1">Digital brain retrieval efficiency</Text>
              </View>
              
              <View className="flex-1 min-h-[200px] flex-row items-end gap-2 px-2 pb-4 border-b border-outline-variant/20">
                <View className="flex-1 bg-surface-container-high rounded-t-xl h-[30%]" />
                <View className="flex-1 bg-surface-container-high rounded-t-xl h-[45%]" />
                <View className="flex-1 bg-surface-container-high rounded-t-xl h-[55%]" />
                <View className="flex-1 bg-secondary rounded-t-xl h-[75%]" />
                <View className="flex-1 bg-surface-container-high rounded-t-xl h-[65%]" />
                <View className="flex-1 bg-surface-container-high rounded-t-xl h-[85%]" />
                <View className="flex-1 bg-primary rounded-t-xl h-[95%]" />
              </View>

              <View className="mt-4 pt-2">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-body-md font-bold text-primary">Improvement</Text>
                  <Text className="text-xl font-bold text-secondary">+142%</Text>
                </View>
                <Text className="text-body-sm text-on-surface-variant leading-relaxed">Latency reduced to 120ms average across all connected nodes.</Text>
              </View>
            </View>
          </View>

          {/* Topic Deep Dive (Treemap alternative) */}
          <View className="bg-surface-container-lowest/80 border border-outline-variant p-lg rounded-[24px] shadow-sm flex-col">
            <View className="flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <View>
                <Text className="font-headline-md text-xl font-bold text-primary">Topic Deep Dive</Text>
                <Text className="text-body-sm text-on-surface-variant mt-1">Knowledge clusters captured this month</Text>
              </View>
              <View className="flex-row gap-2 bg-surface-container-high rounded-full p-1 self-start">
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 rounded-full">
                  <Text className="text-on-surface-variant font-bold text-label-xs">Week</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 rounded-full bg-primary shadow-sm">
                  <Text className="text-white font-bold text-label-xs">Month</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 rounded-full">
                  <Text className="text-on-surface-variant font-bold text-label-xs">Year</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-col md:flex-row gap-4 h-[300px]">
              
              {/* Architecture Segment */}
              <View className="flex-[3] bg-primary-container/20 rounded-2xl p-6 flex-col justify-between overflow-hidden relative">
                <View className="z-10">
                  <Text className="font-headline-md text-[24px] font-bold text-primary">Architecture</Text>
                  <Text className="text-body-sm font-bold text-on-surface-variant mt-1">42% of Focus</Text>
                </View>
                <View className="z-10 flex-row flex-wrap gap-2">
                  <View className="px-3 py-1.5 bg-white/60 rounded-full">
                    <Text className="font-bold text-[10px] uppercase tracking-widest text-primary">Brutalist</Text>
                  </View>
                  <View className="px-3 py-1.5 bg-white/60 rounded-full">
                    <Text className="font-bold text-[10px] uppercase tracking-widest text-primary">Sustainability</Text>
                  </View>
                </View>
                <View className="absolute -right-8 -bottom-8 opacity-10">
                  <MaterialIcons name="architecture" size={160} color={colors.primary} />
                </View>
              </View>

              <View className="flex-[2] flex-col gap-4">
                {/* AI Segment */}
                <View className="flex-[2] bg-secondary-container/30 rounded-2xl p-6 flex-row items-center justify-between overflow-hidden relative">
                  <View className="z-10">
                    <Text className="font-headline-md text-xl font-bold text-[#006e6e]">AI Ethics</Text>
                    <Text className="text-body-sm font-bold text-on-surface-variant mt-1">28% of Focus</Text>
                  </View>
                  <View className="absolute -right-4 -bottom-4 opacity-20">
                    <MaterialIcons name="psychology" size={100} color="#006e6e" />
                  </View>
                </View>

                {/* Philosophy Segment */}
                <View className="flex-[1.5] bg-[#a3f69c]/20 rounded-2xl p-6 flex-row items-center justify-between overflow-hidden relative">
                  <View className="z-10">
                    <Text className="font-headline-md text-lg font-bold text-[#003d0b]">Philosophy</Text>
                    <Text className="text-[12px] font-bold text-on-surface-variant mt-1">15%</Text>
                  </View>
                  <View className="absolute -right-2 -bottom-2 opacity-20">
                    <MaterialIcons name="auto-stories" size={80} color="#003d0b" />
                  </View>
                </View>
              </View>
              
            </View>
          </View>

          {/* Bottom Micro-data Cards */}
          <View className="flex-col md:flex-row gap-4 mt-2">
            
            <View className="flex-1 bg-surface-container-lowest/80 border border-outline-variant p-6 rounded-[24px] flex-row items-center gap-6 shadow-sm">
              <View className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                <MaterialIcons name="bolt" size={28} color={colors.white} />
              </View>
              <View className="flex-1">
                <Text className="font-headline-md text-[18px] font-bold text-primary mb-1">Current Focus</Text>
                <Text className="text-body-sm text-on-surface-variant">High Clarity (4.5h)</Text>
              </View>
            </View>

            <View className="flex-1 bg-surface-container-lowest/80 border border-outline-variant p-6 rounded-[24px] flex-row items-center gap-6 shadow-sm">
              <View className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <MaterialIcons name="mic" size={28} color={colors.white} />
              </View>
              <View className="flex-1">
                <Text className="font-headline-md text-[18px] font-bold text-primary mb-1">Voice Inputs</Text>
                <Text className="text-body-sm text-on-surface-variant">12 Active Threads</Text>
              </View>
            </View>

            <View className="flex-1 bg-surface-container-lowest/80 border border-outline-variant p-6 rounded-[24px] flex-row items-center gap-6 shadow-sm">
              <View className="w-14 h-14 rounded-full bg-[#003d0b] flex items-center justify-center">
                <MaterialIcons name="hub" size={28} color={colors.white} />
              </View>
              <View className="flex-1">
                <Text className="font-headline-md text-[18px] font-bold text-primary mb-1">Synaptic Health</Text>
                <Text className="text-body-sm text-on-surface-variant">Optimal Node Linking</Text>
              </View>
            </View>

          </View>

        </View>
      </View>
    </Screen>
  );
}
