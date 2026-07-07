import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function InsightDetailContext() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-xl">
        
        {/* Hero Section with Abstract Pattern */}
        <View className="relative w-full h-64 md:h-80 rounded-[32px] overflow-hidden mb-4 shadow-sm">
          <View className="absolute inset-0 bg-primary/80 z-10" />
          <View className="absolute bottom-0 left-0 p-lg md:p-xl z-20">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="bg-secondary-container px-3 py-1 rounded-full">
                <Text className="text-on-secondary-container font-bold text-[10px] uppercase tracking-widest">Proactive Insight</Text>
              </View>
              <Text className="text-white/80 font-bold text-[10px]">2 hours ago</Text>
            </View>
            <Text className="font-display-lg text-[32px] md:text-[44px] text-white font-bold leading-tight">
              Contextual Recall: Project Nova Architecture
            </Text>
          </View>
        </View>

        {/* AI Rich Summary Card */}
        <View className="bg-surface-container-lowest/80 border border-outline-variant p-lg rounded-[24px] shadow-sm relative overflow-hidden">
          
          <View className="flex-row items-start gap-4 mb-6">
            <View className="bg-secondary-container/30 p-3 rounded-2xl">
              <MaterialIcons name="auto-awesome" size={28} color={colors.secondary} />
            </View>
            <Text className="flex-1 font-body-md text-on-surface-variant leading-relaxed">
              You are about to enter a design review. Here are the 3 key takeaways from your voice memo recorded 2 days ago:
            </Text>
          </View>

          <View className="flex-col gap-4 mb-8">
            <View className="flex-row items-start gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
              <Text className="font-bold text-secondary text-lg mt-0.5">1.</Text>
              <Text className="flex-1 font-body-md text-on-surface">Latency is the primary blocker for the real-time sync module.</Text>
            </View>
            <View className="flex-row items-start gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
              <Text className="font-bold text-secondary text-lg mt-0.5">2.</Text>
              <Text className="flex-1 font-body-md text-on-surface">Decentralized indexing is being explored as a potential long-term fix.</Text>
            </View>
            <View className="flex-row items-start gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
              <Text className="font-bold text-secondary text-lg mt-0.5">3.</Text>
              <Text className="flex-1 font-body-md text-on-surface">Team needs a decision on the CSS framework for the design system components.</Text>
            </View>
          </View>

          {/* Related Assets Grid */}
          <View className="flex-col md:flex-row gap-4">
            
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 flex-row items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm">
              <View className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <MaterialIcons name="mic" size={24} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-[14px] text-on-surface">Nova_Review_Voice.mp3</Text>
                <Text className="text-[12px] text-on-surface-variant">Audio Recording • 4:20</Text>
              </View>
              <MaterialIcons name="play-circle" size={24} color={colors.outline} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 flex-row items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm">
              <View className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <MaterialIcons name="description" size={24} color={colors.secondary} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-[14px] text-on-surface">System_Specs_V2.pdf</Text>
                <Text className="text-[12px] text-on-surface-variant">PDF Document • 1.2 MB</Text>
              </View>
              <MaterialIcons name="open-in-new" size={24} color={colors.outline} />
            </TouchableOpacity>

          </View>

        </View>

        {/* Contextual Actions */}
        <View className="flex-col md:flex-row gap-4 mt-2">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-[2] h-14 bg-primary rounded-[16px] flex-row items-center justify-center gap-2 shadow-sm">
            <MaterialIcons name="article" size={20} color={colors.white} />
            <Text className="text-white font-bold text-[14px]">Open Full Note</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-[2] h-14 bg-white border border-secondary rounded-[16px] flex-row items-center justify-center gap-2 shadow-sm">
            <MaterialIcons name="smart-toy" size={20} color={colors.secondary} />
            <Text className="text-secondary font-bold text-[14px]">Ask AI about this</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-[1] h-14 bg-surface-container-high rounded-[16px] flex-row items-center justify-center gap-2 shadow-sm md:w-14">
            <MaterialIcons name="close" size={20} color={colors['on-surface-variant']} />
            <Text className="text-on-surface-variant font-bold text-[14px] md:hidden">Dismiss</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Screen>
  );
}
