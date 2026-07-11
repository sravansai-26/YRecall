import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../src/services/api/client';
import { format } from 'date-fns';

export default function InboxScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await apiClient.get('/notifications');
      return data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
  
  const dismissMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const handlePress = (item: any) => {
    if (!item.is_read) {
      markReadMutation.mutate(item.id);
    }
    
    if (item.action_type === 'open_capture' && item.related_capture_id) {
      router.push(`/(main)/memory/${item.related_capture_id}`);
    } else if (item.action_type === 'open_graph') {
      router.push(`/(main)/(tabs)/knowledge-graph`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder': return 'alarm';
      case 'suggestion': return 'lightbulb';
      case 'insight': return 'auto-awesome';
      case 'duplicate': return 'control-point-duplicate';
      default: return 'notifications';
    }
  };

  const flattenedData = React.useMemo(() => {
    if (!notificationsData?.data) return [];
    
    const { isToday, isYesterday, isThisWeek, isThisMonth } = require('date-fns');
    
    const grouped: Record<string, any[]> = {
      'Today': [], 'Yesterday': [], 'This Week': [], 'This Month': [], 'Earlier': []
    };
    
    notificationsData.data.forEach((item: any) => {
      const date = new Date(item.created_at);
      if (isToday(date)) grouped['Today']!.push(item);
      else if (isYesterday(date)) grouped['Yesterday']!.push(item);
      else if (isThisWeek(date)) grouped['This Week']!.push(item);
      else if (isThisMonth(date)) grouped['This Month']!.push(item);
      else grouped['Earlier']!.push(item);
    });
    
    const result: any[] = [];
    ['Today', 'Yesterday', 'This Week', 'This Month', 'Earlier'].forEach(key => {
      if (grouped[key]!.length > 0) {
        result.push({ type: 'header', title: key });
        grouped[key]!.forEach(notif => result.push({ type: 'item', item: notif }));
      }
    });
    return result;
  }, [notificationsData]);

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'header') {
      return (
        <View className="py-2 mt-2 mb-1 px-2">
          <Text className="font-title-sm text-on-surface-variant font-bold">{item.title}</Text>
        </View>
      );
    }
    
    const notif = item.item;
    return (
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={() => handlePress(notif)}
        className={`mb-3 p-4 rounded-2xl border ${!notif.is_read ? 'bg-primary-container/20 border-primary/20' : 'bg-surface-container-lowest border-outline-variant/20'}`}
      >
        <View className="flex-row gap-4">
          <View className={`w-12 h-12 rounded-full items-center justify-center ${!notif.is_read ? 'bg-primary text-white' : 'bg-surface-container-high'}`}>
            <MaterialIcons name={getIcon(notif.type)} size={24} color={!notif.is_read ? colors['on-primary'] : colors.primary} />
          </View>
          <View className="flex-1">
            <View className="flex-row justify-between items-start mb-1">
              <Text className={`font-title-sm flex-1 mr-2 ${!notif.is_read ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`} numberOfLines={1}>
                {notif.title}
              </Text>
              <Text className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                {format(new Date(notif.created_at), 'h:mm a')}
              </Text>
            </View>
            <Text className={`font-body-sm leading-tight ${!notif.is_read ? 'text-on-surface' : 'text-on-surface-variant/80'}`}>
              {notif.content}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const hasNotifications = flattenedData.length > 0;

  return (
    <Screen scrollable={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-margin-mobile h-14 bg-surface border-b border-outline-variant/10">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm font-bold text-primary">Inbox</Text>
        </View>
        <TouchableOpacity 
          className="bg-surface-container-high px-4 py-2 rounded-full"
          onPress={async () => {
            await apiClient.post('/notifications/read-all');
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          }}
        >
          <Text className="text-on-surface-variant font-label-sm font-bold">Mark all read</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 w-full max-w-7xl mx-auto">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : !hasNotifications ? (
          <View className="flex-1 items-center justify-center pt-20 px-6">
            <MaterialIcons name="notifications-none" size={64} color={colors.outline} className="mb-4 opacity-50" />
            <Text className="font-title-sm text-on-surface-variant text-center">You're all caught up!</Text>
            <Text className="font-body-md text-on-surface-variant/70 text-center mt-2">
              The AI Intelligence Engine will notify you here when there are important reminders or insights.
            </Text>
          </View>
        ) : (
          <FlashList
            data={flattenedData}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
            keyExtractor={(item: any, index: number) => item.type === 'header' ? `header-${item.title}` : `notif-${item.item.id}`}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            estimatedItemSize={100}
            renderItem={renderItem}
          />
        )}
      </View>
    </Screen>
  );
}
