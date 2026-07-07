import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button, ConfidenceBadge } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function SourceAttribution() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-xl">
        
        {/* Main Content Area */}
        <View className="flex-col gap-lg md:flex-row">
          
          <View className="flex-col gap-lg flex-1">
            
            {/* Claim Headline & Confidence Card */}
            <View className="bg-surface-container-lowest border border-outline-variant rounded-[24px] overflow-hidden shadow-sm">
              <View className="p-lg border-b border-outline-variant flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <View className="flex-1">
                  <Text className="font-label-caps text-label-xs text-on-surface-variant uppercase tracking-widest">THE CLAIM</Text>
                  <Text className="font-headline-md text-[24px] md:text-[32px] text-primary mt-2 font-bold leading-tight">
                    Project "Helios" timeline was extended to Q4 due to supply chain delays.
                  </Text>
                </View>
                <View className="flex-col items-end shrink-0">
                  <View className="flex-row items-center gap-2 px-4 py-2 bg-secondary-fixed rounded-full">
                    <MaterialIcons name="verified" size={20} color={colors['on-secondary-fixed']} />
                    <Text className="font-bold text-label-xs text-on-secondary-fixed uppercase tracking-widest">High Confidence</Text>
                  </View>
                  <Text className="font-data-mono text-sm text-on-surface-variant mt-2">Calculated: 94%</Text>
                </View>
              </View>

              <View className="flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-outline-variant">
                <View className="flex-1 p-lg flex-col gap-2">
                  <Text className="font-bold text-label-xs text-on-surface-variant uppercase tracking-widest">CONFIDENCE</Text>
                  <View className="h-2 w-full bg-surface-container rounded-full overflow-hidden mt-1">
                    <View className="h-full bg-emerald-600 w-[94%]" />
                  </View>
                  <Text className="text-body-sm text-emerald-600 mt-1 font-bold">Emerald Tier Precision</Text>
                </View>

                <View className="flex-1 p-lg flex-col gap-2">
                  <Text className="font-bold text-label-xs text-on-surface-variant uppercase tracking-widest">PRIMARY SOURCE</Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <MaterialIcons name="description" size={20} color={colors.secondary} />
                    <Text className="text-body-md font-bold text-primary truncate" numberOfLines={1}>Helios_Update_Final.pdf</Text>
                  </View>
                </View>

                <View className="flex-1 p-lg flex-col gap-2">
                  <Text className="font-bold text-label-xs text-on-surface-variant uppercase tracking-widest">LAST UPDATED</Text>
                  <Text className="text-body-md font-bold text-primary mt-1">Oct 24, 2023 · 14:32</Text>
                </View>
              </View>
            </View>

            {/* Supporting Memories (Bento Style) */}
            <View className="flex-col gap-4 mt-4">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="link" size={24} color={colors.primary} />
                  <Text className="font-headline-md text-xl font-bold text-primary">Supporting Memories</Text>
                </View>
                <Text className="text-body-sm text-on-surface-variant">3 Items Found</Text>
              </View>

              <View className="flex-col md:flex-row gap-lg">
                <View className="flex-1 flex-col gap-lg">
                  {/* Card 1 */}
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-surface border border-outline-variant p-lg rounded-[24px]  transition-colors group">
                    <View className="flex-row justify-between items-start mb-4">
                      <View className="flex-row items-center gap-2">
                        <MaterialIcons name="chat" size={20} color={colors.secondary} />
                        <Text className="font-bold text-label-xs text-primary uppercase tracking-widest">Slack Channel: #helios-dev</Text>
                      </View>
                      <MaterialIcons name="open-in-new" size={20} color={colors['on-surface-variant']} />
                    </View>
                    <Text className="text-body-md text-on-surface mb-4 italic leading-relaxed">
                      "...we have to push the final release to December. Shipping containers are stuck in Long Beach."
                    </Text>
                    <View className="flex-row flex-wrap items-center gap-2 mt-auto">
                      <Text className="text-body-sm text-on-surface-variant flex-1">— Sarah Jenkins, Lead Architect</Text>
                      <View className="bg-surface-container-high px-2 py-1 rounded">
                        <Text className="text-[11px] font-bold text-on-surface-variant">Aug 12</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Card 2 */}
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-surface border border-outline-variant p-lg rounded-[24px]  transition-colors group">
                    <View className="flex-row justify-between items-start mb-4">
                      <View className="flex-row items-center gap-2">
                        <MaterialIcons name="description" size={20} color={colors.secondary} />
                        <Text className="font-bold text-label-xs text-primary uppercase tracking-widest">Project Doc: Q4 Roadmap</Text>
                      </View>
                      <MaterialIcons name="open-in-new" size={20} color={colors['on-surface-variant']} />
                    </View>
                    <Text className="text-body-md text-on-surface mb-4 leading-relaxed">
                      Section 4.2: Milestone adjustment from Sept 15 to Nov 30 due to component shortage.
                    </Text>
                    <View className="flex-row items-center gap-2 mt-auto">
                      <Text className="text-body-sm text-on-surface-variant flex-1">Automated extraction</Text>
                      <View className="bg-surface-container-high px-2 py-1 rounded">
                        <Text className="text-[11px] font-bold text-on-surface-variant">Aug 15</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                
                {/* Card 3 (Video spanning on large) */}
                <View className="flex-[1.5]">
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-surface border border-outline-variant p-lg rounded-[24px]  transition-colors group flex-col gap-6 h-full">
                    <View className="aspect-video w-full rounded-xl overflow-hidden bg-surface-container-highest relative">
                      <Image 
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwpUKjRLLHYwOC1Dej4EgSbZoweatafdGytyMQeW5whaVYEdUPiRf1kUD4TFsmXLy2NjIdOEwr2Z5O83x2t05t2Q8VkH0DgxpiDUWQO-e8UK33WOoIcYGYCQUXoDSEyLJbaVtFU3cgpB7esdgA_w7B34prJXAvV70pAoK9LcAm7DRuZEym7yU7oHSNVAiXB8Oy1dFDV6rGnCERUBfNHL6JGNC5M7irvpj02GOYIMvqLwLJOR7cHLZcN9IGjv51ye_uH_2MlHDuRCM' }}
                        className="w-full h-full"
                      />
                      <View className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <MaterialIcons name="play-circle" size={48} color={colors.white} />
                      </View>
                    </View>

                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-row items-center gap-2">
                          <MaterialIcons name="videocam" size={20} color={colors.secondary} />
                          <Text className="font-bold text-label-xs text-primary uppercase tracking-widest">Meeting Recording: All Hands</Text>
                        </View>
                        <MaterialIcons name="open-in-new" size={20} color={colors['on-surface-variant']} />
                      </View>
                      <Text className="text-body-md text-on-surface mb-2 leading-relaxed">
                        Transcript: "CEO confirms Q4 is the new target. We need to be realistic about the supply chain constraints we're seeing across the board."
                      </Text>
                      <Text className="text-body-sm text-on-surface-variant mt-auto">Timestamp: 14:02 - 14:15</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Contradictory Evidence */}
            <View className="bg-error-container/20 rounded-[24px] p-lg border-l-4 border-error mt-4">
              <View className="flex-row items-center gap-3 mb-4">
                <MaterialIcons name="warning" size={24} color={colors.error} />
                <Text className="font-headline-md text-xl font-bold text-on-surface">Contradictory Evidence</Text>
              </View>
              <Text className="text-body-md text-on-surface-variant mb-6 leading-relaxed">
                The AI detected potential conflicting information that lowered the score from 99% to 94%. Review the following:
              </Text>
              <View className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex-row gap-4">
                <View className="pt-1">
                  <MaterialIcons name="calendar-today" size={20} color={colors['on-surface-variant']} />
                </View>
                <View className="flex-1">
                  <Text className="text-body-md font-bold text-primary mb-1">Legacy Calendar Event</Text>
                  <Text className="text-body-sm text-on-surface-variant leading-relaxed">
                    "Helios Launch Party" still listed on Sept 20th in the Shared Social Calendar. This suggests an un-updated public resource.
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Area */}
            <View className="flex-col md:flex-row items-center justify-between gap-6 p-lg bg-primary-container rounded-[24px] mt-4">
              <View className="flex-col gap-1 flex-1">
                <Text className="font-headline-md text-[18px] font-bold text-white">Not quite right?</Text>
                <Text className="text-body-sm text-on-primary-container leading-relaxed">
                  Correct the AI's understanding to improve future insights.
                </Text>
              </View>
              <View className="flex-col md:flex-row gap-4 w-full md:w-auto">
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 md:flex-none border border-on-primary-container py-3 px-6 rounded-full flex-row items-center justify-center gap-2">
                  <MaterialIcons name="edit" size={20} color={colors.white} />
                  <Text className="text-white font-bold">Add Context</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 md:flex-none bg-secondary py-3 px-6 rounded-full flex-row items-center justify-center gap-2">
                  <MaterialIcons name="psychology-alt" size={20} color={colors.white} />
                  <Text className="text-white font-bold">Refine Digital Brain</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>
      </View>
    </Screen>
  );
}
