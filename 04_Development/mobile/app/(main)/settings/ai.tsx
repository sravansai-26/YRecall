import { View, Text, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function AIPersonalization() {
  const router = useRouter();
  
  const [activePersona, setActivePersona] = useState('calm');
  const [activeVoice, setActiveVoice] = useState('echo');
  
  const [sources, setSources] = useState({
    email: true,
    slack: true,
    calendar: true
  });

  return (
    <Screen scrollable={true} className="pb-32">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface/80 flex-row items-center justify-between px-margin-mobile h-16 md:px-margin-desktop">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">AI Personalization</Text>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6">
        
        {/* Header Section */}
        <View className="mb-8">
          <Text className="font-headline-md text-3xl font-bold text-on-surface mb-2">Refine your AI</Text>
          <Text className="text-on-surface-variant font-body-md text-base max-w-2xl">
            Tailor YRecall's intelligence to match your workflow. These settings adjust how your personal AI interacts with you and processes your knowledge base.
          </Text>
        </View>

        <View className="flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Column: Personality & Voice */}
          <View className="flex-col gap-6 flex-1 lg:w-[60%] w-full">
            
            {/* AI Persona Section */}
            <View className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
              <View className="flex-row items-center gap-2 mb-6">
                <View className="bg-secondary-container p-2 rounded-lg">
                  <MaterialIcons name="psychology" size={24} color={colors['on-secondary-container']} />
                </View>
                <Text className="font-title-sm text-xl font-bold text-on-surface">AI Persona</Text>
              </View>
              
              <View className="flex-col md:flex-row gap-4">
                {['calm', 'analytical', 'creative'].map((persona) => {
                  const isActive = activePersona === persona;
                  const labels: Record<string, {title: string, desc: string}> = {
                    calm: { title: 'Calm', desc: 'Minimizes interruptions, provides brief, serene summaries.' },
                    analytical: { title: 'Analytical', desc: 'Data-driven, cites sources, focuses on logical patterns.' },
                    creative: { title: 'Creative', desc: 'Explores distant connections, uses expressive metaphors.' }
                  };
                  return (
                    <TouchableOpacity 
                      key={persona}
                      onPress={() => setActivePersona(persona)}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all flex-col ${isActive ? 'border-primary bg-primary/5' : 'border-outline-variant '}`}
                    >
                      <Text className="font-bold text-base mb-1 capitalize text-on-surface">{labels[persona].title}</Text>
                      <Text className="font-caption-sm text-xs text-on-surface-variant">{labels[persona].desc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>



            {/* Knowledge Sources */}
            <View className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center gap-2">
                  <View className="bg-secondary-container p-2 rounded-lg">
                    <MaterialIcons name="hub" size={24} color={colors['on-secondary-container']} />
                  </View>
                  <Text className="font-title-sm text-xl font-bold text-on-surface">Knowledge Sources</Text>
                </View>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-1">
                  <Text className="text-secondary font-medium ">Add New</Text>
                  <MaterialIcons name="add" size={18} color={colors.secondary} />
                </TouchableOpacity>
              </View>

              <View className="flex-col gap-2">
                
                {/* Email */}
                <View className={`flex-row items-center justify-between p-4 bg-surface-container-low rounded-lg ${!sources.email && 'opacity-60'}`}>
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded bg-white items-center justify-center border border-outline-variant">
                      <MaterialIcons name="mail" size={20} color={colors.primary} />
                    </View>
                    <View className="flex-col">
                      <Text className="font-medium text-base text-on-surface">Work Email (Gmail)</Text>
                      <Text className="font-caption-sm text-xs text-on-surface-variant">Last synced 5m ago</Text>
                    </View>
                  </View>
                  <Switch 
                    value={sources.email}
                    onValueChange={(val) => setSources(s => ({...s, email: val}))}
                    trackColor={{ false: colors['outline-variant'], true: colors.primary }}
                    thumbColor="#ffffff"
                  />
                </View>

                {/* Slack */}
                <View className={`flex-row items-center justify-between p-4 bg-surface-container-low rounded-lg ${!sources.slack && 'opacity-60'}`}>
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded bg-white items-center justify-center border border-outline-variant">
                      <MaterialIcons name="forum" size={20} color={colors.primary} />
                    </View>
                    <View className="flex-col">
                      <Text className="font-medium text-base text-on-surface">Slack (Workspace X)</Text>
                      <Text className="font-caption-sm text-xs text-on-surface-variant">Permissions: Public channels only</Text>
                    </View>
                  </View>
                  <Switch 
                    value={sources.slack}
                    onValueChange={(val) => setSources(s => ({...s, slack: val}))}
                    trackColor={{ false: colors['outline-variant'], true: colors.primary }}
                    thumbColor="#ffffff"
                  />
                </View>

                {/* Calendar */}
                <View className={`flex-row items-center justify-between p-4 bg-surface-container-low rounded-lg ${!sources.calendar && 'opacity-60'}`}>
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded bg-white items-center justify-center border border-outline-variant">
                      <MaterialIcons name="calendar-month" size={20} color={colors.primary} />
                    </View>
                    <View className="flex-col">
                      <Text className="font-medium text-base text-on-surface">Primary Calendar</Text>
                      <Text className="font-caption-sm text-xs text-on-surface-variant">Syncs event context for memories</Text>
                    </View>
                  </View>
                  <Switch 
                    value={sources.calendar}
                    onValueChange={(val) => setSources(s => ({...s, calendar: val}))}
                    trackColor={{ false: colors['outline-variant'], true: colors.primary }}
                    thumbColor="#ffffff"
                  />
                </View>

              </View>
            </View>

          </View>

          {/* Right Column: Memory Synthesis (Bento-style Cards) */}
          <View className="flex-col gap-6 w-full lg:w-[40%] min-w-[300px]">
            


            {/* AI Snapshot */}
            <View className="bg-surface-container-high rounded-xl p-6 relative overflow-hidden h-64 flex-col justify-end">
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHH6CbS2ZklSqAA944U7GOgEkIxfmNpwjkjJsO3Es0gFFPa86NWzrqAPL-FqK-oaJaKuZVT8RUZFodldc68FTRHsC81GLhPqcBucIoOOuqrA4Ia0_2rp65bFcUQhN_p5bgS-AqmVGIaXfn85kTtPU2CLoI8lE9x7d_JyevUNJDAPMFJN1OWAiYOVZ0i9wi9wWOTyfwNcvHzEig5E8uyMN_2TdS2Ctg7otGyg8jrC4l6tSXXOZIEvHjIH-kU9RVIMDtjpKAk65uEOI' }} className="absolute inset-0 w-full h-full opacity-60" />
              <View className="absolute inset-0 bg-black/40" />
              
              <View className="z-10 flex-col">
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="bg-tertiary-fixed px-2 py-0.5 rounded-full">
                    <Text className="text-on-tertiary-fixed font-label-xs text-[10px] font-bold">ACTIVE</Text>
                  </View>
                  <Text className="text-white/80 font-label-xs text-xs uppercase tracking-widest font-bold">Memory Cluster #442</Text>
                </View>
                <Text className="font-title-sm text-xl text-white font-bold">Optimizing neural pathways</Text>
                <Text className="text-white/90 text-caption-sm text-xs mt-1">AI is currently indexing your last 48 hours of communications.</Text>
              </View>
            </View>

            {/* Security Disclaimer */}
            <View className="bg-error-container p-4 rounded-xl flex-row gap-4 items-start">
              <MaterialIcons name="verified-user" size={24} color={colors['on-error-container']} />
              <View className="flex-col flex-1">
                <Text className="font-bold text-caption-sm text-xs uppercase mb-1 text-on-error-container">Privacy Guard</Text>
                <Text className="text-caption-sm text-xs text-on-error-container leading-relaxed">All AI processing happens within your encrypted private cloud. No data is used to train global models. Your memory is yours alone.</Text>
              </View>
            </View>

          </View>
        </View>

        {/* Footer Actions */}
        <View className="mt-12 pt-6 border-t border-outline-variant/30 flex-col md:flex-row items-center justify-between gap-4">
          <Text className="text-on-surface-variant font-caption-sm text-xs italic">Changes are synced across all your YRecall instances.</Text>
          <View className="flex-row items-center gap-4 w-full md:w-auto">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 md:flex-initial px-8 h-12 rounded-xl border border-outline items-center justify-center">
              <Text className="text-primary font-medium text-base">Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 md:flex-initial px-8 h-12 rounded-xl bg-primary items-center justify-center">
              <Text className="text-white font-medium text-base">Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </Screen>
  );
}
