import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';

export default function GoalEntity() {
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
            <MaterialIcons name="arrow-back" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
          <Text className="font-headline-md text-[32px] text-primary tracking-tight font-bold">Run a Marathon</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary-fixed">
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0Gsl3zC2n97fIVjDPxHlh6Nk2Qrr8MJ53Xt_9TDJHp_80PLz0BTBmVAeag3t4b391rekLax62W6gEe4NlvTMLDCKt_ePeXpmv1zLCmPbEtSOGYFl67U5tT7KHQNn_g4bOGJFOli_cO_t4CuQTKs47q8dKpcO3o_1o5Qy5xoCxLG9L_p2o1TG7E346DcJFdEMXKia0PDSIBmeoRDwGlRq-QZAvhk3Y28vLm5kXcKz4SMtpitrVLQrcao3U_ypDloQQllhxkMcK85Q' }} className="w-full h-full" />
          </View>
        </View>
      </View>

      <View className="px-margin-mobile pt-4 pb-32 flex-col gap-lg">
        {/* Hero Progress Card */}
        <View className="bg-surface-container-lowest rounded-[24px] p-xl border border-outline-variant shadow-sm flex-col relative overflow-hidden min-h-[300px]">
          <View className="z-10 flex-1">
            <View className="bg-secondary-container px-3 py-1 rounded-full self-start mb-4">
              <Text className="text-on-secondary-container font-label-xs text-[10px] uppercase tracking-widest font-bold">Active Journey</Text>
            </View>
            <Text className="font-headline-md text-[32px] text-primary font-bold mb-2">64% Completed</Text>
            <Text className="text-body-md text-on-surface-variant max-w-[80%] leading-relaxed">
              You've logged 270.4 miles of your 422.4 mile training block. Your stamina is trending 12% higher than last month.
            </Text>
          </View>
          
          <View className="mt-8 z-10">
            <View className="w-full h-4 bg-surface-container-high rounded-full overflow-hidden mb-2">
              <View className="h-full w-[64%] rounded-full shadow-[0_0_12px_rgba(0,106,106,0.3)] bg-secondary" />
            </View>
            <View className="flex-row justify-between">
              <Text className="font-label-xs text-[10px] text-on-surface-variant uppercase font-bold">Start: Jan 15</Text>
              <Text className="font-label-xs text-[10px] text-secondary font-bold uppercase">Current: Mar 22</Text>
              <Text className="font-label-xs text-[10px] text-on-surface-variant uppercase font-bold">Goal: Jun 10</Text>
            </View>
          </View>
          
          {/* Decorative Icon */}
          <View className="absolute -right-10 -bottom-10 opacity-10">
            <MaterialIcons name="directions-run" size={240} color={colors.primary} />
          </View>
        </View>

        {/* AI Prediction Card */}
        <View className="bg-primary rounded-[24px] p-xl flex-col shadow-sm relative overflow-hidden">
          <View className="z-10 flex-1">
            <View className="flex-row items-center gap-2 mb-4">
              <MaterialIcons name="psychology" size={20} color={colors['secondary-fixed']} />
              <Text className="text-label-xs text-[10px] uppercase tracking-widest text-secondary-fixed font-bold">AI Insight</Text>
            </View>
            <Text className="font-title-sm text-surface-container-lowest mb-2 text-lg">Projected Finish</Text>
            <Text className="font-display-lg-mobile text-[36px] text-white font-bold mb-2">June 08</Text>
            <Text className="text-caption-sm text-primary-fixed opacity-90 leading-relaxed">
              Based on your current 4-day-a-week habit and increasing split times, you are tracking 2 days ahead of schedule.
            </Text>
          </View>
          <View className="mt-6 pt-4 border-t border-primary-fixed/20 z-10 flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center">
              <MaterialIcons name="trending-up" size={18} color={colors.white} />
            </View>
            <Text className="font-label-xs text-[12px] text-white font-bold uppercase">Confidence Score: 94%</Text>
          </View>
        </View>

        {/* Milestones Section */}
        <View className="bg-surface-container rounded-[24px] p-xl border border-outline-variant flex-col gap-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-title-sm text-primary font-bold text-lg">Milestones</Text>
            <MaterialIcons name="flag" size={24} color={colors['on-surface-variant']} />
          </View>

          <View className="flex-col">
            <View className="flex-row gap-4 items-start">
              <View className="flex-col items-center">
                <View className="w-8 h-8 rounded-full bg-secondary-fixed-dim items-center justify-center">
                  <MaterialIcons name="check" size={18} color={colors['on-secondary-fixed']} />
                </View>
                <View className="w-[2px] h-12 bg-outline-variant mt-2" />
              </View>
              <View className="flex-1 pb-4">
                <Text className="text-label-xs text-on-surface-variant font-bold uppercase mb-1">Feb 02</Text>
                <Text className="text-body-md font-bold text-primary">First 10K Logged</Text>
                <Text className="text-caption-sm text-on-surface-variant">Completed in Central Park with 8:45 split.</Text>
              </View>
            </View>

            <View className="flex-row gap-4 items-start">
              <View className="flex-col items-center">
                <View className="w-8 h-8 rounded-full bg-secondary-fixed-dim items-center justify-center">
                  <MaterialIcons name="check" size={18} color={colors['on-secondary-fixed']} />
                </View>
                <View className="w-[2px] h-12 bg-outline-variant mt-2" />
              </View>
              <View className="flex-1 pb-4">
                <Text className="text-label-xs text-on-surface-variant font-bold uppercase mb-1">Mar 10</Text>
                <Text className="text-body-md font-bold text-primary">Half Marathon Simulation</Text>
                <Text className="text-caption-sm text-on-surface-variant">13.1 miles. Toughest run yet but felt strong.</Text>
              </View>
            </View>

            <View className="flex-row gap-4 items-start">
              <View className="flex-col items-center">
                <View className="w-8 h-8 rounded-full border-2 border-outline-variant items-center justify-center">
                  <MaterialIcons name="lock" size={18} color={colors['on-surface-variant']} />
                </View>
              </View>
              <View className="flex-1">
                <Text className="text-label-xs text-on-surface-variant font-bold uppercase mb-1">Apr 15 (Upcoming)</Text>
                <Text className="text-body-md font-bold text-on-surface-variant">20-Mile Taper Start</Text>
                <Text className="text-caption-sm text-on-surface-variant opacity-60">Prepare mentally for the long duration.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Memory Cloud (Linked Workouts) */}
        <View className="flex-col gap-4">
          <View className="flex-row justify-between items-center">
            <Text className="font-title-sm text-primary font-bold text-lg">Workout Memories</Text>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
              <Text className="text-secondary font-label-xs font-bold uppercase tracking-wider">View All</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-4 h-40">
            {/* Photo 1 */}
            <View className="flex-1 rounded-xl overflow-hidden relative">
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkGfNTogPsMzn3opqYd_p_xNrXpdvICSGwzGu-185MzgtYIt1OkjAC5nNBZimkO8fkgH-zIIYMvD0QYh4IIb8TTuMw_lW2yxkFCJLh6kwXFdZZs_nFCjYZVm1QNy2mWy3fIFzvFQwgaORPIGgl4zsQTmKUtivbydQY713Y5i1hFNxvVUw8oUOXb2-m4R2AzfMXECr18tNi_KylgxHbIpc0EDeeuxOpkN1v7U_DR4-AB_Nr1LXoGR2sMIPFkX1oqvWOeB2r0pZ83gM' }} className="w-full h-full" />
              <View className="absolute inset-0 bg-black/20" />
              <View className="absolute bottom-2 left-2">
                <Text className="text-white text-[10px] font-bold">Morning Run • Mar 12</Text>
              </View>
            </View>
            {/* Voice Memo */}
            <View className="flex-1 bg-surface-container-high rounded-xl border border-outline-variant items-center justify-center p-4">
              <MaterialIcons name="mic" size={32} color={colors.primary} className="mb-2" />
              <Text className="text-label-xs font-bold text-primary text-center">Post-Run Reflection</Text>
              <Text className="text-caption-sm text-on-surface-variant text-center">0:45 • Mar 18</Text>
            </View>
            {/* Photo 2 */}
            <View className="flex-1 rounded-xl overflow-hidden relative">
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkdJhiZP2UCgR1zAioCLiO84vTKYRC21vugLzq2LdvptQd7lBLfK_wyKpjdnvXU6nVS49nBQxomI7wsjtcwF66CoZqXfk6HQx9g2aKijYZ7B5yI4r7r4aCAWIxgs6aTjG4hPcj_XpDDCr_VfZSt0-kpHIInpiyQhohkDx7pUgBx2wLbpTQQU3cMD40d80RZQumMaqgNgbqA3OOdR-o1W2XyNccDGSCvIXnY9mXaH1L9hH8PSJ6DWjbnUbhRS_6-uj0uLTcw9-G3o4' }} className="w-full h-full" />
              <View className="absolute inset-0 bg-black/20" />
              <View className="absolute bottom-2 left-2">
                <Text className="text-white text-[10px] font-bold">Hill Repeats • Mar 20</Text>
              </View>
            </View>
          </View>
        </View>

        {/* AI Persona Encouragement */}
        <View className="bg-tertiary-container rounded-[24px] p-lg flex-row gap-4 items-start border border-tertiary-fixed/30 relative overflow-hidden mt-4">
          <View className="w-12 h-12 rounded-full bg-tertiary-fixed items-center justify-center shrink-0">
            <MaterialIcons name="auto-awesome" size={24} color={colors.tertiary} />
          </View>
          <View className="flex-1 z-10">
            <Text className="font-title-sm text-tertiary-fixed-dim text-[16px] mb-2 font-bold">Encouragement from YRecall</Text>
            <Text className="text-body-md text-on-tertiary-container italic leading-relaxed">
              "I've noticed you've stayed consistent even on rainy days. That mental toughness is what's going to get you through mile 22. You're doing exactly what you said you'd do, and that's the hardest part of any marathon. Keep the pace, stay hydrated, and remember why we started."
            </Text>
          </View>
        </View>

      </View>
    </Screen>
  );
}
