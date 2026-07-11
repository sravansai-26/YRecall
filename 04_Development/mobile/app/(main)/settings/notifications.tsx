import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { apiClient } from '../../../src/services/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/notifications/settings');
      return data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (newSettings: any) => {
      await apiClient.put('/notifications/settings', newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
    }
  });

  const [settings, setSettings] = useState({
    reminders: true,
    insights: true,
    relationships: true,
    system: true
  });

  useEffect(() => {
    if (settingsData?.data) {
      setSettings(settingsData.data);
    }
  }, [settingsData]);

  const toggleSetting = (key: string) => {
    const newSettings = { ...settings, [key]: !settings[key as keyof typeof settings] };
    setSettings(newSettings);
    mutation.mutate(newSettings);
  };

  return (
    <Screen scrollable={false}>
      {/* Header */}
      <View className="flex-row items-center gap-3 px-margin-mobile h-14 bg-surface border-b border-outline-variant/10">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container">
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="font-title-sm font-bold text-primary">Notification Settings</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView className="flex-1 px-margin-mobile pt-4">
          <Text className="font-body-md text-on-surface-variant mb-6">
            Control which types of insights and reminders the AI Intelligence Engine sends you.
          </Text>

          {/* Setting Items */}
          <SettingToggle 
            title="Smart Reminders" 
            description="Time-sensitive tasks, follow-ups, and calendar reminders extracted from your memories."
            icon="alarm"
            value={settings.reminders}
            onValueChange={() => toggleSetting('reminders')}
          />

          <SettingToggle 
            title="AI Insights & Summaries" 
            description="Daily briefs, suggestions, and intelligent insights generated from your captures."
            icon="auto-awesome"
            value={settings.insights}
            onValueChange={() => toggleSetting('insights')}
          />

          <SettingToggle 
            title="Knowledge Relationships" 
            description="Alerts when the AI discovers new connections between your people, projects, and ideas."
            icon="hub"
            value={settings.relationships}
            onValueChange={() => toggleSetting('relationships')}
          />

          <SettingToggle 
            title="System Updates" 
            description="App updates, sync status, and storage alerts."
            icon="settings-system-daydream"
            value={settings.system}
            onValueChange={() => toggleSetting('system')}
          />
        </ScrollView>
      )}
    </Screen>
  );
}

function SettingToggle({ title, description, icon, value, onValueChange }: any) {
  return (
    <View className="flex-row items-center justify-between py-4 border-b border-outline-variant/10">
      <View className="flex-1 flex-row gap-4">
        <View className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center mt-1">
          <MaterialIcons name={icon} size={20} color={colors.primary} />
        </View>
        <View className="flex-1 pr-4">
          <Text className="font-title-sm font-bold text-on-surface mb-1">{title}</Text>
          <Text className="font-body-sm text-on-surface-variant leading-tight">{description}</Text>
        </View>
      </View>
      <Switch
        trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
        ios_backgroundColor={colors['surface-container-highest']}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}
