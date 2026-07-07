import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function OfflineSyncStatus() {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <Screen scrollable={true} className="pb-24">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16 border-b border-outline-variant/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl font-bold text-primary">Offline & Sync Management</Text>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-8 flex-col md:flex-row gap-8">
        
        {/* Left Sidebar: Local Brain Status & Sync Controls */}
        <View className="flex-col w-full md:w-[40%] xl:w-[30%] gap-8">
          
          <View className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-[24px] shadow-sm flex-col">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="font-headline-md text-xl font-bold text-on-surface">Local Brain Status</Text>
              <MaterialIcons name="dns" size={24} color={colors.secondary} />
            </View>

            <View className="flex-col gap-4">
              <View className="flex-row justify-between items-end border-b border-outline-variant/30 pb-2">
                <Text className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">ON-DEVICE STORAGE</Text>
                <Text className="text-xs font-medium text-on-surface">12.4 GB / 64 GB</Text>
              </View>
              <View className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <View className="h-full bg-secondary w-1/5 rounded-full" />
              </View>

              <View className="pt-4 flex-col gap-3">
                <View className="flex-row items-center gap-3 p-3 bg-surface-bright border border-outline-variant/30 rounded-xl">
                  <MaterialIcons name="verified-user" size={24} color="#059669" />
                  <View className="flex-col">
                    <Text className="font-label-caps text-[10px] font-bold text-on-surface uppercase tracking-widest">SECURELY STORED OFFLINE</Text>
                    <Text className="text-xs text-on-surface-variant font-medium">AES-256 Encrypted on silicon</Text>
                  </View>
                </View>
                
                <View className="flex-row items-center gap-3 p-3 bg-surface-bright border border-outline-variant/30 rounded-xl">
                  <MaterialIcons name="sync-problem" size={24} color="#D97706" />
                  <View className="flex-col">
                    <Text className="font-label-caps text-[10px] font-bold text-on-surface uppercase tracking-widest">PENDING RESOLUTION</Text>
                    <Text className="text-xs text-on-surface-variant font-medium">3 Conflicts require attention</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="mt-8 flex-col gap-3">
              <TouchableOpacity 
                onPress={handleSync}
                disabled={isSyncing}
                className="w-full bg-primary py-4 rounded-xl flex-row items-center justify-center gap-2  shadow-sm"
              >
                {isSyncing ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <MaterialIcons name="sync" size={20} color="#ffffff" />
                )}
                <Text className="text-white font-bold text-sm tracking-widest uppercase">{isSyncing ? 'SYNCING DATA...' : 'FORCE MANUAL SYNC'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full border border-outline-variant/50 bg-white py-4 rounded-xl flex-row items-center justify-center gap-2  shadow-sm">
                <MaterialIcons name="wifi-off" size={20} color={colors.primary} />
                <Text className="text-primary font-bold text-sm tracking-widest uppercase">GO FULL OFFLINE MODE</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sync Queue */}
          <View className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-[24px] shadow-sm flex-col">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-label-caps text-[10px] font-bold text-on-tertiary-container tracking-widest uppercase">Sync Queue</Text>
              <View className="px-2 py-1 bg-secondary-fixed rounded">
                <Text className="text-[10px] font-bold text-on-secondary-fixed">8 ITEMS</Text>
              </View>
            </View>
            
            <View className="flex-col gap-2">
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-start gap-4 p-3 rounded-xl  transition-colors group">
                <MaterialIcons name="description" size={20} color={colors['on-surface-variant']} className="mt-1" />
                <View className="flex-1 flex-col">
                  <Text className="font-body-md text-sm font-bold text-on-surface mb-0.5">Product Strategy Q4.pdf</Text>
                  <Text className="text-xs text-on-surface-variant">Modified 2m ago • 4.2 MB</Text>
                </View>
                <MaterialIcons name="priority-high" size={20} color={colors['outline-variant']} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-start gap-4 p-3 rounded-xl  transition-colors group">
                <MaterialIcons name="mic" size={20} color={colors['on-surface-variant']} className="mt-1" />
                <View className="flex-1 flex-col">
                  <Text className="font-body-md text-sm font-bold text-on-surface mb-0.5">Voice Memo - Meeting.m4a</Text>
                  <Text className="text-xs text-on-surface-variant">Recorded 15m ago • 12 MB</Text>
                </View>
                <MaterialIcons name="cloud-upload" size={20} color={colors['outline-variant']} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-start gap-4 p-3 rounded-xl  transition-colors group">
                <MaterialIcons name="image" size={20} color={colors['on-surface-variant']} className="mt-1" />
                <View className="flex-1 flex-col">
                  <Text className="font-body-md text-sm font-bold text-on-surface mb-0.5">Whiteboard_Session.jpg</Text>
                  <Text className="text-xs text-on-surface-variant">Captured 1h ago • 1.8 MB</Text>
                </View>
                <MaterialIcons name="hourglass-empty" size={20} color={colors['outline-variant']} />
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* Right: Conflict Resolution Canvas */}
        <View className="flex-col w-full md:w-[60%] xl:w-[70%] gap-8">
          
          <View className="flex-row items-center justify-between">
            <Text className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface">Conflict Resolution</Text>
            <View className="px-3 py-1 bg-error-container rounded-full hidden sm:flex">
              <Text className="text-on-error-container font-label-caps text-[10px] font-bold uppercase tracking-widest">3 HIGH PRIORITY</Text>
            </View>
          </View>

          {/* Active Conflict Card */}
          <View className="bg-surface-container-lowest border border-outline-variant/30 rounded-[24px] overflow-hidden shadow-sm flex-col">
            <View className="bg-surface-container p-4 border-b border-outline-variant/30 flex-row justify-between items-center">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="difference" size={20} color={colors.secondary} />
                <Text className="font-body-md text-sm font-bold text-on-surface">CONFLICT #1: "Architecture Proposal.md"</Text>
              </View>
              <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hidden sm:flex">LAST SYNC ATTEMPT: 14:22 PM</Text>
            </View>
            
            <View className="flex-col xl:flex-row">
              {/* Local Version */}
              <View className="flex-1 p-6 border-b xl:border-b-0 xl:border-r border-outline-variant/30 flex-col">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="laptop-mac" size={20} color={colors.primary} />
                    <Text className="font-label-caps text-[10px] font-bold uppercase tracking-widest text-primary">LOCAL VERSION (THIS DEVICE)</Text>
                  </View>
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">CONFIDENCE: 94%</Text>
                </View>
                <View className="bg-surface-bright p-4 border border-outline-variant/30 rounded-xl flex-col gap-3 flex-1">
                  <Text className="text-sm text-on-surface leading-relaxed">
                    The proposed microservices architecture will utilize <Text className="bg-secondary-fixed/50 font-medium">RabbitMQ for inter-process communication</Text> to ensure high throughput and eventual consistency.
                  </Text>
                  <Text className="text-xs text-on-surface-variant italic mt-auto">Modified 10 minutes ago</Text>
                </View>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="mt-6 w-full py-3 bg-secondary rounded-xl flex-row items-center justify-center gap-2  shadow-sm">
                  <MaterialIcons name="check-circle" size={16} color="#ffffff" />
                  <Text className="text-white font-bold text-[10px] uppercase tracking-widest">KEEP LOCAL VERSION</Text>
                </TouchableOpacity>
              </View>

              {/* Cloud Version */}
              <View className="flex-1 p-6 bg-surface-container-low flex-col">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="cloud" size={20} color={colors['on-surface-variant']} />
                    <Text className="font-label-caps text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">CLOUD VERSION (SYNCED)</Text>
                  </View>
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">VERSION 2.1.4</Text>
                </View>
                <View className="bg-surface-container-highest p-4 border border-outline-variant/30 rounded-xl flex-col gap-3 opacity-80 flex-1">
                  <Text className="text-sm text-on-surface-variant leading-relaxed">
                    The proposed architecture will utilize <Text className="bg-error-container line-through font-medium">Apache Kafka</Text> to ensure massive data streams and high durability.
                  </Text>
                  <Text className="text-xs text-on-surface-variant italic mt-auto">Modified 2 hours ago from Web Portal</Text>
                </View>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="mt-6 w-full py-3 border border-outline/50 bg-white rounded-xl flex-row items-center justify-center gap-2  shadow-sm">
                  <MaterialIcons name="restore" size={16} color={colors.primary} />
                  <Text className="text-primary font-bold text-[10px] uppercase tracking-widest">OVERWRITE WITH CLOUD</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Merge Logic */}
            <View className="p-4 bg-primary-container border-t border-outline-variant/30 flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <View className="flex-row items-start sm:items-center gap-4 flex-1">
                <MaterialIcons name="auto-awesome" size={24} color={colors['secondary-fixed']} className="mt-0.5 sm:mt-0" />
                <Text className="text-sm text-on-primary-container font-medium flex-1">AI Suggestion: These changes are additive. You can merge both versions into a single document.</Text>
              </View>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-6 py-2 bg-on-secondary-container rounded-full  self-end sm:self-auto">
                <Text className="text-secondary font-bold text-[10px] uppercase tracking-widest">SMART MERGE</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Intelligence Layer Switcher */}
          <View className="flex-col sm:flex-row gap-4 mt-2">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl flex-row items-center gap-4  transition-all  shadow-sm">
              <View className="w-12 h-12 bg-secondary-container rounded-full items-center justify-center">
                <MaterialIcons name="person-search" size={24} color={colors['on-secondary-container']} />
              </View>
              <View className="flex-col flex-1">
                <Text className="font-bold text-base text-on-surface">Personal Intelligence</Text>
                <Text className="text-xs text-on-surface-variant">2 pending local-only recalls</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl flex-row items-center gap-4  transition-all  shadow-sm">
              <View className="w-12 h-12 bg-surface-container rounded-full items-center justify-center">
                <MaterialIcons name="group-work" size={24} color={colors['on-surface-variant']} />
              </View>
              <View className="flex-col flex-1">
                <Text className="font-bold text-base text-on-surface">Team Intelligence</Text>
                <Text className="text-xs text-on-surface-variant">Fully synced with cloud</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Screen>
  );
}
