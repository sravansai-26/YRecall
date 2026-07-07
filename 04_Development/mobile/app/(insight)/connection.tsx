import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function InsightConnection() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-xl">
        
        {/* Breadcrumb / Header Section */}
        <View className="mb-4">
          <View className="flex-row items-center gap-1 mb-2">
            <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">Knowledge Graph</Text>
            <MaterialIcons name="chevron-right" size={14} color={colors['on-surface-variant']} />
            <Text className="font-bold text-[10px] text-primary uppercase tracking-widest">Relationship Insight</Text>
          </View>
          <Text className="font-headline-md text-[32px] text-on-surface font-bold tracking-tight">
            Sarah Jenkins <Text className="text-outline-variant px-2">&</Text> Project Nova
          </Text>
        </View>

        <View className="flex-col md:flex-row gap-lg">
          
          {/* AI Synthesis Card (Bento Row 1) */}
          <View className="flex-[2] bg-surface-container-lowest/80 border border-outline-variant p-lg rounded-[24px] shadow-sm relative overflow-hidden flex-col">
            <View className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <View className="flex-row items-center gap-2 mb-6">
              <MaterialIcons name="hub" size={24} color={colors['on-tertiary-container']} />
              <Text className="font-headline-md text-xl font-bold text-on-tertiary-container">AI Relationship Synthesis</Text>
            </View>

            <Text className="font-body-md text-on-surface-variant leading-relaxed mb-8">
              Sarah Jenkins is the <Text className="text-primary font-bold">primary architect</Text> for Project Nova. Her involvement spans from the initial conceptualization in March 2024 to the current optimization phase. Synthesis of cross-platform data reveals that her recent voice memos and Slack activity suggest a critical focus on <Text className="bg-secondary-container/30 text-on-secondary-container font-bold px-1 rounded">latency issues</Text> within the cloud-native infrastructure. Sarah acts as the bridge between technical execution and strategic vision, frequently mediating between the dev team and stakeholders.
            </Text>

            <View className="flex-col md:flex-row gap-4 mt-auto">
              <View className="flex-1 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Key Connection</Text>
                <Text className="font-bold text-[14px] text-primary">Strategic Architect</Text>
              </View>
              <View className="flex-1 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Sentiment Score</Text>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="trending-up" size={16} color={colors['on-tertiary-container']} />
                  <Text className="font-bold text-[14px] text-primary">Optimistic (88%)</Text>
                </View>
              </View>
              <View className="flex-1 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Recent Intensity</Text>
                <Text className="font-bold text-[14px] text-primary">High (Daily Sync)</Text>
              </View>
            </View>
          </View>

          {/* Entities Side Bar (Bento Row 1) */}
          <View className="flex-[1] flex-col gap-4">
            <View className="bg-primary-container p-6 rounded-[24px] flex-row items-center justify-between shadow-sm">
              <View>
                <Text className="font-headline-md text-[18px] font-bold text-white">Entity Alpha</Text>
                <Text className="text-white/80 text-body-sm mt-1">Sarah Jenkins</Text>
              </View>
              <View className="w-14 h-14 rounded-full border-2 border-white/20 overflow-hidden">
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrkXbVtS44OmrGc1WWyJwoHjE_enHAdINluExZayftTxEDFmdCdbR6NM9Q_V90ih2cxxU_JD14kGwdY8_e3v-MPeWFAEJdedJqL5SNQAowIuysQiFlDamEucjO2kwyMu5Rtl4_aCjzem_TrWUI0VWe-NkQFsBuxRv2lCdc6FkSRvEno0yUodYOK2Y0GW6ClBuP25xB8dGMDCTml8bSRoqrOxHRlgiWeIvqJOpGFm8iSFzJATzJuGk9c7K4MBI9o93MuJhnEd6TtZ8' }} className="w-full h-full" />
              </View>
            </View>

            <View className="bg-surface-container-highest p-6 rounded-[24px] flex-row items-center justify-between border border-outline-variant/50 flex-1">
              <View>
                <Text className="font-headline-md text-[18px] font-bold text-primary">Entity Beta</Text>
                <Text className="text-on-surface-variant text-body-sm mt-1">Project Nova</Text>
              </View>
              <View className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                <MaterialIcons name="rocket-launch" size={24} color={colors.white} />
              </View>
            </View>
          </View>

        </View>

        {/* Visual Timeline (Bento Row 2) */}
        <View className="bg-surface-container-lowest/80 border border-outline-variant p-lg rounded-[24px] shadow-sm mt-2 flex-col">
          <View className="flex-row items-center justify-between mb-8">
            <Text className="font-headline-md text-xl font-bold text-primary">Shared History Timeline</Text>
            <View className="bg-surface-variant px-3 py-1.5 rounded-full">
              <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">Last 6 Months</Text>
            </View>
          </View>

          <View className="relative py-8 px-4 h-32 justify-center">
            {/* Timeline Line */}
            <View className="absolute left-4 right-4 h-[2px] bg-outline-variant/30 top-1/2 -mt-[1px]" />
            
            <View className="flex-row justify-between relative z-10">
              <View className="items-center -mt-2">
                <View className="w-4 h-4 rounded-full bg-primary border-4 border-surface" />
                <Text className="font-bold text-on-surface mt-2 text-[12px]">Mar 12</Text>
                <Text className="text-on-surface-variant text-[10px]">Project Kickoff</Text>
              </View>

              <View className="items-center -mt-2">
                <View className="w-4 h-4 rounded-full bg-secondary border-4 border-surface" />
                <Text className="font-bold text-on-surface mt-2 text-[12px]">Apr 05</Text>
                <Text className="text-on-surface-variant text-[10px]">Arch Approval</Text>
              </View>

              <View className="items-center -mt-2">
                <View className="w-4 h-4 rounded-full bg-primary border-4 border-surface" />
                <Text className="font-bold text-on-surface mt-2 text-[12px]">Jun 20</Text>
                <Text className="text-on-surface-variant text-[10px]">Latex Refactor</Text>
              </View>

              <View className="items-center -mt-3">
                <View className="w-6 h-6 rounded-full bg-secondary-fixed border-4 border-secondary items-center justify-center">
                  <View className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                </View>
                <Text className="font-bold text-secondary mt-1 text-[12px]">Today</Text>
                <Text className="text-on-surface-variant text-[10px]">Optimization</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-col md:flex-row gap-lg mt-2">
          
          {/* Shared Files (Bento Row 3) */}
          <View className="flex-[5] bg-surface-container-lowest/80 border border-outline-variant p-lg rounded-[24px] shadow-sm flex-col">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="font-headline-md text-[18px] font-bold text-primary">Shared Assets</Text>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
                <Text className="font-bold text-[10px] text-secondary uppercase tracking-widest">View All</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-col gap-4">
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <View className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center">
                  <MaterialIcons name="description" size={20} color={colors.error} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-[14px] text-on-surface">Nova_System_Architecture.pdf</Text>
                  <Text className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Last edited by Sarah • 2d ago</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <View className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center">
                  <MaterialIcons name="table-chart" size={20} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-[14px] text-on-surface">Resource_Allocation_Matrix.xlsx</Text>
                  <Text className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Shared via Slack • 5d ago</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <View className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center">
                  <MaterialIcons name="slideshow" size={20} color={colors['on-secondary-container']} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-[14px] text-on-surface">Stakeholder_Presentation_V4.pptx</Text>
                  <Text className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Created by Sarah • 1w ago</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Proactive Recommendations */}
          <View className="flex-[7] flex-col">
            <View className="bg-[#a3f69c]/20 border border-[#a3f69c]/30 rounded-[24px] p-lg flex-1 shadow-sm relative overflow-hidden">
              <View className="flex-row items-center gap-2 mb-6 z-10">
                <MaterialIcons name="lightbulb" size={24} color="#003d0b" />
                <Text className="font-headline-md text-xl font-bold text-[#003d0b]">AI Next-Step Projections</Text>
              </View>

              <View className="flex-col sm:flex-row gap-4 z-10">
                <View className="flex-1 p-4 bg-white/40 rounded-xl border border-[#003d0b]/10">
                  <Text className="font-bold text-[14px] text-[#003d0b] mb-2">Review Latency Audio</Text>
                  <Text className="text-[12px] text-[#003d0b]/80 mb-4 leading-relaxed">Sarah mentioned a potential bottleneck in her 3 PM memo. Shall I extract the transcript?</Text>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
                    <Text className="font-bold text-[12px] text-[#003d0b] uppercase tracking-widest underline">Extract Now</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-1 p-4 bg-white/40 rounded-xl border border-[#003d0b]/10">
                  <Text className="font-bold text-[14px] text-[#003d0b] mb-2">Schedule Sync</Text>
                  <Text className="text-[12px] text-[#003d0b]/80 mb-4 leading-relaxed">Nova milestones are approaching. Both parties have a window tomorrow at 10 AM.</Text>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
                    <Text className="font-bold text-[12px] text-[#003d0b] uppercase tracking-widest underline">Send Invite</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

        </View>

      </View>
    </Screen>
  );
}
