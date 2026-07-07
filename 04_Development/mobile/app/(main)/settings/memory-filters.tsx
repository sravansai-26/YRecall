import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function MemoryFilters() {
  const router = useRouter();

  return (
    <Screen scrollable={true} className="pb-32">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface/80 flex-row items-center justify-between px-margin-mobile h-16 md:px-margin-desktop">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">Memory Synthesis</Text>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6">
        <View className="mb-8">
          <Text className="font-headline-md text-3xl font-bold text-on-surface mb-2">Memory Filters & Synthesis</Text>
          <Text className="text-on-surface-variant font-body-md text-base max-w-2xl">
            Configure how your digital brain resurfaces and connects your memories over time.
          </Text>
        </View>

        <View className="flex-col gap-6 max-w-2xl">
          {/* Memory Synthesis Slider Card */}
          <View className="bg-primary rounded-[24px] p-6 shadow-xl relative overflow-hidden w-full">
            <View className="flex-row items-center gap-2 mb-6">
              <MaterialIcons name="auto-awesome" size={24} color="#ffffff" />
              <Text className="font-title-sm text-xl font-bold text-white">Synthesis Engine</Text>
            </View>

            <View className="flex-col gap-8">
              <View className="flex-col">
                <View className="flex-row justify-between mb-2">
                  <Text className="font-medium text-base text-white">Proactivity</Text>
                  <Text className="text-primary-fixed text-base font-bold">High</Text>
                </View>
                {/* Slider visual representation */}
                <View className="h-2 bg-white/30 rounded-full w-full justify-center">
                  <View className="absolute left-0 w-[80%] h-2 bg-white rounded-full" />
                  <View className="absolute left-[80%] -ml-3 w-6 h-6 rounded-full bg-primary border-2 border-white shadow-sm" />
                </View>
                <Text className="text-on-primary-container text-caption-sm text-sm mt-4 leading-relaxed">Adjust how often YRecall suggests memories without being prompted. High levels provide deep contextual insights daily.</Text>
              </View>

              <View className="flex-col">
                <View className="flex-row justify-between mb-2">
                  <Text className="font-medium text-base text-white">Insight Depth</Text>
                  <Text className="text-primary-fixed text-base font-bold">Balanced</Text>
                </View>
                {/* Slider visual representation */}
                <View className="h-2 bg-white/30 rounded-full w-full justify-center">
                  <View className="absolute left-0 w-[50%] h-2 bg-white rounded-full" />
                  <View className="absolute left-[50%] -ml-3 w-6 h-6 rounded-full bg-primary border-2 border-white shadow-sm" />
                </View>
                <Text className="text-on-primary-container text-caption-sm text-sm mt-4 leading-relaxed">Controls the detail of AI-generated summaries. Deeper insights require more processing but provide richer context.</Text>
              </View>
            </View>
          </View>

          <View className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant/30 flex-col gap-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-col flex-1 pr-4">
                <Text className="font-bold text-base text-on-surface">Temporal Smoothing</Text>
                <Text className="text-sm text-on-surface-variant mt-1">Group rapidly captured memories (like burst photos) into single narrative events to reduce timeline clutter.</Text>
              </View>
              <MaterialIcons name="toggle-on" size={36} color={colors.primary} />
            </View>
            <View className="h-[1px] w-full bg-outline-variant/30 my-2" />
            <View className="flex-row items-center justify-between">
              <View className="flex-col flex-1 pr-4">
                <Text className="font-bold text-base text-on-surface">Emotional Variance</Text>
                <Text className="text-sm text-on-surface-variant mt-1">Allow the AI to tag memories with inferred emotional states based on tone and context.</Text>
              </View>
              <MaterialIcons name="toggle-off" size={36} color={colors.outline} />
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}
