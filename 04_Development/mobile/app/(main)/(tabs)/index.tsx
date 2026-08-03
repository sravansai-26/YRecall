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
import { useWorkspaceStore } from '../../../src/modules/workspaces/store';
import { useWorkspaces } from '../../../src/modules/workspaces/api';
import { useTranslation } from 'react-i18next';
import { TimelineCard } from '../../../src/modules/timeline/components/TimelineCard';

export default function HomeDashboard() {
 const router = useRouter();
 const { user } = useAuthStore();
 const [backPressCount, setBackPressCount] = useState(0);
 const { activeWorkspaceId } = useWorkspaceStore();
 const { data: workspaces } = useWorkspaces();
 const { t } = useTranslation();
 
 const activeWorkspace = activeWorkspaceId ? workspaces?.find(w => w.id === activeWorkspaceId) : null;

 const getGreeting = () => {
 try {
 const formatter = new Intl.DateTimeFormat('en-US', {
 hour: 'numeric',
 hour12: false,
 timeZone: 'Asia/Kolkata',
 });
 const hour = parseInt(formatter.format(new Date()), 10);
 if (hour < 12) return t('home.morning', 'Good Morning,');
 if (hour < 17) return t('home.afternoon', 'Good Afternoon,');
 return t('home.evening', 'Good Evening,');
 } catch (e) {
 const hour = new Date().getHours();
 if (hour < 12) return t('home.morning', 'Good Morning,');
 if (hour < 17) return t('home.afternoon', 'Good Afternoon,');
 return t('home.evening', 'Good Evening,');
 }
 };

 const { data: dashboardData, isLoading, refetch, isRefetching } = useDashboard(activeWorkspaceId);
 const { mutate: generateReflection, isPending: isReflecting } = useGenerateReflection();
 const { data: notificationsData } = useNotifications();

 const { data: capturesData, isLoading: capturesLoading } = useQuery({
 queryKey: ['captures', 'recent', activeWorkspaceId],
 queryFn: async () => {
 const params = activeWorkspaceId ? `&workspace_id=${activeWorkspaceId}` : '';
 const res = await apiClient.get(`/captures?limit=3${params}`);
 return res.data;
 },
 staleTime: 60000,
 });

 const unreadCount = notificationsData?.meta?.unread_count || 0;

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
 <TouchableOpacity onPress={() => router.push('/(main)/workspaces' as any)} className="flex-col">
 <Text className="font-label-xs text-on-surface-variant">{getGreeting()}</Text>
 <View className="flex-row items-center gap-1">
 <Text className="font-title-sm text-[16px] font-bold text-primary">
 {activeWorkspace ? activeWorkspace.name : (user?.displayName?.split(' ')[0] || 'User')}
 </Text>
 <MaterialIcons name="keyboard-arrow-down" size={16} color={colors.primary} />
 </View>
 </TouchableOpacity>
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
 <Text className="font-headline-md text-[20px] text-primary">{t('home.briefing', "Today's Briefing")}</Text>
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
 <Text className="font-body-sm text-on-surface-variant mt-2">{t('home.analyzing', 'AI is analyzing your memories...')}</Text>
 </View>
 ) : dashboardData?.daily_brief?.summary_text ? (
 <Text className="font-body-md text-on-surface-variant leading-relaxed mb-4">
 {dashboardData.daily_brief.summary_text}
 </Text>
 ) : (
 <Text className="font-body-md text-on-surface-variant leading-relaxed mb-4">
 {t('home.noBriefing', "You haven't generated a briefing today. Tap the refresh icon to let AI reflect on your recent memories!")}
 </Text>
 )}

 {/* Render Insights if any */}
 {dashboardData?.insights?.length > 0 && !isLoading && !isReflecting && (
 <View className="mt-2 pt-3 border-t border-outline-variant/30">
 <Text className="font-label-md text-secondary font-bold mb-2">{t('home.insights', 'AI Insights')}</Text>
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
 <Text className="font-label-xs text-[14px] text-on-primary">{t('home.ask', 'Ask Anything')}</Text>
 </TouchableOpacity>
 <TouchableOpacity onPress={() => router.push('/(main)/capture/camera?mode=scan')} className="flex-row items-center gap-2 px-lg py-3 bg-surface-container-low rounded-full">
 <MaterialIcons name="document-scanner" size={20} color={colors['on-surface']} />
 <Text className="font-label-xs text-[14px] text-on-surface">{t('home.scan', 'Scan Doc')}</Text>
 </TouchableOpacity>
 <TouchableOpacity onPress={() => router.push('/(main)/capture/voice')} className="flex-row items-center gap-2 px-lg py-3 bg-surface-container-low rounded-full">
 <MaterialIcons name="mic" size={20} color={colors['on-surface']} />
 <Text className="font-label-xs text-[14px] text-on-surface">{t('home.voice', 'Voice Note')}</Text>
 </TouchableOpacity>
 <TouchableOpacity onPress={() => router.push('/(main)/capture/camera')} className="flex-row items-center gap-2 px-lg py-3 bg-surface-container-low rounded-full">
 <MaterialIcons name="photo-camera" size={20} color={colors['on-surface']} />
 <Text className="font-label-xs text-[14px] text-on-surface">{t('home.snap', 'Snap Photo')}</Text>
 </TouchableOpacity>
 </ScrollView>

 {/* Recent Memories */}
 <View className="mb-md flex-row justify-between items-end">
 <Text className="font-title-sm text-primary">{t('home.recent', 'Recent Memories')}</Text>
 <TouchableOpacity onPress={() => router.push('/(main)/(tabs)/recall')}>
 <Text className="text-secondary font-label-xs text-[13px]">{t('home.seeAll', 'See All')}</Text>
 </TouchableOpacity>
 </View>

 <View className="flex-col w-full mb-xl">
 {capturesLoading ? (
 <View className="w-full py-xl items-center justify-center">
 <ActivityIndicator color={colors.primary} />
 </View>
 ) : capturesData?.data?.length === 0 ? (
 <View className="w-full py-xl items-center justify-center bg-surface-container-low rounded-2xl border-dashed">
 <Text className="text-on-surface-variant font-body-md">{t('home.noMemories', 'No recent memories found.')}</Text>
 </View>
 ) : (
 capturesData?.data?.slice(0, 3).map((capture: any) => (
  <TimelineCard 
    key={capture.id}
    capture={capture}
    onPress={() => router.push(`/(main)/memory/${capture.id}` as any)}
  />
 ))
 )}
 </View>
 {/* Automation Reminders / Tasks */}
 <View className="flex-row justify-between items-end mb-md">
 <Text className="font-title-sm text-primary">{t('home.pending', 'Pending Tasks')}</Text>
 <TouchableOpacity onPress={() => router.push('/(main)/automation' as any)}>
 <Text className="text-secondary font-label-xs text-[13px]">{t('home.manageAll', 'Manage All')}</Text>
 </TouchableOpacity>
 </View>
 <View className="space-y-sm mb-10">
 {dashboardData?.reminders?.length === 0 ? (
 <View className="py-4 items-center">
 <Text className="font-body-md text-on-surface-variant">No pending tasks.</Text>
 </View>
 ) : (
 dashboardData?.reminders?.map((reminder: any) => (
 <TouchableOpacity key={reminder.id} className="bg-surface-container-low rounded-xl p-md flex-row items-center justify-between mb-2">
 <View className="flex-row items-center gap-4">
 <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
 <MaterialIcons name="check-box-outline-blank" size={20} color={colors.primary} />
 </View>
 <View>
 <Text className="font-body-md font-bold text-primary">{reminder.title}</Text>
 {reminder.due_date ? (
 <Text className="font-caption-sm text-on-surface-variant">Due: {new Date(reminder.due_date).toLocaleDateString()}</Text>
 ) : (
 <Text className="font-caption-sm text-on-surface-variant">No due date</Text>
 )}
 </View>
 </View>
 </TouchableOpacity>
 ))
 )}
 </View>

 </ScrollView>
 </Screen>
 );
}
