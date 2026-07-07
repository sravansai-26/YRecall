import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function FeatureComparison() {
  const router = useRouter();

  return (
    <Screen scrollable={true} className="pb-24 bg-[#FCFAF7]">
      {/* Top App Bar */}
      <View className="w-full sticky top-0 z-50 bg-[#FCFAF7]/90 flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16 border-b border-outline-variant/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="auto-awesome" size={24} color={colors.primary} />
            <Text className="font-headline-md text-2xl font-bold text-primary">YRecall</Text>
          </View>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 flex-col gap-12 w-full">
        
        {/* Hero Section */}
        <View className="flex-col items-center text-center">
          <Text className="font-display-lg text-4xl md:text-5xl text-primary font-bold mb-4">Expand Your Mind.</Text>
          <Text className="text-on-surface-variant text-base md:text-lg max-w-2xl text-center leading-relaxed">
            Choose the perfect tier for your digital second brain. Upgrade to YRecall Premium for unlimited potential and advanced AI synthesis.
          </Text>
        </View>

        {/* Comparison Cards */}
        <View className="flex-col md:flex-row gap-8">
          
          {/* Free Plan */}
          <View className="flex-1 bg-white rounded-[24px] p-8 shadow-sm border border-outline-variant/30 flex-col min-w-[300px]">
            <View className="mb-8">
              <View className="bg-surface-container px-3 py-1 rounded-full self-start mb-4">
                <Text className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">For Individuals</Text>
              </View>
              <Text className="font-headline-md text-3xl font-bold text-primary mb-2">Free</Text>
              <Text className="text-on-surface-variant text-base">Essential features for casual note-taking.</Text>
              <View className="flex-row items-baseline gap-1 mt-4">
                <Text className="font-headline-md text-4xl font-bold text-primary">$0</Text>
                <Text className="text-outline text-sm">/mo</Text>
              </View>
            </View>
            
            <View className="flex-col gap-6 flex-1">
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="check-circle" size={20} color={colors['on-tertiary-container']} />
                <View className="flex-col">
                  <Text className="font-bold text-base text-primary">2GB Capacity</Text>
                  <Text className="text-xs text-on-surface-variant">Ample space for text and basic images.</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="check-circle" size={20} color={colors['on-tertiary-container']} />
                <View className="flex-col">
                  <Text className="font-bold text-base text-primary">Standard AI</Text>
                  <Text className="text-xs text-on-surface-variant">Basic summarization and tagging.</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="check-circle" size={20} color={colors['on-tertiary-container']} />
                <View className="flex-col">
                  <Text className="font-bold text-base text-primary">1 Device</Text>
                  <Text className="text-xs text-on-surface-variant">Access from your primary computer or phone.</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="check-circle" size={20} color={colors['on-tertiary-container']} />
                <View className="flex-col">
                  <Text className="font-bold text-base text-primary">Keyword Search</Text>
                  <Text className="text-xs text-on-surface-variant">Find specific terms within your memory.</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="check-circle" size={20} color={colors['on-tertiary-container']} />
                <View className="flex-col">
                  <Text className="font-bold text-base text-primary">Community Support</Text>
                  <Text className="text-xs text-on-surface-variant">Get help via forums and documentation.</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="mt-8 w-full py-4 border-2 border-primary rounded-[16px] items-center justify-center  transition-all">
              <Text className="text-primary font-bold text-base">Current Plan</Text>
            </TouchableOpacity>
          </View>

          {/* Premium Plan */}
          <View className="flex-1 bg-white rounded-[24px] p-8 shadow-sm flex-col relative border-2 border-secondary/30 min-w-[300px] transform md:-translate-y-4">
            <View className="mb-8">
              <View className="flex-row justify-between items-start mb-4">
                <View className="bg-secondary-container px-3 py-1 rounded-full">
                  <Text className="text-on-secondary-container text-[10px] font-bold uppercase tracking-widest">Most Popular</Text>
                </View>
                <MaterialIcons name="stars" size={24} color={colors.secondary} />
              </View>
              <Text className="font-headline-md text-3xl font-bold text-primary mb-2">Premium</Text>
              <Text className="text-on-surface-variant text-base">For power users who want a truly infinite memory.</Text>
              <View className="flex-row items-baseline gap-1 mt-4">
                <Text className="font-headline-md text-4xl font-bold text-primary">$12</Text>
                <Text className="text-outline text-sm">/mo</Text>
              </View>
            </View>
            
            <View className="flex-col gap-6 flex-1">
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
                <View className="flex-col">
                  <Text className="font-bold text-base text-primary">Unlimited Capacity</Text>
                  <Text className="text-xs text-secondary font-medium">Store your entire digital life without limits.</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
                <View className="flex-col">
                  <Text className="font-bold text-base text-primary">Pro AI Intelligence</Text>
                  <Text className="text-xs text-on-surface-variant">GPT-4o & Claude 3.5 level reasoning.</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
                <View className="flex-col">
                  <Text className="font-bold text-base text-primary">Unlimited Devices</Text>
                  <Text className="text-xs text-on-surface-variant">Perfect sync across phone, tablet, and web.</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
                <View className="flex-col">
                  <Text className="font-bold text-base text-primary">Semantic Retrieval</Text>
                  <Text className="text-xs text-on-surface-variant">Ask complex questions; get natural answers.</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
                <View className="flex-col">
                  <Text className="font-bold text-base text-primary">Priority 24/7 Support</Text>
                  <Text className="text-xs text-on-surface-variant">Direct line to our technical expert team.</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              className="mt-8 w-full py-4 bg-primary rounded-[16px] items-center justify-center  shadow-lg transition-all"
              onPress={() => router.push('/subscription/success')}
            >
              <Text className="text-white font-bold text-base">Upgrade Now</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Visual Credibility Section */}
        <View className="flex-col md:flex-row gap-6">
          <View className="flex-1 bg-white/70 p-6 rounded-[24px] shadow-sm border border-outline-variant/30 flex-col items-center text-center">
            <View className="w-16 h-16 bg-primary-container/10 rounded-full items-center justify-center mb-4">
              <MaterialIcons name="enhanced-encryption" size={32} color={colors.primary} />
            </View>
            <Text className="font-bold text-lg text-primary mb-2">End-to-End Encrypted</Text>
            <Text className="text-xs text-on-surface-variant leading-relaxed">Your memories are your own. We use enterprise-grade AES-256 encryption.</Text>
          </View>
          
          <View className="flex-1 bg-white/70 p-6 rounded-[24px] shadow-sm border border-outline-variant/30 flex-col items-center text-center">
            <View className="w-16 h-16 bg-secondary-container/10 rounded-full items-center justify-center mb-4">
              <MaterialIcons name="bolt" size={32} color={colors.secondary} />
            </View>
            <Text className="font-bold text-lg text-primary mb-2">Lightning Fast</Text>
            <Text className="text-xs text-on-surface-variant leading-relaxed">Global edge network ensures your data is accessible instantly, anywhere.</Text>
          </View>
          
          <View className="flex-1 bg-white/70 p-6 rounded-[24px] shadow-sm border border-outline-variant/30 flex-col items-center text-center">
            <View className="w-16 h-16 bg-surface-container-high rounded-full items-center justify-center mb-4">
              <MaterialIcons name="all-inclusive" size={32} color={colors['on-surface']} />
            </View>
            <Text className="font-bold text-lg text-primary mb-2">Future Proof</Text>
            <Text className="text-xs text-on-surface-variant leading-relaxed">Export your data anytime in open formats. No vendor lock-in, ever.</Text>
          </View>
        </View>

        {/* Detailed Comparison List */}
        <View className="hidden md:flex flex-col bg-white rounded-[24px] border border-outline-variant/30 shadow-sm overflow-hidden mb-8">
          <View className="px-8 py-6 bg-surface-container/50 flex-row justify-between items-center border-b border-outline-variant/30">
            <Text className="font-headline-md text-2xl font-bold text-primary">Detailed Comparison</Text>
            <Text className="font-label-caps text-[10px] font-bold text-outline uppercase tracking-widest">Transparent Pricing</Text>
          </View>
          
          <View className="flex-col divide-y divide-outline-variant/30">
            <View className="flex-row px-8 py-4 items-center">
              <Text className="flex-1 font-bold text-lg text-primary">Memory Engine</Text>
              <Text className="flex-1 text-base text-on-surface-variant">PostgreSQL</Text>
              <Text className="flex-1 text-base font-bold text-secondary">Vector + Graph Database</Text>
            </View>
            <View className="flex-row px-8 py-4 items-center">
              <Text className="flex-1 font-bold text-lg text-primary">Context Window</Text>
              <Text className="flex-1 text-base text-on-surface-variant">8k Tokens</Text>
              <Text className="flex-1 text-base font-bold text-secondary">1M+ Tokens</Text>
            </View>
            <View className="flex-row px-8 py-4 items-center">
              <Text className="flex-1 font-bold text-lg text-primary">File Attachments</Text>
              <Text className="flex-1 text-base text-on-surface-variant">Images only</Text>
              <Text className="flex-1 text-base font-bold text-secondary">Any file type (PDF, Video, etc.)</Text>
            </View>
            <View className="flex-row px-8 py-4 items-center">
              <Text className="flex-1 font-bold text-lg text-primary">API Access</Text>
              <Text className="flex-1 text-base text-on-surface-variant">Read-only</Text>
              <Text className="flex-1 text-base font-bold text-secondary">Full Read/Write Hooks</Text>
            </View>
          </View>
        </View>

      </View>
    </Screen>
  );
}
