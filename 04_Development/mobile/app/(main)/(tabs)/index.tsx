import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';
import { useDashboard, useGenerateReflection } from '../../../src/modules/home/hooks';
import { useNotifications } from '../../../src/shared/hooks/useNotifications';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../src/services/api/client';

export default function HomeDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [backPressCount, setBackPressCount] = useState(0);

  const getGreeting = () => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: 'Asia/Kolkata',
      });
      const hour = parseInt(formatter.format(new Date()), 10);
      if (hour < 12) return 'Good Morning,';
      if (hour < 17) return 'Good Afternoon,';
      return 'Good Evening,';
    } catch (e) {
      // Fallback if environment doesn't support timeZone
      const hour = new Date().getHours();
      if (hour < 12) return 'Good Morning,';
      if (hour < 17) return 'Good Afternoon,';
      return 'Good Evening,';
    }
  };

  const { data: dashboardData, isLoading, refetch, isRefetching } = useDashboard();
  const { mutate: generateReflection, isPending: isReflecting } = useGenerateReflection();
  const { data: notificationsData } = useNotifications();

  // Fetch only the 3 most recent memories to speed up home screen loading
  const { data: capturesData, isLoading: capturesLoading } = useQuery({
    queryKey: ['captures', 'recent'],
    queryFn: async () => {
      const res = await apiClient.get('/captures?limit=3');
      return res.data;
    },
    staleTime: 60000,
  });

  const unreadCount = notificationsData?.meta?.unread_count || 0;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (backPressCount === 0) {
          setBackPressCount(1);
          require('react-native').ToastAndroid?.show('Press back again to exit', require('react-native').ToastAndroid.SHORT);
          setTimeout(() => setBackPressCount(0), 2000);
          return true;
        } else {
          require('react-native').BackHandler.exitApp();
          return true;
        }
      };
      const subscription = require('react-native').BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [backPressCount])
  );

  return (
    <Screen scrollable={false}>
      {/* Top Header */}
      <View className="bg-surface z-40">
        <View className="flex-row justify-between items-center w-full px-margin-mobile h-16 max-w-7xl mx-auto">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.push('/(main)/profile-edit')} className="w-10 h-10 rounded-full bg-primary-fixed overflow-hidden items-center justify-center border-2 border-surface-container-high">
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} className="w-full h-full" />
              ) : (
                <MaterialIcons name="person" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
            <View className="flex-col">
              <Text className="font-label-xs text-on-surface-variant">{getGreeting()}</Text>
              <Text className="font-title-sm text-[16px] font-bold text-primary">{user?.displayName?.split(' ')[0] || 'User'}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full relative"
              onPress={() => router.push('/(main)/inbox' as any)}
            >
              <MaterialIcons name="notifications" size={24} color={colors.primary} />
              {unreadCount > 0 && (
                <View className="absolute top-2 right-2 w-3 h-3 rounded-full bg-error border-2 border-surface" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 w-full max-w-7xl mx-auto mt-4 px-margin-mobile" 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
      >
        {/* Daily Briefing & AI Reflection */}
        <View className="bg-surface-dim p-lg rounded-[24px] shadow-sm overflow-hidden mb-xl">
          <View className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
            <MaterialIcons name="auto-awesome" size={80} color={colors.primary} />
          </View>
          
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="auto-awesome" size={20} color={colors.secondary} />
              <Text className="font-headline-md text-[20px] text-primary">Today's Briefing</Text>
            </View>
            <TouchableOpacity 
              onPress={() => generateReflection('daily')}
              disabled={isReflecting || isLoading}
            >
              <MaterialIcons name={isReflecting ? "hourglass-empty" : "refresh"} size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View className="py-4">
              <View className="h-4 w-full bg-surface-container-high rounded-full mb-2 animate-pulse" />
              <View className="h-4 w-5/6 bg-surface-container-high rounded-full mb-2 animate-pulse" />
              <View className="h-4 w-2/3 bg-surface-container-high rounded-full animate-pulse" />
            </View>
          ) : isReflecting ? (
            <View className="py-4 items-center justify-center">
              <ActivityIndicator color={colors.primary} size="small" />
              <Text className="font-body-sm text-on-surface-variant mt-2">AI is analyzing your memories...</Text>
            </View>
          ) : dashboardData?.daily_brief?.summary_text ? (
            <Text className="font-body-md text-on-surface-variant leading-relaxed mb-4">
              {dashboardData.daily_brief.summary_text}
            </Text>
          ) : (
            <Text className="font-body-md text-on-surface-variant leading-relaxed mb-4">
              You haven't generated a briefing today. Tap the refresh icon to let AI reflect on your recent memories!
            </Text>
          )}

          {/* Render Insights if any */}
          {dashboardData?.insights?.length > 0 && !isLoading && !isReflecting && (
            <View className="mt-2 border-t border-outline-variant/30 pt-3">
              <Text className="font-label-md text-secondary font-bold mb-2">AI Insights</Text>
              {dashboardData.insights.map((insight: any) => (
                <View key={insight.id} className="flex-row items-start gap-2 mb-2">
                  <MaterialCommunityIcons name="lightbulb-on" size={16} color={colors.tertiary} style={{marginTop: 2}} />
                  <Text className="font-body-sm text-on-surface-variant flex-1 leading-tight">{insight.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-xl -mx-margin-mobile px-margin-mobile" contentContainerStyle={{ gap: 8, paddingRight: 40 }}>
          <TouchableOpacity onPress={() => router.push('/(main)/(tabs)/ask')} className="flex-row items-center gap-2 px-lg py-3 bg-primary rounded-full">
            <MaterialIcons name="chat-bubble" size={20} color={colors['on-primary']} />
            <Text className="font-label-xs text-[14px] text-on-primary">Ask Anything</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(main)/capture/camera')} className="flex-row items-center gap-2 px-lg py-3 bg-surface-container-low border border-outline-variant rounded-full">
            <MaterialIcons name="document-scanner" size={20} color={colors['on-surface']} />
            <Text className="font-label-xs text-[14px] text-on-surface">Scan Doc</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(main)/capture/voice')} className="flex-row items-center gap-2 px-lg py-3 bg-surface-container-low border border-outline-variant rounded-full">
            <MaterialIcons name="mic" size={20} color={colors['on-surface']} />
            <Text className="font-label-xs text-[14px] text-on-surface">Voice Note</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(main)/capture/camera')} className="flex-row items-center gap-2 px-lg py-3 bg-surface-container-low border border-outline-variant rounded-full">
            <MaterialIcons name="photo-camera" size={20} color={colors['on-surface']} />
            <Text className="font-label-xs text-[14px] text-on-surface">Snap Photo</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Recent Memories */}
        <View className="mb-md flex-row justify-between items-end">
          <Text className="font-title-sm text-primary">Recent Memories</Text>
          <TouchableOpacity onPress={() => router.push('/(main)/(tabs)/recall')}>
            <Text className="text-secondary font-label-xs text-[13px]">See All</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-col md:flex-row gap-gutter mb-xl flex-wrap">
          {capturesLoading ? (
            <View className="w-full py-xl items-center justify-center">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : capturesData?.data?.length === 0 ? (
            <View className="w-full py-xl items-center justify-center bg-surface-container-low rounded-2xl border border-outline-variant/30 border-dashed">
              <Text className="text-on-surface-variant font-body-md">No recent memories found.</Text>
            </View>
          ) : (
            capturesData?.data?.slice(0, 3).map((capture: any) => (
              <TouchableOpacity key={capture.id} onPress={() => router.push(`/(main)/memory/${capture.id}`)} className="bg-white rounded-[24px] shadow-sm overflow-hidden flex-col w-full mb-4 border border-transparent">
                <View className="p-lg flex-row gap-3">
                  <View className="w-10 h-10 bg-secondary-container items-center justify-center rounded-xl">
                    <MaterialIcons name={capture.type === 'voice' ? 'mic' : capture.type === 'image' ? 'image' : 'edit-note'} size={20} color={colors['on-secondary-container']} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-label-xs text-[10px] text-on-surface-variant uppercase tracking-wider">{capture.type} Capture</Text>
                    <Text className="font-body-md font-bold text-primary mb-1" numberOfLines={1}>
                      {capture.title || (capture.content_text ? capture.content_text.substring(0, 40) : 'Media Capture')}
                    </Text>
                    <Text className="font-caption-sm text-on-surface-variant" numberOfLines={2}>{capture.summary || capture.content_text || 'View details'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
        
        {/* Ongoing Projects */}
        <Text className="font-title-sm text-primary mb-md">Ongoing Projects</Text>
        <View className="space-y-sm">
          <TouchableOpacity onPress={() => {}} className="bg-surface-container-low rounded-xl p-md flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm">
                <MaterialIcons name="folder-open" size={24} color={colors.primary} />
              </View>
              <View>
                <Text className="font-body-md font-bold text-primary">Redesign Project: Q3</Text>
                <Text className="font-caption-sm text-on-surface-variant">Active now</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </Screen>
  );
}
