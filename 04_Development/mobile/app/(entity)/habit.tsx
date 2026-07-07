import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, AIBentoCard } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';

export default function HabitEntity() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      {/* Top App Bar */}
      <View className="fixed top-0 w-full z-50 bg-surface h-16 flex-row justify-between items-center px-margin-mobile">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            className="p-2 rounded-full "
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-[32px] text-primary tracking-tight font-bold">Morning Meditation</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full ">
            <MaterialIcons name="share" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border border-outline-variant">
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4BoWg5ugGXJMZxuBClENLMyMFKf9gXUIqaVhzD27h1--Sl3d5ovGKk5tDJnYtSX1H2ZiTd6kp6JiyJHm2UTO5575Jv4GNZtP7sYGEUOXe0Ob0ZoiT_5-gY1YFjfMtp2kfAyxmb1wUg1pSVycUKWbBCDEQiksruGiqsW68y1FJeLRXSay6QtPH6saDKrB1Po4KPNtDzsvWz9aTXBUZBiP8-ifoQQiQiyDW8xG5Vc_3YhoEzQwbs5d6tj1Ljg-7MuTDkvt61sSgfrc' }} className="w-full h-full" />
          </View>
        </View>
      </View>

      <View className="px-margin-mobile pt-4 pb-32 flex-col gap-lg">
        {/* Hero Header & Stats Grid */}
        <View className="flex-col gap-lg">
          {/* Habit Identity Card */}
          <View className="bg-white rounded-[24px] p-xl shadow-sm border border-outline-variant/30 relative overflow-hidden">
            <View className="absolute top-0 right-0 p-lg opacity-10">
              <MaterialIcons name="self-improvement" size={120} color={colors.primary} />
            </View>
            <View className="relative z-10">
              <View className="flex-row items-center gap-2 mb-4">
                <View className="bg-secondary-container px-3 py-1 rounded-full">
                  <Text className="text-on-secondary-container font-label-xs text-[10px] uppercase tracking-widest font-bold">Mindfulness</Text>
                </View>
                <Text className="text-on-surface-variant text-caption-sm">Started Oct 2023</Text>
              </View>
              <Text className="font-body-md text-on-surface-variant max-w-[90%] leading-relaxed mb-6">
                A daily 15-minute practice focused on breath awareness and sensory grounding to start the day with clarity and focus.
              </Text>
              
              <View className="flex-row flex-wrap justify-between gap-4">
                <View>
                  <Text className="text-on-surface-variant font-label-xs text-[10px] uppercase mb-1">Current Streak</Text>
                  <Text className="font-headline-md text-primary text-[28px] font-bold">12 Days</Text>
                </View>
                <View>
                  <Text className="text-on-surface-variant font-label-xs text-[10px] uppercase mb-1">Best Streak</Text>
                  <Text className="font-headline-md text-primary text-[28px] font-bold">45 Days</Text>
                </View>
                <View>
                  <Text className="text-on-surface-variant font-label-xs text-[10px] uppercase mb-1">Completion</Text>
                  <Text className="font-headline-md text-primary text-[28px] font-bold">94%</Text>
                </View>
                <View>
                  <Text className="text-on-surface-variant font-label-xs text-[10px] uppercase mb-1">Total Hours</Text>
                  <Text className="font-headline-md text-primary text-[28px] font-bold">32.5h</Text>
                </View>
              </View>
            </View>
          </View>

          {/* AI Insight Bento Box */}
          <AIBentoCard 
            title="AI Correlation" 
            actionText="Explore Life Log Links"
            onActionPress={() => {}}
            containerClassName="border-secondary/20"
          >
            <Text className="text-body-md text-on-surface-variant italic leading-relaxed">
              "Your 'Life Log' suggests a 22% increase in focus scores on days you meditate before 8:00 AM. Interestingly, your sleep quality also correlates positively (+14%) on these days."
            </Text>
          </AIBentoCard>
        </View>

        {/* Data Visuals Section */}
        <View className="flex-col gap-lg">
          {/* 30-Day Streak Heatmap */}
          <View className="bg-white rounded-[24px] p-xl shadow-sm border border-outline-variant/30">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-title-sm text-primary font-bold text-lg">Last 30 Days</Text>
              <View className="flex-row gap-2">
                <View className="w-3 h-3 rounded-sm bg-surface-container-highest" />
                <View className="w-3 h-3 rounded-sm bg-secondary-fixed" />
                <View className="w-3 h-3 rounded-sm bg-secondary" />
              </View>
            </View>
            <View className="flex-row flex-wrap gap-2 justify-center">
              {Array.from({ length: 30 }).map((_, i) => (
                <View 
                  key={i} 
                  className={`w-10 h-10 rounded-md ${
                    i % 4 === 0 ? 'bg-secondary' : 
                    i % 3 === 0 ? 'bg-secondary-fixed' : 
                    'bg-surface-container-highest'
                  }`} 
                />
              ))}
            </View>
            <View className="flex-row justify-between mt-4">
              <Text className="text-caption-sm text-on-surface-variant">30 days ago</Text>
              <Text className="text-caption-sm text-on-surface-variant">Today</Text>
            </View>
          </View>
          
          {/* Frequency/Intensity Chart */}
          <View className="bg-white rounded-[24px] p-xl shadow-sm border border-outline-variant/30">
            <Text className="font-title-sm text-primary font-bold text-lg mb-6">Weekly Focus Intensity</Text>
            <View className="flex-row items-end justify-between h-40 gap-4">
              <View className="flex-1 bg-surface-container-high rounded-t-lg h-[60%]" />
              <View className="flex-1 bg-secondary-fixed rounded-t-lg h-[85%]" />
              <View className="flex-1 bg-secondary rounded-t-lg h-[95%]" />
              <View className="flex-1 bg-secondary-fixed rounded-t-lg h-[70%]" />
              <View className="flex-1 bg-surface-container-high rounded-t-lg h-[40%]" />
              <View className="flex-1 bg-secondary-fixed rounded-t-lg h-[80%]" />
              <View className="flex-1 bg-secondary rounded-t-lg h-[100%]" />
            </View>
            <View className="flex-row justify-between mt-4">
              {['M','T','W','T','F','S','S'].map((day, i) => (
                <Text key={i} className="text-label-xs text-on-surface-variant font-bold flex-1 text-center">{day}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* Linked Reflections & Journal Entries */}
        <View className="flex-col gap-4">
          <View className="flex-row justify-between items-center px-2">
            <Text className="font-title-sm text-primary font-bold text-lg">Linked Reflections</Text>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
              <Text className="text-secondary font-label-xs font-bold uppercase tracking-widest">View All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-col gap-4">
            {/* Entry Card 1 */}
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-white rounded-[24px] p-lg shadow-sm border border-outline-variant/30">
              <View className="flex-row justify-between items-start mb-2">
                <View>
                  <Text className="text-label-xs text-on-surface-variant uppercase font-bold tracking-tighter">Tuesday, Oct 24</Text>
                  <Text className="font-title-sm text-primary font-bold mt-1 text-lg">Quiet mind, active body</Text>
                </View>
                <MaterialIcons name="sentiment-very-satisfied" size={24} color={colors.secondary} />
              </View>
              <Text className="text-body-md text-on-surface-variant leading-relaxed" numberOfLines={3}>
                Focused on the breath today. Felt a bit restless at first, but settled into a deep rhythmic pattern around the 10-minute mark. Noticed a sharp reduction in morning anxiety...
              </Text>
              <View className="flex-row gap-2 mt-4">
                <View className="bg-surface-container-high px-2 py-1 rounded">
                  <Text className="text-on-surface-variant text-[10px] font-bold">#clarity</Text>
                </View>
                <View className="bg-surface-container-high px-2 py-1 rounded">
                  <Text className="text-on-surface-variant text-[10px] font-bold">#breathwork</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Entry Card 2 */}
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-white rounded-[24px] p-lg shadow-sm border border-outline-variant/30">
              <View className="flex-row justify-between items-start mb-2">
                <View>
                  <Text className="text-label-xs text-on-surface-variant uppercase font-bold tracking-tighter">Sunday, Oct 22</Text>
                  <Text className="font-title-sm text-primary font-bold mt-1 text-lg">Digital detox thoughts</Text>
                </View>
                <MaterialIcons name="sentiment-neutral" size={24} color={colors['on-surface-variant']} />
              </View>
              <Text className="text-body-md text-on-surface-variant leading-relaxed" numberOfLines={3}>
                Meditation helped me realize how much time I spend scrolling before I even get out of bed. Goal for next week: No phone until after practice...
              </Text>
              <View className="flex-row gap-2 mt-4">
                <View className="bg-surface-container-high px-2 py-1 rounded">
                  <Text className="text-on-surface-variant text-[10px] font-bold">#mindfulness</Text>
                </View>
                <View className="bg-surface-container-high px-2 py-1 rounded">
                  <Text className="text-on-surface-variant text-[10px] font-bold">#goals</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Contextual FAB */}
      <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-2xl shadow-xl items-center justify-center">
        <MaterialIcons name="edit" size={24} color={colors.white} />
      </TouchableOpacity>
    </Screen>
  );
}
