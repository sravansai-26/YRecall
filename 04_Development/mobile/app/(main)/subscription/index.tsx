import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function PremiumUpgradeHub() {
  const router = useRouter();

  return (
    <Screen scrollable={true} className="pb-24 bg-[#FCFAF7]">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-[#FCFAF7]/90 flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16 border-b border-outline-variant/30">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full  mr-2">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <MaterialIcons name="auto-awesome" size={24} color={colors.primary} />
          <Text className="font-headline-md text-2xl font-bold text-primary">YRecall</Text>
        </View>
        <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-primary px-6 py-2 rounded-full  shadow-sm">
          <Text className="text-white font-bold text-sm">Sign In</Text>
        </TouchableOpacity>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 flex-col gap-12 w-full">
        
        {/* Hero Section */}
        <View className="flex-col items-center text-center">
          <View className="bg-secondary/10 px-4 py-1.5 rounded-full mb-6">
            <Text className="text-secondary font-bold text-xs uppercase tracking-widest">Premium Intelligence</Text>
          </View>
          <Text className="font-display-lg text-4xl md:text-5xl text-primary font-bold max-w-3xl mb-4 text-center">
            A Second Brain that Never Forgets.
          </Text>
          <Text className="text-on-surface-variant text-base md:text-lg max-w-xl text-center leading-relaxed">
            Unlock the full potential of your cognitive lifecycle. Upgrade to YRecall Pro for unlimited memory expansion and advanced AI insights.
          </Text>
        </View>

        {/* Pricing Bento Grid */}
        <View className="flex-col md:flex-row gap-8">
          
          {/* Features Highlight Card */}
          <View className="flex-[1.5] bg-white p-8 rounded-[24px] shadow-sm flex-col justify-between border border-outline-variant/20">
            <Text className="font-title-sm text-2xl font-bold text-primary mb-8">Why go Pro?</Text>
            
            <View className="flex-col gap-6">
              <View className="flex-row items-start gap-4">
                <View className="bg-secondary-container/30 p-2.5 rounded-xl">
                  <MaterialIcons name="cloud-done" size={24} color={colors.secondary} />
                </View>
                <View className="flex-col flex-1">
                  <Text className="font-bold text-base text-primary">Unlimited Recall</Text>
                  <Text className="text-sm text-on-surface-variant leading-relaxed">Store every thought, document, and meeting without limits.</Text>
                </View>
              </View>
              
              <View className="flex-row items-start gap-4">
                <View className="bg-secondary-container/30 p-2.5 rounded-xl">
                  <MaterialIcons name="psychology" size={24} color={colors.secondary} />
                </View>
                <View className="flex-col flex-1">
                  <Text className="font-bold text-base text-primary">Deep Cognitive Insights</Text>
                  <Text className="text-sm text-on-surface-variant leading-relaxed">AI-driven patterns that map how you learn and think.</Text>
                </View>
              </View>

              <View className="flex-row items-start gap-4">
                <View className="bg-secondary-container/30 p-2.5 rounded-xl">
                  <MaterialIcons name="sync" size={24} color={colors.secondary} />
                </View>
                <View className="flex-col flex-1">
                  <Text className="font-bold text-base text-primary">Universal Sync</Text>
                  <Text className="text-sm text-on-surface-variant leading-relaxed">Access your brain from any device, offline or online.</Text>
                </View>
              </View>

              <View className="flex-row items-start gap-4">
                <View className="bg-secondary-container/30 p-2.5 rounded-xl">
                  <MaterialIcons name="verified-user" size={24} color={colors.secondary} />
                </View>
                <View className="flex-col flex-1">
                  <Text className="font-bold text-base text-primary">Priority Processing</Text>
                  <Text className="text-sm text-on-surface-variant leading-relaxed">Experience 10x faster AI indexing and retrieval.</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Main Pro Subscription Card */}
          <View className="flex-1 bg-white p-8 rounded-[24px] shadow-sm flex-col relative border-2 border-secondary/30 min-w-[320px]">
            <View className="absolute -top-3 right-8 bg-primary px-4 py-1 rounded-full shadow-md z-10">
              <Text className="text-white text-[10px] font-bold uppercase tracking-widest">Best Value</Text>
            </View>
            
            <View className="flex-col mb-10">
              <Text className="font-title-sm text-xl font-bold text-primary mb-2">Annual Plan</Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="font-display-lg text-5xl font-bold text-primary">$12</Text>
                <Text className="text-on-surface-variant font-medium text-base">/month</Text>
              </View>
              <Text className="text-on-surface-variant text-sm mt-2">Billed annually at $144/year</Text>
            </View>
            
            <View className="flex-col gap-4 mb-10">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
                <Text className="text-base text-on-surface font-medium">Unlimited Data Nodes</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
                <Text className="text-base text-on-surface font-medium">Advanced Semantic Search</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="check-circle" size={20} color={colors.secondary} />
                <Text className="text-base text-on-surface font-medium">Personal AI Tutor</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              className="w-full bg-primary h-14 rounded-xl items-center justify-center  shadow-sm mt-auto"
              onPress={() => router.push('/subscription/success')}
            >
              <Text className="text-white font-bold text-lg">Simulate Purchase (Demo)</Text>
            </TouchableOpacity>
            <Text className="text-center text-xs text-on-surface-variant mt-4 font-medium">Cancel anytime. No questions asked.</Text>
          </View>

        </View>

        {/* Alternative Plans */}
        <View className="flex-col md:flex-row gap-6">
          <TouchableOpacity 
            className="flex-1 bg-surface-container p-6 rounded-[24px] shadow-sm flex-row items-center justify-between  border border-outline-variant/20"
            onPress={() => router.push('/subscription/compare')}
          >
            <View className="flex-col">
              <Text className="font-bold text-lg text-primary">Monthly Flexible</Text>
              <Text className="text-sm text-on-surface-variant mt-1">Pay month-to-month, pause anytime.</Text>
            </View>
            <View className="flex-col items-end gap-1">
              <Text className="font-bold text-xl text-primary">$19</Text>
              <MaterialIcons name="arrow-forward" size={20} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 bg-surface-container p-6 rounded-[24px] shadow-sm flex-row items-center justify-between  border border-outline-variant/20">
            <View className="flex-col">
              <Text className="font-bold text-lg text-primary">Teams & Education</Text>
              <Text className="text-sm text-on-surface-variant mt-1">Group licensing for schools and startups.</Text>
            </View>
            <View className="flex-col items-end gap-1">
              <Text className="font-bold text-xl text-primary">Contact</Text>
              <MaterialIcons name="arrow-forward" size={20} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Trust Section */}
        <View className="mt-8 pt-8 border-t border-outline-variant/30 flex-col md:flex-row justify-between items-center gap-8">
          <View className="flex-col items-center md:items-start flex-1">
            <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Trusted by professionals at</Text>
            <View className="flex-row flex-wrap justify-center md:justify-start gap-6 opacity-60">
               <View className="h-8 w-24 bg-on-surface-variant/20 rounded-md" />
               <View className="h-8 w-32 bg-on-surface-variant/20 rounded-md" />
               <View className="h-8 w-20 bg-on-surface-variant/20 rounded-md" />
               <View className="h-8 w-28 bg-on-surface-variant/20 rounded-md" />
            </View>
          </View>
          <View className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 max-w-sm flex-1">
            <View className="flex-row gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <MaterialIcons key={i} name="star" size={16} color={colors.secondary} />
              ))}
            </View>
            <Text className="text-on-surface text-sm italic leading-relaxed">
              "YRecall has transformed how I manage research. It's like having an assistant who knows exactly what I was thinking 3 months ago."
            </Text>
            <Text className="text-on-surface-variant text-xs mt-3 font-bold">— Dr. Elena Vance, Neuroscientist</Text>
          </View>
        </View>

      </View>
    </Screen>
  );
}
