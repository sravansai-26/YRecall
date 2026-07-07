import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';

export default function PersonProfile() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      {/* Top Navigation */}
      <View className="fixed top-0 w-full z-50 bg-surface/80 h-20 flex-row justify-between items-center px-margin-mobile">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            className="w-10 h-10 flex items-center justify-center rounded-full "
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
          <Text className="font-display-lg-mobile text-[36px] font-bold text-primary tracking-tight">YRecall</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/30">
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADTphHkBXybpYdB6hPikIFaRCJcmj2nEsmFTmwJfWiVyltzt-zScryXLTHdi3W1bikRmk5df00YrXEJuuoXWFpVzEhtaWUGRgasBBNyOaXxrn0zx7LFR0VqPOSgU0bYasEj6Up0lMK3lP5RBNLsy9mxB6U2QQqJduB3W2p6HSF2AsQXoTSPjRU_cLav6-YVWIEybbWHNUQsWwZBgKKrD-xFbGe97rktdDpPh_N01T5B0p9wqkZns6SvPzur5LwimMykO3_fxMINHA' }} 
              className="w-full h-full"
            />
          </View>
        </View>
      </View>

      <View className="pt-4 pb-32 px-margin-mobile">
        {/* Hero Header */}
        <View className="mt-lg flex-col md:flex-row items-center md:items-end gap-lg mb-xxl">
          <View className="relative">
            <View className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] overflow-hidden shadow-md">
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAd5GNs-FDoPtNPeDp0uB7PAGbo5_pH0WYDIFlJsvihl-8NwcftLFnosG6RnGBGdmDd6EgRiH-idb1kbbMsAlb8jJ5K2XNr65PaWJafuuUIU62Oqhc0RGHbf0b_oi-IFlQMIdAMFcNJbdNU0uKbX63rwqOdq-M2okvvSOog19pgPEt-8IP6LKsC6Zy0S2YYHClxjQI71rMRHkYsZloqTeAOSJrhcjEgL1k0ZjYIqrhD3nVKzIw3yjU3qoVUzPbhntDO34ylt1pjuI' }} 
                className="w-full h-full"
              />
            </View>
            <View className="absolute -bottom-2 -right-2 bg-secondary text-white w-10 h-10 rounded-full items-center justify-center shadow-lg border-4 border-surface">
              <MaterialIcons name="verified" size={20} color={colors.white} />
            </View>
          </View>
          <View className="flex-1 items-center md:items-start text-center md:text-left mt-4 md:mt-0">
            <Text className="font-headline-md text-[32px] text-primary font-bold mb-1">Sarah Jenkins</Text>
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="work" size={18} color={colors['on-surface-variant']} />
              <Text className="text-on-surface-variant font-body-md">Lead Designer</Text>
            </View>
            <View className="mt-lg flex-row flex-wrap justify-center md:justify-start gap-sm">
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-primary px-8 h-14 rounded-xl flex-row items-center justify-center gap-2 shadow-sm">
                <MaterialIcons name="mail" size={20} color={colors.white} />
                <Text className="font-bold text-white">Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-white px-8 h-14 rounded-xl flex-row items-center justify-center gap-2 shadow-sm border border-outline-variant/30">
                <MaterialIcons name="auto-awesome" size={20} color={colors.secondary} />
                <Text className="font-medium text-on-surface">Ask AI about Sarah</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bento Grid Content */}
        <View className="flex-col gap-lg">
          {/* Key Context Card */}
          <View className="bg-white rounded-[24px] p-lg shadow-sm border border-surface-container-highest">
            <View className="flex-row items-center gap-3 mb-xl">
              <View className="w-10 h-10 rounded-full bg-secondary-container items-center justify-center">
                <MaterialIcons name="lightbulb" size={20} color={colors['on-secondary-container']} />
              </View>
              <Text className="font-title-sm text-primary font-bold text-lg">Context</Text>
            </View>
            <View className="flex-col gap-6">
              <View>
                <Text className="text-label-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Current Focus</Text>
                <Text className="font-body-md text-on-surface">Collaborating on <Text className="font-bold text-secondary">Q3 Redesign</Text> across all platforms.</Text>
              </View>
              <View>
                <Text className="text-label-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Last Met</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="font-body-md text-on-surface">2 days ago</Text>
                  <View className="bg-surface-container px-2 py-0.5 rounded-full"><Text className="text-xs text-outline">Virtual</Text></View>
                </View>
              </View>
              <View className="p-md bg-surface-container-low rounded-2xl border border-outline-variant/20">
                <Text className="text-sm italic text-on-surface-variant">"Mentioned she wants to simplify the navigation shell by removing top borders."</Text>
              </View>
            </View>
          </View>

          {/* Relationships Card */}
          <View className="bg-white rounded-[24px] p-lg shadow-sm border border-surface-container-highest">
            <View className="flex-row justify-between items-center mb-xl">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-primary-container items-center justify-center">
                  <MaterialIcons name="hub" size={20} color={colors['on-primary-container']} />
                </View>
                <Text className="font-title-sm text-primary font-bold text-lg">Relationships</Text>
              </View>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
                 <Text className="text-secondary text-sm font-semibold">View All</Text>
              </TouchableOpacity>
            </View>
            
            <View className="flex-col gap-md">
              {/* Relation Item */}
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-4 p-md rounded-2xl ">
                <View className="w-12 h-12 rounded-xl bg-surface-container-highest items-center justify-center">
                  <MaterialIcons name="domain" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text className="font-bold text-on-surface">Design Studio</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Company</Text>
                </View>
              </TouchableOpacity>
              {/* Relation Item */}
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-4 p-md rounded-2xl ">
                <View className="w-12 h-12 rounded-xl bg-surface-container-highest items-center justify-center">
                  <MaterialIcons name="rocket-launch" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text className="font-bold text-on-surface">Q3 Redesign</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Project Lead</Text>
                </View>
              </TouchableOpacity>
              {/* Relation Item */}
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-4 p-md rounded-2xl ">
                <View className="w-12 h-12 rounded-xl bg-surface-container-highest items-center justify-center">
                  <MaterialIcons name="groups" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text className="font-bold text-on-surface">Core UI Team</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Engineering</Text>
                </View>
              </TouchableOpacity>
              {/* Relation Item */}
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-4 p-md rounded-2xl ">
                <View className="w-12 h-12 rounded-xl bg-surface-container-highest items-center justify-center">
                  <MaterialIcons name="location-on" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text className="font-bold text-on-surface">London, UK</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Primary Office</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Connected Memories Timeline */}
          <View className="bg-white rounded-[24px] p-lg shadow-sm border border-surface-container-highest mt-lg">
            <View className="flex-row items-center gap-3 mb-xl">
              <View className="w-10 h-10 rounded-full bg-tertiary-fixed items-center justify-center">
                <MaterialIcons name="history" size={20} color={colors['on-tertiary-fixed']} />
              </View>
              <Text className="font-title-sm text-primary font-bold text-lg">Connected Memories</Text>
            </View>
            
            <View className="relative">
              {/* Timeline Item */}
              <View className="flex-row gap-4 items-start relative mb-xl">
                <View className="w-4 h-4 rounded-full bg-secondary border-4 border-surface z-10 mt-3" />
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 bg-surface-container-low p-md rounded-2xl">
                  <View className="flex-row justify-between mb-1">
                    <View className="flex-row items-center gap-2">
                       <MaterialIcons name="groups" size={18} color={colors.secondary} />
                       <Text className="font-bold text-primary">Bi-weekly Design Sync</Text>
                    </View>
                  </View>
                  <Text className="text-body-md text-on-surface-variant mt-1">Reviewed the mobile bottom bar transitions. Sarah emphasized the "Calm" principle for the active state.</Text>
                  <View className="mt-md flex-row gap-2">
                    <View className="bg-white px-3 py-1 rounded-full border border-outline-variant/20"><Text className="text-xs text-on-surface-variant">Zoom Recording</Text></View>
                    <View className="bg-white px-3 py-1 rounded-full border border-outline-variant/20"><Text className="text-xs text-on-surface-variant">3 Participants</Text></View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Timeline Item */}
              <View className="flex-row gap-4 items-start relative mb-xl">
                <View className="w-4 h-4 rounded-full bg-outline-variant border-4 border-surface z-10 mt-3" />
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 bg-white p-md rounded-2xl border border-surface-container-highest shadow-sm">
                  <View className="flex-row justify-between mb-1">
                    <View className="flex-row items-center gap-2">
                       <MaterialIcons name="mail" size={18} color={colors.primary} />
                       <Text className="font-bold text-primary">Re: Figma Comments - Core Navigation</Text>
                    </View>
                  </View>
                  <Text className="text-body-md text-on-surface-variant mt-1">Thread regarding the 8px grid system vs the fluid 12-column grid for tablet breakpoints.</Text>
                </TouchableOpacity>
              </View>
              
            </View>
          </View>
        </View>
      </View>

      {/* FAB */}
      <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="absolute bottom-6 right-6 w-16 h-16 bg-primary rounded-2xl shadow-xl items-center justify-center z-40">
        <MaterialIcons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
    </Screen>
  );
}
