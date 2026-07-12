import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useTimeline } from '../../../src/shared/hooks/useTimeline';
import { HorizontalDateNavigator } from '../../../src/modules/timeline/components/HorizontalDateNavigator';
import { TextInput, ScrollView } from 'react-native';
import { TimelineCard } from '../../../src/modules/timeline/components/TimelineCard';
import { Capture } from '../../../src/modules/captures/services/api';
import { isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { useWorkspaceStore } from '../../../src/modules/workspaces/store';

interface TimelineSection {
  type: 'header' | 'item';
  title?: string;
  capture?: any;
}

export default function RecallScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const { activeWorkspaceId } = useWorkspaceStore();

  const [activeSegment, setActiveSegment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const filters = useMemo(() => {
    const f: any = {};
    if (activeSegment !== 'All') f.type = activeSegment.toLowerCase();
    if (searchQuery.trim().length > 0) f.search = searchQuery;
    if (selectedDate) {
      // Need ISO strings
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);
      f.start_date = start.toISOString();
      f.end_date = end.toISOString();
    }
    if (activeWorkspaceId) {
      f.workspace_id = activeWorkspaceId;
    }
    return f;
  }, [activeSegment, searchQuery, selectedDate, activeWorkspaceId]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching
  } = useTimeline(filters);

  // Grouping logic ... (same as before)
  const flattenedData = useMemo(() => {
    // ...
    if (!data) return [];
    const items = data.pages.flatMap(page => page.data || []);
    const grouped: Record<string, Capture[]> = {
      'Today': [], 'Yesterday': [], 'This Week': [], 'This Month': [], 'Earlier': []
    };
    items.forEach((item: Capture) => {
      const date = new Date(item.created_at);
      if (isToday(date)) grouped['Today']!.push(item);
      else if (isYesterday(date)) grouped['Yesterday']!.push(item);
      else if (isThisWeek(date)) grouped['This Week']!.push(item);
      else if (isThisMonth(date)) grouped['This Month']!.push(item);
      else grouped['Earlier']!.push(item);
    });
    const result: TimelineSection[] = [];
    ['Today', 'Yesterday', 'This Week', 'This Month', 'Earlier'].forEach(key => {
      if (grouped[key]!.length > 0) {
        result.push({ type: 'header', title: key });
        grouped[key]!.forEach(capture => result.push({ type: 'item', capture }));
      }
    });
    return result;
  }, [data]);

  const handleCardPress = React.useCallback((c: Capture) => {
    router.push(`/(main)/memory/${c.id}` as any);
  }, [router]);

  const renderItem = ({ item }: { item: TimelineSection }) => {
    // ...
    if (item.type === 'header') {
      return (
        <View className="py-4 mt-2">
          <Text className="font-title-sm text-on-surface-variant font-bold">{item.title}</Text>
        </View>
      );
    }
    return (
      <TimelineCard 
        capture={item.capture} 
        onPress={handleCardPress} 
      />
    );
  };

  return (
    <Screen scrollable={false}>
      {/* Top Header */}
      <View className="bg-surface/80 z-50 h-20 w-full flex-row items-center justify-between px-margin-mobile">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.push('/(main)/profile-edit' as any)} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center border border-outline-variant/20 overflow-hidden">
             {user?.photoURL ? (
               <Image source={{ uri: user.photoURL }} className="w-full h-full" />
             ) : (
               <MaterialIcons name="person" size={24} color={colors.primary} />
             )}
          </TouchableOpacity>
          <Text className="font-display-lg-mobile text-[36px] font-bold text-primary tracking-tight">Timeline</Text>
        </View>
      </View>

      <View className="flex-1 w-full max-w-7xl mx-auto">
        {/* Search Bar */}
        <View className="px-margin-mobile mb-2">
          <View className="flex-row items-center h-12 bg-surface-container-low rounded-2xl px-4 border border-outline-variant/30">
            <MaterialIcons name="search" size={20} color={colors['on-surface-variant']} />
            <TextInput 
              placeholder="Search timeline..."
              placeholderTextColor={colors['on-surface-variant']}
              className="flex-1 ml-2 font-body-lg text-on-surface"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={20} color={colors['on-surface-variant']} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Date Navigator */}
        <HorizontalDateNavigator 
          selectedDate={selectedDate} 
          onSelectDate={setSelectedDate} 
        />

        {/* Type Filter Chips */}
        <View className="mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
            {['All', 'Image', 'Voice', 'Note', 'URL', 'Document', 'Automation'].map((segment) => {
              const isActive = activeSegment === segment;
              return (
              <TouchableOpacity 
                key={segment}
                onPress={() => setActiveSegment(segment)} 
                className={`px-4 py-2 rounded-full border ${isActive ? 'bg-primary border-primary' : 'bg-surface-container border-outline-variant/30'}`}
              >
                <Text className={`font-label-md font-medium ${isActive ? 'text-on-primary' : 'text-on-surface-variant'}`}>{segment}</Text>
              </TouchableOpacity>
            )})}
          </ScrollView>
        </View>

        {/* Timeline Feed */}
        <View className="flex-1">
          {isLoading && !isRefetching ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlashList
              data={flattenedData}
              renderItem={renderItem}
              keyExtractor={(item: any, index) => item.type === 'header' ? `header-${item.title}` : `item-${item.capture.id}`}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              onRefresh={refetch}
              refreshing={isRefetching}
              ListEmptyComponent={
                <View className="items-center justify-center pt-20">
                  <MaterialIcons name="history" size={64} color={colors.outline} className="mb-4 opacity-50" />
                  <Text className="font-title-sm text-on-surface-variant text-center">No memories found.</Text>
                  <Text className="font-body-md text-on-surface-variant/70 text-center mt-2 max-w-[250px]">
                    Capture your first memory to see it appear here in your timeline.
                  </Text>
                </View>
              }
              ListFooterComponent={
                isFetchingNextPage ? (
                  <View className="py-4 items-center justify-center">
                    <ActivityIndicator color={colors.primary} />
                  </View>
                ) : null
              }
              {...({
                estimatedItemSize: 150,
              } as any)}
            />
          )}
        </View>
      </View>
    </Screen>
  );
}
