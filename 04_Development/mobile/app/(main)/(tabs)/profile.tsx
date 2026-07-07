import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';

export default function KnowledgeGraphHub() {
  const router = useRouter();
  const { user } = useAuthStore();
  return (
    <Screen scrollable={false}>
      {/* Top Header */}
      <View className="bg-surface/80 z-50 h-20 w-full flex-row items-center justify-between px-margin-mobile">
        <View className="flex-row items-center gap-4">
          <Text className="font-display-lg-mobile text-[36px] font-bold text-primary tracking-tight">YRecall</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="hidden md:flex flex-row items-center gap-2 px-4 py-2 rounded-full ">
            <MaterialIcons name="search" size={24} color={colors['on-surface-variant']} />
            <Text className="font-title-sm text-sm text-on-surface-variant">Explore Hub</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full ">
            <MaterialIcons name="notifications" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(main)/profile-edit')} className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden">
             {user?.photoURL ? (
               <Image 
                  source={{ uri: user.photoURL }} 
                  className="w-full h-full"
               />
             ) : (
               <View className="w-full h-full bg-primary/20 items-center justify-center">
                 <Text className="font-bold text-primary">{user?.displayName?.charAt(0) || 'U'}</Text>
               </View>
             )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 w-full max-w-7xl mx-auto px-margin-mobile pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Search & Header */}
        <View className="mb-xl flex-col md:flex-row md:items-end justify-between gap-6">
          <View>
            <Text className="font-headline-md text-[32px] text-primary mb-2 font-bold">Digital Brain</Text>
            <Text className="text-body-md text-on-surface-variant max-w-xl">
              Visualize the neural network of your memories, connections, and projects. Your digital self, mapped in real-time.
            </Text>
          </View>
          <View className="relative w-full md:w-96">
            <View className="absolute left-4 top-4 z-10">
              <MaterialIcons name="search" size={24} color={colors.outline} />
            </View>
            <View className="w-full h-14 pl-12 pr-4 bg-white border border-[#D1CDC7] rounded-xl justify-center">
              <Text className="text-outline-variant font-body-md">Search your knowledge graph...</Text>
            </View>
          </View>
        </View>

        {/* Relationship Map / Bento Grid */}
        <View className="mb-xxl">
          <View className="flex-col md:flex-row gap-6">
            {/* Main Visual Map */}
            <View className="md:flex-[2] h-[400px] bg-white rounded-[24px] shadow-sm border border-secondary-container/30 relative overflow-hidden">
              <View className="absolute inset-0 p-lg flex-col justify-between z-10 pointer-events-none">
                <View className="self-start px-4 py-1.5 bg-secondary/10 rounded-full">
                  <Text className="text-secondary font-label-xs font-bold uppercase tracking-wider">Live Visualization</Text>
                </View>
                <View className="flex-col">
                  <Text className="font-headline-md text-primary font-bold">Connection Flow</Text>
                  <Text className="text-body-md text-on-surface-variant">Active nodes based on your morning workflow.</Text>
                </View>
              </View>
              <View className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent z-0" />
              {/* Nodes Illustration (Static representation for Native) */}
              <View className="absolute inset-0 pointer-events-none items-center justify-center">
                <MaterialIcons name="scatter-plot" size={200} color={colors['secondary-fixed-dim']} style={{ opacity: 0.3 }} />
              </View>
            </View>

            {/* Categories Quick Access */}
            <View className="md:flex-[1] flex-row flex-wrap justify-between gap-y-4">
              {/* Category: People */}
              <TouchableOpacity onPress={() => router.push('/(entity)/person')} className="w-[48%] bg-white p-4 rounded-[24px] shadow-sm border border-outline-variant/10">
                <View className="flex-col h-full justify-between gap-4">
                  <View className="flex-row justify-between items-start">
                    <View className="w-10 h-10 rounded-xl bg-secondary/10 items-center justify-center">
                      <MaterialIcons name="person" size={24} color={colors.secondary} />
                    </View>
                    <MaterialIcons name="arrow-outward" size={20} color={colors['on-surface-variant']} style={{ opacity: 0.5 }} />
                  </View>
                  <View>
                    <Text className="font-title-sm text-primary font-bold">People</Text>
                    <Text className="text-caption-sm text-on-surface-variant">142 Entities</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Category: Places */}
              <TouchableOpacity onPress={() => router.push('/(entity)/place')} className="w-[48%] bg-white p-4 rounded-[24px] shadow-sm border border-outline-variant/10">
                <View className="flex-col h-full justify-between gap-4">
                  <View className="flex-row justify-between items-start">
                    <View className="w-10 h-10 rounded-xl bg-primary/5 items-center justify-center">
                      <MaterialIcons name="location-on" size={24} color={colors.primary} />
                    </View>
                    <MaterialIcons name="arrow-outward" size={20} color={colors['on-surface-variant']} style={{ opacity: 0.5 }} />
                  </View>
                  <View>
                    <Text className="font-title-sm text-primary font-bold">Places</Text>
                    <Text className="text-caption-sm text-on-surface-variant">28 Locations</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Category: Projects */}
              <TouchableOpacity onPress={() => router.push('/(entity)/project')} className="w-[48%] bg-white p-4 rounded-[24px] shadow-sm border border-outline-variant/10">
                <View className="flex-col h-full justify-between gap-4">
                  <View className="flex-row justify-between items-start">
                    <View className="w-10 h-10 rounded-xl bg-tertiary-fixed-dim/20 items-center justify-center">
                      <MaterialIcons name="folder" size={24} color={colors['on-tertiary-fixed-variant']} />
                    </View>
                    <MaterialIcons name="arrow-outward" size={20} color={colors['on-surface-variant']} style={{ opacity: 0.5 }} />
                  </View>
                  <View>
                    <Text className="font-title-sm text-primary font-bold">Projects</Text>
                    <Text className="text-caption-sm text-on-surface-variant">12 Active</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Category: Companies */}
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-[48%] bg-white p-4 rounded-[24px] shadow-sm border border-outline-variant/10">
                <View className="flex-col h-full justify-between gap-4">
                  <View className="flex-row justify-between items-start">
                    <View className="w-10 h-10 rounded-xl bg-primary-container/10 items-center justify-center">
                      <MaterialIcons name="business" size={24} color={colors['primary-container']} />
                    </View>
                    <MaterialIcons name="arrow-outward" size={20} color={colors['on-surface-variant']} style={{ opacity: 0.5 }} />
                  </View>
                  <View>
                    <Text className="font-title-sm text-primary font-bold">Companies</Text>
                    <Text className="text-caption-sm text-on-surface-variant">54 Partners</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recent Connections */}
        <View className="mb-10">
          <View className="flex-row items-center justify-between mb-lg">
            <Text className="font-title-sm text-primary font-bold">Recent Connections</Text>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
              <Text className="text-secondary font-label-xs uppercase tracking-widest font-bold">View All History</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-6">
            {/* Connection Card 1 */}
            <TouchableOpacity onPress={() => router.push('/(entity)/person')} className="bg-white p-lg rounded-[24px] shadow-sm border border-outline-variant/10">
              <View className="flex-row items-center gap-4 mb-4">
                <View className="w-12 h-12 rounded-full overflow-hidden border-2 border-surface-container">
                  <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAElTwkpunw7Ymlm-Pd7D9bAIDUqvPsQ9k_neD7lujOZ6PM8x7KMZ7-Y5diyFgB_clIg-ZOPwDvCpbHmINNxh2YONGuW9IOTgANSHAqfaJZiKpMVPl3nIZhUAP9tGZuHgIjsaI6tTyF17B4lolK_VLSozDjMf93qW3EhGYtSJfVLZZGFmWwI2hxNkWoMbap5QOycaeWb0TMFaTxd2NClpuLoWy1fBE04sOL-IPHQ1O-jePapiF_Lul2y61S8fHko3pum7ppAUg4_so' }} 
                    className="w-full h-full"
                  />
                </View>
                <View>
                  <Text className="font-title-sm text-primary font-bold text-base">Marcus Thorne</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Connected via 'Project Aurora'</Text>
                </View>
              </View>
              <Text className="text-body-md text-on-surface-variant mb-4">Mentioned in today's voice note about the quarterly design review and stakeholder alignment.</Text>
              <View className="flex-row flex-wrap gap-2">
                <View className="px-3 py-1 bg-surface-container rounded-full"><Text className="text-caption-sm text-on-surface-variant">Project</Text></View>
                <View className="px-3 py-1 bg-secondary/10 rounded-full"><Text className="text-caption-sm text-secondary font-bold">Person</Text></View>
              </View>
            </TouchableOpacity>

            {/* Connection Card 2 */}
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-white p-lg rounded-[24px] shadow-sm border border-outline-variant/10">
              <View className="flex-row items-center gap-4 mb-4">
                <View className="w-12 h-12 rounded-full bg-primary-container/10 items-center justify-center">
                  <MaterialIcons name="business" size={24} color={colors['primary-container']} />
                </View>
                <View>
                  <Text className="font-title-sm text-primary font-bold text-base">Veloce Robotics</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Update: New Funding Round</Text>
                </View>
              </View>
              <Text className="text-body-md text-on-surface-variant mb-4">Entity linked to 'Tech Trends' document from 2 days ago. AI identified cross-industry synergy.</Text>
              <View className="flex-row flex-wrap gap-2">
                <View className="px-3 py-1 bg-surface-container rounded-full"><Text className="text-caption-sm text-on-surface-variant">Company</Text></View>
                <View className="px-3 py-1 bg-primary/10 rounded-full"><Text className="text-caption-sm text-primary font-bold">Insight</Text></View>
              </View>
            </TouchableOpacity>

          </View>
        </View>

      </ScrollView>
    </Screen>
  );
}
