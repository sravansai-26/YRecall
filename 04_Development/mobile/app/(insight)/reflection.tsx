import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function SystemIntelligenceReflection() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-xl">
        
        {/* Hero Section: System Status */}
        <View className="flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <View className="flex-1 max-w-2xl">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-2 h-2 rounded-full bg-secondary" />
              <Text className="font-bold text-label-xs text-secondary uppercase tracking-widest">Cognitive Audit Active</Text>
            </View>
            <Text className="font-display-lg text-[32px] md:text-[48px] text-on-surface font-bold tracking-tight">
              Intelligence Reflection
            </Text>
            <Text className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
              A multi-dimensional audit of the system's long-term learning patterns. These insights represent the high-level cognitive frameworks extracted from our interactions over the past 12 months.
            </Text>
          </View>
          <View className="flex-col items-start md:items-end mt-4 md:mt-0">
            <Text className="font-bold text-label-xs text-on-surface-variant uppercase tracking-widest">Alignment Score</Text>
            <Text className="font-display-lg text-[32px] font-bold text-secondary">94.2%</Text>
          </View>
        </View>

        {/* Bento Grid: Core Learning Modules */}
        <View className="flex-col gap-lg md:flex-row">
          
          {/* Main Area: Cognitive Evolution + Details */}
          <View className="flex-col gap-lg flex-[2]">
            
            {/* Cognitive Evolution (Chart) */}
            <View className="bg-surface-container-lowest border border-outline-variant p-lg rounded-[24px] shadow-sm">
              <View className="flex-row justify-between items-start mb-6">
                <View>
                  <Text className="font-headline-md text-xl font-bold text-on-surface">Cognitive Evolution</Text>
                  <Text className="text-body-sm text-on-surface-variant">Pattern extraction efficiency over time.</Text>
                </View>
                <View className="bg-secondary-container/10 px-2 py-1 rounded">
                  <Text className="font-data-mono text-[12px] text-secondary">Last update: 2h ago</Text>
                </View>
              </View>

              {/* Simplified Logic Visualization (Bars) */}
              <View className="h-64 flex-row items-end gap-2 relative mt-4">
                <View className="flex-1 bg-surface-container-high rounded-t h-[25%]" />
                <View className="flex-1 bg-surface-container-high rounded-t h-[33%]" />
                <View className="flex-1 bg-surface-container-high rounded-t h-[50%]" />
                <View className="flex-1 bg-secondary rounded-t h-[75%]" />
                <View className="flex-1 bg-secondary-container rounded-t h-[100%]" />
                <View className="flex-1 bg-secondary rounded-t h-[83%]" />
                <View className="flex-1 bg-surface-container-high rounded-t h-[66%]" />
                <View className="flex-1 bg-secondary-container rounded-t h-[80%]" />
                
                {/* Horizontal Guide Lines */}
                <View className="absolute inset-0 flex-col justify-between pointer-events-none opacity-20 py-2">
                  <View className="border-t border-outline border-dashed w-full" />
                  <View className="border-t border-outline border-dashed w-full" />
                  <View className="border-t border-outline border-dashed w-full" />
                </View>
              </View>

              <View className="flex-row justify-between mt-4">
                <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest flex-1">Q1: Base Alignment</Text>
                <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest flex-1 text-center">Q2: Context Mapping</Text>
                <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest flex-1 text-center">Q3: Strategic Anticipation</Text>
                <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest flex-1 text-right">Q4: Current State</Text>
              </View>
            </View>

            {/* Refinement Clusters */}
            <View className="bg-surface-container-lowest border border-outline-variant p-lg rounded-[24px] shadow-sm">
              <Text className="font-headline-md text-xl font-bold text-on-surface mb-4">Refinement Clusters</Text>
              <View className="flex-col md:flex-row gap-4">
                
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 p-4 border border-outline-variant rounded-xl  group">
                  <View className="flex-row items-center gap-2 mb-2">
                    <MaterialIcons name="forum" size={20} color={colors.secondary} />
                    <Text className="font-body-md font-bold text-on-surface">Communication Refinement</Text>
                  </View>
                  <Text className="text-body-sm text-on-surface-variant leading-relaxed">
                    Adjusted syntax sensitivity. Observed preference for structured data lists over prose narratives.
                  </Text>
                  <Text className="mt-4 font-data-mono text-[10px] text-on-surface-variant/50 uppercase tracking-tighter">
                    Refinement Log: 4,201 Nodes Modified
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 p-4 border border-outline-variant rounded-xl  group">
                  <View className="flex-row items-center gap-2 mb-2">
                    <MaterialIcons name="hub" size={20} color={colors.secondary} />
                    <Text className="font-body-md font-bold text-on-surface">Relationship Mapping</Text>
                  </View>
                  <Text className="text-body-sm text-on-surface-variant leading-relaxed">
                    Contextualized 12 professional and 4 personal primary anchors. Priority: Executive Level 1 stakeholders.
                  </Text>
                  <Text className="mt-4 font-data-mono text-[10px] text-on-surface-variant/50 uppercase tracking-tighter">
                    Refinement Log: 890 Connections Validated
                  </Text>
                </TouchableOpacity>

              </View>
            </View>

            {/* AI Thinking State Loader Placeholder */}
            <View className="flex-row items-center gap-4 p-4 bg-surface-container/50 rounded-xl border border-dashed border-outline-variant">
              <View className="w-2 h-2 rounded-full bg-secondary" />
              <Text className="font-data-mono text-[12px] text-on-surface-variant">
                AI background process: Auditing latent semantic biases in recent "Decision Making" thread...
              </Text>
            </View>

          </View>

          {/* Right Sidebar: Values, Calibrate Worldview */}
          <View className="flex-col gap-lg flex-[1] md:max-w-[340px]">
            
            {/* Core Values Identified */}
            <View className="bg-primary p-lg rounded-[24px] border border-primary">
              <View className="flex-row items-center gap-2 mb-2">
                <MaterialIcons name="psychology" size={24} color={colors.white} />
                <Text className="font-headline-md text-xl font-bold text-white">Values Model</Text>
              </View>
              <Text className="text-body-sm text-white/80 mb-6 leading-relaxed">
                Identified priorities driving user decision-making.
              </Text>

              <View className="flex-col gap-4">
                <View className="flex-row items-center justify-between border-b border-white/10 pb-2">
                  <Text className="text-body-md text-white">Precision/Accuracy</Text>
                  <Text className="font-data-mono text-secondary-fixed">88%</Text>
                </View>
                <View className="flex-row items-center justify-between border-b border-white/10 pb-2">
                  <Text className="text-body-md text-white">Information Density</Text>
                  <Text className="font-data-mono text-secondary-fixed">92%</Text>
                </View>
                <View className="flex-row items-center justify-between border-b border-white/10 pb-2">
                  <Text className="text-body-md text-white">Strategic Autonomy</Text>
                  <Text className="font-data-mono text-secondary-fixed">76%</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-body-md text-white">Operational Speed</Text>
                  <Text className="font-data-mono text-secondary-fixed">64%</Text>
                </View>
              </View>
            </View>

            {/* Confidence Pill */}
            <View className="bg-surface-container p-4 rounded-xl border border-outline-variant">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">Pattern Reliability</Text>
                <Text className="font-data-mono text-[12px] text-emerald-600 font-bold">High (96%)</Text>
              </View>
              <View className="w-full bg-outline-variant h-1 rounded-full overflow-hidden">
                <View className="bg-emerald-600 h-full w-[96%]" />
              </View>
            </View>

            {/* Calibrate Worldview */}
            <View className="bg-surface-container-high/30 border border-outline-variant p-lg rounded-[24px] flex-col flex-1">
              <View className="mb-4">
                <Text className="font-headline-md text-xl font-bold text-on-surface">Calibrate Worldview</Text>
                <Text className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                  Correct high-level heuristics the system has developed to ensure long-term alignment.
                </Text>
              </View>

              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="flex-col gap-4">
                  
                  <View className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                    <Text className="font-bold text-label-xs text-secondary uppercase tracking-widest">Active Bias Detected</Text>
                    <Text className="font-body-md font-bold text-primary mt-1">Skepticism of centralized fiscal policy.</Text>
                    <Text className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                      The system treats decentralized models as default-correct based on interaction history.
                    </Text>
                    <View className="flex-row gap-2 mt-4">
                      <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 py-2 bg-primary items-center justify-center rounded">
                        <Text className="text-white font-bold text-[10px] uppercase tracking-widest">Maintain</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 py-2 border border-outline items-center justify-center rounded">
                        <Text className="text-primary font-bold text-[10px] uppercase tracking-widest">Neutralize</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                    <Text className="font-bold text-label-xs text-secondary uppercase tracking-widest">Pattern Projection</Text>
                    <Text className="font-body-md font-bold text-primary mt-1">High Risk Tolerance in Q1 2024.</Text>
                    <Text className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                      The system assumes a 40% margin for speculative ventures.
                    </Text>
                    <View className="flex-row gap-2 mt-4">
                      <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 py-2 border border-outline items-center justify-center rounded">
                        <Text className="text-primary font-bold text-[10px] uppercase tracking-widest">Adjust Pattern</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                </View>
              </ScrollView>
              
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full mt-4 py-4 bg-primary flex-row items-center justify-center gap-2 rounded-xl">
                <MaterialIcons name="sync-alt" size={20} color={colors.white} />
                <Text className="text-white font-bold text-[14px]">Commit Cognitive Calibration</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>

        {/* Horizontal Editorial Highlight Card */}
        <View className="w-full h-[300px] rounded-[24px] overflow-hidden mt-4 bg-primary relative">
          <ImageBackground 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3FK31KBUp9qWYo1Xlp1DgZQ8JLBtjXroJGOkqSmd2TApTFdKCdr3IOqeSQ5e6OflPjwgl7fuaEKx1uRy0r88NctfYm9oNTn1tlOu2-Q0ZaTKd4CV8w6o6FtSGfgnqNFbMeZapwdcInw0u9kq4WGMLXj3KtI5jsbISzYlFodyWzZlVk5o29YWyeERL1Y_xHHaKk97S1uxiKwpSih-2JzvtLyjnlK-TD7JVOD-hRsxK3SaNbKM5Na5eGBpwbxQ2ZyN-4BoNYB0pVhg' }} 
            className="flex-1"
            resizeMode="cover"
          >
            <View className="flex-1 bg-black/60 p-lg justify-center">
              <Text className="text-white font-display-lg text-[32px] md:text-[48px] font-bold tracking-tight max-w-xl">
                Trust is built on transparency.
              </Text>
              <Text className="text-white/80 text-body-md mt-4 max-w-md leading-relaxed">
                This cognitive audit ensures that as the system grows more capable, it remains strictly within your ethical and operational boundaries.
              </Text>
            </View>
          </ImageBackground>
        </View>

      </View>
    </Screen>
  );
}
