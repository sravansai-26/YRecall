import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function VoiceSynthesis() {
  const router = useRouter();
  const [activeVoice, setActiveVoice] = useState('echo');
  
  return (
    <Screen scrollable={true} className="pb-32">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface/80 flex-row items-center justify-between px-margin-mobile h-16 md:px-margin-desktop">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">Voice Synthesis</Text>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6">
        <View className="mb-8">
          <Text className="font-headline-md text-3xl font-bold text-on-surface mb-2">Voice Settings</Text>
          <Text className="text-on-surface-variant font-body-md text-base max-w-2xl">
            Choose how your AI sounds when interacting with you verbally.
          </Text>
        </View>

        <View className="bg-surface-container-lowest rounded-[24px] p-6 md:p-8 shadow-sm border border-outline-variant/30 w-full max-w-2xl">
          <View className="flex-row items-center gap-2 mb-8">
            <View className="bg-secondary-container p-2 rounded-lg">
              <MaterialIcons name="record-voice-over" size={24} color={colors['on-secondary-container']} />
            </View>
            <Text className="font-title-sm text-xl font-bold text-on-surface">Select a Voice</Text>
          </View>

          {/* Waveform Visualizer Placeholder */}
          <View className="h-32 bg-surface-container-low rounded-xl mb-8 flex-row items-center justify-center gap-2 overflow-hidden px-6">
            <View className="w-1.5 bg-primary rounded-full h-4" />
            <View className="w-1.5 bg-primary rounded-full h-8" />
            <View className="w-1.5 bg-primary rounded-full h-12" />
            <View className="w-1.5 bg-primary rounded-full h-20" />
            <View className="w-1.5 bg-primary rounded-full h-10" />
            <View className="w-1.5 bg-primary rounded-full h-16" />
            <View className="w-1.5 bg-primary rounded-full h-6" />
            <View className="w-1.5 bg-primary rounded-full h-8" />
            <View className="w-1.5 bg-primary rounded-full h-4" />
          </View>

          <View className="flex-col gap-4">
            {['aura', 'echo', 'horizon'].map((voice) => {
              const isActive = activeVoice === voice;
              const labels: Record<string, string> = {
                aura: 'Warm and empathetic',
                echo: 'Clear and analytical',
                horizon: 'Deep and professional'
              };
              return (
                <TouchableOpacity 
                  key={voice}
                  onPress={() => setActiveVoice(voice)}
                  className={`w-full p-4 rounded-xl border-2 flex-row items-center justify-between ${isActive ? 'border-primary bg-primary/5' : 'border-outline-variant '}`}
                >
                  <View className="flex-row items-center gap-4">
                    <MaterialIcons name={isActive ? "play-circle-fill" : "play-circle-outline"} size={28} color={isActive ? colors.primary : colors.outline} />
                    <View className="flex-col">
                      <Text className={`font-bold text-lg capitalize ${isActive ? 'text-primary' : 'text-on-surface'}`}>{voice}</Text>
                      <Text className="text-sm text-on-surface-variant">{labels[voice]}</Text>
                    </View>
                  </View>
                  {isActive && <MaterialIcons name="check-circle" size={24} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Screen>
  );
}
