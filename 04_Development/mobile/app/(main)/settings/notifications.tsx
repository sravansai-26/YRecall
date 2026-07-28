import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { apiClient } from '../../../src/services/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { OverviewTab } from '../../../src/modules/notifications/components/OverviewTab';
import { CategoriesTab } from '../../../src/modules/notifications/components/CategoriesTab';
import { BehaviorTab } from '../../../src/modules/notifications/components/BehaviorTab';
import { useNotifications } from '../../../src/shared/hooks/useNotifications';

type Tab = 'Overview' | 'Categories' | 'Behavior';

export default function NotificationCenterScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/notifications/settings');
      return data.data;
    }
  });

  const { data: notificationsResponse, isLoading: notifsLoading } = useNotifications();
  const notificationsData = notificationsResponse?.data || [];

  const mutation = useMutation({
    mutationFn: async (newSettings: any) => {
      await apiClient.patch('/notifications/settings', newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
    }
  });

  const handleUpdate = (partialUpdate: any) => {
    mutation.mutate(partialUpdate);
  };

  const isLoading = settingsLoading || notifsLoading;

  return (
    <Screen scrollable={false}>
      {/* Header */}
      <View className="flex-row items-center gap-3 px-margin-mobile h-14 bg-surface">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container">
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="font-title-sm font-bold text-primary">Intelligent Notification Center</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-outline-variant/30 px-margin-mobile">
        {(['Overview', 'Categories', 'Behavior'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-3 items-center border-b-2 ${activeTab === tab ? 'border-primary' : 'border-transparent'}`}
          >
            <Text className={`font-title-sm ${activeTab === tab ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View className="flex-1 bg-surface px-margin-mobile">
          {activeTab === 'Overview' && <OverviewTab notifications={notificationsData} />}
          {activeTab === 'Categories' && <CategoriesTab settings={settingsData || {}} onUpdate={handleUpdate} />}
          {activeTab === 'Behavior' && <BehaviorTab settings={settingsData || {}} onUpdate={handleUpdate} />}
        </View>
      )}
    </Screen>
  );
}
