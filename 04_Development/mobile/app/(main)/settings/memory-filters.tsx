import { View, Text, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useFiltersSettings, useUpdateFiltersSettings, useFiltersStats } from '../../../src/modules/filters/useFiltersSettings';

export default function MemoryFiltersSettings() {
  const router = useRouter();
  
  const { data: settings, isLoading: isSettingsLoading } = useFiltersSettings();
  const { data: stats, isLoading: isStatsLoading } = useFiltersStats();
  const updateSettings = useUpdateFiltersSettings();

  const [form, setForm] = useState<any>({});
  
  // For expanding/collapsing sections
  const [expandedSection, setExpandedSection] = useState<string | null>('timeline');

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate(form, {
      onSuccess: () => Alert.alert('Saved', 'Memory filters updated successfully.')
    });
  };

  const updateField = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (cat: string) => {
    const current = form.enabled_categories || [];
    if (current.includes(cat)) {
      updateField('enabled_categories', current.filter((c: string) => c !== cat));
    } else {
      updateField('enabled_categories', [...current, cat]);
    }
  };

  const applyPreset = (presetName: string) => {
    Alert.alert('Apply Preset', `Are you sure you want to apply the ${presetName} preset? This will overwrite your current filter preferences.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Apply', onPress: () => {
          updateField('active_preset', presetName.toLowerCase());
          // Normally this would also set all the sub-fields based on the preset definition
      }}
    ]);
  };

  if (isSettingsLoading || isStatsLoading) {
    return (
      <Screen scrollable={false} className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  const SectionTitle = ({ title, icon, id }: { title: string, icon: any, id: string }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => setExpandedSection(expandedSection === id ? null : id)}
      className="flex-row items-center justify-between mt-6 mb-2 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-sm"
    >
      <View className="flex-row items-center gap-3">
        <View className="bg-primary/10 p-2 rounded-lg">
          <MaterialIcons name={icon} size={20} color={colors.primary} />
        </View>
        <Text className="font-title-sm text-lg font-bold text-on-surface">{title}</Text>
      </View>
      <MaterialIcons name={expandedSection === id ? "expand-less" : "expand-more"} size={24} color={colors.outline} />
    </TouchableOpacity>
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
    <View className="mb-4">
      <Text className="font-label-sm text-xs text-on-surface-variant font-bold mb-2 ml-1 uppercase">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((opt: string) => (
          <TouchableOpacity 
            key={opt}
            onPress={() => onSelect(opt)}
            className={`px-4 py-2 rounded-full border ${value === opt ? 'bg-primary border-primary' : 'bg-surface-container-lowest border-outline-variant/30'}`}
          >
            <Text className={`font-medium text-sm ${value === opt ? 'text-white' : 'text-on-surface capitalize'}`}>{opt.replace('_', ' ')}</Text>
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
          <Text className="font-title-sm text-xl text-primary font-bold">Memory Filters</Text>
        </View>
        <TouchableOpacity onPress={handleSave} className="bg-primary px-4 py-1.5 rounded-full">
          {updateSettings.isPending ? <ActivityIndicator size="small" color="white" /> : <Text className="text-white font-bold text-sm">Save</Text>}
        </TouchableOpacity>
      </View>

      <View className="max-w-2xl mx-auto px-margin-mobile w-full pb-20 pt-4">

        {/* Live Preview / Active Preset Bar */}
        <View className="bg-secondary-container/30 rounded-2xl p-4 mb-6 border border-secondary/20 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-1">Active Preset</Text>
            <Text className="text-on-surface font-bold text-lg capitalize">{form.active_preset || 'Custom'}</Text>
          </View>
          <TouchableOpacity onPress={() => setExpandedSection('presets')} className="bg-secondary px-4 py-2 rounded-full">
            <Text className="text-on-secondary font-bold text-sm">Change Preset</Text>
          </TouchableOpacity>
        </View>

        {/* 1. Memory Overview */}
        <View className="flex-row flex-wrap gap-3 mb-4">
          {[
            { label: 'Total', value: stats?.total_memories, color: 'text-primary' },
            { label: 'Visible', value: stats?.visible_memories, color: 'text-green-600' },
            { label: 'Hidden', value: stats?.hidden_memories, color: 'text-outline' },
            { label: 'Pinned', value: stats?.pinned_memories, color: 'text-secondary' },
          ].map(stat => (
            <View key={stat.label} className="flex-1 min-w-[80px] bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20 shadow-sm items-center">
              <Text className={`font-bold text-lg ${stat.color}`}>{stat.value || 0}</Text>
              <Text className="text-[10px] text-on-surface-variant uppercase font-bold mt-1">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Presets Section */}
        {expandedSection === 'presets' && (
          <View className="bg-surface-container-lowest rounded-2xl p-5 mb-4 border border-outline-variant/20 shadow-sm animate-fade-in">
            <Text className="font-bold text-on-surface mb-3">Quick Presets</Text>
            <View className="flex-row flex-wrap gap-2">
              {['Default', 'Professional', 'Student', 'Minimal', 'Learning Focus'].map(preset => (
                <TouchableOpacity 
                  key={preset}
                  onPress={() => applyPreset(preset)}
                  className={`px-3 py-2 rounded-lg border ${form.active_preset?.toLowerCase() === preset.toLowerCase() ? 'bg-secondary/10 border-secondary' : 'bg-surface border-outline-variant/30'}`}
                >
                  <Text className={`text-sm font-medium ${form.active_preset?.toLowerCase() === preset.toLowerCase() ? 'text-secondary' : 'text-on-surface'}`}>{preset}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 2. Timeline Defaults */}
        <SectionTitle id="timeline" title="Timeline Defaults" icon="view-timeline" />
        {expandedSection === 'timeline' && (
          <View className="bg-surface-container-lowest rounded-2xl p-5 mb-4 border border-outline-variant/20 shadow-sm animate-fade-in">
            <ChoiceSelector 
              label="Sort Order" 
              options={['recent_first', 'pinned_first', 'important_first', 'ai_prioritized']} 
              value={form.default_timeline_sort || 'recent_first'} 
              onSelect={(v: string) => updateField('default_timeline_sort', v)} 
            />
            
            <Text className="font-label-sm text-xs text-on-surface-variant font-bold mb-3 ml-1 uppercase mt-4">Visible Categories</Text>
            <View className="flex-row flex-wrap gap-2">
              {['notes', 'voice', 'images', 'videos', 'pdfs', 'links', 'meetings', 'tasks'].map(cat => {
                const isActive = (form.enabled_categories || []).includes(cat);
                return (
                  <TouchableOpacity 
                    key={cat}
                    onPress={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full border flex-row items-center gap-1 ${isActive ? 'bg-primary border-primary' : 'bg-surface-container-highest border-transparent'}`}
                  >
                    {isActive && <MaterialIcons name="check" size={14} color="white" />}
                    <Text className={`text-sm font-medium capitalize ${isActive ? 'text-white' : 'text-on-surface-variant'}`}>{cat}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* 4. AI Prioritization */}
        <SectionTitle id="ai" title="AI Prioritization" icon="auto-awesome" />
        {expandedSection === 'ai' && (
          <View className="bg-surface-container-lowest rounded-2xl p-5 mb-4 border border-outline-variant/20 shadow-sm animate-fade-in">
            <ToggleSetting label="Important Memories First" description="Boost items marked as high value." value={form.show_important_first} onToggle={(v: boolean) => updateField('show_important_first', v)} />
            <ToggleSetting label="Recently Discussed" description="Surface items relevant to recent AI chats." value={form.show_recently_discussed} onToggle={(v: boolean) => updateField('show_recently_discussed', v)} />
            <ToggleSetting label="AI Recommended" description="Let AI inject relevant context automatically." value={form.show_ai_recommended} onToggle={(v: boolean) => updateField('show_ai_recommended', v)} />
            <ToggleSetting label="Hide Low Value" description="Automatically suppress noise." value={form.hide_low_value} onToggle={(v: boolean) => updateField('hide_low_value', v)} />
          </View>
        )}

        {/* 6. Visibility Rules */}
        <SectionTitle id="visibility" title="Visibility Rules" icon="visibility-off" />
        {expandedSection === 'visibility' && (
          <View className="bg-surface-container-lowest rounded-2xl p-5 mb-4 border border-outline-variant/20 shadow-sm animate-fade-in">
            <ToggleSetting label="Hide Archived" description="Remove archived items from default views." value={form.hide_archived} onToggle={(v: boolean) => updateField('hide_archived', v)} />
            <ToggleSetting label="Hide Completed Tasks" description="Keep timeline focused on actionable items." value={form.hide_completed_tasks} onToggle={(v: boolean) => updateField('hide_completed_tasks', v)} />
            <ToggleSetting label="Hide Temporary" description="Hide short-lived captures." value={form.hide_temporary} onToggle={(v: boolean) => updateField('hide_temporary', v)} />
            <ToggleSetting label="Hide Workspace Memories" description="Separate work from personal timeline." value={form.hide_workspace_memories} onToggle={(v: boolean) => updateField('hide_workspace_memories', v)} />
          </View>
        )}

        {/* 7. Search Behaviour */}
        <SectionTitle id="search" title="Search Behaviour" icon="search" />
        {expandedSection === 'search' && (
          <View className="bg-surface-container-lowest rounded-2xl p-5 mb-4 border border-outline-variant/20 shadow-sm animate-fade-in">
            <ToggleSetting label="Semantic Search Priority" description="Search by meaning, not just keywords." value={form.semantic_search_priority} onToggle={(v: boolean) => updateField('semantic_search_priority', v)} />
            <ToggleSetting label="Hybrid Search" description="Combine semantic and keyword matching." value={form.hybrid_search} onToggle={(v: boolean) => updateField('hybrid_search', v)} />
            <ToggleSetting label="Search History" description="Remember past queries." value={form.search_history_enabled} onToggle={(v: boolean) => updateField('search_history_enabled', v)} />
          </View>
        )}

        {/* 8. AI Context Selection */}
        <SectionTitle id="context" title="AI Context Scope" icon="psychology" />
        {expandedSection === 'context' && (
          <View className="bg-surface-container-lowest rounded-2xl p-5 mb-4 border border-outline-variant/20 shadow-sm animate-fade-in">
            <Text className="text-sm text-on-surface-variant mb-4">Select which memory pools Ask AI is allowed to read from to generate context.</Text>
            <ToggleSetting label="Recent Memories" description="Include last 7 days." value={form.ai_context_recent} onToggle={(v: boolean) => updateField('ai_context_recent', v)} />
            <ToggleSetting label="Pinned & Favourite" description="Include highly rated items." value={form.ai_context_pinned} onToggle={(v: boolean) => updateField('ai_context_pinned', v)} />
            <ToggleSetting label="Active Projects" description="Include workspace project data." value={form.ai_context_project} onToggle={(v: boolean) => updateField('ai_context_project', v)} />
            <ToggleSetting label="Voice & Meetings" description="Include transcriptions." value={form.ai_context_voice} onToggle={(v: boolean) => updateField('ai_context_voice', v)} />
          </View>
        )}

        {/* 9. Retention Preferences */}
        <SectionTitle id="retention" title="Retention & Archiving" icon="archive" />
        {expandedSection === 'retention' && (
          <View className="bg-surface-container-lowest rounded-2xl p-5 mb-4 border border-outline-variant/20 shadow-sm animate-fade-in">
            <ToggleSetting label="Auto Archive" description="Archive old memories automatically." value={form.auto_archive} onToggle={(v: boolean) => updateField('auto_archive', v)} />
            {form.auto_archive && (
              <ChoiceSelector 
                label="Archive After" 
                options={['30_days', '90_days', '1_year']} 
                value={form.archive_inactivity_days === 30 ? '30_days' : form.archive_inactivity_days === 365 ? '1_year' : '90_days'} 
                onSelect={(v: string) => updateField('archive_inactivity_days', v === '30_days' ? 30 : v === '1_year' ? 365 : 90)} 
              />
            )}
            <ToggleSetting label="Auto Pin Important" description="AI automatically pins critical notes." value={form.auto_pin} onToggle={(v: boolean) => updateField('auto_pin', v)} />
          </View>
        )}

      </View>
    </Screen>
  );
}
