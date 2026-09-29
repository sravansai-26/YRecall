import { View, Text, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useMigrationJobs, useCreateExport, useDeleteMigrationJob } from '../../../src/modules/migration/api';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { env } from '../../../src/config/env';
import { auth } from '../../../src/shared/lib/firebase';

export default function MigrationHub() {
    const router = useRouter();
    const { data: jobs, isLoading: isLoadingJobs } = useMigrationJobs();
    const createExport = useCreateExport();
    const deleteJob = useDeleteMigrationJob();
    
    const [exportFormat, setExportFormat] = useState('ZIP');

    const handleCreateExport = () => {
        createExport.mutate(
            { categories: ['memories', 'timeline', 'settings'], archive_format: exportFormat, compression_type: 'gzip' },
            {
                onSuccess: () => {
                    Alert.alert('Export Started', 'Your export is being generated in the background. You can track its progress in the History section.');
                },
                onError: (err) => {
                    Alert.alert('Export Failed', err.message || 'An error occurred.');
                }
            }
        );
    };

    const handleDriveSync = () => {
        Alert.alert(
            'Google Drive Sync',
            'Your Google Drive is currently connected. YRecall is actively listening to changes via Push Notifications.\n\nLatest sync: 2 minutes ago.',
            [{ text: 'Force Sync Now', onPress: () => Alert.alert('Sync queued', 'A manual sync has been triggered.') }, { text: 'Cancel', style: 'cancel' }]
        );
    };

    const handleDownload = async (fileUrl: string, format: string) => {
        try {
            if (!fileUrl) throw new Error('File URL is missing.');
            
            // In dev mode with local files, fileUrl might be something like file:///...
            // In prod it will be https://...
            // We can download it using expo-file-system
            
            const filename = `yrecall_export_${Date.now()}.${format.toLowerCase()}`;
            const destPath = `${FileSystem.documentDirectory}${filename}`;
            
            let downloadUrl = fileUrl;
            
            // Handle legacy backend paths (e.g. file:///tmp/yrecall_exports/export_xxx.json)
            if (fileUrl.startsWith('file://')) {
                const parts = fileUrl.split(/[\/\\]/);
                const rawFilename = parts[parts.length - 1];
                downloadUrl = `${env.apiUrl}/migration/download/${rawFilename}`;
            } else if (!fileUrl.startsWith('http')) {
                // If it's just a filename (e.g., export_d10e...json), prepend the download endpoint
                downloadUrl = `${env.apiUrl}/migration/download/${fileUrl}`;
            }

            // Remote, download it via HTTP
            const token = await auth.currentUser?.getIdToken();
            const result = await FileSystem.downloadAsync(downloadUrl, destPath, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (result.status !== 200) throw new Error('Download failed. Make sure you are authenticated.');
            
            // Share or Save
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(destPath, { dialogTitle: 'Save Export Data' });
            } else {
                Alert.alert('Download Complete', `File saved to ${destPath}`);
            }
        } catch (error: any) {
            Alert.alert('Download Error', error.message || 'Unable to download file.');
        }
    };

    return (
        <Screen scrollable={true} className="pb-24">
            {/* TopAppBar */}
            <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
                        <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <Text className="font-title-sm text-xl text-primary font-bold">Data Portability & Migration</Text>
                </View>
            </View>

            <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6">
                
                {/* Welcome Header */}
                <View className="mb-8">
                    <Text className="font-display-lg-mobile md:font-display-lg text-4xl font-bold text-primary mb-4">Bring your world to YRecall</Text>
                    <Text className="font-body-md text-base text-on-surface-variant max-w-2xl mb-6">
                        Consolidate your digital existence. Connect your primary knowledge bases and let the AI life OS weave your memories together.
                    </Text>
                </View>

                {/* Sources Bento Grid (Preserved) */}
                <View className="flex-col md:flex-row md:flex-wrap gap-4 md:gap-6">
                    
                    {/* Google Drive (Connected) */}
                    <TouchableOpacity onPress={handleDriveSync} className="w-full md:flex-1 bg-white p-6 rounded-[24px] shadow-sm flex-col justify-between active:scale-[0.98]">
                        <View className="flex-row justify-between items-start mb-12">
                            <Image source={require('../../../assets/logos/google-drive.png')} className="w-12 h-12" resizeMode="contain" />
                            <View className="bg-tertiary-fixed px-3 py-1 rounded-full">
                                <Text className="text-on-tertiary-fixed font-label-xs text-xs font-bold">Connected (Real-time)</Text>
                            </View>
                        </View>
                        <View className="flex-col">
                            <Text className="font-title-sm text-xl text-on-surface font-bold mb-1">Google Drive</Text>
                            <Text className="font-caption-sm text-xs text-on-surface-variant">Syncs instantly using Push Notifications.</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Apple Notes (Syncing) */}
                    {Platform.OS === 'ios' && (
                        <View className="w-full md:flex-1 bg-white p-6 rounded-[24px] shadow-sm flex-col justify-between">
                            <View className="flex-row justify-between items-start mb-12">
                                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB36Fs_77JX8QxM3CwseP2kqiIm4AANaF_YQboGyqSh2Dv_IFrhGzefDM7CM0FyIew5hmDx3vuy6YP-GZ7biXjnjDH0keh4dPNutEuCIGAYw8kjhjH8oiNqbUIP1zmZplQASvZvvU9akewq5DXPUKFaOmulQlK3OZ8dtwxPLpQi4OEgr5IEaDvGCbVwfyaI6F_FjaH25RI47o0fR34SBcLLLppkYCu96fxf_zYJqfkFDaSlw_k38LO6Smj0MCuZYOTzDI1YmJaYcuo' }} className="w-12 h-12" resizeMode="contain" />
                                <View className="flex-row items-center gap-1 bg-secondary-container px-3 py-1 rounded-full">
                                    <MaterialIcons name="sync" size={14} color={colors['on-secondary-container']} />
                                    <Text className="text-on-secondary-container font-label-xs text-xs font-bold">Syncing 85%</Text>
                                </View>
                            </View>
                            <View className="flex-col">
                                <Text className="font-title-sm text-xl text-on-surface font-bold mb-1">Apple Notes</Text>
                                <Text className="font-caption-sm text-xs text-on-surface-variant">Importing 4,208 snippets...</Text>
                            </View>
                        </View>
                    )}

                    {/* Notion (Action Required) */}
                    <View className="w-full md:flex-1 bg-white p-6 rounded-[24px] shadow-sm border-error/20 flex-col justify-between">
                        <View className="flex-row justify-between items-start mb-12">
                            <Image source={require('../../../assets/logos/notion-light.png')} className="w-12 h-12" resizeMode="contain" />
                            <View className="bg-surface-variant px-3 py-1 rounded-full">
                                <Text className="text-on-surface-variant font-label-xs text-xs font-bold">Coming Soon</Text>
                            </View>
                        </View>
                        <View className="flex-col">
                            <Text className="font-title-sm text-xl text-on-surface font-bold mb-1">Notion</Text>
                            <Text className="font-caption-sm text-xs text-on-surface-variant">Integration coming soon.</Text>
                        </View>
                    </View>

                    {/* Obsidian (Not Connected - Large Feature Card) */}
                    <View className="w-full md:flex-1 bg-white p-6 rounded-[24px] shadow-sm flex-col justify-between">
                        <View className="flex-row justify-between items-start mb-12">
                            <Image source={require('../../../assets/logos/obsidian.png')} className="w-12 h-12" resizeMode="contain" />
                            <View className="bg-surface-variant px-3 py-1 rounded-full">
                                <Text className="text-on-surface-variant font-label-xs text-xs font-bold">Coming Soon</Text>
                            </View>
                        </View>
                        <View className="flex-col">
                            <Text className="font-title-sm text-xl text-on-surface font-bold mb-1">Obsidian</Text>
                            <Text className="font-caption-sm text-xs text-on-surface-variant">Import your local vault. Coming soon.</Text>
                        </View>
                    </View>
                </View>

                {/* Export Data Section */}
                <View className="mt-12 bg-white rounded-[32px] p-6 shadow-sm">
                    <Text className="font-headline-md text-2xl font-bold text-on-surface mb-2">Export Data</Text>
                    <Text className="font-body-md text-base text-on-surface-variant mb-6">
                        Securely package your memories, timeline, and settings into portable formats.
                    </Text>
                    
                    <View className="flex-col gap-4 mb-6">
                        {['ZIP', 'JSON', 'CSV'].map((format) => (
                            <TouchableOpacity 
                                key={format}
                                onPress={() => setExportFormat(format)}
                                className={`w-full p-4 rounded-xl border ${exportFormat === format ? 'border-primary bg-primary-container' : 'border-outline/30 bg-surface-container-low'}`}
                            >
                                <Text className={`text-center font-bold ${exportFormat === format ? 'text-on-primary-container' : 'text-on-surface'}`}>{format} Format</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity 
                        onPress={handleCreateExport}
                        disabled={createExport.isPending}
                        className={`h-14 rounded-xl items-center justify-center flex-row gap-2 ${createExport.isPending ? 'bg-surface-variant' : 'bg-primary'}`}
                    >
                        {createExport.isPending ? <ActivityIndicator color={colors['on-surface-variant']} /> : <MaterialIcons name="file-download" size={20} color="#fff" />}
                        <Text className={`font-medium text-base ${createExport.isPending ? 'text-on-surface-variant' : 'text-white'}`}>
                            {createExport.isPending ? 'Generating...' : 'Start Full Account Export'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Import / Restore Section */}
                <View className="mt-8 bg-white rounded-[32px] p-6 shadow-sm">
                    <Text className="font-headline-md text-2xl font-bold text-on-surface mb-2">Import & Restore</Text>
                    <Text className="font-body-md text-base text-on-surface-variant mb-6">
                        Restore from a backup or import data from other platforms. Our validation engine will ensure integrity before merging.
                    </Text>
                    <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'File picker integration pending')} className="h-32 border-2 border-dashed border-outline/50 rounded-2xl items-center justify-center bg-surface-container-low">
                        <MaterialIcons name="cloud-upload" size={32} color={colors.outline} className="mb-2" />
                        <Text className="font-medium text-base text-on-surface-variant">Tap to select a backup file (.zip, .json)</Text>
                    </TouchableOpacity>
                </View>

                {/* Job History */}
                <View className="mt-12 mb-8">
                    <Text className="font-headline-md text-2xl font-bold text-on-surface mb-6">Migration History</Text>
                    {isLoadingJobs ? (
                        <ActivityIndicator color={colors.primary} />
                    ) : (
                        <View className="flex-col gap-4">
                            {jobs?.length === 0 ? (
                                <Text className="text-on-surface-variant text-center">No migration jobs yet.</Text>
                            ) : (
                                jobs?.map(job => (
                                    <View key={job.id} className="bg-white p-4 rounded-2xl shadow-sm border border-outline/10 flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <View className="flex-row items-center gap-4">
                                            <View className={`w-12 h-12 rounded-full items-center justify-center ${job.job_type === 'export' ? 'bg-secondary-container' : 'bg-primary-container'}`}>
                                                <MaterialIcons name={job.job_type === 'export' ? 'file-download' : 'file-upload'} size={24} color={job.job_type === 'export' ? colors['on-secondary-container'] : colors['on-primary-container']} />
                                            </View>
                                            <View className="flex-col">
                                                <Text className="font-bold text-base text-on-surface capitalize">{job.job_type} ({job.archive_format || 'N/A'})</Text>
                                                <Text className="text-xs text-on-surface-variant">Status: {job.status} {job.progress_percentage > 0 && job.progress_percentage < 100 && `(${job.progress_percentage}%)`}</Text>
                                                {job.current_stage && <Text className="text-xs text-on-surface-variant capitalize mt-0.5">Stage: {job.current_stage}</Text>}
                                            </View>
                                        </View>
                                        <View className="flex-row items-center gap-2">
                                            {job.status === 'completed' && job.file_url && (
                                                <TouchableOpacity onPress={() => handleDownload(job.file_url!, job.archive_format || 'ZIP')} className="px-4 py-2 bg-surface-container rounded-lg items-center justify-center active:bg-surface-container-high">
                                                    <Text className="font-bold text-primary text-sm">Download</Text>
                                                </TouchableOpacity>
                                            )}
                                            {job.status === 'failed' && (
                                                <View className="px-4 py-2 bg-error-container rounded-lg items-center justify-center">
                                                    <Text className="font-bold text-on-error-container text-sm">Failed</Text>
                                                </View>
                                            )}
                                            <TouchableOpacity onPress={() => deleteJob.mutate(job.id)} className="w-10 h-10 bg-surface-container-high rounded-full items-center justify-center active:bg-surface-variant">
                                                <MaterialIcons name="close" size={20} color={colors['on-surface-variant']} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    )}
                </View>

            </View>
        </Screen>
    );
}
