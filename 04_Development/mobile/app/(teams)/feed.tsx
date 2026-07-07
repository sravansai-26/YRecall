import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function Feed() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      {/* Top Navigation */}
      <View className="w-full top-0 sticky z-50 bg-surface-container border-b border-outline-variant/10 shadow-sm h-16 px-4 md:px-margin-desktop flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="hub" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl font-bold text-primary">YRecall Teams</Text>
        </View>
        <View className="hidden md:flex-row items-center gap-6">
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="text-primary font-bold">Discovery</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="text-on-surface-variant">Shared Space</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="text-on-surface-variant">Insights</Text></TouchableOpacity>
          </View>
          <View className="h-6 w-[1px] bg-outline-variant/30" />
          <View className="flex-row items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/30">
            <MaterialIcons name="sensors" size={18} color={colors['on-secondary-container']} />
            <Text className="font-label-xs text-on-secondary-container uppercase">Presence</Text>
          </View>
        </View>
      </View>

      <View className="flex-1 w-full max-w-[1280px] mx-auto flex-row min-h-[900px]">
        {/* Navigation Drawer (Desktop) */}
        <View className="hidden lg:flex flex-col w-[280px] p-4 gap-2 border-r border-outline-variant/10 bg-surface-container-low h-full">
          <View className="flex-col mb-6 p-4 rounded-xl bg-surface-container-highest/50">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="w-10 h-10 rounded-lg bg-primary-container items-center justify-center">
                <MaterialIcons name="architecture" size={24} color="#ffffff" />
              </View>
              <View className="flex-col">
                <Text className="font-headline-sm text-lg text-primary font-bold">Engineering Alpha</Text>
                <Text className="text-body-sm text-on-surface-variant">12 Active Members</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1.5 px-2 py-0.5 rounded bg-secondary-fixed self-start">
              <Text className="text-[10px] text-on-secondary-fixed font-bold uppercase tracking-widest">AI Synchronized</Text>
            </View>
          </View>

          <View className="flex-col gap-1">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 p-3 bg-primary rounded-xl">
              <MaterialIcons name="explore" size={20} color="#ffffff" />
              <Text className="text-white font-bold">Discovery Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 p-3 rounded-xl">
              <MaterialIcons name="cloud-queue" size={20} color={colors['on-surface-variant']} />
              <Text className="text-on-surface-variant font-bold">Shared Space</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 p-3 rounded-xl">
              <MaterialIcons name="person-search" size={20} color={colors['on-surface-variant']} />
              <Text className="text-on-surface-variant font-bold">Expert Search</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 p-3 rounded-xl">
              <MaterialIcons name="psychology" size={20} color={colors['on-surface-variant']} />
              <Text className="text-on-surface-variant font-bold">AI Insights</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 p-3 rounded-xl">
              <MaterialIcons name="inventory-2" size={20} color={colors['on-surface-variant']} />
              <Text className="text-on-surface-variant font-bold">Archive</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-auto pt-6 border-t border-outline-variant/10">
            <Text className="font-label-xs text-on-surface-variant/60 mb-4 px-3 uppercase tracking-widest">Team Knowledge Health</Text>
            <View className="px-3">
              <View className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                <View className="h-full bg-secondary w-3/4" />
              </View>
              <Text className="mt-2 text-body-sm text-on-surface-variant">86% Cohesion Rating</Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View className="flex-[1] p-6 md:p-8 bg-background flex-col gap-6">
          
          {/* Intelligence Alerts Hero */}
          <View className="mb-10 p-6 rounded-2xl bg-white/80 border border-outline-variant/10">
            <View className="flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <View className="flex-col max-w-[600px]">
                <View className="flex-row items-center gap-2 mb-3 px-3 py-1 rounded-full bg-error-container self-start">
                  <MaterialIcons name="priority-high" size={16} color={colors['on-error-container']} />
                  <Text className="font-label-xs text-on-error-container uppercase">Intelligence Alert</Text>
                </View>
                <Text className="font-headline-lg text-3xl font-bold text-primary mb-2">3 Semantic Divergences Detected</Text>
                <Text className="text-body-lg text-on-surface-variant">Your team's current research on 'Edge Computing' is drifting from established marketing whitepapers. AI suggests a synchronization meeting.</Text>
              </View>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-primary px-6 py-3 rounded-full shadow-lg items-center justify-center">
                <Text className="text-white font-bold">Resolve Conflicts</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dashboard Layout: Bento Grid Style */}
          <View className="flex-col xl:flex-row gap-6">
            
            {/* Semantic Threads Feed */}
            <View className="xl:flex-[2] flex-col gap-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-headline-sm text-xl font-bold text-primary">Semantic Threads</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded"><MaterialIcons name="filter-list" size={20} color={colors['on-surface-variant']} /></TouchableOpacity>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded"><MaterialIcons name="sync" size={20} color={colors['on-surface-variant']} /></TouchableOpacity>
                </View>
              </View>

              {/* Thread 1 */}
              <View className="relative pl-10 flex-col">
                <View className="absolute left-[15px] top-[40px] bottom-[-24px] w-[2px] border-l-2 border-dashed border-surface-variant" />
                <View className="absolute left-0 top-0 w-8 h-8 rounded-full bg-secondary-container items-center justify-center z-10">
                  <MaterialIcons name="account-tree" size={18} color={colors['on-secondary-container']} />
                </View>
                <View className="p-5 bg-white border border-outline-variant/10 rounded-xl shadow-sm">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-col">
                      <Text className="text-body-sm font-bold text-secondary uppercase tracking-widest">Knowledge Synthesis</Text>
                      <Text className="font-headline-sm text-lg font-bold text-primary mt-1">A new research node linked 3 existing marketing docs</Text>
                    </View>
                    <Text className="text-mono text-[12px] text-on-surface-variant">09:42 AM</Text>
                  </View>
                  <Text className="text-body-md text-on-surface-variant mb-4">
                    Sarah uploaded "Q4 Latency Benchmarks". The AI autonomously mapped this to the "Customer Pain Points" deck and two technical specifications.
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    <View className="px-2 py-1 bg-surface-container rounded-md flex-row items-center gap-1">
                      <MaterialIcons name="description" size={14} color={colors['on-surface-variant']} />
                      <Text className="text-body-sm text-on-surface-variant">Q4_Latency_V2.pdf</Text>
                    </View>
                    <View className="px-2 py-1 bg-surface-container rounded-md flex-row items-center gap-1">
                      <MaterialIcons name="description" size={14} color={colors['on-surface-variant']} />
                      <Text className="text-body-sm text-on-surface-variant">Pain_Points_Review</Text>
                    </View>
                  </View>
                  <View className="mt-4 pt-4 border-t border-outline-variant/10 flex-row items-center justify-between">
                    <View className="flex-row -space-x-2">
                      <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3LEP4pMRtRWZtqxmZSebx3bUT_LNstqKve7qp-xXaYrLQRMZaw5ZZtEHVgwmG88CKz4TmGXlPJU664JKGCPc4oGRuwSsKScgtTt9zV2GkuCdwwJU8aaK6Qh5GixN8U4mumSaoYDKQjEQtMXOp2W9qD9ySrjCoknpqeyZYxmzOTpvWNIXXp5PNjR5vtSOIgbHHQ3RyNq46bveJgTns2-jjGPe-VVtzjyhdBLGImPQiqo4quhLoLSpE8_mAksYXVcIM91Rc1MuMHA8' }} className="w-8 h-8 rounded-full border-2 border-white" />
                      <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKOpElRTTb3JGl_DaByjSgZ0xgq-whQ0kwRNJJaQLDLltztPJVCshR5ThURi15Xoxp8LNAxgd8tzHBxMi4RcWinhi65ZF9slOWeyau172nbjtysTVEcefQKyKow3oHlwB9YraaYFzq67USDyh79RNbji1H6me1xKNi2YgNI_cIK3gs88AwBIg7Q_7N3ceBogmXbg_KKd8G-Iu6LaPntymym8xk4kVuLEJp9e0b2huuZxA-DSUZgmbRuLYqYrAzwR1kI4xAvRWmzfA' }} className="w-8 h-8 rounded-full border-2 border-white" />
                      <View className="w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center"><Text className="text-white text-[10px] font-bold">+3</Text></View>
                    </View>
                    <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-1">
                      <Text className="text-primary font-bold text-body-sm">View Graph</Text>
                      <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Thread 2 */}
              <View className="relative pl-10 mt-6 flex-col">
                <View className="absolute left-[15px] top-[40px] bottom-[0px] w-[2px] border-l-2 border-dashed border-surface-variant" />
                <View className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary-container items-center justify-center z-10">
                  <MaterialIcons name="psychology" size={18} color="#ffffff" />
                </View>
                <View className="p-5 bg-white border border-outline-variant/10 rounded-xl shadow-sm">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-col">
                      <Text className="text-body-sm font-bold text-primary uppercase tracking-widest">AI Insight Generated</Text>
                      <Text className="font-headline-sm text-lg font-bold text-primary mt-1">Opportunity for Content Reuse</Text>
                    </View>
                    <Text className="text-mono text-[12px] text-on-surface-variant">YESTERDAY</Text>
                  </View>
                  <Text className="text-body-md text-on-surface-variant mb-4">
                    I've noticed overlapping themes between the 'Project Omega' draft and the 'SaaS Playbook'. 42% content redundancy detected. Recommend merging into a single Source of Truth.
                  </Text>
                  <View className="flex-row items-center gap-2 px-3 py-1.5 bg-secondary-container rounded-full self-start">
                    <MaterialIcons name="auto-fix-high" size={16} color={colors['on-secondary-container']} />
                    <Text className="text-on-secondary-container text-body-sm font-bold">Auto-Merge Suggested</Text>
                  </View>
                </View>
              </View>

            </View>

            {/* Right Column */}
            <View className="xl:flex-[1] flex-col gap-6">
              
              {/* Trending Intelligence */}
              <View className="p-6 bg-surface-container-low border border-outline-variant/20 rounded-2xl shadow-sm">
                <View className="flex-row items-center gap-2 mb-6">
                  <MaterialIcons name="trending-up" size={24} color={colors.secondary} />
                  <Text className="font-headline-sm text-xl font-bold text-primary">Trending Intelligence</Text>
                </View>
                <View className="flex-col gap-4">
                  <View className="flex-col">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="font-bold text-primary">#API_Spec_Refactor</Text>
                      <Text className="text-mono text-[12px] text-on-surface-variant">82 accesses</Text>
                    </View>
                    <View className="h-1 w-full bg-surface-variant rounded-full overflow-hidden">
                      <View className="h-full bg-primary w-full" />
                    </View>
                  </View>

                  <View className="flex-col">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="font-bold text-primary">Market_Entry_Strategy</Text>
                      <Text className="text-mono text-[12px] text-on-surface-variant">45 accesses</Text>
                    </View>
                    <View className="h-1 w-full bg-surface-variant rounded-full overflow-hidden">
                      <View className="h-full bg-primary w-[65%]" />
                    </View>
                  </View>

                  <View className="flex-col">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="font-bold text-primary">User_Testing_Notes</Text>
                      <Text className="text-mono text-[12px] text-on-surface-variant">31 accesses</Text>
                    </View>
                    <View className="h-1 w-full bg-surface-variant rounded-full overflow-hidden">
                      <View className="h-full bg-primary w-[40%]" />
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full mt-6 py-2 border border-outline-variant/30 rounded items-center">
                  <Text className="text-body-sm font-bold text-primary">Explore All Clusters</Text>
                </TouchableOpacity>
              </View>

              {/* Shared Bookmarks */}
              <View className="p-6 bg-white border border-outline-variant/10 rounded-2xl shadow-sm">
                <View className="flex-row items-center justify-between mb-6">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="bookmark" size={24} color={colors.primary} />
                    <Text className="font-headline-sm text-xl font-bold text-primary">Shared Bookmarks</Text>
                  </View>
                  <MaterialIcons name="add-circle" size={24} color={colors['on-surface-variant']} />
                </View>
                <View className="flex-col gap-3">
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 p-3 rounded-lg border border-outline-variant/5 bg-surface-bright">
                    <View className="w-10 h-10 bg-secondary-container/20 rounded items-center justify-center">
                      <MaterialIcons name="description" size={20} color={colors['on-secondary-container']} />
                    </View>
                    <View className="flex-col flex-1">
                      <Text className="font-bold text-primary truncate">Architecture_Master_v2</Text>
                      <Text className="text-body-sm text-on-surface-variant">Updated 2h ago</Text>
                    </View>
                    <MaterialIcons name="open-in-new" size={16} color={colors['on-surface-variant']} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 p-3 rounded-lg border border-outline-variant/5 bg-surface-bright">
                    <View className="w-10 h-10 bg-secondary-container/20 rounded items-center justify-center">
                      <MaterialIcons name="link" size={20} color={colors['on-secondary-container']} />
                    </View>
                    <View className="flex-col flex-1">
                      <Text className="font-bold text-primary truncate">Figma: Design System Hub</Text>
                      <Text className="text-body-sm text-on-surface-variant">Shared by Kevin</Text>
                    </View>
                    <MaterialIcons name="open-in-new" size={16} color={colors['on-surface-variant']} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Collaborative Presence */}
              <View className="p-4 bg-white/80 rounded-2xl border-l-4 border-l-secondary">
                <Text className="font-label-xs text-on-surface-variant mb-3 uppercase tracking-widest">Now Collaborating</Text>
                <View className="flex-row flex-wrap gap-3">
                  <View className="flex-row items-center gap-2 px-2 py-1 rounded bg-white shadow-sm border border-outline-variant/10">
                    <View className="w-2 h-2 rounded-full bg-secondary" />
                    <Text className="text-body-sm font-bold text-primary">Liam G.</Text>
                  </View>
                  <View className="flex-row items-center gap-2 px-2 py-1 rounded bg-white shadow-sm border border-outline-variant/10">
                    <View className="w-2 h-2 rounded-full bg-primary" />
                    <Text className="text-body-sm font-bold text-primary">Sarah W.</Text>
                  </View>
                  <View className="flex-row items-center gap-2 px-2 py-1 rounded bg-white shadow-sm border border-outline-variant/10">
                    <View className="w-2 h-2 rounded-full bg-secondary-container" />
                    <Text className="text-body-sm font-bold text-primary">AI Assistant</Text>
                  </View>
                </View>
              </View>

            </View>
          </View>

        </View>
      </View>
    </Screen>
  );
}
