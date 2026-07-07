import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function DiscoveryHub() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      {/* TopAppBar */}
      <View className="w-full top-0 sticky z-50 bg-surface-container border-b border-outline-variant/10 shadow-sm h-16 px-4 md:px-margin-desktop flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="hub" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl font-bold text-primary">YRecall Teams</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="hidden md:flex-row gap-6 mr-6">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-body-md text-primary font-bold">Discovery</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-body-md text-on-surface-variant ">Archive</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-primary px-4 py-2 rounded-xl flex-row items-center gap-2">
            <MaterialIcons name="groups" size={18} color="#ffffff" />
            <Text className="text-white font-body-sm">Presence</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-margin-desktop pt-8 pb-32">
        
        {/* Global Search Section */}
        <View className="mb-12">
          <View className="max-w-[768px] mx-auto w-full">
            <View className="relative bg-white rounded-xl shadow-sm border border-outline-variant/10">
              <View className="absolute left-4 top-4 z-10">
                <MaterialIcons name="search" size={24} color={colors.outline} />
              </View>
              <TextInput 
                className="w-full h-14 pl-12 pr-32 font-body-lg text-primary rounded-xl"
                placeholder="Search team intelligence, experts, or archives..."
                placeholderTextColor={colors['outline-variant']}
              />
              <View className="absolute right-2 top-2 z-10">
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30 gap-2">
                  <Text className="font-label-xs text-[10px] text-on-surface-variant uppercase">Expert Search</Text>
                  <View className="w-8 h-4 bg-secondary rounded-full relative">
                    <View className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 flex-row gap-3">
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-secondary-container px-3 py-1 rounded-full mr-3">
                <Text className="text-on-secondary-container font-label-xs uppercase">#Engineering-Alpha</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-surface-container-high px-3 py-1 rounded-full mr-3">
                <Text className="text-on-surface-variant font-label-xs uppercase">#Q3-Roadmap</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-surface-container-high px-3 py-1 rounded-full mr-3">
                <Text className="text-on-surface-variant font-label-xs uppercase">#User-Interviews</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-surface-container-high px-3 py-1 rounded-full mr-3">
                <Text className="text-on-surface-variant font-label-xs uppercase">#Legal-Review</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>

        <View className="flex-col lg:flex-row gap-6">
          
          {/* Shared Intelligence */}
          <View className="lg:w-[30%] flex-col gap-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-headline-sm text-xl text-primary font-bold">Shared Intelligence</Text>
              <MaterialIcons name="insights" size={24} color={colors.secondary} />
            </View>

            <View className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10 shadow-[rgba(0,106,106,0.1)_0px_4px_12px]">
              <View className="flex-row items-start justify-between mb-4">
                <View className="bg-error-container px-2 py-0.5 rounded">
                  <Text className="font-label-xs text-[10px] text-on-error-container uppercase tracking-widest">CRITICAL RISK</Text>
                </View>
                <Text className="text-[12px] text-outline font-mono">09:42 AM</Text>
              </View>
              <Text className="font-body-md font-bold text-primary mb-2">Deployment bottleneck detected in 3 threads</Text>
              <Text className="font-body-sm text-on-surface-variant mb-4">AI detected conflicting PRs in the core-engine repository from Engineering Alpha team.</Text>
              <View className="flex-row -space-x-2">
                <View className="w-6 h-6 rounded-full border-2 border-white bg-primary items-center justify-center"><Text className="text-[8px] text-white">JD</Text></View>
                <View className="w-6 h-6 rounded-full border-2 border-white bg-secondary items-center justify-center"><Text className="text-[8px] text-white">AM</Text></View>
              </View>
            </View>

            <View className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10">
              <View className="flex-row items-start justify-between mb-4">
                <View className="bg-secondary-container px-2 py-0.5 rounded">
                  <Text className="font-label-xs text-[10px] text-on-secondary-container uppercase tracking-widest">SYNTHESIS</Text>
                </View>
                <Text className="text-[12px] text-outline font-mono">Yesterday</Text>
              </View>
              <Text className="font-body-md font-bold text-primary mb-2">Semantic overlap: UI Design & Backend Schema</Text>
              <Text className="font-body-sm text-on-surface-variant mb-4">Elena's latest capture matches 82% with the updated database migration notes.</Text>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full py-2 border border-outline-variant/30 rounded-lg items-center">
                <Text className="font-label-xs text-primary uppercase tracking-widest">View Cluster</Text>
              </TouchableOpacity>
            </View>

            <View className="h-48 rounded-xl overflow-hidden relative border border-outline-variant/10 bg-primary/10">
              <View className="absolute inset-0 bg-black/10" />
              <View className="absolute inset-0 flex-col justify-end p-4">
                <Text className="text-white font-label-xs uppercase font-bold tracking-widest">Live Network Topology</Text>
              </View>
            </View>

          </View>

          {/* Knowledge Explorer */}
          <View className="flex-[1.5] flex-col gap-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-headline-sm text-xl text-primary font-bold">Team Knowledge Explorer</Text>
              <Text className="font-label-xs text-secondary uppercase tracking-widest">Active Now</Text>
            </View>

            <View className="flex-col md:flex-row gap-4 flex-wrap">
              <View className="w-full bg-white p-4 rounded-xl border-l-4 border-l-secondary shadow-sm">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="trending-up" size={16} color={colors.secondary} />
                  <Text className="font-label-xs text-secondary uppercase tracking-widest">Trending Topic</Text>
                </View>
                <Text className="font-headline-sm text-[20px] font-bold text-primary mb-2">Sustainable AI Infrastructure</Text>
                <Text className="font-body-sm text-on-surface-variant">Aggregated from 14 individual captures across the last 48 hours. Focus on energy efficiency and carbon credits.</Text>
              </View>

              <View className="flex-1 min-w-[200px] bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                <MaterialIcons name="description" size={20} color={colors.primary} className="mb-2" />
                <Text className="font-body-md font-bold text-primary mb-1 mt-2">Recent Docs</Text>
                <View className="flex-col gap-1 mt-2">
                  <Text className="font-body-sm text-on-surface-variant" numberOfLines={1}>Q3_Final_Draft.pdf</Text>
                  <Text className="font-body-sm text-on-surface-variant" numberOfLines={1}>System_Specs_v2</Text>
                </View>
              </View>

              <View className="flex-1 min-w-[200px] bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                <MaterialIcons name="account-tree" size={20} color={colors.primary} className="mb-2" />
                <Text className="font-body-md font-bold text-primary mb-1 mt-2">Clusters</Text>
                <View className="flex-col gap-1 mt-2">
                  <Text className="font-body-sm text-on-surface-variant" numberOfLines={1}>Vector Embedding logic</Text>
                  <Text className="font-body-sm text-on-surface-variant" numberOfLines={1}>User Auth Refactor</Text>
                </View>
              </View>

              <View className="w-full h-40 bg-white rounded-xl border border-outline-variant/10 overflow-hidden relative">
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0j4tIRXTB9p2QHR_LgCmchneSNOE2qUWml6kAUGUOz5J8TKyrH5MbmQwsUEPg2nmqZcEEhCO9n0k1bOtSqP0H0GfgV4UplL143OPYfMgjx1vm799YQvO1QXuincIdva1qhmXn97Al5OgRvn1x6bRVvhN2zbKJLCyuZWsSDwFV13QuEi83JKeLyAzSbHzKtMvH6KrzrNs3IStQ0pTKj-f5RBCI0M30gH8gDKIhVjr2TltkxTUEplTn68v7q2cGtLLeK5NBfZEkpJI' }} className="w-full h-full object-cover opacity-40 grayscale" />
                <View className="absolute inset-0 flex-col justify-end p-4">
                  <Text className="font-label-xs text-primary uppercase font-bold tracking-widest bg-white/80 self-start px-2 py-0.5 rounded mb-1">Workspace Archive</Text>
                  <Text className="font-body-sm text-primary font-bold bg-white/80 self-start px-2 py-0.5 rounded">Visualizing the spatial growth of team knowledge.</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Expert Discovery */}
          <View className="lg:w-[30%] bg-white rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
            <View className="mb-8">
              <Text className="font-headline-sm text-xl text-primary font-bold">Expert Discovery</Text>
              <Text className="font-body-sm text-on-surface-variant mt-1">AI-matched experts for your current search focus.</Text>
            </View>

            <View className="flex-col gap-6">
              
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-start gap-3">
                <View className="w-12 h-12 rounded-full border-2 border-secondary p-0.5 relative">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuUEcEt6WwkEjzrBonFQWRLbpCCvuBW1wUp_ljUh9ACPgvsUttHgUEOawcaEXT8Qwg7_5u34-Ve68A0WiNIO7d5HWc64sGeyzz6UzvWnWxOBeA55cSgQn1SSgwYMUblKS27fVe1jcMw4Cqox7iw3ffkxcVSE1bdPx8EU6mQr2WMDM_FEjzGyARG2P9Oxx6dvLLMJPGGQVAG-M9EZdlU_B222LVBwsteQzN3b0PVh3SElIaQmEo604CNKg1eJWgaRsTuZXIy2Wd6pw' }} className="w-full h-full rounded-full object-cover" />
                  <View className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-white rounded-full" />
                </View>
                <View className="flex-col flex-1">
                  <Text className="font-body-md font-bold text-primary">Elena R.</Text>
                  <Text className="font-body-sm text-on-surface-variant">Design Systems expert</Text>
                  <View className="flex-row gap-1 mt-1">
                    <Text className="text-[10px] bg-secondary-container/50 text-on-secondary-container px-1.5 rounded">Figma</Text>
                    <Text className="text-[10px] bg-secondary-container/50 text-on-secondary-container px-1.5 rounded">Tokens</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-start gap-3">
                <View className="w-12 h-12 rounded-full overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW8KDSbF0otOi9JKk_VYx5dXsTm_nFeBNEhGUZlq-m8EPbv8zZMRdKkViURhyMv0maIvhAtIZ3qe-6BggCjtToyItHiuNZGJOnCnHQD9XlnaFGsM11Mcsm_2FgA081R38Gyah1k-5wq3ypeVnPJxdX4KDB8G9IvVQ5y5PQKFiW3sUnJtvcQQdx-jYRzsUYpCCC1rpGewAYJcy4T4tqQ1xhhnzCBT5QrhqMgPvBshbAS4MrGWZIr6YK0lodLd70sJfyuhJjLVlQsF8' }} className="w-full h-full rounded-full object-cover" />
                </View>
                <View className="flex-col flex-1">
                  <Text className="font-body-md font-bold text-primary">Marcus T.</Text>
                  <Text className="font-body-sm text-on-surface-variant">Infrastructure lead</Text>
                  <View className="flex-row gap-1 mt-1">
                    <Text className="text-[10px] bg-secondary-container/50 text-on-secondary-container px-1.5 rounded">Kubernetes</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-start gap-3 opacity-70">
                <View className="w-12 h-12 rounded-full overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0_no1khz-34KPVhEE64eby0WSgkNhhZ7jpLKbBX_wnVHfhTyxQunNENbZ6zLBxcp9GCKu_Zog3XhtHRqGPAvB5d22z-16ZEl5LpWVF5n5rqZGP7v4LqpDZdFg3O-_t1qn73lVlckO2wqYgkhyfKUrMMeLn8Zy-E_hG6qYmBJk_orcHfD0dJhDzRvqKV22SqbaWxK3HHM2_Z8Af7tqPjsRgWVDUPvd8HMR_nSzm67B9bSUhUzlcqjuVrXjf_4Q7HTncBflgKLrLD0' }} className="w-full h-full rounded-full object-cover" />
                </View>
                <View className="flex-col flex-1">
                  <Text className="font-body-md font-bold text-primary">Sarah K.</Text>
                  <Text className="font-body-sm text-on-surface-variant">Semantic Search expert</Text>
                  <View className="flex-row gap-1 mt-1">
                    <Text className="text-[10px] bg-secondary-container/50 text-on-secondary-container px-1.5 rounded">NLP</Text>
                  </View>
                </View>
              </TouchableOpacity>

            </View>

            <View className="mt-8 p-4 bg-primary rounded-xl">
              <Text className="font-label-xs text-white uppercase opacity-70 tracking-widest mb-2">AI Suggestion</Text>
              <Text className="font-body-sm text-white italic">"Based on your recent graph activity, you should connect with Elena regarding the new token architecture."</Text>
            </View>
          </View>

        </View>
      </View>
    </Screen>
  );
}
