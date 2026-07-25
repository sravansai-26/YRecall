import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useCreateWorkflow } from '../../../src/shared/hooks/useAutomation';

const TEMPLATES = [
  {
    id: 'meeting_sync',
    name: 'Meeting Synthesizer',
    description: 'Automatically transcribe voice notes and extract action items.',
    icon: 'microphone-message',
    trigger: { trigger_type: 'capture_created', configuration: { capture_type: 'voice' } },
    action: { action_type: 'extract_action_items', configuration: { target: 'voice_transcript' } },
    condition: { condition_type: 'none', configuration: {} }
  },
  {
    id: 'finance_tracker',
    name: 'Finance Tracker',
    description: 'Tag captures containing "invoice" or "receipt" as Finance.',
    icon: 'receipt-text-outline',
    trigger: { trigger_type: 'capture_created', configuration: { capture_type: 'any' } },
    action: { action_type: 'tag_capture', configuration: { tag: 'Finance' } },
    condition: { condition_type: 'contains_text', configuration: { text: 'invoice,receipt' } }
  },
  {
    id: 'graph_builder',
    name: 'Auto Graph Builder',
    description: 'Continuously scan new notes for People and Projects to link in your graph.',
    icon: 'graphql',
    trigger: { trigger_type: 'capture_created', configuration: { capture_type: 'note' } },
    action: { action_type: 'build_knowledge_graph', configuration: { entity_types: ['person', 'project'] } },
    condition: { condition_type: 'none', configuration: {} }
  },
  {
    id: 'daily_brief',
    name: 'Morning Briefing',
    description: 'Generate a summary of yesterday\'s activities every morning.',
    icon: 'weather-sunset-up',
    trigger: { trigger_type: 'schedule', configuration: { cron: '0 8 * * *' } },
    action: { action_type: 'generate_brief', configuration: { period: 'yesterday' } },
    condition: { condition_type: 'none', configuration: {} }
  }
];

export default function CreateAutomationScreen() {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
  // Custom Workflow State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    setName(template.name);
    setDescription(template.description);
    setStep(3); // Skip straight to review
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    // In a full custom builder, we'd assemble from state. Here we use the template for the MVP grand UI.
    const payload = selectedTemplate ? {
      name,
      description,
      triggers: [selectedTemplate.trigger],
      actions: [selectedTemplate.action],
      conditions: selectedTemplate.condition.condition_type !== 'none' ? [selectedTemplate.condition] : []
    } : {
      name,
      description,
      triggers: [{ trigger_type: 'custom', configuration: {} }],
      actions: [{ action_type: 'custom', configuration: {} }],
      conditions: []
    };

    createWorkflow.mutate(payload, {
      onSuccess: () => {
        router.back();
      }
    });
  };

  return (
    <Screen scrollable={false}>
      {/* Header */}
      <View className="bg-surface z-50 h-16 w-full flex-row items-center px-margin-mobile border-b border-outline-variant/30">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2 rounded-full">
          <MaterialIcons name="close" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="font-title-lg font-bold text-primary ml-2">New Automation</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        
        {step === 1 && (
          <View className="animate-fade-in">
            <MaterialCommunityIcons name="robot-outline" size={48} color={colors.primary} className="mb-4" />
            <Text className="font-headline-sm font-bold text-on-surface mb-2">What should AI do for you?</Text>
            <Text className="font-body-lg text-on-surface-variant mb-8">
              Choose a purpose-built template to automate your memory processing, or build one from scratch.
            </Text>

            <View className="gap-4">
              {TEMPLATES.map((tmpl) => (
                <TouchableOpacity 
                  key={tmpl.id}
                  onPress={() => handleSelectTemplate(tmpl)}
                  className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex-row items-center shadow-sm"
                >
                  <View className="w-12 h-12 rounded-full bg-primary-container/30 items-center justify-center mr-4">
                    <MaterialCommunityIcons name={tmpl.icon as any} size={24} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-title-md font-bold text-on-surface mb-1">{tmpl.name}</Text>
                    <Text className="font-body-sm text-on-surface-variant leading-tight">{tmpl.description}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
                </TouchableOpacity>
              ))}
            </View>

            <View className="mt-8">
              <View className="flex-row items-center justify-center gap-4 mb-6">
                <View className="h-[1px] flex-1 bg-outline-variant/30" />
                <Text className="font-label-md text-outline font-bold uppercase tracking-widest">Or</Text>
                <View className="h-[1px] flex-1 bg-outline-variant/30" />
              </View>
              
              <TouchableOpacity 
                onPress={() => setStep(2)}
                className="bg-surface-container border border-dashed border-primary/50 p-6 rounded-2xl items-center"
              >
                <MaterialCommunityIcons name="plus" size={32} color={colors.primary} className="mb-2" />
                <Text className="font-title-md font-bold text-primary">Build from Scratch</Text>
                <Text className="font-body-sm text-on-surface-variant text-center mt-1">Configure your own custom triggers and AI actions.</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 2 && (
          <View className="animate-fade-in">
            <Text className="font-headline-sm font-bold text-on-surface mb-2">Custom Workflow</Text>
            <Text className="font-body-lg text-on-surface-variant mb-8">Define exactly how the AI should react.</Text>
            
            {/* MVP Custom Builder Form */}
            <View className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 mb-6 shadow-sm">
              <Text className="font-label-md text-primary font-bold uppercase mb-4 tracking-wider">1. Trigger (When...)</Text>
              <View className="bg-surface-container h-12 rounded-xl justify-center px-4 mb-2 border border-outline-variant/20">
                <Text className="text-on-surface">Capture is created</Text>
              </View>
            </View>

            <View className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 mb-6 shadow-sm">
              <Text className="font-label-md text-primary font-bold uppercase mb-4 tracking-wider">2. Action (Then...)</Text>
              <View className="bg-surface-container h-12 rounded-xl justify-center px-4 mb-2 border border-outline-variant/20">
                <Text className="text-on-surface">Extract Action Items</Text>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => setStep(3)}
              className="bg-primary py-4 rounded-full items-center mt-4 shadow-sm"
            >
              <Text className="text-on-primary font-title-sm font-bold">Continue to Review</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View className="animate-fade-in">
            <View className="items-center mb-8 mt-4">
              <View className="w-20 h-20 rounded-full bg-primary-container/30 items-center justify-center mb-4">
                 <MaterialCommunityIcons name={selectedTemplate?.icon || "robot-outline"} size={40} color={colors.primary} />
              </View>
              <Text className="font-headline-sm font-bold text-on-surface text-center mb-2">Review & Activate</Text>
              <Text className="font-body-lg text-on-surface-variant text-center px-4">
                Name your automation and confirm the details before the AI starts working.
              </Text>
            </View>

            <View className="gap-6">
              <View>
                <Text className="font-label-md text-on-surface-variant font-bold mb-2 ml-1">Workflow Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Daily Meeting Prep"
                  placeholderTextColor={colors['outline-variant']}
                  className="bg-surface-container-lowest font-body-lg text-on-surface p-4 rounded-xl border border-outline-variant/30 focus:border-primary shadow-sm"
                />
              </View>
              
              <View>
                <Text className="font-label-md text-on-surface-variant font-bold mb-2 ml-1">Description (Optional)</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="What does this do?"
                  placeholderTextColor={colors['outline-variant']}
                  multiline
                  numberOfLines={3}
                  className="bg-surface-container-lowest font-body-lg text-on-surface p-4 rounded-xl border border-outline-variant/30 focus:border-primary shadow-sm"
                  style={{ textAlignVertical: 'top' }}
                />
              </View>

              <View className="bg-primary/5 p-4 rounded-xl border border-primary/20 mt-4">
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="info-outline" size={16} color={colors.primary} />
                  <Text className="font-label-md text-primary font-bold ml-2">Active Immediately</Text>
                </View>
                <Text className="font-body-sm text-on-surface-variant">
                  Once saved, this workflow will run automatically in the background without further input required.
                </Text>
              </View>

              <TouchableOpacity 
                onPress={handleSave}
                disabled={createWorkflow.isPending || !name.trim()}
                className={`py-4 rounded-full items-center mt-6 flex-row justify-center shadow-sm ${!name.trim() ? 'bg-surface-variant' : 'bg-primary'}`}
              >
                {createWorkflow.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="lightning-bolt" size={20} color={!name.trim() ? colors.outline : 'white'} />
                    <Text className={`font-title-sm font-bold ml-2 ${!name.trim() ? 'text-outline' : 'text-on-primary'}`}>
                      Activate Workflow
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </Screen>
  );
}
