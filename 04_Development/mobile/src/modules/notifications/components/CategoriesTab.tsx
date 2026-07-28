import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';

const CATEGORIES = [
  { id: 'Account', icon: 'person', desc: 'Signups, logins, security alerts' },
  { id: 'Capture', icon: 'camera', desc: 'Uploads, processing, extraction' },
  { id: 'AI', icon: 'auto-awesome', desc: 'Insights, Daily Brief, Reflections' },
  { id: 'Automation', icon: 'precision-manufacturing', desc: 'Workflow status, queue issues' },
  { id: 'Collaboration', icon: 'group', desc: 'Invites, comments, workspace updates' },
  { id: 'Security', icon: 'security', desc: 'Suspicious logins, encryptions' },
  { id: 'Reminders', icon: 'alarm', desc: 'Tasks, meetings, study habits' },
  { id: 'Emergency', icon: 'warning', desc: 'Storage full, critical failures' },
];

export function CategoriesTab({ settings, onUpdate }: { settings: any, onUpdate: (data: any) => void }) {
  const toggleCategory = (catId: string, value: boolean) => {
    const updated = {
      ...settings.categories,
      [catId]: { ...(settings.categories?.[catId] || {}), enabled: value }
    };
    onUpdate({ categories: updated });
  };

  return (
    <ScrollView className="flex-1 mt-4 px-2" showsVerticalScrollIndicator={false}>
      <Text className="font-title-md font-bold text-on-surface mb-2">Notification Categories</Text>
      <Text className="font-body-sm text-on-surface-variant mb-4">
        Control exactly what types of notifications YRecall is allowed to send you.
      </Text>
      
      {CATEGORIES.map(cat => {
        const catSettings = settings.categories?.[cat.id] || { enabled: true };
        return (
          <View key={cat.id} className="bg-surface-container rounded-2xl p-4 mb-3 border border-outline-variant/30">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center flex-1 gap-3">
                <View className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
                  <MaterialIcons name={cat.icon as any} size={20} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-title-sm font-bold text-on-surface">{cat.id}</Text>
                  <Text className="font-body-sm text-on-surface-variant">{cat.desc}</Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
                thumbColor={catSettings.enabled ? '#fff' : '#f4f3f4'}
                onValueChange={(val) => toggleCategory(cat.id, val)}
                value={catSettings.enabled}
              />
            </View>
            
            {catSettings.enabled && (
               <View className="mt-4 pt-3 border-t border-outline-variant/20 flex-row gap-4">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="notifications-active" size={16} color={colors['on-surface-variant']} />
                    <Text className="font-body-sm text-on-surface-variant">Push Enabled</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="vibration" size={16} color={colors['on-surface-variant']} />
                    <Text className="font-body-sm text-on-surface-variant">Vibration</Text>
                  </View>
               </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
