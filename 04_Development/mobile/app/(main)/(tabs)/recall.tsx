import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, TimelineFeedItem } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';

export default function TimelineLifeJourney() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeDate, setActiveDate] = useState('25');
  const [activeSegment, setActiveSegment] = useState('Day');
  return (
    <Screen scrollable={false}>
      {/* Top Header */}
      <View className="bg-surface/80 z-50 h-20 w-full flex-row items-center justify-between px-margin-mobile">
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => router.push('/(main)/profile-edit')} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center border border-outline-variant/20 overflow-hidden">
             {user?.photoURL ? (
               <Image source={{ uri: user.photoURL }} className="w-full h-full" />
             ) : (
               <MaterialIcons name="person" size={24} color={colors.primary} />
             )}
          </Pressable>
          <Text className="font-display-lg-mobile text-[36px] font-bold text-primary tracking-tight">YRecall</Text>
        </View>
        <Pressable onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full ">
          <MaterialIcons name="notifications" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 w-full max-w-7xl mx-auto px-margin-mobile pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Segmented Control */}
        <View className="flex-row justify-center mb-8">
          <View className="flex-row p-1 bg-surface-container rounded-full border border-outline-variant/10 shadow-sm">
            {['Day', 'Week', 'Month', 'Year'].map((segment) => {
              const isActive = activeSegment === segment;
              return (
              <Pressable 
                key={segment}
                onPress={() => setActiveSegment(segment)} 
                className="px-6 py-2 rounded-full"
                style={{ backgroundColor: isActive ? colors.primary : 'transparent' }}
              >
                <Text className="text-label-xs font-medium" style={{ color: isActive ? colors['on-primary'] : colors['on-surface-variant'] }}>{segment}</Text>
              </Pressable>
            )})}
          </View>
        </View>

        {/* Date Picker */}
        <View className="mb-10">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-title-sm text-[20px] text-primary font-medium">October 2023</Text>
            <View className="flex-row gap-1">
              <Pressable onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-1.5 rounded-lg">
                <MaterialIcons name="chevron-left" size={24} color={colors['on-surface-variant']} />
              </Pressable>
              <Pressable onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-1.5 rounded-lg">
                <MaterialIcons name="chevron-right" size={24} color={colors['on-surface-variant']} />
              </Pressable>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
            {[
              { day: 'Mon', date: '23' },
              { day: 'Tue', date: '24' },
              { day: 'Wed', date: '25' },
              { day: 'Thu', date: '26' },
              { day: 'Fri', date: '27' },
              { day: 'Sat', date: '28' },
              { day: 'Sun', date: '29' },
            ].map((item, index) => {
              const isActive = activeDate === item.date;
              return (
                <Pressable 
                  onPress={() => setActiveDate(item.date)}
                  key={index}
                  className="items-center justify-center min-w-[56px] rounded-2xl border border-outline-variant/10 mx-1.5"
                  style={{
                    height: isActive ? 96 : 80,
                    backgroundColor: isActive ? colors.primary : colors['surface-container-low'],
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isActive ? 0.3 : 0,
                    shadowRadius: 4.65,
                    elevation: isActive ? 8 : 0,
                  }}
                >
                  <Text className="text-caption-sm mb-1" style={{ color: isActive ? 'rgba(255,255,255,0.8)' : colors['on-surface-variant'] }}>{item.day}</Text>
                  <Text style={{ 
                    fontWeight: 'bold',
                    fontSize: isActive ? 24 : 14,
                    color: isActive ? '#FFFFFF' : colors['on-surface'] 
                  }}>{item.date}</Text>
                  {isActive && <View className="w-1 h-1 bg-secondary-fixed rounded-full mt-2" />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Chronological Feed */}
        <View className="relative flex-col gap-10">
          {/* Timeline Line (hidden on mobile, visible on tablet+) */}
          <View className="absolute left-[19px] top-4 bottom-0 w-px bg-outline-variant/30 hidden md:flex" />

          {/* AI Highlight Card */}
          <Pressable onPress={() => router.push('/(insight)/detail')}>
            <TimelineFeedItem
              type="ai-insight"
              title="Productive Morning Cycle"
              time="8:00 AM - 12:30 PM"
              content="You've completed 4 major tasks today. Your focus peak was at 10:15 AM during the deep work session on the 'Project Nova' architecture."
              tags={['#Efficiency', '#Productivity']}
              showTimelineTrack={false}
            />
          </Pressable>

          {/* Note Card */}
          <Pressable onPress={() => router.push('/(entity)/project')}>
            <TimelineFeedItem
              type="note"
              title="Notes on Architecture Review"
              time="11:30 AM"
              content="The primary concern remains the latency in the database layer. We need to explore decentralized indexing..."
              tags={['Work', 'Project Nova']}
              showTimelineTrack={false}
            />
          </Pressable>

          {/* Voice Memo */}
          <Pressable onPress={() => router.push('/(entity)/person')}>
            <TimelineFeedItem
              type="voice-memo"
              title="Voice Memo: Idea for App"
              time="04:20 PM"
              tags={['Idea', 'Personal']}
              showTimelineTrack={false}
            />
          </Pressable>

        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="absolute bottom-[104px] right-6 w-16 h-16 bg-primary rounded-2xl shadow-xl items-center justify-center z-50">
        <MaterialIcons name="add" size={32} color={colors.white} />
      </Pressable>
    </Screen>
  );
}
