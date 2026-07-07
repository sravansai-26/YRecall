import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/shared/store/useAuthStore';

export default function InboxScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <Screen scrollable={false}>
      {/* Top App Bar */}
      <View className="flex-row justify-between items-center h-16 px-margin-mobile bg-surface/80 z-40">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            className="p-2 rounded-full "
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
          <Text className="font-headline-md font-bold text-[32px] text-primary tracking-tight">Inbox</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => router.push('/(modals)/search')} className="p-2 rounded-full ">
            <MaterialIcons name="search" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(main)/profile-edit')} className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high items-center justify-center">
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} className="w-full h-full" />
            ) : (
              <Text className="font-bold text-primary text-[10px]">{user?.displayName?.charAt(0) || 'U'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 w-full max-w-7xl mx-auto px-margin-mobile pb-32" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Tabs / Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-lg mb-4">
          {['All', 'AI Insights', 'System'].map((filter) => (
            <TouchableOpacity 
              key={filter}
              onPress={() => setActiveFilter(filter)} 
              className={`px-lg py-2 rounded-full mr-2 ${activeFilter === filter ? 'bg-primary' : 'bg-surface-container'}`}
            >
              <Text className={`font-title-sm text-[14px] ${activeFilter === filter ? 'text-on-primary' : 'text-on-surface-variant'}`}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section 1: Proactive Memories */}
        <View className="mb-xxl">
          <View className="flex-row items-center gap-2 mb-lg">
            <MaterialIcons name="auto-awesome" size={24} color={colors.secondary} />
            <Text className="font-title-sm text-[12px] text-primary uppercase tracking-widest font-bold">Proactive Memories</Text>
          </View>
          
          <View className="flex-col md:flex-row gap-md">
            {/* AI Card 1 */}
            <View className="flex-1 p-lg rounded-[24px] bg-white border border-secondary/20 shadow-sm relative overflow-hidden">
              <View className="absolute top-4 right-4 bg-secondary-container px-3 py-1 rounded-full">
                <Text className="text-on-secondary-container text-[11px] font-bold uppercase tracking-tighter">Priority</Text>
              </View>
              <View className="flex-col gap-base">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="smart-toy" size={20} color={colors.secondary} />
                  <Text className="font-title-sm text-[14px] text-secondary">AI Insight</Text>
                </View>
                <Text className="font-body-md text-on-surface leading-relaxed">
                  You have a meeting with <Text className="font-bold text-primary">Sarah Jenkins</Text> in 30 mins. Re-surfacing notes from your last sync regarding the <Text className="italic">Q4 Roadmap</Text>.
                </Text>
                <View className="mt-base flex-row gap-2 mt-4">
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 rounded-xl bg-primary">
                    <Text className="text-on-primary text-[13px] font-medium">View Notes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 rounded-xl bg-surface-container">
                    <Text className="text-on-surface-variant text-[13px] font-medium">Dismiss</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* AI Card 2 */}
            <View className="flex-1 p-lg rounded-[24px] bg-white border border-secondary/20 shadow-sm mt-4 md:mt-0">
              <View className="flex-col gap-base">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="psychology" size={20} color={colors.secondary} />
                  <Text className="font-title-sm text-[14px] text-secondary">Pattern Recognition</Text>
                </View>
                <Text className="font-body-md text-on-surface leading-relaxed">
                  Based on your recent browsing, I've compiled a summary of <Text className="font-bold text-primary">Quantum Computing breakthroughs</Text> mentioned in your saved articles.
                </Text>
                <View className="mt-base mt-4">
                  <View className="flex-row -space-x-2">
                    <View className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high items-center justify-center">
                      <MaterialIcons name="article" size={14} color={colors['on-surface-variant']} />
                    </View>
                    <View className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high items-center justify-center">
                      <MaterialIcons name="link" size={14} color={colors['on-surface-variant']} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Section 2: Recent Notifications */}
        <View>
          <View className="flex-row items-center justify-between mb-lg">
            <Text className="font-title-sm text-[12px] text-on-surface-variant uppercase tracking-widest font-bold">Recent Notifications</Text>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
              <Text className="text-[12px] font-medium text-primary ">Mark all as read</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-col gap-2">
            {[
              {
                icon: 'cloud-done', color: 'primary', bg: 'surface-container',
                title: 'Cloud Sync Complete', time: '2m ago',
                desc: '42 new memories successfully encrypted and synced to your private vault.'
              },
              {
                icon: 'storage', color: 'error', bg: 'error-container',
                title: 'Storage at 80%', time: '1h ago',
                desc: 'Your local memory buffer is reaching capacity. Consider offloading to Cold Storage.'
              },
              {
                icon: 'history-edu', color: 'primary', bg: 'surface-container',
                title: 'New Memory Captured', time: '3h ago',
                desc: 'Automatic journal entry created for "Afternoon Coffee at Blue Bottle".'
              }
            ].map((notif, index) => (
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} key={index} className="flex-row items-center gap-lg p-lg rounded-[24px] bg-white/50 mb-2">
                <View className={`w-12 h-12 rounded-full bg-${notif.bg} items-center justify-center shrink-0`}>
                  <MaterialIcons name={notif.icon as any} size={24} color={colors[notif.color as keyof typeof colors] as string} />
                </View>
                <View className="flex-1 ml-4">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="font-title-sm text-[16px] text-primary">{notif.title}</Text>
                    <Text className="text-[12px] text-on-surface-variant">{notif.time}</Text>
                  </View>
                  <Text className="text-[14px] text-on-surface-variant">{notif.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </Screen>
  );
}
