import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
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

  const [form, setForm] = useState<any>({});
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    if (profile?.persona) {
      setForm(profile.persona);
    }
  }, [profile]);

  const handleSave = () => {
    updatePersona.mutate(form, {
      onSuccess: () => Alert.alert('Saved', 'AI Persona updated successfully.')
    });
  };

  const updateField = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const addInterest = () => {
    if (newInterest.trim().length > 0) {
      const updatedInterests = [...(form.interests || []), newInterest.trim()];
      updateField('interests', updatedInterests);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    const updatedInterests = (form.interests || []).filter((i: string) => i !== interest);
    updateField('interests', updatedInterests);
  };

  if (isLoading) {
    return (
      <Screen scrollable={false} className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  const SectionTitle = ({ title, icon }: { title: string, icon: any }) => (
    <View className="flex-row items-center gap-2 mb-4 mt-8">
      <View className="bg-primary/10 p-2 rounded-lg">
        <MaterialIcons name={icon} size={20} color={colors.primary} />
      </View>
      <Text className="font-title-sm text-lg font-bold text-on-surface">{title}</Text>
    </View>
  );

  const ChoiceSelector = ({ label, options, value, onSelect }: any) => (
    <View className="mb-6">
      <Text className="font-label-sm text-xs text-on-surface-variant font-bold mb-2 ml-1">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((opt: string) => (
          <TouchableOpacity 
            key={opt}
            onPress={() => onSelect(opt)}
            className={`px-4 py-2 rounded-full border ${value === opt ? 'bg-primary border-primary' : 'bg-surface-container-lowest border-outline-variant/30'}`}
          >
            <Text className={`font-medium text-sm ${value === opt ? 'text-white' : 'text-on-surface'}`}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Screen scrollable={true} className="pb-32 bg-surface">
      <View className="w-full sticky top-0 z-50 bg-surface/90 flex-row items-center justify-between px-margin-mobile h-16 border-b border-outline-variant/10">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">AI Persona</Text>
        </View>
        <TouchableOpacity onPress={handleSave} className="bg-primary px-4 py-1.5 rounded-full">
          {updatePersona.isPending ? <ActivityIndicator size="small" color="white" /> : <Text className="text-white font-bold text-sm">Save</Text>}
        </TouchableOpacity>
      </View>

      <View className="max-w-2xl mx-auto px-margin-mobile w-full pb-20">
        
        {/* Intro */}
        <View className="mt-6 mb-2">
          <Text className="font-headline-sm text-2xl font-bold text-on-surface mb-2">Configure Your AI</Text>
          <Text className="text-on-surface-variant font-body-sm text-sm leading-relaxed">
            These settings govern how the intelligence engine communicates, analyzes, and learns from you. Changes applied here instantly affect your Assistant, Daily Briefs, and Knowledge Graph.
          </Text>
        </View>

        {/* 1. Communication Style */}
        <SectionTitle title="Communication Profile" icon="chat" />
        <View className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 shadow-sm">
          <ChoiceSelector 
            label="Base Tone" 
            options={['Concise', 'Balanced', 'Detailed', 'Professional', 'Friendly', 'Coach']} 
            value={form.preferred_ai_tone || 'Balanced'} 
            onSelect={(v: string) => updateField('preferred_ai_tone', v)} 
          />
          <ChoiceSelector 
            label="Response Style" 
            options={['Conversational', 'Direct', 'Socratic', 'Empathetic']} 
            value={form.communication_style || 'Conversational'} 
            onSelect={(v: string) => updateField('communication_style', v)} 
          />
        </View>

        {/* 2. Cognitive Behavior */}
        <SectionTitle title="Cognitive Behavior" icon="psychology" />
        <View className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 shadow-sm">
          <ChoiceSelector 
            label="Reasoning Depth" 
            options={['Surface', 'Detailed', 'Comprehensive']} 
            value={form.reasoning_depth || 'Detailed'} 
            onSelect={(v: string) => updateField('reasoning_depth', v)} 
          />
          <ChoiceSelector 
            label="Creativity Level" 
            options={['Factual', 'Balanced', 'Imaginative']} 
            value={form.creative_level || 'Balanced'} 
            onSelect={(v: string) => updateField('creative_level', v)} 
          />
          <ChoiceSelector 
            label="Instruction Style" 
            options={['Theory First', 'Examples First', 'Step-by-step', 'Hands-on']} 
            value={form.personality || 'Examples First'} 
            onSelect={(v: string) => updateField('personality', v)} 
          />
        </View>

        {/* 3. Knowledge Focus */}
        <SectionTitle title="Knowledge Focus" icon="explore" />
        <View className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 shadow-sm flex-col">
          <Text className="text-sm text-on-surface-variant mb-5 leading-relaxed">
            Specify core topics or domains that the AI should prioritize when processing, connecting, and resurfacing your memories.
          </Text>
          
          {/* Input Area */}
          <View className="flex-row items-center border border-outline-variant/40 rounded-xl bg-surface pl-4 pr-2 h-12 mb-5">
            <MaterialIcons name="local-offer" size={18} color={colors.outline} />
            <TextInput 
              value={newInterest}
              onChangeText={setNewInterest}
              placeholder="Add a new focus topic..."
              placeholderTextColor={colors.outline}
              className="flex-1 font-body-md text-base text-on-surface h-full mx-3"
              onSubmitEditing={addInterest}
              returnKeyType="done"
            />
            <TouchableOpacity 
              onPress={addInterest} 
              disabled={newInterest.trim().length === 0}
              className={`px-4 py-1.5 rounded-lg ${newInterest.trim().length > 0 ? 'bg-primary' : 'bg-surface-container-high'}`}
            >
              <Text className={`font-bold text-sm ${newInterest.trim().length > 0 ? 'text-white' : 'text-outline'}`}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Chips Area */}
          <View className="flex-row flex-wrap gap-2.5">
            {(form.interests || []).length === 0 ? (
              <View className="w-full py-6 items-center justify-center border border-dashed border-outline-variant/40 rounded-xl bg-surface-container-lowest">
                <Text className="text-sm text-on-surface-variant italic">No focus topics defined yet.</Text>
              </View>
            ) : (
              (form.interests || []).map((interest: string) => (
                <View key={interest} className="bg-secondary-container px-3 py-2 rounded-xl flex-row items-center gap-2 border border-outline-variant/20 shadow-sm">
                  <Text className="text-on-secondary-container font-medium text-sm">{interest}</Text>
                  <TouchableOpacity 
                    onPress={() => removeInterest(interest)}
                    className="bg-black/5 rounded-full p-1"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialIcons name="close" size={14} color={colors['on-secondary-container']} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>

        {/* 4. Danger Zone */}
        <SectionTitle title="Maintenance" icon="build" />
        <View className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 shadow-sm">
          <Text className="text-sm text-on-surface-variant mb-4">Reset the automatic behavioral traits the AI has learned from your usage history.</Text>
          
          <TouchableOpacity 
            onPress={() => Alert.alert('Confirm', 'Are you sure you want to reset all learned behavioral traits? This will not delete your data, only the implicit habits the AI has formed.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset Traits', style: 'destructive', onPress: () => resetLearning.mutate() }
            ])}
            className="flex-row items-center justify-between p-4 bg-error/10 border border-error/20 rounded-xl"
          >
            <Text className="font-bold text-error">Reset Learned Behavior</Text>
            <MaterialIcons name="restart-alt" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

      </View>
    </Screen>
  );
}
