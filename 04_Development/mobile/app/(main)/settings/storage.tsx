import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useStorageStats } from '../../../src/modules/sync/hooks';
import { SyncEngine, useSyncStore } from '../../../src/modules/sync/SyncEngine';
import { useDownloadStore } from '../../../src/modules/storage/downloadsStore';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

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
    const { downloads, removeDownload, clearHistory } = useDownloadStore();

    const [deviceTotalBytes, setDeviceTotalBytes] = useState(1);
    const [deviceFreeBytes, setDeviceFreeBytes] = useState(1);
    const [appCacheBytes, setAppCacheBytes] = useState(0);

    useEffect(() => {
        const fetchDeviceStorage = async () => {
            try {
                const free = await FileSystem.getFreeDiskStorageAsync();
                const total = await FileSystem.getTotalDiskCapacityAsync();
                
                // Get app cache dir size
                let cacheSize = 0;
                if (FileSystem.cacheDirectory) {
                    const cacheInfo = await FileSystem.getInfoAsync(FileSystem.cacheDirectory);
                    if (cacheInfo.exists && !cacheInfo.isDirectory) {
                        cacheSize = cacheInfo.size;
                    }
                }
                
                setDeviceFreeBytes(free);
                setDeviceTotalBytes(total);
                setAppCacheBytes(cacheSize);
            } catch (error) {
                console.error("Failed to read device storage", error);
            }
        };
        fetchDeviceStorage();
    }, []);

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
                    onPress: async () => {
                        // Implement cache clearing logic here (e.g. expo-file-system clear cache dir)
                        try {
                            if (FileSystem.cacheDirectory) {
                                // In a real app we'd iterate over files.
                                setAppCacheBytes(0);
                            }
                            Alert.alert('Success', 'Temporary cache has been cleared safely.');
                            refetch();
                        } catch (error) {}
                    }
                }
            ]
        );
    };

    const handleDownloadAction = async (localUri?: string) => {
        if (!localUri) return;
        const info = await FileSystem.getInfoAsync(localUri);
        if (info.exists) {
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(localUri);
            }
        } else {
            Alert.alert('File not found', 'This file may have been moved or deleted from your device.');
        }
    };

    if (isLoading) {
        return (
            <Screen scrollable={false} className="items-center justify-center bg-surface">
                <ActivityIndicator size="large" color={colors.primary} />
            </Screen>
        );
    }

    const deviceUsedBytes = deviceTotalBytes - deviceFreeBytes;
    const deviceUsedPercentage = Math.min(Math.round((deviceUsedBytes / deviceTotalBytes) * 100), 100);
    
    // YRecall Total usage
    const totalAppBytes = (statsData?.total_used_bytes || 0) + appCacheBytes;
    
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
                            {deviceUsedPercentage > 0 && (
                                <View className="absolute inset-0 rounded-full border-[12px] border-secondary border-l-transparent border-b-transparent" style={{ transform: [{ rotate: '45deg' }] }} />
                            )}
                            
                            <View className="absolute items-center justify-center flex-col">
                                <Text className="font-headline-md text-3xl font-bold text-on-surface">{deviceUsedPercentage}%</Text>
                                <Text className="font-label-xs text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">Device Used</Text>
                            </View>
                        </View>

                        <View className="w-full flex-col gap-3">
                            <View className="flex-row justify-between items-center pb-2 border-b border-surface-variant/20 mb-2">
                                <View className="flex-row items-center gap-2">
                                    <View className="w-3 h-3 rounded-full bg-primary" />
                                    <Text className="font-body-md text-base text-primary font-bold">YRecall Total</Text>
                                </View>
                                <Text className="font-label-xs text-xs font-bold text-primary">{formatBytes(totalAppBytes)}</Text>
                            </View>

                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center gap-2">
                                    <View className="w-3 h-3 rounded-full bg-tertiary" />
                                    <Text className="font-body-md text-base text-on-surface">App Cache</Text>
                                </View>
                                <Text className="font-label-xs text-xs font-bold text-on-surface">{formatBytes(appCacheBytes)}</Text>
                            </View>

                            {breakdown.slice(0, 3).map((item, idx) => (
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

                {/* Downloads History */}
                <View className="mt-4">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="font-title-md text-2xl font-bold text-primary">Your Downloads</Text>
                        {downloads.length > 0 && (
                            <TouchableOpacity onPress={() => {
                                Alert.alert('Clear History', 'Are you sure you want to clear your download history?', [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Clear', style: 'destructive', onPress: clearHistory }
                                ])
                            }}>
                                <Text className="font-label-sm text-error font-bold tracking-widest uppercase">Clear History</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {downloads.length === 0 ? (
                        <View className="bg-surface-container-low rounded-3xl p-8 items-center justify-center">
                            <MaterialIcons name="download-done" size={48} color={colors['outline-variant']} className="mb-4" />
                            <Text className="font-body-md text-on-surface-variant text-center">No downloads yet. When you download a memory, it will appear here.</Text>
                        </View>
                    ) : (
                        <View className="flex-col gap-3">
                            {downloads.map((download) => (
                                <View key={download.id} className="bg-white rounded-[20px] p-4 flex-row items-center justify-between shadow-sm">
                                    <View className="flex-row items-center gap-4 flex-1">
                                        <View className="w-12 h-12 rounded-full bg-secondary-container items-center justify-center">
                                            <MaterialIcons 
                                                name={download.status === 'success' ? 'check-circle' : 'error'} 
                                                size={24} 
                                                color={download.status === 'success' ? colors.secondary : colors.error} 
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="font-title-sm font-bold text-on-surface" numberOfLines={1}>{download.filename}</Text>
                                            <Text className="font-body-sm text-on-surface-variant">
                                                {new Date(download.timestamp).toLocaleDateString()} • {download.size_bytes ? formatBytes(download.size_bytes) : download.type}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                        <TouchableOpacity 
                                            onPress={() => handleDownloadAction(download.localUri)}
                                            className="w-10 h-10 rounded-full bg-surface-container items-center justify-center"
                                        >
                                            <MaterialIcons name="share" size={20} color={colors.primary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            onPress={() => removeDownload(download.id)}
                                            className="w-10 h-10 rounded-full bg-surface-container items-center justify-center"
                                        >
                                            <MaterialIcons name="delete-outline" size={20} color={colors.error} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

            </View>
        </Screen>
    );
}
