import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { TimelineCard } from '../../src/modules/timeline/components/TimelineCard';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/shared/store/useAuthStore';
import { useTimeline } from '../../src/shared/hooks/useTimeline';
import { format } from 'date-fns';
import { Capture } from '../../src/modules/captures/services/api';

export default function TimelineDailyLog() {
    const router = useRouter();
    const { user } = useAuthStore();

    // Get today's start and end for filtering
    const filters = useMemo(() => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return {
            start_date: start.toISOString(),
            end_date: end.toISOString()
        };
    }, []);

    const { data, isLoading } = useTimeline(filters);

    const flattenedData = useMemo(() => {
        if (!data) return [];
        return data.pages.flatMap(page => page.data || []);
    }, [data]);

    const handleCardPress = React.useCallback((c: Capture) => {
        router.push(`/(main)/memory/${c.id}` as any);
    }, [router]);

    return (
        <Screen scrollable={false}>
            {/* Top Header */}
            <View className="bg-surface z-50 h-16 w-full flex-row items-center justify-between px-margin-mobile">
                <View className="flex-row items-center gap-md">
                    <MaterialIcons 
                        name="arrow-back" 
                        size={24} 
                        color={colors.primary} 
                        onPress={() => router.back()}
                    />
                    <Text className="font-title-sm font-bold text-primary">YRecall</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/(main)/profile-edit' as any)} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center overflow-hidden">
                    {user?.photoURL ? (
                        <Image source={{ uri: user.photoURL }} className="w-full h-full" />
                    ) : (
                        <MaterialIcons name="person" size={24} color={colors.primary} />
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 w-full max-w-4xl mx-auto px-margin-mobile pt-lg" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Today Header */}
                <View className="mb-xl">
                    <Text className="font-label-xs text-secondary uppercase tracking-widest mb-xs">Today</Text>
                    <Text className="font-headline-md text-primary font-bold">{format(new Date(), 'EEEE, MMMM d')}</Text>
                </View>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center pt-10">
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : flattenedData.length === 0 ? (
                    <View className="items-center justify-center pt-20">
                        <MaterialIcons name="history" size={64} color={colors.outline} className="mb-4 opacity-50" />
                        <Text className="font-title-sm text-on-surface-variant text-center">No memories today.</Text>
                    </View>
                ) : (
                    <View className="relative flex-col gap-xl">
                        {/* Vertical Line */}
                        <View className="absolute left-[16px] top-4 bottom-0 w-[2px] bg-surface-variant z-0" />

                        {flattenedData.map((capture: Capture, index: number) => {
                            let icon = 'edit-note';
                            if (capture.type === 'voice') icon = 'mic';
                            if (capture.type === 'image' || capture.type === 'camera') icon = 'image';
                            
                            return (
                                <View key={capture.id || index} className="flex-row w-full mb-6">
                                    <View className="z-10 w-[34px] items-center mr-4 mt-2">
                                        <View className="w-8 h-8 rounded-full bg-white items-center justify-center shadow-sm border border-surface-variant">
                                            <MaterialIcons name={icon as any} size={16} color={colors.primary} />
                                        </View>
                                    </View>
                                    <View className="flex-1">
                                        <TimelineCard capture={capture} onPress={handleCardPress} />
                                    </View>
                                </View>
                            );
                        })}

                        {/* End of Timeline */}
                        <View className="items-center py-xl">
                            <MaterialIcons name="expand-more" size={24} color={colors.outline} className="mb-2" />
                            <Text className="font-label-xs text-outline uppercase">End of today's recall</Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </Screen>
    );
}
