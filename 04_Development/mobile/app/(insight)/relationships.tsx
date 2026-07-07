import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function RelationshipIntelligence() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-xl">
        
        {/* Dashboard Header */}
        <View className="mb-4">
          <Text className="font-headline-md text-[32px] text-primary font-bold tracking-tight mb-2">Relationship Intelligence</Text>
          <Text className="font-body-md text-on-surface-variant max-w-2xl leading-relaxed">
            Analyze the health, depth, and latent opportunities within your professional network.
          </Text>
        </View>

        {/* Main Bento Grid Layout */}
        <View className="flex-col md:flex-row gap-lg">
          
          {/* Network Health Visualization (Large Canvas) */}
          <View className="flex-[2] bg-surface-container-lowest/80 border border-outline-variant rounded-[24px] overflow-hidden relative min-h-[400px] shadow-sm">
            
            <View className="absolute top-6 left-6 z-10 flex-col gap-2">
              <View className="bg-surface-container-highest px-3 py-1.5 rounded-full self-start">
                <Text className="font-bold text-[10px] text-primary uppercase tracking-widest">Live Graph</Text>
              </View>
              <Text className="font-headline-md text-xl font-bold text-primary">Interconnectivity Map</Text>
            </View>

            {/* Static Node Overlay (Simulated Nodes) */}
            <View className="absolute inset-0 items-center justify-center pointer-events-none">
              
              {/* Node 1: High Health */}
              <View className="absolute top-[30%] left-[33%] pointer-events-auto">
                <View className="w-4 h-4 bg-secondary rounded-full animate-pulse" />
                {/* Simulated Tooltip */}
                <View className="absolute top-6 left-0 bg-surface-container-lowest/90 p-3 rounded-xl w-48 shadow-lg z-20 border border-outline-variant/30">
                  <Text className="font-bold text-[10px] text-secondary uppercase tracking-widest mb-1">Active Connection</Text>
                  <Text className="font-headline-md text-[16px] font-bold text-on-surface">Marcus Chen</Text>
                  <View className="flex-row items-center gap-2 mt-2">
                    <View className="h-1 flex-1 bg-secondary rounded-full" />
                    <Text className="font-data-mono text-[12px] font-bold text-on-surface-variant">92% Health</Text>
                  </View>
                </View>
              </View>

              {/* Node 2: Connection Decay */}
              <View className="absolute bottom-[33%] right-[25%] pointer-events-auto">
                <View className="w-4 h-4 bg-error rounded-full animate-pulse" />
              </View>

              {/* Node 3: Intro Opportunity */}
              <View className="absolute top-[50%] right-[50%] pointer-events-auto">
                <View className="w-6 h-6 bg-primary border-2 border-white rounded-full items-center justify-center">
                  <MaterialIcons name="link" size={12} color={colors.white} />
                </View>
              </View>

            </View>

            {/* Graph Legend */}
            <View className="absolute bottom-6 right-6 flex-row gap-4 bg-surface-container-lowest/90 p-4 rounded-xl border border-outline-variant/30 shadow-sm">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-secondary" />
                <Text className="font-bold text-[10px] uppercase tracking-widest text-on-surface">Healthy</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-error" />
                <Text className="font-bold text-[10px] uppercase tracking-widest text-on-surface">Decaying</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-primary" />
                <Text className="font-bold text-[10px] uppercase tracking-widest text-on-surface">Suggestion</Text>
              </View>
            </View>

          </View>

          {/* Insight Panel (Actionable Side) */}
          <View className="flex-[1] flex-col gap-lg">
            
            {/* Connection Decay Card */}
            <View className="border border-outline-variant bg-surface-container-lowest/80 rounded-[24px] p-6 shadow-sm flex-col">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">Connection Decay</Text>
                <MaterialIcons name="trending-down" size={20} color={colors.error} />
              </View>

              <View className="flex-col gap-2">
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 p-2 bg-surface-container-high rounded-xl">
                  <View className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden">
                    <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOHwFG0haOyXukACo4WoNkOi30n4PHTHluZKl-Cy3phWCyIWoHl2SNsvVkI3K4hEHL5CGraKL7hcDh0xXesygM3fmxy4yeJtLyRwmgKtCOusqPerf2XxUE6TENETozAODupfUZCtDLC3izE5vtNAYo8C-opJ4aXpxG598jsqetiji-hN0m7oR9Fsbj-YjEkGzjPeqAEI_vyjI41Eo7Dh3Mvnid64KpuynfcJjXIvX0SMZaw3HKsxrVWbXbQVyWNTUpH39yM0oGZyU' }} className="w-full h-full" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-body-md font-bold text-on-surface">Sarah Jenkins</Text>
                    <Text className="font-bold text-[10px] text-error uppercase tracking-widest">12 weeks silent</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 p-2 rounded-xl border border-outline-variant/20">
                  <View className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden">
                    <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu5jHOWigA91sjRMjHPbVLU_64NuvyHXsx7FFsg8HKDKjcVUUucGg1Kksu9-Y6T7O7hGZiMK-Yum-bC_NkvWc-p6V7Ou4aGO6fPhfq4YG8YBUpQomxvUJbGAeV98qs6idURq5QNbwHinA7jcrXAP06yiSitI5LXHZrtQGLMSeaq8dJ5KVTnf7TyrV8QmfJh3tcQgEEFXlE60xQociVFD2240CFz6A1zx1h2b8mDwzLoWfGPdOgHj79YZ4NJHD0V8U3ZzF7_A9D3j4' }} className="w-full h-full" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-body-md font-bold text-on-surface">David Park</Text>
                    <Text className="font-bold text-[10px] text-error uppercase tracking-widest">8 weeks silent</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="mt-6 w-full py-3 border border-outline-variant rounded-xl items-center justify-center">
                <Text className="font-bold text-label-xs uppercase tracking-widest text-on-surface">Recall All</Text>
              </TouchableOpacity>
            </View>

            {/* AI Intro Suggestions */}
            <View className="border border-outline-variant bg-surface-container-lowest/80 rounded-[24px] p-6 shadow-sm">
              <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-4">AI Intro Suggestions</Text>
              
              <View className="p-4 bg-[#a3f69c]/20 rounded-xl border border-outline-variant/30">
                <View className="flex-row items-center gap-2 mb-3">
                  <MaterialIcons name="psychology" size={18} color={colors.secondary} />
                  <Text className="font-data-mono text-[10px] font-bold text-[#003d0b] tracking-widest uppercase">KNOWLEDGE OVERLAP</Text>
                </View>
                <Text className="text-body-sm text-on-surface mb-1">
                  Introduce <Text className="font-bold">Marcus</Text> to <Text className="font-bold">Li Wei</Text>
                </Text>
                <Text className="text-[12px] text-on-surface-variant mb-4">
                  Both researched "Neural Compression" recently.
                </Text>
                
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 bg-primary py-2 rounded-lg items-center justify-center">
                    <Text className="text-white font-bold text-[12px]">Draft Intro</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-3 border border-outline-variant rounded-lg items-center justify-center bg-surface-container-highest">
                    <MaterialIcons name="close" size={16} color={colors['on-surface-variant']} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Network Pulse */}
            <View className="border border-outline-variant bg-primary text-white rounded-[24px] p-6 shadow-sm">
              <Text className="font-bold text-[10px] text-white/70 uppercase tracking-widest mb-2">Network Health Score</Text>
              
              <View className="flex-row items-end justify-between">
                <Text className="text-[40px] font-bold text-white leading-none">84</Text>
                <View className="flex-col items-end">
                  <View className="bg-emerald-600 px-2 py-1 rounded">
                    <Text className="text-[10px] font-bold text-white">+4% this week</Text>
                  </View>
                  <Text className="text-[10px] text-white/70 mt-1">Optimal: 90+</Text>
                </View>
              </View>

              <View className="w-full bg-white/20 h-2 rounded-full mt-6 overflow-hidden">
                <View className="w-[84%] bg-white h-full rounded-full" />
              </View>
            </View>

          </View>
        </View>

        {/* Relationship Milestones (Horizontal Scroll Section) */}
        <View className="mt-4">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="font-headline-md text-[24px] font-bold text-primary">Relationship Milestones</Text>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
              <Text className="text-secondary font-bold text-label-xs uppercase tracking-widest">View History</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-margin-mobile px-margin-mobile">
            <View className="flex-row gap-4 pr-margin-mobile">
              
              {/* Milestone Card 1 */}
              <View className="w-[300px] bg-surface-container-lowest/80 p-6 rounded-[24px] border-l-4 border-l-secondary shadow-sm">
                <Text className="font-data-mono text-[12px] font-bold text-secondary tracking-widest mb-2">TODAY</Text>
                <Text className="font-headline-md text-[18px] font-bold text-on-surface">Marcus Chen: 5 Years</Text>
                <Text className="text-body-sm text-on-surface-variant mt-2 leading-relaxed h-16">
                  First met at the SF Tech Summit 2019. You've collaborated on 4 major initiatives since.
                </Text>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="mt-6 w-full bg-surface-container-highest py-3 rounded-xl items-center justify-center">
                  <Text className="text-on-surface font-bold text-[12px] uppercase tracking-widest">Send Note</Text>
                </TouchableOpacity>
              </View>

              {/* Milestone Card 2 */}
              <View className="w-[300px] bg-surface-container-lowest/80 p-6 rounded-[24px] border-l-4 border-l-primary shadow-sm">
                <Text className="font-data-mono text-[12px] font-bold text-on-surface-variant tracking-widest mb-2">TOMORROW</Text>
                <Text className="font-headline-md text-[18px] font-bold text-on-surface">Sarah Jenkins: Project Closing</Text>
                <Text className="text-body-sm text-on-surface-variant mt-2 leading-relaxed h-16">
                  Completion of the Q3 Intelligence Audit. Mark the success with a follow-up call.
                </Text>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="mt-6 w-full bg-surface-container-highest py-3 rounded-xl items-center justify-center">
                  <Text className="text-on-surface font-bold text-[12px] uppercase tracking-widest">Schedule Call</Text>
                </TouchableOpacity>
              </View>

              {/* Milestone Card 3 */}
              <View className="w-[300px] bg-surface-container-lowest/80 p-6 rounded-[24px] border-l-4 border-l-[#003d0b] shadow-sm">
                <Text className="font-data-mono text-[12px] font-bold text-on-surface-variant tracking-widest mb-2">SEP 15</Text>
                <Text className="font-headline-md text-[18px] font-bold text-on-surface">Annual Alumni Meet</Text>
                <Text className="text-body-sm text-on-surface-variant mt-2 leading-relaxed h-16">
                  Predicted 12 core connections will be present. Prime opportunity to restore decay.
                </Text>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="mt-6 w-full bg-primary py-3 rounded-xl items-center justify-center">
                  <Text className="text-white font-bold text-[12px] uppercase tracking-widest">RSVP Event</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </View>

      </View>

      {/* FAB */}
      <View className="absolute bottom-24 right-margin-mobile z-40">
        <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-16 h-16 bg-primary rounded-full items-center justify-center shadow-lg  transition-transform">
          <MaterialIcons name="person-add" size={28} color={colors.white} />
        </TouchableOpacity>
      </View>

    </Screen>
  );
}
