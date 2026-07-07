import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, TimelineFeedItem } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';

export default function TimelineDailyLog() {
  return (
    <Screen scrollable={false}>
      {/* Top Header */}
      <View className="bg-surface z-50 h-16 w-full flex-row items-center justify-between px-margin-mobile">
        <View className="flex-row items-center gap-md">
          <View className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden">
            <MaterialIcons name="person" size={24} color={colors.primary} />
          </View>
          <Text className="font-title-sm font-bold text-primary">YRecall</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full ">
            <MaterialIcons name="search" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full ">
            <MaterialIcons name="filter-list" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 w-full max-w-4xl mx-auto px-margin-mobile pt-lg" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Today Header */}
        <View className="mb-xl">
          <Text className="font-label-xs text-secondary uppercase tracking-widest mb-xs">Today</Text>
          <Text className="font-headline-md text-primary font-bold">Monday, June 12</Text>
        </View>

        {/* Timeline Container */}
        <View className="relative flex-col gap-xl">
          {/* Vertical Line */}
          <View className="absolute left-[24px] top-0 bottom-0 w-[2px] bg-surface-variant z-0" />

          {/* AI Highlight */}
          <TimelineFeedItem
            type="ai-insight"
            title="Morning Focus Peak"
            time="09:15 AM"
            content="Your voice memos from the commute suggest high creative energy. I've scheduled a 'Deep Work' block for tomorrow at this same time to capitalize on this pattern."
            showTimelineTrack={true}
          />

          {/* Photos */}
          <TimelineFeedItem
            type="photo"
            title="Captured via Camera"
            time="11:42 AM"
            content="Lunch meeting brainstorm with the architecture team at The Glass House."
            showTimelineTrack={true}
          />

          {/* Voice Memo */}
          <TimelineFeedItem
            type="voice-memo"
            title="Voice Memo"
            time="02:30 PM"
            content="Thinking about the new typography for the OS. We need something that feels both digital and editorial. Maybe a high-contrast serif for headers?"
            duration="0:45"
            showTimelineTrack={true}
          />

          {/* End of Timeline */}
          <View className="items-center py-xl">
            <MaterialIcons name="expand-more" size={24} color={colors.outline} className="mb-2" />
            <Text className="font-label-xs text-outline uppercase">End of today's recall</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
