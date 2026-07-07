import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function StorageSyncDashboard() {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <Screen scrollable={true} className="pb-24 md:pb-0">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">Storage & Sync</Text>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6 flex-col gap-8 w-full">
        
        {/* Cloud Status & Main Hero */}
        <View className="flex-col md:flex-row gap-6">
          <View className="w-full md:w-[33%] lg:w-[33%] p-6 rounded-[24px] bg-white shadow-sm border border-outline-variant/30 flex-col items-center">
            
            <View className="w-48 h-48 relative items-center justify-center mb-6">
              {/* Circular Progress Placeholder using simple CSS borders for React Native */}
              <View className="absolute inset-0 rounded-full border-[12px] border-surface-variant" />
              <View className="absolute inset-0 rounded-full border-[12px] border-secondary border-l-transparent border-b-transparent" style={{ transform: [{ rotate: '45deg' }] }} />
              <View className="absolute inset-4 rounded-full border-[12px] border-primary-container border-r-transparent border-t-transparent" style={{ transform: [{ rotate: '-45deg' }] }} />
              <View className="absolute inset-8 rounded-full border-[12px] border-outline border-b-transparent border-r-transparent" style={{ transform: [{ rotate: '135deg' }] }} />
              
              <View className="absolute items-center justify-center flex-col">
                <Text className="font-headline-md text-3xl font-bold text-on-surface">74%</Text>
                <Text className="font-label-xs text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">Used</Text>
              </View>
            </View>

            <View className="w-full flex-col gap-3">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <View className="w-3 h-3 rounded-full bg-secondary" />
                  <Text className="font-body-md text-base text-on-surface">Audio Memories</Text>
                </View>
                <Text className="font-label-xs text-xs font-bold text-on-surface">12.4 GB</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <View className="w-3 h-3 rounded-full bg-primary-container" />
                  <Text className="font-body-md text-base text-on-surface">Photo Streams</Text>
                </View>
                <Text className="font-label-xs text-xs font-bold text-on-surface">8.1 GB</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <View className="w-3 h-3 rounded-full bg-outline" />
                  <Text className="font-body-md text-base text-on-surface">Documents</Text>
                </View>
                <Text className="font-label-xs text-xs font-bold text-on-surface">3.2 GB</Text>
              </View>
            </View>
          </View>

          <View className="flex-1 flex-col gap-6">
            {/* Sync Card */}
            <View className="p-6 rounded-[24px] bg-white shadow-sm border border-outline-variant/30 flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <View className="flex-row items-center gap-6">
                <View className="w-16 h-16 rounded-full bg-secondary-container items-center justify-center">
                  <MaterialIcons name="cloud-sync" size={32} color={colors['on-secondary-container']} />
                </View>
                <View className="flex-col">
                  <Text className="font-title-sm text-xl font-bold text-primary mb-1">Cloud Sync Status</Text>
                  <Text className="font-body-md text-base text-on-surface-variant">Last synced: 2 minutes ago</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={handleSync}
                className="bg-primary px-8 h-14 rounded-[16px] flex-row items-center justify-center gap-2 "
              >
                <MaterialIcons name={syncing ? "sync" : "cloud-upload"} size={20} color="#ffffff" />
                <Text className="text-white font-medium text-base">{syncing ? "Syncing..." : "Sync Now"}</Text>
              </TouchableOpacity>
            </View>

            {/* AI Cleanup Tools Grid */}
            <View className="flex-col md:flex-row gap-6 flex-1">
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 p-6 rounded-[24px] bg-white shadow-sm border border-outline-variant/30 flex-col justify-between">
                <View className="flex-col gap-4">
                  <View className="w-12 h-12 rounded-full bg-tertiary-fixed items-center justify-center">
                    <MaterialIcons name="auto-awesome" size={24} color={colors['on-tertiary-fixed']} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-title-sm text-xl font-bold text-on-surface mb-2">Duplicate Memory Cleaner</Text>
                    <Text className="font-body-md text-base text-on-surface-variant">AI found 127 identical memory clusters saving up to 1.4 GB.</Text>
                  </View>
                </View>
                <View className="mt-8 flex-row items-center gap-1">
                  <Text className="text-secondary font-medium text-base">Review Duplicates</Text>
                  <MaterialIcons name="chevron-right" size={20} color={colors.secondary} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 p-6 rounded-[24px] bg-white shadow-sm border border-outline-variant/30 flex-col justify-between">
                <View className="flex-col gap-4">
                  <View className="w-12 h-12 rounded-full bg-primary-fixed items-center justify-center">
                    <MaterialIcons name="folder-open" size={24} color={colors['on-primary-fixed']} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-title-sm text-xl font-bold text-on-surface mb-2">Large Attachment Manager</Text>
                    <Text className="font-body-md text-base text-on-surface-variant">Summarize or archive raw files over 100MB to optimize local cache.</Text>
                  </View>
                </View>
                <View className="mt-8 flex-row items-center gap-1">
                  <Text className="text-secondary font-medium text-base">Analyze Files</Text>
                  <MaterialIcons name="chevron-right" size={20} color={colors.secondary} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Export Options Section */}
        <View className="flex-col gap-6">
          <Text className="font-headline-md text-3xl font-bold text-on-surface px-1">Export Options</Text>
          <View className="flex-col sm:flex-row gap-6">
            
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 p-6 rounded-[24px] bg-white border border-outline-variant/30 flex-col items-center justify-center gap-4 ">
              <View className="w-14 h-14 rounded-xl bg-surface-container-low items-center justify-center">
                <MaterialIcons name="picture-as-pdf" size={28} color={colors.primary} />
              </View>
              <View className="flex-col items-center">
                <Text className="font-title-sm text-base font-bold text-on-surface mb-1">PDF Portfolio</Text>
                <Text className="font-caption-sm text-xs text-on-surface-variant text-center">High-res memories report</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 p-6 rounded-[24px] bg-white border border-outline-variant/30 flex-col items-center justify-center gap-4 ">
              <View className="w-14 h-14 rounded-xl bg-surface-container-low items-center justify-center">
                <MaterialIcons name="edit-document" size={28} color={colors.primary} />
              </View>
              <View className="flex-col items-center">
                <Text className="font-title-sm text-base font-bold text-on-surface mb-1">Markdown Archive</Text>
                <Text className="font-caption-sm text-xs text-on-surface-variant text-center">Interconnected text notes</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 p-6 rounded-[24px] bg-white border border-outline-variant/30 flex-col items-center justify-center gap-4 ">
              <View className="w-14 h-14 rounded-xl bg-surface-container-low items-center justify-center">
                <MaterialIcons name="data-object" size={28} color={colors.primary} />
              </View>
              <View className="flex-col items-center">
                <Text className="font-title-sm text-base font-bold text-on-surface mb-1">JSON Raw Data</Text>
                <Text className="font-caption-sm text-xs text-on-surface-variant text-center">Developer-friendly structure</Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>

        {/* Visualization Placeholder */}
        <View className="h-[400px] rounded-[32px] overflow-hidden relative shadow-sm border border-outline-variant/10 bg-surface-container-high justify-end p-6 md:p-8">
          <View className="bg-white/80 p-6 md:p-8 rounded-[24px] flex-col max-w-md w-full border border-white/40">
            <Text className="font-headline-md text-3xl font-bold text-primary mb-2">Data Health Score</Text>
            <Text className="font-body-md text-base text-on-surface-variant mb-6">Your memory architecture is 98% efficient. The AI suggests optimizing metadata for faster recall lookups.</Text>
            <View className="flex-row">
              <View className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                <View className="h-full bg-secondary w-[98%]" />
              </View>
            </View>
          </View>
        </View>

      </View>
    </Screen>
  );
}
