import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, InsightCard } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';

export default function SearchResults() {
  const router = useRouter();

  return (
    <Screen scrollable={false}>
      <View className="bg-surface z-40 shadow-sm w-full h-16 flex-row items-center justify-between px-margin-mobile">
        <View className="flex-row items-center gap-md">
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} onPress={() => router.back()} />
          <Text className="text-title-sm font-title-sm font-bold text-primary">YRecall</Text>
        </View>
        <View className="flex-row items-center gap-md">
          <View className="w-10 h-10 items-center justify-center rounded-full">
            <MaterialIcons name="search" size={24} color={colors.primary} />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 w-full max-w-[1440px] mx-auto px-margin-mobile py-lg" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Search Query Header */}
        <View className="mb-xl flex-row items-end justify-between">
          <View>
            <Text className="text-label-xs font-label-xs text-outline uppercase tracking-widest mb-xs">Search Results</Text>
            <Text className="text-headline-md font-headline-md text-primary">Project Nova timeline</Text>
          </View>
          <View className="hidden md:block">
            <Text className="text-caption-sm font-caption-sm text-on-surface-variant">4 synthesized sources</Text>
          </View>
        </View>

        {/* AI Synthesis */}
        <View className="mb-xxl relative">
          <View className="bg-white/80 rounded-[24px] p-lg border border-secondary/30 shadow-sm">
            <View className="flex-row items-center gap-sm mb-md">
              <MaterialIcons name="auto-awesome" size={20} color={colors.secondary} />
              <Text className="text-title-sm font-title-sm font-bold text-secondary">AI Synthesis</Text>
            </View>
            <Text className="font-body-md text-body-md text-on-surface leading-relaxed mb-4">
              Project Nova is currently in its <Text className="font-bold text-primary">Execution Phase</Text>. Following the board meeting on Tuesday, the timeline has been accelerated by two weeks to align with the Q4 product launch. Key milestones reached include the completion of the backend architecture and initial user testing of the neural interface. Your last voice memo notes a minor bottleneck in the compliance review, which is scheduled to be resolved by Friday's sprint sync.
            </Text>
            <View className="flex-row flex-wrap gap-xs pt-sm">
              <View className="px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full">
                <Text className="text-secondary text-label-xs font-label-xs">Source: Meeting Notes</Text>
              </View>
              <View className="px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full">
                <Text className="text-secondary text-label-xs font-label-xs">Source: E-mail (Sarah K.)</Text>
              </View>
              <View className="px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full">
                <Text className="text-secondary text-label-xs font-label-xs">Source: Voice Memo</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Direct Matches */}
        <View className="mb-xl">
          <Text className="text-label-xs font-label-xs text-outline uppercase tracking-widest mb-lg ml-xs">Direct Matches</Text>
          <View className="flex-col md:flex-row gap-gutter">
            {/* Knowledge Graph Entry */}
            <TouchableOpacity onPress={() => router.push('/(entity)/project')} className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-[24px] p-lg shadow-sm mb-4">
              <View className="flex-row items-start justify-between mb-lg">
                <View className="w-12 h-12 rounded-xl bg-primary-container/10 items-center justify-center">
                  <MaterialIcons name="hub" size={28} color={colors.primary} />
                </View>
                <Text className="text-caption-sm font-caption-sm text-outline">Knowledge Graph</Text>
              </View>
              <Text className="text-title-sm font-title-sm font-bold text-primary mb-xs">Project Nova</Text>
              <Text className="text-body-md font-body-md text-on-surface-variant mb-lg">Internal codename for the next-gen AI OS infrastructure. Connected to: Sarah K., David L., Sprint #42.</Text>
              <View className="flex-row items-center gap-xs mt-auto">
                <Text className="text-secondary font-label-xs text-label-xs">View graph relationships</Text>
                <MaterialIcons name="arrow-forward" size={14} color={colors.secondary} />
              </View>
            </TouchableOpacity>

            {/* Timeline Event */}
            <TouchableOpacity onPress={() => router.push('/(insight)/detail')} className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-[24px] p-lg shadow-sm mb-4">
              <View className="flex-row items-start justify-between mb-lg">
                <View className="w-12 h-12 rounded-xl bg-tertiary-container/10 items-center justify-center">
                  <MaterialIcons name="timeline" size={28} color={colors['on-tertiary-container']} />
                </View>
                <Text className="text-caption-sm font-caption-sm text-outline">2 days ago</Text>
              </View>
              <Text className="text-title-sm font-title-sm font-bold text-primary mb-xs">Timeline Update</Text>
              <Text className="text-body-md font-body-md text-on-surface-variant mb-lg">Sarah King modified the 'Nova_Roadmap_V3.pdf' in the shared cloud directory at 2:45 PM.</Text>
              <View className="w-full h-10 bg-surface-container-high rounded-full items-center justify-center mt-auto">
                <Text className="text-label-xs font-label-xs text-primary font-bold">Review Changes</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bento Insights */}
        <View className="mt-xxl bg-primary rounded-[24px] p-lg shadow-lg">
          <MaterialIcons name="lightbulb" size={40} color={colors.white} />
          <View className="mt-4">
            <Text className="text-title-sm font-bold mb-xs text-white">Proactive Tip</Text>
            <Text className="text-on-primary-container text-body-md">
              Schedule a meeting with Sarah King soon to discuss the compliance bottleneck mentioned in your memo.
            </Text>
          </View>
        </View>

      </ScrollView>
    </Screen>
  );
}
