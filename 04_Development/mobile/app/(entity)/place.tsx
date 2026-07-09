import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';

export default function PlaceProfile() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      {/* Top Navigation */}
      <View className="absolute top-0 w-full z-50 bg-black/20 h-24 pt-10 flex-row justify-between items-center px-margin-mobile">
        <TouchableOpacity 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-10 h-10 rounded-full bg-black/20 items-center justify-center">
            <MaterialIcons name="notifications" size={24} color={colors.white} />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/30">
            <MaterialIcons name="person" size={24} color={colors['on-surface-variant']} />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 w-full bg-surface" contentContainerStyle={{ paddingBottom: 100 }} bounces={false}>
        {/* Hero Header */}
        <View className="relative w-full h-[400px]">
          <Image 
             source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYgqzwnmuTEIfSiPeIKm3l9BXqwQrtXPxLylGd0sQV7RVboUZ-16QX612C5L_m3SFsOgWSZ4l0KImIFkYb0bRczOJUI72oLiL8Ng2pvtRmV7b5t5gRaR5675StTmsQeGg7PB45QLQv07WQkNeYH7L8dE8wHPcuSGS9ZcBXteB4Ynogym0m2Wu5NOEtu7eb8dwEVbmvuPhfvsKmNeHDSXmBgSsLs1SAsBJugitt3D_J0ytmt0iTn6G6ESJNC2XchMal2IZaej3u_So' }} 
             className="w-full h-full"
          />
          <View className="absolute inset-0 bg-black/40" />
          <View className="absolute bottom-0 left-0 w-full p-margin-mobile">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="bg-secondary-container px-3 py-1 rounded-full">
                <Text className="text-on-secondary-container font-bold text-[10px] uppercase tracking-widest">Retreat</Text>
              </View>
              <Text className="text-white/80 text-sm">• California, USA</Text>
            </View>
            <Text className="font-headline-md text-[36px] font-bold text-white">Lake Tahoe Cabin</Text>
          </View>
        </View>

        <View className="px-margin-mobile py-xl flex-col gap-lg">
          {/* Location & Weather */}
          <View className="bg-white rounded-[24px] p-lg shadow-sm border border-outline-variant/10">
            <Text className="font-title-sm text-primary font-bold text-lg mb-4">Location</Text>
            <View className="w-full aspect-video bg-surface-container rounded-xl mb-4 items-center justify-center">
               <MaterialIcons name="location-on" size={32} color={colors.error} />
            </View>
            <View className="flex-row items-center justify-between p-4 bg-surface-container-low rounded-xl">
               <View className="flex-row items-center gap-3">
                 <MaterialIcons name="cloud" size={32} color={colors.secondary} />
                 <View>
                   <Text className="font-bold text-on-surface text-base">68°F</Text>
                   <Text className="text-caption-sm text-on-surface-variant">Partly Cloudy</Text>
                 </View>
               </View>
               <View className="items-end">
                 <Text className="text-caption-sm text-on-surface-variant">Feels like 65°</Text>
                 <Text className="text-caption-sm text-secondary font-bold">Perfect for a hike</Text>
               </View>
            </View>
          </View>

          {/* AI Insight Card */}
          <View className="bg-primary rounded-[24px] p-lg relative overflow-hidden shadow-md">
            <View className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/20 rounded-full" />
            <View className="relative z-10 flex-col gap-4 items-start">
               <View className="w-14 h-14 bg-white/10 rounded-2xl items-center justify-center">
                 <MaterialIcons name="auto-awesome" size={28} color={colors['secondary-fixed']} />
               </View>
               <View>
                 <Text className="font-bold text-white text-lg mb-1">Smart Recall</Text>
                 <Text className="text-white/90 text-body-md leading-relaxed">
                   You typically visit this location when you mention feeling "overwhelmed" in your journal. It's your top-rated sanctuary for mental clarity.
                 </Text>
               </View>
               <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-white px-6 py-3 rounded-full mt-2">
                 <Text className="text-primary font-bold">Plan Next Visit</Text>
               </TouchableOpacity>
            </View>
          </View>

          {/* Visits Timeline */}
          <View className="bg-white rounded-[24px] p-lg shadow-sm border border-outline-variant/10">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-title-sm text-primary font-bold text-lg">Recent Visits</Text>
              <Text className="text-primary font-bold text-xs uppercase">12 Total</Text>
            </View>
            <View className="flex-col gap-4">
              <View className="flex-row items-start gap-4">
                <View className="mt-2 w-3 h-3 rounded-full bg-secondary border-2 border-secondary-container" />
                <View>
                  <Text className="font-bold text-on-surface text-base">Aug 14 - Aug 20, 2024</Text>
                  <Text className="text-caption-sm text-on-surface-variant italic">"The lakeside sunset was unforgettable."</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-4">
                <View className="mt-2 w-3 h-3 rounded-full bg-outline-variant" />
                <View>
                  <Text className="font-bold text-on-surface text-base">Dec 22 - Jan 2, 2024</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Winter Holidays 2023</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-4">
                <View className="mt-2 w-3 h-3 rounded-full bg-outline-variant" />
                <View>
                  <Text className="font-bold text-on-surface text-base">July 4 - July 8, 2023</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Summer Kickoff</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Memories Bento Grid */}
          <View className="flex-col gap-4">
            <View className="flex-row justify-between items-end mb-2">
              <View>
                <Text className="font-headline-md text-[28px] text-primary font-bold">Related Memories</Text>
                <Text className="text-on-surface-variant text-sm">Photos and notes from your stays</Text>
              </View>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-1">
                 <Text className="text-primary font-bold">View All</Text>
                 <MaterialIcons name="open-in-new" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row gap-4 h-48">
               <View className="flex-[2] rounded-[24px] overflow-hidden relative">
                 <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0ekfZfLwyk32x8wIo2a46olgBP8b7qGsMdh5dQsQfoB86dgK0U4ILATQRbK8yxDTrJCdu-mrUyQfCyz-YXE8Heli-NpPICAzfqstD6zzg9wq2omh3QmULr2ICDMhOoXrgCDWIOgvZ4CL5aeX_3HSA5uAMFXk4AUosBETC29ORFdTjPKY1Zc1jPfbOjVQLX5i48MOYnwoGSITnYZ0Zaj4inKlZziTxoZwqKfSGFnOZrr6lAQRp-u4yHka85OLqK8f8JgY_k45rnCw' }} className="w-full h-full" />
                 <View className="absolute inset-0 bg-black/30" />
                 <View className="absolute bottom-4 left-4">
                   <Text className="text-white/80 text-xs">Last Night Celebration</Text>
                   <Text className="text-white font-bold">Aug 19, 2024</Text>
                 </View>
               </View>
               <View className="flex-[1] rounded-[24px] overflow-hidden relative">
                 <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_AadlecehVAyXLTIuHU-Jp1L8NZ0dj3QZP-Ns3TCugUwX5LTiifejsimNTuE5A5UR5azIRYOPOPzDnOqBEXnGReQLKTrrVXVFfzWmE4T1TqnASug0Ap78glHhJ6ykKmny-A7U1Ki9fWADLqKL5Hqcwo1m0c6Z7KiYRZe3sO_TEgRky9O7SrWOB4M-91ylQMq223o7KLEnYgQdM1C4-PCxUGdkdJ4L3orjmEiUrKNaawh4iQWmz6EhgKri3LlQpo3-JsEXTd6Bli8' }} className="w-full h-full" />
               </View>
            </View>

            <View className="bg-secondary-fixed p-lg rounded-[24px] shadow-sm flex-col gap-2">
               <MaterialIcons name="format-quote" size={24} color={colors.secondary} />
               <Text className="text-on-secondary-fixed text-body-md italic leading-relaxed">"The air here just feels different. Can we stay another week?"</Text>
               <Text className="text-on-secondary-fixed text-caption-sm font-bold mt-2 opacity-80">— Sarah</Text>
            </View>
          </View>

          {/* Favorite Spots Chips */}
          <View className="bg-surface-container rounded-[24px] p-lg border border-outline-variant/20 mt-4">
            <View className="flex-row items-center gap-4 mb-4">
               <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                 <MaterialIcons name="stars" size={20} color={colors.secondary} />
               </View>
               <View>
                 <Text className="font-bold text-primary text-lg">Favorite Spots Mentioned</Text>
                 <Text className="text-caption-sm text-on-surface-variant italic">AI-curated from your notes and chat history</Text>
               </View>
            </View>
            <View className="flex-row flex-wrap gap-2">
               <View className="bg-white px-4 py-2 rounded-full border border-outline-variant/30 flex-row items-center gap-2">
                 <MaterialIcons name="hiking" size={18} color={colors.secondary} />
                 <Text className="font-medium">Eagle Falls Trail</Text>
               </View>
               <View className="bg-white px-4 py-2 rounded-full border border-outline-variant/30 flex-row items-center gap-2">
                 <MaterialIcons name="restaurant" size={18} color={colors.secondary} />
                 <Text className="font-medium">The Beacon Grill</Text>
               </View>
               <View className="bg-white px-4 py-2 rounded-full border border-outline-variant/30 flex-row items-center gap-2">
                 <MaterialIcons name="sailing" size={18} color={colors.secondary} />
                 <Text className="font-medium">Emerald Bay Dock</Text>
               </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
