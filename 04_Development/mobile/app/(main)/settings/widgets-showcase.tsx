import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function WidgetsShowcase() {
  const router = useRouter();

  return (
    <Screen scrollable={true} className="pb-24 bg-background">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16 border-b border-outline-variant/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl font-bold text-primary">YRecall Hub</Text>
        </View>
      </View>

      <View className="flex-1 items-center py-12 px-4">
        {/* Hero Header */}
        <View className="max-w-4xl w-full text-center mb-16 items-center">
          <Text className="font-display-lg text-4xl text-primary font-bold mb-2">YRecall Hub</Text>
          <Text className="font-body-md text-base text-on-surface-variant max-w-md mx-auto text-center leading-relaxed">
            Your intelligence operating system, accessible at a glance. Editorial design meets iOS efficiency.
          </Text>
        </View>

        {/* iPhone Mockup Shell */}
        <View className="relative w-[340px] h-[740px] bg-black rounded-[50px] p-4 shadow-2xl border-8 border-neutral-800">
          {/* Screen Content */}
          <View className="relative w-full h-full overflow-hidden rounded-[36px] bg-white">
            <ImageBackground 
              source={{ uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop' }} 
              className="absolute inset-0 opacity-40" 
              resizeMode="cover"
            />
            
            {/* Status Bar Placeholder */}
            <View className="flex-row justify-between items-center px-8 pt-4">
              <Text className="font-bold text-xs text-primary">9:41</Text>
              <View className="flex-row gap-1.5 items-center">
                <MaterialIcons name="signal-cellular-alt" size={14} color={colors.primary} />
                <MaterialIcons name="wifi" size={14} color={colors.primary} />
                <MaterialIcons name="battery-full" size={14} color={colors.primary} />
              </View>
            </View>

            {/* Widgets Area */}
            <ScrollView className="flex-1 px-4 pt-10" showsVerticalScrollIndicator={false}>
              
              {/* Large Widget */}
              <View className="w-full bg-white/70 rounded-[28px] p-4 mb-4 shadow-sm border border-white flex-col gap-3">
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 rounded-lg bg-primary-container items-center justify-center">
                    <MaterialIcons name="history" size={16} color="#ffffff" />
                  </View>
                  <Text className="text-xs font-bold text-primary">YRecall Intelligence</Text>
                </View>
                <View className="p-3 bg-secondary/10 rounded-xl border border-secondary/20 flex-col gap-1">
                  <View className="flex-row items-center gap-1 mb-1">
                    <MaterialIcons name="auto-awesome" size={12} color={colors.secondary} />
                    <Text className="text-[10px] font-bold text-secondary uppercase tracking-tight">AI Insight</Text>
                  </View>
                  <Text className="text-sm font-medium text-on-surface leading-snug">"You mentioned a meeting with Sarah today at 3 PM about Project Nova."</Text>
                </View>
                <View className="flex-row gap-2">
                  <View className="flex-1 bg-primary rounded-xl h-10 flex-row items-center justify-center gap-1">
                    <MaterialIcons name="bolt" size={16} color="#ffffff" />
                    <Text className="text-white text-[10px] font-bold">Quick</Text>
                  </View>
                  <View className="flex-1 bg-surface-variant rounded-xl h-10 flex-row items-center justify-center gap-1">
                    <MaterialIcons name="mic" size={16} color={colors['on-surface']} />
                  </View>
                </View>
              </View>

              {/* Small Widgets Row */}
              <View className="flex-row gap-4 mb-4">
                {/* Small Widget 1 */}
                <View className="flex-1 aspect-square bg-white/70 rounded-[28px] p-4 shadow-sm border border-white flex-col justify-between">
                  <View className="flex-row items-center justify-between">
                    <MaterialIcons name="trending-up" size={20} color={colors.secondary} />
                    <Text className="text-[10px] font-bold text-on-surface-variant uppercase">Focus</Text>
                  </View>
                  <View className="flex-col">
                    <Text className="text-3xl font-bold text-primary">82%</Text>
                    <Text className="text-[10px] text-on-surface-variant font-medium">Optimal Flow</Text>
                  </View>
                </View>
                
                {/* Small Widget 2 */}
                <View className="flex-1 aspect-square bg-primary rounded-[28px] p-4 shadow-sm flex-col justify-between">
                  <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                    <MaterialIcons name="mic" size={16} color="#ffffff" />
                  </View>
                  <View className="flex-col">
                    <Text className="text-sm font-bold text-white mb-1">Voice Note</Text>
                    <Text className="text-[10px] text-white/70">Tap to record</Text>
                  </View>
                </View>
              </View>

              {/* Medium Widget */}
              <View className="w-full bg-surface-container-lowest/80 rounded-[28px] p-4 mb-4 shadow-sm border border-outline-variant/30 flex-col">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="check-circle" size={16} color={colors.primary} />
                    <Text className="text-xs font-bold text-primary">Recent Recalls</Text>
                  </View>
                  <Text className="text-[10px] font-bold text-on-surface-variant uppercase">3 New</Text>
                </View>
                <View className="flex-col gap-2">
                  <View className="flex-row items-center gap-3">
                    <View className="w-2 h-2 rounded-full bg-secondary" />
                    <Text className="text-sm text-on-surface font-medium">Brainstorming session notes</Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <View className="w-2 h-2 rounded-full bg-outline-variant" />
                    <Text className="text-sm text-on-surface font-medium text-on-surface-variant">Expense receipt from lunch</Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <View className="w-2 h-2 rounded-full bg-outline-variant" />
                    <Text className="text-sm text-on-surface font-medium text-on-surface-variant">Idea for marketing campaign</Text>
                  </View>
                </View>
              </View>

            </ScrollView>
          </View>
        </View>

      </View>
    </Screen>
  );
}
