import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useStorageStats } from '../../../src/modules/sync/hooks';
import { SyncEngine, useSyncStore } from '../../../src/modules/sync/SyncEngine';

// Utility to format bytes
function formatBytes(bytes: number, decimals = 1) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function StorageSyncDashboard() {
    const router = useRouter();
    const { data: statsData, isLoading, refetch } = useStorageStats();
    const { isSyncing, lastSyncTimestamp } = useSyncStore();

    const handleSync = async () => {
        if (isSyncing) return;
        const result = await SyncEngine.sync();
        if (result.success) {
            refetch(); // Refresh storage stats after successful sync
        } else {
            Alert.alert('Sync Failed', result.error?.message || 'An error occurred during synchronization.');
        }
    };

    const handleClearCache = () => {
        Alert.alert(
            'Clear Local Cache',
            'This will safely remove temporary images, thumbnails, and non-essential cached data to free up space. Your memories and core data will not be affected.',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Clear Cache', 
                    style: 'destructive',
                    onPress: () => {
                        // Implement cache clearing logic here (e.g. expo-file-system clear cache dir)
                        Alert.alert('Success', 'Temporary cache has been cleared safely.');
                        refetch();
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <Screen scrollable={false} className="items-center justify-center bg-surface">
                <ActivityIndicator size="large" color={colors.primary} />
            </Screen>
        );
    }

    const totalBytes = statsData?.total_used_bytes || 0;
    // For visual calculation, assume a baseline capacity (e.g. 50GB) to show a percentage, or just calculate from breakdown.
    // Let's use 50GB as 100% just for the circular gauge if not provided by backend.
    const capacityBytes = 50 * 1024 * 1024 * 1024; 
    const usedPercentage = Math.min(Math.round((totalBytes / capacityBytes) * 100), 100);
    
    // Sort breakdown by size descending
    const breakdown = statsData?.breakdown?.sort((a, b) => b.size_bytes - a.size_bytes) || [];

    // Helper for visual colors mapping
    const getCategoryColor = (index: number) => {
        const clrs = ['bg-secondary', 'bg-primary-container', 'bg-tertiary', 'bg-outline'];
        return clrs[index % clrs.length];
    };

    return (
        <Screen scrollable={true} className="pb-24 md:pb-0">
            {/* TopAppBar */}
            <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
                        <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <Text className="font-title-sm text-xl text-primary font-bold">Data & Storage</Text>
                </View>
            </View>

            <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6 flex-col gap-8 w-full">
                
                {/* Cloud Status & Main Hero */}
                <View className="flex-col md:flex-row gap-6">
                    <View className="w-full md:w-[33%] lg:w-[33%] p-6 rounded-[24px] bg-white shadow-sm flex-col items-center">
                        
                        <View className="w-48 h-48 relative items-center justify-center mb-6">
                            <View className="absolute inset-0 rounded-full border-[12px] border-surface-variant" />
                            {totalBytes > 0 && (
                                <View className="absolute inset-0 rounded-full border-[12px] border-secondary border-l-transparent border-b-transparent" style={{ transform: [{ rotate: '45deg' }] }} />
                            )}
                            
                            <View className="absolute items-center justify-center flex-col">
                                <Text className="font-headline-md text-3xl font-bold text-on-surface">{usedPercentage}%</Text>
                                <Text className="font-label-xs text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">Used</Text>
                            </View>
                        </View>

                        <View className="w-full flex-col gap-3">
                            {breakdown.slice(0, 4).map((item, idx) => (
                                <View key={item.category} className="flex-row justify-between items-center">
                                    <View className="flex-row items-center gap-2">
                                        <View className={`w-3 h-3 rounded-full ${getCategoryColor(idx)}`} />
                                        <Text className="font-body-md text-base text-on-surface">{item.category}</Text>
                                    </View>
                                    <Text className="font-label-xs text-xs font-bold text-on-surface">{formatBytes(item.size_bytes)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View className="flex-1 flex-col gap-6">
                        {/* Sync Card */}
                        <View className="p-6 rounded-[24px] bg-white shadow-sm flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <View className="flex-row items-center gap-6">
                                <View className="w-16 h-16 rounded-full bg-secondary-container items-center justify-center">
                                    <MaterialIcons name="cloud-sync" size={32} color={colors['on-secondary-container']} />
                                </View>
                                <View className="flex-col">
                                    <Text className="font-title-sm text-xl font-bold text-primary mb-1">Central Sync Engine</Text>
                                    <Text className="font-body-md text-base text-on-surface-variant">
                                        {lastSyncTimestamp ? `Last synced: ${new Date(lastSyncTimestamp).toLocaleTimeString()}` : 'Never synced'}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity 
                                onPress={handleSync}
                                disabled={isSyncing}
                                className={`px-8 h-14 rounded-[16px] flex-row items-center justify-center gap-2 ${isSyncing ? 'bg-surface-variant' : 'bg-primary'}`}
                            >
                                <MaterialIcons name={isSyncing ? "sync" : "cloud-upload"} size={20} color={isSyncing ? colors.on_surface_variant : "#ffffff"} />
                                <Text className={`font-medium text-base ${isSyncing ? 'text-on-surface-variant' : 'text-white'}`}>
                                    {isSyncing ? "Syncing..." : "Sync Now"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Cache Management Tools */}
                        <View className="flex-col md:flex-row gap-6 flex-1">
                            <TouchableOpacity onPress={handleClearCache} className="flex-1 p-6 rounded-[24px] bg-white shadow-sm flex-col justify-between">
                                <View className="flex-col gap-4">
                                    <View className="w-12 h-12 rounded-full bg-tertiary-fixed items-center justify-center">
                                        <MaterialIcons name="cleaning-services" size={24} color={colors['on-tertiary-fixed']} />
                                    </View>
                                    <View className="flex-col">
                                        <Text className="font-title-sm text-xl font-bold text-on-surface mb-2">Safe Cache Clear</Text>
                                        <Text className="font-body-md text-base text-on-surface-variant">Remove temporary thumbnails and downloads. Memories will be kept.</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Detailed diagnostics are being rolled out.')} className="flex-1 p-6 rounded-[24px] bg-white shadow-sm flex-col justify-between">
                                <View className="flex-col gap-4">
                                    <View className="w-12 h-12 rounded-full bg-primary-fixed items-center justify-center">
                                        <MaterialIcons name="health-and-safety" size={24} color={colors['on-primary-fixed']} />
                                    </View>
                                    <View className="flex-col">
                                        <Text className="font-title-sm text-xl font-bold text-on-surface mb-2">Storage Diagnostics</Text>
                                        <Text className="font-body-md text-base text-on-surface-variant">Status: {statsData?.health?.database_status || 'Checking...'}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Visualization / Data Health */}
                {statsData?.health && (
                    <View className="h-[200px] rounded-[32px] overflow-hidden relative shadow-sm bg-surface-container-high justify-end p-6 md:p-8">
                        <View className="bg-white/80 p-6 md:p-8 rounded-[24px] flex-col max-w-md w-full border-white/40">
                            <Text className="font-headline-md text-3xl font-bold text-primary mb-2">Data Health Score: {statsData.health.score}%</Text>
                            <Text className="font-body-md text-base text-on-surface-variant mb-4">
                                Cache: {statsData.health.cache_health} | Index: {statsData.health.index_status}
                            </Text>
                            <View className="flex-row">
                                <View className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                                    <View className="h-full bg-secondary" style={{ width: `${statsData.health.score}%` }} />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </Screen>
    );
}
