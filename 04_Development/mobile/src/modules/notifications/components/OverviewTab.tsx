import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';

export function OverviewTab({ notifications }: { notifications: any[] }) {
  const unreadCount = notifications.filter(n => !n.is_read).length;
  const todayCount = notifications.filter(n => new Date(n.created_at).toDateString() === new Date().toDateString()).length;
  
  return (
    <ScrollView className="flex-1 mt-4 px-2" showsVerticalScrollIndicator={false}>
      <Text className="font-title-md font-bold text-on-surface mb-2">Engine Status</Text>
      
      <View className="flex-row gap-3 mb-6">
        <StatusCard title="Today" value={todayCount.toString()} icon="today" color={colors.primary} />
        <StatusCard title="Unread" value={unreadCount.toString()} icon="mark-email-unread" color={colors.error} />
        <StatusCard title="System" value="Active" icon="check-circle" color={colors.primary} />
      </View>

      <Text className="font-title-md font-bold text-on-surface mb-3">Recent Activity</Text>
      {notifications.length === 0 ? (
        <View className="items-center py-10 opacity-50">
           <MaterialIcons name="notifications-off" size={48} color={colors['on-surface']} />
           <Text className="mt-4 font-body-md text-on-surface">No recent notifications</Text>
        </View>
      ) : (
        notifications.slice(0, 5).map((n, i) => (
          <View key={n.id || i} className="bg-surface-container rounded-xl p-3 mb-2 flex-row gap-3">
             <View className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
                <MaterialIcons name="notifications" size={20} color={colors.primary} />
             </View>
             <View className="flex-1">
                <Text className="font-title-sm font-bold text-on-surface">{n.title}</Text>
                <Text className="font-body-sm text-on-surface-variant" numberOfLines={2}>{n.content}</Text>
             </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function StatusCard({ title, value, icon, color }: any) {
  return (
    <View className="flex-1 bg-surface-container rounded-2xl p-4 items-center border border-outline-variant/30">
      <MaterialIcons name={icon} size={24} color={color} />
      <Text className="font-title-lg font-bold text-on-surface mt-2">{value}</Text>
      <Text className="font-body-xs text-on-surface-variant mt-1">{title}</Text>
    </View>
  );
}
