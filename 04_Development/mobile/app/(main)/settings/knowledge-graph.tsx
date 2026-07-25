import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { graphApi } from '../../../src/modules/graph/api';

export default function KnowledgeGraphSettings() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  
  const [maintenanceRunning, setMaintenanceRunning] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await graphApi.getSettings();
      setSettings(res.data.settings);
      setStats(res.data.statistics);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load graph settings.');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    // Optimistic update
    const prev = { ...settings };
    setSettings({ ...settings, [key]: value });
    try {
      await graphApi.updateSettings({ [key]: value });
    } catch (err) {
      console.error(err);
      setSettings(prev);
      Alert.alert('Error', 'Failed to update setting.');
    }
  };

  const runMaintenance = (action: string, title: string, description: string) => {
    Alert.alert(title, description, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Proceed',
        style: 'destructive',
        onPress: async () => {
          setMaintenanceRunning(action);
          try {
            await graphApi.runMaintenance(action);
            // Simulate waiting for background job for demo
            setTimeout(() => {
              setMaintenanceRunning(null);
              fetchData();
              Alert.alert('Success', `${title} completed successfully.`);
            }, 2500);
          } catch (err) {
            setMaintenanceRunning(null);
            Alert.alert('Error', `Failed to run ${title}.`);
          }
        }
      }
    ]);
  };

  if (loading && !settings) {
    return (
      <Screen scrollable={false} className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  const StatCard = ({ title, value, icon, color = colors.primary }: any) => (
    <View className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20 flex-1 min-w-[45%] mb-4 mr-4">
      <View className="flex-row items-center gap-2 mb-2">
        <MaterialIcons name={icon} size={20} color={color} />
        <Text className="font-label-sm text-xs text-on-surface-variant font-medium">{title}</Text>
      </View>
      <Text className="font-headline-md text-2xl font-bold text-on-surface">{value}</Text>
    </View>
  );

  const SettingToggle = ({ title, description, value, onValueChange }: any) => (
    <View className="flex-row items-center justify-between py-4 border-b border-outline-variant/20">
      <View className="flex-1 pr-4">
        <Text className="font-body-md text-base font-bold text-on-surface">{title}</Text>
        <Text className="font-body-sm text-sm text-on-surface-variant mt-1">{description}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange} 
        trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
        thumbColor={colors.onPrimary}
      />
    </View>
  );

  const MaintenanceButton = ({ title, description, icon, action, color = colors.primary }: any) => {
    const isRunning = maintenanceRunning === action;
    return (
      <TouchableOpacity 
        disabled={maintenanceRunning !== null}
        onPress={() => runMaintenance(action, title, description)}
        className={`flex-row items-center justify-between p-4 rounded-2xl border mb-3 ${isRunning ? 'bg-surface-container border-outline-variant/20' : 'bg-surface-container-lowest border-outline-variant/20'}`}
      >
        <View className="flex-row items-center gap-4 flex-1">
          <View className={`w-10 h-10 items-center justify-center rounded-xl`} style={{ backgroundColor: `${color}15` }}>
            {isRunning ? <ActivityIndicator size="small" color={color} /> : <MaterialIcons name={icon} size={24} color={color} />}
          </View>
          <View className="flex-1">
            <Text className="font-body-md text-base font-bold text-on-surface">{title}</Text>
            <Text className="font-body-sm text-sm text-on-surface-variant">{isRunning ? 'Processing in background...' : description}</Text>
          </View>
        </View>
        {!isRunning && <MaterialIcons name="chevron-right" size={24} color={colors.outline} />}
      </TouchableOpacity>
    );
  };

  return (
    <Screen scrollable={false} className="flex-1 bg-surface">
      <View className="w-full sticky top-0 z-40 bg-surface flex-row items-center justify-between px-margin-mobile h-16 border-b border-outline-variant/10">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">Knowledge Graph</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-margin-mobile pt-6 pb-20">
        
        {/* Health Section */}
        <View className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm border border-outline-variant/20 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-headline-sm text-lg font-bold text-primary">Graph Health</Text>
            <View className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <Text className="font-label-sm text-xs font-bold text-green-600">Excellent</Text>
            </View>
          </View>
          
          <View className="flex-row items-end gap-2 mb-6">
            <Text className="font-display-md text-4xl font-bold text-primary">{stats?.health?.connectivity_score || 0}</Text>
            <Text className="font-body-md text-base text-on-surface-variant mb-1">/ 100 Connectivity Score</Text>
          </View>

          <View className="flex-row flex-wrap -mr-4">
            <StatCard title="Density" value={stats?.health?.relationship_density || 0} icon="grain" />
            <StatCard title="Orphans" value={stats?.health?.isolated_nodes || 0} icon="link-off" color={colors.error} />
            <StatCard title="Duplicates" value={stats?.health?.duplicate_entities || 0} icon="file-copy" color={colors.secondary} />
            <StatCard title="Broken" value={stats?.health?.broken_references || 0} icon="warning" color={colors.error} />
          </View>
        </View>

        {/* Overview & Growth */}
        <Text className="font-label-md text-sm text-primary font-bold uppercase tracking-widest mb-4">Graph Overview</Text>
        <View className="flex-row flex-wrap -mr-4 mb-4">
          <StatCard title="Total Nodes" value={stats?.overview?.total_nodes || 0} icon="scatter-plot" />
          <StatCard title="Relationships" value={stats?.overview?.total_relationships || 0} icon="route" />
          <StatCard title="Connected Memories" value={stats?.overview?.connected_memories || 0} icon="memory" />
          <StatCard title="AI Discovered" value={stats?.overview?.ai_generated_links || 0} icon="auto-awesome" color={colors.secondary} />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 -mx-margin-mobile px-margin-mobile">
          {Object.entries({
            People: stats?.overview?.people,
            Places: stats?.overview?.places,
            Projects: stats?.overview?.projects,
            Topics: stats?.overview?.topics,
            Orgs: stats?.overview?.organizations,
            Docs: stats?.overview?.documents
          }).map(([k, v]) => (
            <View key={k} className="bg-surface-container rounded-xl px-4 py-3 mr-3 items-center justify-center min-w-[80px]">
              <Text className="font-headline-sm text-xl font-bold text-on-surface mb-1">{v || 0}</Text>
              <Text className="font-label-sm text-xs text-on-surface-variant font-medium">{k}</Text>
            </View>
          ))}
        </ScrollView>

        {/* AI Relationship Engine */}
        <Text className="font-label-md text-sm text-primary font-bold uppercase tracking-widest mb-4 mt-2">AI Relationship Engine</Text>
        <View className="bg-surface-container-lowest rounded-[24px] px-6 py-2 shadow-sm border border-outline-variant/20 mb-8">
          <SettingToggle 
            title="Auto-Discovery" 
            description="AI automatically finds relationships between entities in the background."
            value={settings?.auto_relationship_discovery ?? true}
            onValueChange={(val: boolean) => updateSetting('auto_relationship_discovery', val)}
          />
          <SettingToggle 
            title="Smart Entity Linking" 
            description="Link incoming memories to existing entities automatically."
            value={settings?.auto_entity_linking ?? true}
            onValueChange={(val: boolean) => updateSetting('auto_entity_linking', val)}
          />
          <SettingToggle 
            title="Semantic Linking" 
            description="Use embedding distances to find hidden relationships."
            value={settings?.semantic_linking ?? true}
            onValueChange={(val: boolean) => updateSetting('semantic_linking', val)}
          />
        </View>

        {/* Entity Preferences */}
        <Text className="font-label-md text-sm text-primary font-bold uppercase tracking-widest mb-4">Entity Preferences</Text>
        <View className="bg-surface-container-lowest rounded-[24px] px-6 py-2 shadow-sm border border-outline-variant/20 mb-8">
          <SettingToggle 
            title="Auto Merge Similar" 
            description="Automatically merge entities with high semantic similarity."
            value={settings?.auto_merge_similar ?? false}
            onValueChange={(val: boolean) => updateSetting('auto_merge_similar', val)}
          />
          <SettingToggle 
            title="Alias Recognition" 
            description="Understand nicknames and alternative names for the same entity."
            value={settings?.alias_recognition ?? true}
            onValueChange={(val: boolean) => updateSetting('alias_recognition', val)}
          />
          <SettingToggle 
            title="Strict Case Matching" 
            description="Differentiate entities based on capitalization (e.g. apple vs Apple)."
            value={settings?.case_sensitive ?? false}
            onValueChange={(val: boolean) => updateSetting('case_sensitive', val)}
          />
        </View>

        {/* AI Explainability */}
        <Text className="font-label-md text-sm text-primary font-bold uppercase tracking-widest mb-4">AI Explainability</Text>
        <View className="bg-surface-container-lowest rounded-[24px] px-6 py-2 shadow-sm border border-outline-variant/20 mb-8">
          <SettingToggle 
            title="Show Reasoning" 
            description="Display AI's reasoning for connecting two entities."
            value={settings?.show_relationship_reasons ?? true}
            onValueChange={(val: boolean) => updateSetting('show_relationship_reasons', val)}
          />
          <SettingToggle 
            title="Confidence Scores" 
            description="Show the numerical confidence value (0-100%) for AI links."
            value={settings?.show_confidence_scores ?? false}
            onValueChange={(val: boolean) => updateSetting('show_confidence_scores', val)}
          />
        </View>

        {/* Search Configuration */}
        <Text className="font-label-md text-sm text-primary font-bold uppercase tracking-widest mb-4">Search Configuration</Text>
        <View className="bg-surface-container-lowest rounded-[24px] px-6 py-2 shadow-sm border border-outline-variant/20 mb-8">
          <SettingToggle 
            title="Hybrid Search by Default" 
            description="Use both semantic matching and keyword search."
            value={settings?.search_type === 'hybrid'}
            onValueChange={(val: boolean) => updateSetting('search_type', val ? 'hybrid' : 'semantic')}
          />
        </View>

        {/* Graph Privacy */}
        <Text className="font-label-md text-sm text-primary font-bold uppercase tracking-widest mb-4">Graph Privacy</Text>
        <View className="bg-surface-container-lowest rounded-[24px] px-6 py-2 shadow-sm border border-outline-variant/20 mb-8">
          <SettingToggle 
            title="Include Workspace Graphs" 
            description="Allow your personal graph to query public workspace data."
            value={settings?.include_workspace_graphs ?? false}
            onValueChange={(val: boolean) => updateSetting('include_workspace_graphs', val)}
          />
          <SettingToggle 
            title="Hide Sensitive Entities" 
            description="Automatically exclude entities marked as sensitive from search."
            value={settings?.hide_sensitive_entities ?? true}
            onValueChange={(val: boolean) => updateSetting('hide_sensitive_entities', val)}
          />
        </View>

        {/* Export Data */}
        <Text className="font-label-md text-sm text-primary font-bold uppercase tracking-widest mb-4">Data Portability</Text>
        <View className="mb-8">
          <MaintenanceButton 
            title="Export Graph (JSON)" 
            description="Download your entire knowledge graph as a raw JSON file." 
            icon="download" 
            action="export_json" 
          />
        </View>

        {/* Maintenance Actions */}
        <Text className="font-label-md text-sm text-error font-bold uppercase tracking-widest mb-4">Maintenance & Optimization</Text>
        <View className="mb-8">
          <MaintenanceButton 
            title="Optimize Graph" 
            description="Rebuild indexes and compact the database for faster queries." 
            icon="auto-fix-high" 
            action="optimize" 
          />
          <MaintenanceButton 
            title="Refresh Embeddings" 
            description="Regenerate vector embeddings using the latest AI models." 
            icon="transform" 
            action="recalculate" 
            color={colors.secondary}
          />
          <MaintenanceButton 
            title="Clean Orphans" 
            description="Remove isolated nodes that have no relationships or attached memories." 
            icon="cleaning-services" 
            action="clean" 
            color={colors.error}
          />
          <MaintenanceButton 
            title="Rebuild Entire Graph" 
            description="Destructive action. Completely rebuilds relationships from raw captures." 
            icon="warning" 
            action="rebuild" 
            color={colors.error}
          />
        </View>

        {/* System Info */}
        <Text className="font-label-xs text-xs text-outline text-center mb-12">
          Index Size: {stats?.performance?.search_index_size || '0 MB'} • Average Query: {stats?.performance?.avg_search_time || '0ms'}
        </Text>

      </ScrollView>
    </Screen>
  );
}
