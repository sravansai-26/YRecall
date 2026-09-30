import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, Modal } from 'react-native';
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
import { useTranslation } from 'react-i18next';
import { Calendar } from 'react-native-calendars';

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
    const { t } = useTranslation();

    const [activeSegment, setActiveSegment] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

    const [calendarDisplayDate, setCalendarDisplayDate] = useState<string>(new Date().toISOString().split('T')[0] as string);
    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
    const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentYear = new Date().getFullYear();
    const startYear = 2026;
    const endYear = Math.max(currentYear + 10, 2036);
    const years = Array.from({length: endYear - startYear + 1}, (_, i) => startYear + i);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching
    } = useTimeline(filters);

    const flattenedData = useMemo(() => {
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
        if (item.type === 'header') {
            let localizedTitle = item.title;
            if (item.title === 'Today') localizedTitle = t('timeline.today', 'Today');
            if (item.title === 'Yesterday') localizedTitle = t('timeline.yesterday', 'Yesterday');
            if (item.title === 'This Week') localizedTitle = t('timeline.thisWeek', 'This Week');
            if (item.title === 'This Month') localizedTitle = t('timeline.thisMonth', 'This Month');
            if (item.title === 'Earlier') localizedTitle = t('timeline.earlier', 'Earlier');

            return (
                <View className="py-4 mt-2">
                    <Text className="font-title-sm text-on-surface-variant font-bold">{localizedTitle}</Text>
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

    const segmentTitles: Record<string, string> = {
        'All': t('timeline.filters.all', 'All'),
        'Image': t('timeline.filters.image', 'Image'),
        'Voice': t('timeline.filters.voice', 'Voice'),
        'Note': t('timeline.filters.note', 'Note'),
        'URL': t('timeline.filters.url', 'URL'),
        'Document': t('timeline.filters.document', 'Document'),
        'Automation': t('timeline.filters.automation', 'Automation')
    };

    return (
        <Screen scrollable={false}>
            {/* Top Header */}
            <View className="bg-surface/80 z-50 h-20 w-full flex-row items-center justify-between px-margin-mobile">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => router.push('/(main)/profile-edit' as any)} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center overflow-hidden">
                        {user?.photoURL ? (
                            <Image source={{ uri: user.photoURL }} className="w-full h-full" />
                        ) : (
                            <MaterialIcons name="person" size={24} color={colors.primary} />
                        )}
                    </TouchableOpacity>
                    <Text className="font-display-lg-mobile text-[36px] font-bold text-primary tracking-tight">{t('tabs.timeline', 'Timeline')}</Text>
                </View>
            </View>

            <View className="flex-1 w-full max-w-7xl mx-auto">
                {/* Search Bar & Calendar Picker */}
                <View className="px-margin-mobile mb-2">
                    <View className="flex-row items-center gap-2">
                        <View className="flex-1 flex-row items-center h-12 bg-surface-container-low rounded-2xl px-4">
                            <MaterialIcons name="search" size={20} color={colors['on-surface-variant']} />
                            <TextInput
                                placeholder={t('timeline.searchPlaceholder', 'Search timeline...')}
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
                        <TouchableOpacity 
                            onPress={() => setIsCalendarOpen(true)}
                            className="w-12 h-12 bg-surface-container-low rounded-2xl items-center justify-center border"
                            style={{ borderColor: selectedDate ? colors.primary : 'transparent' }}
                        >
                            <MaterialIcons name="calendar-today" size={20} color={selectedDate ? colors.primary : colors['on-surface-variant']} />
                        </TouchableOpacity>
                    </View>
                </View>

                {selectedDate && (
                    <View className="px-margin-mobile mb-2 flex-row justify-end">
                        <TouchableOpacity 
                            onPress={() => setSelectedDate(null)} 
                            className="flex-row items-center gap-1 bg-error/10 px-3 py-1.5 rounded-full"
                        >
                            <MaterialIcons name="clear" size={14} color={colors.error} />
                            <Text className="font-label-sm text-error">Clear Date</Text>
                        </TouchableOpacity>
                    </View>
                )}

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
                                    className={`px-4 py-2 rounded-full ${isActive ? 'bg-primary' : 'bg-surface-container'}`}
                                >
                                    <Text className={`font-label-md font-medium ${isActive ? 'text-on-primary' : 'text-on-surface-variant'}`}>{segmentTitles[segment]}</Text>
                                </TouchableOpacity>
                            )
                        })}
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
                                    <Text className="font-title-sm text-on-surface-variant text-center">{t('timeline.emptyTitle', 'No memories found.')}</Text>
                                    <Text className="font-body-md text-on-surface-variant/70 text-center mt-2 max-w-[250px]">
                                        {t('timeline.emptyDesc', 'Capture your first memory to see it appear here in your timeline.')}
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

            {/* Calendar Modal */}
            <Modal visible={isCalendarOpen} transparent animationType="fade">
                <View className="flex-1 justify-center bg-black/50 px-4">
                    <View className="bg-surface rounded-3xl overflow-hidden p-4 shadow-xl">
                        <View className="flex-row justify-between items-center mb-4 px-2">
                            <Text className="font-title-md text-on-surface">Select Date</Text>
                            <TouchableOpacity onPress={() => setIsCalendarOpen(false)} className="p-1">
                                <MaterialIcons name="close" size={24} color={colors['on-surface-variant']} />
                            </TouchableOpacity>
                        </View>
                        
                        {/* Month / Year Dropdowns */}
                        <View className="flex-row gap-2 mb-4 px-2 z-50">
                            <View className="flex-1 relative z-50">
                                <TouchableOpacity 
                                    onPress={() => { setIsMonthPickerOpen(!isMonthPickerOpen); setIsYearPickerOpen(false); }}
                                    className="flex-row justify-between items-center bg-surface-container-low p-3 rounded-xl border border-outline-variant/50"
                                >
                                    <Text className="text-on-surface font-medium">{months[new Date(calendarDisplayDate as string).getMonth()]}</Text>
                                    <MaterialIcons name="arrow-drop-down" size={20} color={colors['on-surface-variant']} />
                                </TouchableOpacity>
                                {isMonthPickerOpen && (
                                    <View className="absolute top-[105%] left-0 right-0 bg-surface-container-high rounded-xl shadow-lg border border-outline-variant/30 max-h-40 overflow-hidden z-50">
                                        <ScrollView nestedScrollEnabled>
                                            {months.map((m, i) => (
                                                <TouchableOpacity 
                                                    key={m} 
                                                    onPress={() => {
                                                        const d = new Date(calendarDisplayDate as string);
                                                        d.setMonth(i);
                                                        setCalendarDisplayDate(d.toISOString().split('T')[0] as string);
                                                        setIsMonthPickerOpen(false);
                                                    }}
                                                    className="p-3 border-b border-outline-variant/10"
                                                >
                                                    <Text className="text-on-surface">{m}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>
                            <View className="flex-1 relative z-50">
                                <TouchableOpacity 
                                    onPress={() => { setIsYearPickerOpen(!isYearPickerOpen); setIsMonthPickerOpen(false); }}
                                    className="flex-row justify-between items-center bg-surface-container-low p-3 rounded-xl border border-outline-variant/50"
                                >
                                    <Text className="text-on-surface font-medium">{new Date(calendarDisplayDate as string).getFullYear()}</Text>
                                    <MaterialIcons name="arrow-drop-down" size={20} color={colors['on-surface-variant']} />
                                </TouchableOpacity>
                                {isYearPickerOpen && (
                                    <View className="absolute top-[105%] left-0 right-0 bg-surface-container-high rounded-xl shadow-lg border border-outline-variant/30 max-h-40 overflow-hidden z-50">
                                        <ScrollView nestedScrollEnabled>
                                            {years.map((y) => (
                                                <TouchableOpacity 
                                                    key={y} 
                                                    onPress={() => {
                                                        const d = new Date(calendarDisplayDate as string);
                                                        d.setFullYear(y);
                                                        setCalendarDisplayDate(d.toISOString().split('T')[0] as string);
                                                        setIsYearPickerOpen(false);
                                                    }}
                                                    className="p-3 border-b border-outline-variant/10"
                                                >
                                                    <Text className="text-on-surface">{y}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View className="z-10 relative">
                        <Calendar
                            current={calendarDisplayDate}
                            onMonthChange={(month: any) => {
                                setCalendarDisplayDate(month.dateString);
                            }}
                            onDayPress={(day: any) => {
                                // Add timezone offset so the date parses locally
                                const offset = new Date().getTimezoneOffset() * 60000;
                                const localDate = new Date(day.timestamp + offset);
                                setSelectedDate(localDate);
                                setIsCalendarOpen(false);
                            }}
                            markedDates={
                                selectedDate
                                    ? {
                                          [new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] as string]: {
                                              selected: true,
                                              selectedColor: colors.primary,
                                          },
                                      }
                                    : {}
                            }
                            theme={{
                                calendarBackground: 'transparent',
                                textSectionTitleColor: colors['on-surface-variant'],
                                selectedDayBackgroundColor: colors.primary,
                                selectedDayTextColor: colors['on-primary'],
                                todayTextColor: colors.primary,
                                dayTextColor: colors['on-surface'],
                                textDisabledColor: colors['on-surface-variant'] + '50',
                                arrowColor: colors.primary,
                                monthTextColor: colors['on-surface'],
                            }}
                        />
                        </View>
                        <View className="mt-4 flex-row justify-end gap-2 px-2 z-10">
                            {selectedDate && (
                                <TouchableOpacity 
                                    onPress={() => {
                                        setSelectedDate(null);
                                        setIsCalendarOpen(false);
                                    }}
                                    className="p-3 bg-error/10 rounded-xl px-6"
                                >
                                    <Text className="text-error font-label-md">Clear</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </Screen>
    );
}
