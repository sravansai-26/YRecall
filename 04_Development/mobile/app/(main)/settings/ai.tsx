import { View, Text, ScrollView, TouchableOpacity, Switch, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { usePersonaProfile, useUpdatePersona, useResetLearning } from '../../../src/modules/persona/usePersona';

export default function AIPersonalization() {
  const router = useRouter();
  
  const { data: profile, isLoading } = usePersonaProfile();
  const updatePersona = useUpdatePersona();
  const resetLearning = useResetLearning();

  // Local state for the UI before saving
  const [activeTone, setActiveTone] = useState<string>('balanced');
  const [occupation, setOccupation] = useState<string>('');
  
  useEffect(() => {
    if (profile?.persona) {
      setActiveTone(profile.persona.preferred_ai_tone || 'balanced');
      setOccupation(profile.persona.occupation || '');
    }
  }, [profile]);

  const handleSave = () => {
    updatePersona.mutate({
      preferred_ai_tone: activeTone,
      occupation: occupation
    });
  };

  if (isLoading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable={true} className="pb-32">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface/80 flex-row items-center justify-between px-margin-mobile h-16 md:px-margin-desktop">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">Persona Center</Text>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6">
        
        {/* Header Section */}
        <View className="mb-8">
          <Text className="font-headline-md text-3xl font-bold text-on-surface mb-2">Persona Engine</Text>
          <Text className="text-on-surface-variant font-body-md text-base max-w-2xl">
            This is your AI's understanding of who you are. The Persona Engine continuously learns from your habits to provide personalized insights and recommendations.
          </Text>
        </View>

        <View className="flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Column */}
          <View className="flex-col gap-6 flex-1 lg:w-[60%] w-full">
            
            {/* AI Tone Section */}
            <View className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
              <View className="flex-row items-center gap-2 mb-6">
                <View className="bg-secondary-container p-2 rounded-lg">
                  <MaterialIcons name="record-voice-over" size={24} color={colors['on-secondary-container']} />
                </View>
                <Text className="font-title-sm text-xl font-bold text-on-surface">AI Tone & Personality</Text>
              </View>
              
              <View className="flex-col md:flex-row gap-4">
                {['calm', 'balanced', 'analytical', 'creative'].map((tone) => {
                  const isActive = activeTone === tone;
                  const labels: Record<string, {title: string, desc: string}> = {
                    calm: { title: 'Calm', desc: 'Brief, serene, minimizes interruptions.' },
                    balanced: { title: 'Balanced', desc: 'Conversational and helpful.' },
                    analytical: { title: 'Analytical', desc: 'Data-driven, logical, cites sources.' },
                    creative: { title: 'Creative', desc: 'Expressive and explores connections.' }
                  };
                  return (
                    <TouchableOpacity 
                      key={tone}
                      onPress={() => setActiveTone(tone)}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all flex-col ${isActive ? 'border-primary bg-primary/5' : 'border-outline-variant '}`}
                    >
                      <Text className="font-bold text-base mb-1 capitalize text-on-surface">{labels[tone as keyof typeof labels]?.title}</Text>
                      <Text className="font-caption-sm text-xs text-on-surface-variant">{labels[tone as keyof typeof labels]?.desc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* AI Learned Behaviors */}
            <View className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center gap-2">
                  <View className="bg-secondary-container p-2 rounded-lg">
                    <MaterialIcons name="psychology" size={24} color={colors['on-secondary-container']} />
                  </View>
                  <Text className="font-title-sm text-xl font-bold text-on-surface">Learned Behaviors</Text>
                </View>
                <TouchableOpacity onPress={() => resetLearning.mutate()} className="flex-row items-center gap-1">
                  <Text className="text-error font-medium ">Reset</Text>
                  <MaterialIcons name="refresh" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>

              <View className="flex-col gap-2">
                {profile?.behavior?.data && Object.keys(profile.behavior.data).length > 0 ? (
                  Object.entries(profile.behavior.data).map(([key, val]) => (
                    <View key={key} className="flex-row items-center justify-between p-4 bg-surface-container-low rounded-lg">
                       <Text className="font-medium text-base text-on-surface capitalize">{key.replace(/_/g, ' ')}</Text>
                       <Text className="text-primary font-bold">{String(val)}</Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-on-surface-variant italic">AI has not yet learned specific behavioral patterns.</Text>
                )}
              </View>
            </View>
            
             {/* Active Goals */}
             <View className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center gap-2">
                  <View className="bg-secondary-container p-2 rounded-lg">
                    <MaterialIcons name="flag" size={24} color={colors['on-secondary-container']} />
                  </View>
                  <Text className="font-title-sm text-xl font-bold text-on-surface">Active Goals</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Goal editor API ready, UI coming.')} className="flex-row items-center gap-1">
                  <Text className="text-secondary font-medium ">Edit</Text>
                  <MaterialIcons name="edit" size={18} color={colors.secondary} />
                </TouchableOpacity>
              </View>

              <View className="flex-col gap-2">
                {profile?.goals && profile.goals.length > 0 ? (
                  profile.goals.map(goal => (
                    <View key={goal.id} className="flex-row items-center justify-between p-4 bg-surface-container-low rounded-lg">
                       <View>
                        <Text className="font-medium text-base text-on-surface">{goal.title}</Text>
                        <Text className="text-on-surface-variant text-xs">{goal.description}</Text>
                       </View>
                    </View>
                  ))
                ) : (
                  <Text className="text-on-surface-variant italic">No active goals configured.</Text>
                )}
              </View>
            </View>

          </View>

          {/* Right Column: Dynamic Stats */}
          <View className="flex-col gap-6 w-full lg:w-[40%] min-w-[300px]">
            
            {/* AI Status */}
            <View className="bg-surface-container-high rounded-xl p-6 relative overflow-hidden h-64 flex-col justify-end">
              <View className="absolute inset-0 bg-black/40" />
              <View className="z-10 flex-col">
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="bg-tertiary-fixed px-2 py-0.5 rounded-full">
                    <Text className="text-on-tertiary-fixed font-label-xs text-[10px] font-bold">ACTIVE</Text>
                  </View>
                  <Text className="text-white/80 font-label-xs text-xs uppercase tracking-widest font-bold">Persona Engine</Text>
                </View>
                <Text className="font-title-sm text-xl text-white font-bold">Intelligence Synced</Text>
                <Text className="text-white/90 text-caption-sm text-xs mt-1">Your interactions shape this identity in real-time across YRecall.</Text>
              </View>
            </View>

            {/* Security Disclaimer */}
            <View className="bg-error-container p-4 rounded-xl flex-row gap-4 items-start">
              <MaterialIcons name="verified-user" size={24} color={colors['on-error-container']} />
              <View className="flex-col flex-1">
                <Text className="font-bold text-caption-sm text-xs uppercase mb-1 text-on-error-container">Strictly Private</Text>
                <Text className="text-caption-sm text-xs text-on-error-container leading-relaxed">Your persona belongs only to you. No cross-user data leakage. All reasoning is private.</Text>
              </View>
            </View>

          </View>
        </View>

        {/* Footer Actions */}
        <View className="mt-12 pt-6 border-t border-outline-variant/30 flex-col md:flex-row items-center justify-between gap-4">
          <Text className="text-on-surface-variant font-caption-sm text-xs italic">Identity changes update your Assistant immediately.</Text>
          <View className="flex-row items-center gap-4 w-full md:w-auto">
            <TouchableOpacity onPress={handleSave} className="flex-1 md:flex-initial px-8 h-12 rounded-xl bg-primary items-center justify-center">
              {updatePersona.isPending ? (
                 <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-medium text-base">Save Identity</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </Screen>
  );
}
