import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';

export default function SubscriptionEntity() {
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
          <Text className="font-headline-md text-[32px] text-primary tracking-tight font-bold">Netflix</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full ">
            <MaterialIcons name="share" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant">
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc8C2U9jh-7mYJNgCVnnMLNuUHWxrSWdIuBa7W93X2HfXz8YTdfHz8Ur7bl_FPU6Ba2vLTKeAu5O25acOEJ788cg9r26b84giCQleAoDGtN0Y0ZwnhTZIwuIb6MRglCjTsYA86DPmoNXMMOYUa3Zc4IYCZuxM12OpJwpZi0UR0KoVuk8ky4ZnTWcFHEyH26wHydWff6epJGkZIKhkqKOsKC7O4VRzOJ1FKlGs042zA7os7sexGXQ0-9ZGQfkuVjpUnjuREc71UyxQ' }} className="w-full h-full" />
          </View>
        </View>
      </View>

      <View className="px-margin-mobile pt-4 pb-32 flex-col gap-lg">
        {/* Hero Section / Brand Identity */}
        <View className="flex-col gap-lg">
          <View className="relative h-64 rounded-[24px] overflow-hidden shadow-sm">
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVYGq9ZZP_Jl8qlJQZXFLPIweGezUwb2gkFeO0D6GazCZywLsGD1fPSl0JDq1me8NlvNXatJLjJJY-4i9J0IgReXOOpC6y14qd3kZ9-gA7E-l0cVWR8FHeDvsU5XvBf9mNmngi25e2tAHij5XqaekhmdHagKGbQTb6WuqR4F0TSulgQyrrEhMctuRtDJwnrsWuPgUfCsM6auMqCgvabkWXxQA8ogogtn687a0kv4xG4soejtIrMeXfXa8JLpOofSRip_Pz3iGPgWo' }} className="w-full h-full" />
            <View className="absolute inset-0 bg-black/40" />
            <View className="absolute bottom-6 left-6 flex-row items-center gap-4">
              <View className="w-16 h-16 bg-white rounded-xl items-center justify-center shadow-md">
                <MaterialIcons name="movie" size={32} color={colors.error} />
              </View>
              <View>
                <Text className="text-white/80 font-label-xs text-[10px] uppercase tracking-widest font-bold">Entertainment Subscription</Text>
                <Text className="text-white font-headline-md text-[32px] font-bold">Netflix Premium</Text>
              </View>
            </View>
          </View>

          {/* Bento Grid - Subscription Details */}
          <View className="flex-col gap-4">
            <View className="flex-row gap-4 h-40">
              {/* Monthly Cost */}
              <View className="flex-1 bg-white p-lg rounded-[24px] shadow-sm border border-surface-variant flex-col justify-between">
                <View>
                  <Text className="text-on-surface-variant text-body-md mb-2">Monthly Cost</Text>
                  <Text className="font-headline-md text-primary text-[28px] font-bold">$19.99</Text>
                </View>
                <View className="mt-2 pt-2 border-t border-surface-variant flex-row items-center">
                  <MaterialIcons name="trending-up" size={16} color={colors.secondary} />
                  <Text className="text-secondary text-[12px] font-bold ml-1">Increased by $2.00</Text>
                </View>
              </View>
              {/* Renewal Date */}
              <View className="flex-1 bg-white p-lg rounded-[24px] shadow-sm border border-surface-variant flex-col justify-between">
                <View>
                  <Text className="text-on-surface-variant text-body-md mb-2">Next Renewal</Text>
                  <Text className="font-headline-md text-primary text-[28px] font-bold">May 14, 2024</Text>
                </View>
                <View className="mt-2 pt-2 border-t border-surface-variant flex-row items-center">
                  <MaterialIcons name="calendar-today" size={16} color={colors['on-surface-variant']} />
                  <Text className="text-on-surface-variant text-[12px] font-bold ml-1">12 days remaining</Text>
                </View>
              </View>
            </View>

            {/* Payment Method */}
            <View className="bg-white p-lg rounded-[24px] shadow-sm border border-surface-variant flex-row items-center justify-between">
              <View>
                <Text className="text-on-surface-variant text-body-md mb-2">Payment Method</Text>
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="credit-card" size={24} color={colors.primary} />
                  <Text className="font-title-sm text-primary font-bold">Visa •••• 4242</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-6 py-2 rounded-xl bg-surface-container ">
                <Text className="text-primary font-bold uppercase text-[10px]">Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AI Usage Analysis */}
          <View className="bg-white p-lg rounded-[24px] shadow-sm border border-secondary/20 relative overflow-hidden flex-col gap-4">
             <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="auto-awesome" size={24} color={colors.secondary} />
                  <Text className="font-title-sm text-primary font-bold text-lg">AI Usage Insight</Text>
                </View>
                <View className="px-3 py-1 bg-secondary/10 rounded-full">
                  <Text className="text-secondary font-label-xs text-[10px] uppercase tracking-wider font-bold">Highly Efficient</Text>
                </View>
             </View>
             <View className="flex-col gap-4">
               <View className="flex-row items-center justify-center p-4 bg-background rounded-xl border border-secondary-container/30">
                 <View className="w-24 h-24 items-center justify-center border-[8px] border-secondary rounded-full">
                   <Text className="font-bold text-primary text-[24px]">88%</Text>
                   <Text className="text-caption-sm text-on-surface-variant">Usage</Text>
                 </View>
                 <View className="ml-6">
                   <Text className="text-on-surface-variant text-caption-sm text-center">Daily avg: 1.4 hours</Text>
                 </View>
               </View>
               <View>
                 <Text className="text-body-md text-on-surface leading-relaxed">
                   Your Netflix usage remains high, averaging <Text className="font-bold text-primary">42 hours</Text> of content per month. At <Text className="font-bold text-primary">$0.47 per hour</Text>, this subscription provides exceptional value compared to your typical cinema visits ($9.50/hr).
                 </Text>
                 <View className="flex-row flex-wrap gap-2 mt-4">
                   <View className="bg-secondary-container/50 px-3 py-1 rounded-full">
                     <Text className="text-on-secondary-container text-[12px] font-bold">Binge-Watching Peak (Weekends)</Text>
                   </View>
                   <View className="bg-secondary-container/50 px-3 py-1 rounded-full">
                     <Text className="text-on-secondary-container text-[12px] font-bold">Top Genre: Scifi</Text>
                   </View>
                 </View>
               </View>
             </View>
          </View>
        </View>

        {/* Sidebar / Actions */}
        <View className="flex-col gap-lg mt-4">
          {/* Controls & Settings */}
          <View className="bg-white p-lg rounded-[24px] shadow-sm border border-surface-variant flex-col gap-4">
            <Text className="font-title-sm text-primary font-bold text-lg">Preference Engine</Text>
            
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="receipt-long" size={24} color={colors['on-surface-variant']} />
                <View>
                  <Text className="text-body-md text-on-surface font-bold">Auto-archive receipts</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Store in Finance folder</Text>
                </View>
              </View>
              {/* Dummy toggle */}
              <View className="w-11 h-6 bg-primary rounded-full relative">
                 <View className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="monitor" size={24} color={colors['on-surface-variant']} />
                <View>
                  <Text className="text-body-md text-on-surface font-bold">Usage Monitoring</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Analyze screentime data</Text>
                </View>
              </View>
              {/* Dummy toggle */}
              <View className="w-11 h-6 bg-primary rounded-full relative">
                 <View className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </View>
            </View>
          </View>

          {/* Related Memories */}
          <View className="bg-white p-lg rounded-[24px] shadow-sm border border-surface-variant flex-col gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-title-sm text-primary font-bold text-lg">Related Memories</Text>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
                <Text className="text-secondary font-label-xs font-bold uppercase">View All</Text>
              </TouchableOpacity>
            </View>
            
            <View className="flex-col gap-2">
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row gap-3 p-2 rounded-xl ">
                <View className="w-14 h-14 rounded-lg overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBN-R1kXTn5mHwA2ayiHJ-967WV9qZmWFQngnB8Sf-zMdizmSWVd0FQcjxllVxxDE7Guz0KoKrKeAYAqA0ZbGLT3C4JyuCMrTaJz5sECnd7Jy3RL9wx5xeaLzly2iDLN2mDL5QCNfm0f2qlxuc-SFc0n5SGovQjfbpYjUeOHrRNcE67q6r4F1vvj-WlIVzxBhItn9UYW_KC3rnFFj4ObSTMBa6kAkuBO70XeYlHcLamYkuCeC0TkcqoEerRo24htShIrrMnjPXoqbs' }} className="w-full h-full" />
                </View>
                <View className="justify-center">
                  <Text className="text-on-surface font-bold">Movie Night with Sarah</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Oct 24, 2023 • Entertainment</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row gap-3 p-2 rounded-xl ">
                <View className="w-14 h-14 rounded-lg overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCofcC5vnJArnMb8UngIqbAE3m_zZ3Lp41MaPxDexXUZQqbfjuboSlvzXAh1s8nCn4mRw42KcvM8xiJ0x1mdpD9QEDZdjpkGHaHMqt6dZs-IwYqiLr_2uetiZ_gHxv_QwX89RQtTaBUWcv9HhMi8WTlqtg1DmohTxnZSq0H1E6e1UjolTVAG9ksFc64_SDOUl0cPPnX9Vqm8wm-6-WJbjnrsAAVwVQOfFuL4Vy6k4vr4TM9Qf8pin5r__7HrlQ0diw68_hk4Q-xsUA' }} className="w-full h-full" />
                </View>
                <View className="justify-center">
                  <Text className="text-on-surface font-bold">Interstellar IMAX Weekend</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Dec 02, 2023 • Entertainment</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row gap-3 p-2 rounded-xl ">
                <View className="w-14 h-14 rounded-lg overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmVMFDvKxhHtXb4QvvYhTkOUOQBHTBSFO5vVYzBgf3jXNGvYLBaLwB71crHmoGQxYoeenYKJRGUk6KYqK_gLPESLI1HPoS_qaHgQR02XdHdoJQwtIVJcRZ_tsI0W8WKIsmdURFJ2Yjfw6ISV8-PMbNHodaGbGf6_pj3a0zbqsmKGI0A25M2glk7EnzRIf1ijI14qDToFpsP396T08FLVRQTqdrvBQSj5xsJlufudRWWhCCkyhaD105lc5P5v9Mk5tnqxzcNLX9t_4' }} className="w-full h-full" />
                </View>
                <View className="justify-center">
                  <Text className="text-on-surface font-bold">2023 Wrapped List</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Jan 01, 2024 • Insights</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Danger Zone */}
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full py-4 rounded-[24px] border border-error/20 bg-error/5 flex-row items-center justify-center gap-2">
            <MaterialIcons name="cancel" size={20} color={colors.error} />
            <Text className="text-error font-bold">Cancel Subscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
