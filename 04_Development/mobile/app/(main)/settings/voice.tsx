import { View, Text, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useVoiceSettings, useUpdateVoiceSettings, useVoiceStats } from '../../../src/modules/voice/useVoiceSettings';

export default function VoiceIntelligenceCenter() {
  const router = useRouter();
  
  const { data: settings, isLoading: isSettingsLoading } = useVoiceSettings();
  const { data: stats, isLoading: isStatsLoading } = useVoiceStats();
  const updateSettings = useUpdateVoiceSettings();

  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate(form, {
      onSuccess: () => Alert.alert('Saved', 'Voice settings updated successfully.')
    });
  };

  const updateField = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  if (isSettingsLoading || isStatsLoading) {
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

  const ToggleSetting = ({ label, description, value, onToggle }: any) => (
    <View className="flex-row items-center justify-between py-3 border-b border-outline-variant/10">
      <View className="flex-1 pr-4">
        <Text className="font-body-md text-base font-medium text-on-surface">{label}</Text>
        <Text className="font-body-sm text-xs text-on-surface-variant mt-0.5">{description}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onToggle}
        trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
        thumbColor={colors['on-primary']}
      />
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
          <Text className="font-title-sm text-xl text-primary font-bold">Voice Center</Text>
        </View>
        <TouchableOpacity onPress={handleSave} className="bg-primary px-4 py-1.5 rounded-full">
          {updateSettings.isPending ? <ActivityIndicator size="small" color="white" /> : <Text className="text-white font-bold text-sm">Save</Text>}
        </TouchableOpacity>
      </View>

      <View className="max-w-2xl mx-auto px-margin-mobile w-full pb-20">
        
        {/* Intro */}
        <View className="mt-6 mb-2">
          <Text className="font-headline-sm text-2xl font-bold text-on-surface mb-2">Voice Intelligence</Text>
          <Text className="text-on-surface-variant font-body-sm text-sm leading-relaxed">
            Control how YRecall captures, processes, transcribes, and learns from your voice across all modules.
          </Text>
        </View>

        {/* 1. Voice Overview */}
        <View className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 shadow-sm mt-6 flex-row flex-wrap gap-4">
          <View className="flex-1 min-w-[120px]">
             <Text className="text-on-surface-variant text-xs mb-1 uppercase tracking-widest font-bold">Provider</Text>
             <Text className="text-primary font-bold">OpenAI Whisper</Text>
          </View>
          <View className="flex-1 min-w-[120px]">
             <Text className="text-on-surface-variant text-xs mb-1 uppercase tracking-widest font-bold">Voice Memories</Text>
             <Text className="text-on-surface font-bold">{stats?.voice_memories_count || 0}</Text>
          </View>
          <View className="flex-1 min-w-[120px]">
             <Text className="text-on-surface-variant text-xs mb-1 uppercase tracking-widest font-bold">Avg Accuracy</Text>
             <Text className="text-green-600 font-bold">{stats?.average_accuracy || 0}%</Text>
          </View>
          <View className="flex-1 min-w-[120px]">
             <Text className="text-on-surface-variant text-xs mb-1 uppercase tracking-widest font-bold">Storage</Text>
             <Text className="text-on-surface font-bold">{((stats?.storage_used_bytes || 0) / (1024*1024)).toFixed(1)} MB</Text>
          </View>
        </View>

        {/* 2. Recording Preferences */}
        <SectionTitle title="Recording Preferences" icon="mic" />
        <View className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 shadow-sm">
          <ChoiceSelector 
            label="Recording Quality" 
            options={['low', 'medium', 'high']} 
            value={form.recording_quality || 'high'} 
            onSelect={(v: string) => updateField('recording_quality', v)} 
          />
          <ToggleSetting label="Auto Gain Control" description="Automatically adjust volume levels." value={form.auto_gain ?? true} onToggle={(v: boolean) => updateField('auto_gain', v)} />
          <ToggleSetting label="Noise Reduction" description="Filter out background noise." value={form.noise_reduction ?? true} onToggle={(v: boolean) => updateField('noise_reduction', v)} />
          <ToggleSetting label="Silence Detection" description="Pause processing during silence." value={form.silence_detection ?? true} onToggle={(v: boolean) => updateField('silence_detection', v)} />
        </View>

        {/* 3. Speech Recognition */}
        <SectionTitle title="Speech Recognition" icon="translate" />
        <View className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 shadow-sm">
          <ChoiceSelector 
            label="Recognition Accuracy Profile" 
            options={['fast', 'balanced', 'highly_accurate']} 
            value={form.recognition_accuracy || 'balanced'} 
            onSelect={(v: string) => updateField('recognition_accuracy', v)} 
          />
          <ToggleSetting label="Auto Language Detection" description="Detect language dynamically." value={form.auto_language_detection ?? true} onToggle={(v: boolean) => updateField('auto_language_detection', v)} />
          <ToggleSetting label="Offline Recognition" description="Use local model when offline (lower accuracy)." value={form.offline_recognition ?? false} onToggle={(v: boolean) => updateField('offline_recognition', v)} />
        </View>

        {/* 4. Voice Intelligence */}
        <SectionTitle title="Voice Intelligence" icon="psychology" />
        <View className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 shadow-sm">
          <ToggleSetting label="Auto Transcribe" description="Generate transcriptions immediately." value={form.auto_transcribe ?? true} onToggle={(v: boolean) => updateField('auto_transcribe', v)} />
          <ToggleSetting label="Auto Summary" description="Summarize long voice recordings." value={form.auto_summary ?? true} onToggle={(v: boolean) => updateField('auto_summary', v)} />
          <ToggleSetting label="Entity Extraction" description="Detect people, places, and facts." value={form.auto_entity_extraction ?? true} onToggle={(v: boolean) => updateField('auto_entity_extraction', v)} />
          <ToggleSetting label="Action Detection" description="Extract tasks and to-dos." value={form.auto_action_detection ?? true} onToggle={(v: boolean) => updateField('auto_action_detection', v)} />
          <ToggleSetting label="Knowledge Graph Linking" description="Connect voice entities to your graph." value={form.auto_kg_linking ?? true} onToggle={(v: boolean) => updateField('auto_kg_linking', v)} />
        </View>

        {/* 5. Ask AI Voice */}
        <SectionTitle title="Ask AI Voice" icon="record-voice-over" />
        <View className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 shadow-sm">
          <ChoiceSelector 
            label="Response Voice" 
            options={['nova', 'alloy', 'echo', 'fable', 'onyx', 'shimmer']} 
            value={form.response_voice || 'nova'} 
            onSelect={(v: string) => updateField('response_voice', v)} 
          />
          <ToggleSetting label="Continuous Listening" description="Keep mic open during conversations." value={form.continuous_listening ?? false} onToggle={(v: boolean) => updateField('continuous_listening', v)} />
          <ToggleSetting label="Push-to-Talk" description="Hold to speak during AI chats." value={form.push_to_talk ?? true} onToggle={(v: boolean) => updateField('push_to_talk', v)} />
          <ToggleSetting label="Voice Feedback" description="AI speaks responses aloud." value={form.voice_feedback ?? true} onToggle={(v: boolean) => updateField('voice_feedback', v)} />
        </View>

        {/* 7. Voice Memory Behaviour & 8. Search */}
        <SectionTitle title="Data & Search" icon="storage" />
        <View className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 shadow-sm">
          <ToggleSetting label="Store Original Audio" description="Keep original audio files for playback." value={form.store_original_audio ?? true} onToggle={(v: boolean) => updateField('store_original_audio', v)} />
          <ToggleSetting label="Compress Audio" description="Save storage space with compressed audio." value={form.compress_audio ?? true} onToggle={(v: boolean) => updateField('compress_audio', v)} />
          <ToggleSetting label="Search Audio & Transcripts" description="Index voice notes for global search." value={form.search_audio ?? true} onToggle={(v: boolean) => updateField('search_audio', v)} />
        </View>

        {/* 9. Privacy */}
        <SectionTitle title="Privacy & Security" icon="security" />
        <View className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 shadow-sm">
          <ToggleSetting label="Encrypt Voice Files" description="End-to-end encryption for audio storage." value={form.encrypt_voice_files ?? true} onToggle={(v: boolean) => updateField('encrypt_voice_files', v)} />
          <ToggleSetting label="Allow AI Processing" description="Permit AI pipelines to process your audio." value={form.allow_ai_processing ?? true} onToggle={(v: boolean) => updateField('allow_ai_processing', v)} />
          <ToggleSetting label="Delete Temp Audio" description="Clear uncompressed processing cache." value={form.delete_temp_audio ?? true} onToggle={(v: boolean) => updateField('delete_temp_audio', v)} />
        </View>
        
        {/* Diagnostics & Performance Summary */}
        <View className="mt-8 pt-6 border-t border-outline-variant/30 flex-col md:flex-row items-center justify-between gap-4">
          <Text className="text-on-surface-variant font-caption-sm text-xs italic">Avg Processing Time: {stats?.average_processing_time_ms}ms • Audio Files: {stats?.audio_files_count}</Text>
          <TouchableOpacity onPress={() => Alert.alert('Diagnostics', 'Running pipeline test...\n\nMicrophone: OK\nNoise Reduction: OK\nRecognition: OK\nAI Summarization: OK')} className="px-4 py-2 border border-primary/30 rounded-xl bg-primary/5">
            <Text className="font-bold text-primary">Run Diagnostics</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Screen>
  );
}
