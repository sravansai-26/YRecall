import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, TopAppBar, InsightCard } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';

export default function HomeDailyBriefing() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <Screen scrollable={false}>
      {/* Top Header */}
      <View className="bg-surface z-40">
        <View className="flex-row justify-between items-center w-full px-margin-mobile h-16 max-w-7xl mx-auto">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.push('/(main)/profile-edit')} className="w-10 h-10 rounded-full bg-primary-fixed overflow-hidden items-center justify-center border-2 border-surface-container-high">
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} className="w-full h-full" />
              ) : (
                <MaterialIcons name="person" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
            <View className="flex-col">
              <Text className="font-label-xs text-on-surface-variant">Good Morning,</Text>
              <Text className="font-title-sm text-[16px] font-bold text-primary">{user?.displayName?.split(' ')[0] || 'User'}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full"
              onPress={() => router.push('/inbox')}
            >
              <MaterialIcons name="notifications" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 w-full max-w-7xl mx-auto mt-4 px-margin-mobile" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Daily Briefing */}
        <View className="bg-surface-dim p-lg rounded-[24px] shadow-sm overflow-hidden mb-xl">
          <View className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
            <MaterialIcons name="auto-awesome" size={80} color={colors.primary} />
          </View>
          <View className="flex-row items-center gap-2 mb-3">
            <MaterialIcons name="auto-awesome" size={20} color={colors.secondary} />
            <Text className="font-headline-md text-[20px] text-primary">Today's Briefing</Text>
          </View>
          <Text className="font-body-md text-on-surface-variant leading-relaxed">
            You have a design review at 10 AM. Key takeaways from yesterday: the client preferred the minimalist layout and mentioned a need for a darker "Deep Recall" mode. Remember to mention the new bento grid pattern.
          </Text>
        </View>

        {/* Quick Actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-xl -mx-margin-mobile px-margin-mobile" contentContainerStyle={{ gap: 8, paddingRight: 40 }}>
          <TouchableOpacity onPress={() => router.push('/(main)/(tabs)/ask')} className="flex-row items-center gap-2 px-lg py-3 bg-primary rounded-full">
            <MaterialIcons name="chat-bubble" size={20} color={colors['on-primary']} />
            <Text className="font-label-xs text-[14px] text-on-primary">Ask Anything</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/capture')} className="flex-row items-center gap-2 px-lg py-3 bg-surface-container-low border border-outline-variant rounded-full">
            <MaterialIcons name="document-scanner" size={20} color={colors['on-surface']} />
            <Text className="font-label-xs text-[14px] text-on-surface">Scan Doc</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/capture')} className="flex-row items-center gap-2 px-lg py-3 bg-surface-container-low border border-outline-variant rounded-full">
            <MaterialIcons name="mic" size={20} color={colors['on-surface']} />
            <Text className="font-label-xs text-[14px] text-on-surface">Voice Note</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/capture')} className="flex-row items-center gap-2 px-lg py-3 bg-surface-container-low border border-outline-variant rounded-full">
            <MaterialIcons name="photo-camera" size={20} color={colors['on-surface']} />
            <Text className="font-label-xs text-[14px] text-on-surface">Snap Photo</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Recent Memories */}
        <View className="mb-md flex-row justify-between items-end">
          <Text className="font-title-sm text-primary">Recent Memories</Text>
          <Text className="text-secondary font-label-xs text-[13px]">See All</Text>
        </View>

        <View className="flex-col md:flex-row gap-gutter mb-xl flex-wrap">
          {/* Memory: Photo */}
          <View className="bg-white rounded-[24px] shadow-sm overflow-hidden flex-col flex-1 w-full mb-4">
            <View className="h-48 relative bg-surface-container-high items-center justify-center">
               <MaterialIcons name="landscape" size={48} color={colors['outline-variant']} />
               <View className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full flex-row items-center gap-1">
                 <MaterialIcons name="image" size={14} color={colors.primary} />
                 <Text className="font-label-xs text-[10px] text-primary">Captured 2h ago</Text>
               </View>
            </View>
            <View className="p-lg">
              <Text className="font-body-md text-on-surface mb-2 font-medium">Architecture Inspo</Text>
              <Text className="font-caption-sm text-on-surface-variant">Saved from your walk through the Venice District. The light on these facades is perfect for the upcoming project.</Text>
            </View>
          </View>

          {/* Memory: Link */}
          <TouchableOpacity onPress={() => router.push('/(insight)/detail')} className="bg-white rounded-[24px] shadow-sm p-lg border border-transparent flex-col flex-1 w-full mb-4">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-10 h-10 bg-secondary-container items-center justify-center rounded-xl">
                <MaterialIcons name="link" size={20} color={colors['on-secondary-container']} />
              </View>
              <View>
                <Text className="font-label-xs text-[10px] text-on-surface-variant uppercase tracking-wider">Article Summary</Text>
                <Text className="font-body-md font-bold text-primary">The Future of AI Interfaces</Text>
              </View>
            </View>
            <Text className="font-body-md text-on-surface-variant mb-4">A deep dive into how large action models will replace traditional app navigation. Focuses on intent-based UI.</Text>
            <View className="flex-row flex-wrap gap-2">
              <View className="bg-tertiary/10 px-3 py-1 rounded-full">
                <Text className="text-on-tertiary-container font-label-xs text-[10px]">#TechTrends</Text>
              </View>
              <View className="bg-tertiary/10 px-3 py-1 rounded-full">
                <Text className="text-on-tertiary-container font-label-xs text-[10px]">#Design</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Ongoing Projects */}
        <Text className="font-title-sm text-primary mb-md">Ongoing Projects</Text>
        <View className="space-y-sm">
          <TouchableOpacity onPress={() => router.push('/(entity)/project')} className="bg-surface-container-low rounded-xl p-md flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm">
                <MaterialIcons name="folder-open" size={24} color={colors.primary} />
              </View>
              <View>
                <Text className="font-body-md font-bold text-primary">Redesign Project: Q3</Text>
                <Text className="font-caption-sm text-on-surface-variant">12 related memories • Active now</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </Screen>
  );
}
