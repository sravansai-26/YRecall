import React from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';

export function BehaviorTab({ settings, onUpdate }: { settings: any, onUpdate: (data: any) => void }) {
  
  const toggleSetting = (key: string) => {
    onUpdate({ [key]: !settings[key] });
  };

  const toggleChannel = (channel: string) => {
    const channels = settings.delivery_channels || {};
    onUpdate({ delivery_channels: { ...channels, [channel]: !channels[channel] } });
  };

  return (
    <ScrollView className="flex-1 mt-4 px-2" showsVerticalScrollIndicator={false}>
      <Text className="font-title-md font-bold text-on-surface mb-2">Engine Behavior</Text>
      
      <View className="bg-surface-container rounded-2xl p-4 mb-4 border border-outline-variant/30">
         <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1 pr-4">
               <Text className="font-title-sm font-bold text-on-surface">Quiet Hours</Text>
               <Text className="font-body-sm text-on-surface-variant">Suppress non-critical notifications between 10 PM and 7 AM.</Text>
            </View>
            <Switch
              trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
              thumbColor={settings.quiet_hours_enabled ? '#fff' : '#f4f3f4'}
              onValueChange={() => toggleSetting('quiet_hours_enabled')}
              value={settings.quiet_hours_enabled}
            />
         </View>
         
         <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1 pr-4">
               <Text className="font-title-sm font-bold text-on-surface">Smart Suggestions</Text>
               <Text className="font-body-sm text-on-surface-variant">Allow AI to intelligently suppress repetitive or low-value notifications.</Text>
            </View>
            <Switch
              trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
              thumbColor={settings.smart_suggestions ? '#fff' : '#f4f3f4'}
              onValueChange={() => toggleSetting('smart_suggestions')}
              value={settings.smart_suggestions}
            />
         </View>
         
         <View className="flex-row justify-between items-center">
            <View className="flex-1 pr-4">
               <Text className="font-title-sm font-bold text-on-surface">Vacation Mode</Text>
               <Text className="font-body-sm text-on-surface-variant">Pause all notifications until you return.</Text>
            </View>
            <Switch
              trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
              thumbColor={settings.vacation_mode ? '#fff' : '#f4f3f4'}
              onValueChange={() => toggleSetting('vacation_mode')}
              value={settings.vacation_mode}
            />
         </View>
      </View>
      
      <Text className="font-title-md font-bold text-on-surface mt-2 mb-2">Delivery Channels</Text>
      <View className="bg-surface-container rounded-2xl p-4 mb-8 border border-outline-variant/30">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-3">
               <MaterialIcons name="notifications-active" size={20} color={colors.primary} />
               <Text className="font-title-sm font-bold text-on-surface">Push Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
              thumbColor={settings.delivery_channels?.push ? '#fff' : '#f4f3f4'}
              onValueChange={() => toggleChannel('push')}
              value={settings.delivery_channels?.push ?? true}
            />
         </View>
         <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-3">
               <MaterialIcons name="inbox" size={20} color={colors.primary} />
               <Text className="font-title-sm font-bold text-on-surface">In-App Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
              thumbColor={settings.delivery_channels?.in_app ? '#fff' : '#f4f3f4'}
              onValueChange={() => toggleChannel('in_app')}
              value={settings.delivery_channels?.in_app ?? true}
            />
         </View>
         <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
               <MaterialIcons name="email" size={20} color={colors.primary} />
               <Text className="font-title-sm font-bold text-on-surface">Daily Email Digest</Text>
            </View>
            <Switch
              trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
              thumbColor={settings.delivery_channels?.daily_digest ? '#fff' : '#f4f3f4'}
              onValueChange={() => toggleChannel('daily_digest')}
              value={settings.delivery_channels?.daily_digest ?? false}
            />
         </View>
      </View>
    </ScrollView>
  );
}
