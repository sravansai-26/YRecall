import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function DiscoveryProfile() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      {/* Top Navigation Bar */}
      <View className="w-full top-0 sticky z-50 bg-surface-container/80 shadow-sm border-b border-outline-variant/10 h-16 px-4 md:px-margin-desktop flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="hub" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl font-bold text-primary">YRecall Teams</Text>
        </View>
        <View className="hidden md:flex-row gap-6">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-label-xs text-on-surface-variant uppercase tracking-widest">Activity</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-label-xs text-on-surface-variant uppercase tracking-widest">Graph</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="border-b-2 border-primary"><Text className="font-label-xs text-primary font-bold uppercase tracking-widest pb-1">Members</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-label-xs text-on-surface-variant uppercase tracking-widest">Settings</Text></TouchableOpacity>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="w-8 h-8 rounded-full border-2 border-surface-bright ring-2 ring-secondary overflow-hidden">
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe03eYJLPO3Jc6tk9gdhfEWw8uzzDvExHk3MGXgqyS4Iha4WoIvWYrkWiAU-CNdywkLiewQzIB-r6rtn5jfKaOh_4TchUG9NmFM9lLvmCg0AtVYfo6zAroc6nI1bPh85dP_Ul_PnCeU4xfDYv6Q1TR8wwpyz0nan3TExp-EoFQ0aK0Mpc38F8R3iGAPO-BIfBEJszqaEkoWT2K7JK9_9Kojs9HoL_Z2dORtq5oBQZdK2Gpgj7noLvabTG04ow4ZS_DYUPFZ3goXyU' }} className="w-full h-full object-cover" />
          </View>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-2 bg-primary px-4 py-2 rounded-lg">
            <MaterialIcons name="bolt" size={18} color="#ffffff" />
            <Text className="text-white font-label-xs uppercase">AI Insights</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-margin-desktop py-10 pb-32">
        
        {/* Expert Profile Header Section */}
        <View className="flex-col md:flex-row gap-8 mb-12">
          
          {/* Profile Info Sidebar */}
          <View className="flex-[1] flex-col gap-6">
            <View className="relative w-full aspect-square rounded-xl overflow-hidden border border-outline-variant/20 shadow-lg">
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkXEsvcnvZKCPQ0x-LNNptgJmI_GOWFY1NX_ODa7RBmNHTimCN8_IVPsl3p_K3WXM0I3uHHYxL1Z8UzFwSKlDFyHZLJbD-s7M6f68tRS0O6xuee3LZv-jjxLCuXu4r8RBVWO3PGTJoRYfjSmC3cbieBVWlfzpZPflGQUgFAO-JJPzB_SByhGYf-w90nJmE-MbmVU-wBKbD_hHxyZAxLRmcYdTV4MOZK7S_VpOAudUv43n_BIjJC9pA8DiytZ2VwTU0_YZWyItdrnU' }} className="w-full h-full object-cover" />
              <View className="absolute bottom-4 right-4 bg-secondary px-3 py-1 rounded-full flex-row items-center gap-1 shadow-md">
                <MaterialIcons name="verified" size={14} color="#ffffff" />
                <Text className="text-white font-label-xs uppercase tracking-widest">Core Expert</Text>
              </View>
            </View>
            
            <View className="flex-col gap-2">
              <Text className="font-headline-lg text-[32px] text-primary tracking-tight font-bold">Elena Rodriguez</Text>
              <Text className="text-on-surface-variant font-body-lg">Senior Knowledge Architect & Semantic Engineer</Text>
              <View className="flex-row flex-wrap gap-2 pt-2">
                <View className="bg-secondary-container px-3 py-1 rounded-full"><Text className="text-on-secondary-container text-body-sm font-label-xs uppercase tracking-widest">Graph Theory</Text></View>
                <View className="bg-secondary-container px-3 py-1 rounded-full"><Text className="text-on-secondary-container text-body-sm font-label-xs uppercase tracking-widest">AI Synthesis</Text></View>
                <View className="bg-secondary-container px-3 py-1 rounded-full"><Text className="text-on-secondary-container text-body-sm font-label-xs uppercase tracking-widest">Data Ethics</Text></View>
              </View>
            </View>

            <View className="pt-6 border-t border-outline-variant/20 flex-col gap-3">
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full bg-primary py-3 rounded-lg flex-row items-center justify-center gap-2">
                <MaterialIcons name="mail" size={20} color="#ffffff" />
                <Text className="text-white font-headline-sm font-bold text-lg">Consult Elena</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full border border-primary py-3 rounded-lg flex-row items-center justify-center gap-2">
                <MaterialIcons name="schedule" size={20} color={colors.primary} />
                <Text className="text-primary font-headline-sm font-bold text-lg">View Availability</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Content Area */}
          <View className="flex-[2] flex-col gap-8">
            
            {/* Collaborative Reach Card */}
            <View className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10 relative overflow-hidden">
              <View className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16" />
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-col gap-1">
                  <Text className="text-secondary font-label-xs uppercase tracking-widest">Collaborative Reach</Text>
                  <Text className="text-primary font-headline-md text-2xl font-bold">Impact Synthesis</Text>
                </View>
                <MaterialIcons name="psychology" size={40} color={colors.secondary} />
              </View>
              <View className="flex-col md:flex-row items-center gap-8">
                <View className="flex-col md:w-1/3">
                  <Text className="text-[48px] font-bold text-primary">12%</Text>
                  <Text className="text-on-surface-variant font-body-sm">Elena has optimized 12% of the project's architectural links through her recent contributions.</Text>
                </View>
                <View className="flex-1 w-full bg-surface-bright rounded-xl border border-outline-variant/20 p-4 flex-row items-center justify-around">
                  <View className="flex-col items-center">
                    <Text className="text-primary font-bold text-xl">4.8k</Text>
                    <Text className="text-body-sm text-on-surface-variant font-label-xs uppercase tracking-widest">Nodes Edited</Text>
                  </View>
                  <View className="w-px h-12 bg-outline-variant/30" />
                  <View className="flex-col items-center">
                    <Text className="text-secondary font-bold text-xl">82</Text>
                    <Text className="text-body-sm text-on-surface-variant font-label-xs uppercase tracking-widest">Peer Reviews</Text>
                  </View>
                  <View className="w-px h-12 bg-outline-variant/30" />
                  <View className="flex-col items-center">
                    <Text className="text-primary font-bold text-xl">1.2m</Text>
                    <Text className="text-body-sm text-on-surface-variant font-label-xs uppercase tracking-widest">Recall Weight</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Knowledge Domain Map Visualization */}
            <View className="bg-white rounded-2xl p-8 border border-outline-variant/10 shadow-sm relative h-[400px] flex-col">
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="explore" size={24} color={colors.secondary} />
                  <Text className="text-primary font-headline-sm text-xl font-bold">Knowledge Domain Map</Text>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full"><MaterialIcons name="zoom-in" size={20} color={colors['on-surface-variant']} /></TouchableOpacity>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full"><MaterialIcons name="filter-list" size={20} color={colors['on-surface-variant']} /></TouchableOpacity>
                </View>
              </View>
              
              <View className="flex-1 relative rounded-xl bg-surface-dim/20 border border-dashed border-outline-variant overflow-hidden">
                <View className="absolute top-[20%] left-[30%] p-4 bg-white/70 rounded-full flex-row items-center gap-3 shadow-sm z-10 border border-secondary/20">
                  <View className="w-2 h-2 bg-secondary rounded-full" />
                  <Text className="font-label-xs text-primary uppercase">Semantic Mapping</Text>
                </View>
                <View className="absolute top-[60%] left-[15%] p-3 bg-white/70 rounded-full flex-row items-center gap-3 shadow-sm z-10 border border-secondary/20">
                  <View className="w-2 h-2 bg-primary rounded-full" />
                  <Text className="font-label-xs text-primary uppercase">API Architecture</Text>
                </View>
                <View className="absolute top-[40%] left-[70%] p-5 bg-white/70 rounded-full flex-row items-center gap-3 shadow-sm z-10 border border-secondary/20">
                  <View className="w-3 h-3 bg-secondary rounded-full" />
                  <Text className="font-label-xs text-primary uppercase">Neural Synthesis</Text>
                </View>
                <View className="absolute inset-0 opacity-10" />
              </View>
            </View>
          </View>
        </View>

        {/* Recent Contributions Section */}
        <View className="mt-12 flex-col">
          <View className="flex-row items-center justify-between mb-8">
            <View className="flex-col gap-1">
              <Text className="text-primary font-headline-md text-2xl font-bold">Recent Contributions</Text>
              <Text className="text-on-surface-variant font-body-sm">Archival audit of indexed work and node modifications.</Text>
            </View>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-1">
              <Text className="text-primary font-bold font-label-xs uppercase">View All Activity</Text>
              <MaterialIcons name="arrow-forward" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View className="flex-col md:flex-row gap-6">
            
            <View className="flex-1 bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm">
              <View className="flex-row items-start justify-between mb-4">
                <View className="bg-secondary-container/30 p-2 rounded-lg">
                  <MaterialIcons name="description" size={24} color={colors.secondary} />
                </View>
                <Text className="font-mono text-[12px] text-on-surface-variant">2h ago</Text>
              </View>
              <Text className="text-primary font-headline-sm text-lg font-bold mb-2">Infrastructure Alpha_v2</Text>
              <Text className="text-on-surface-variant text-body-sm mb-4" numberOfLines={2}>Optimized 14 sub-nodes related to latency reduction in the semantic vector engine.</Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-on-secondary-container font-label-xs text-[10px] px-2 py-0.5 bg-secondary-container rounded uppercase">Refactored</Text>
                <Text className="text-white font-label-xs text-[10px] px-2 py-0.5 bg-primary rounded uppercase">Core</Text>
              </View>
            </View>

            <View className="flex-1 bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm">
              <View className="flex-row items-start justify-between mb-4">
                <View className="bg-primary-fixed/30 p-2 rounded-lg">
                  <MaterialIcons name="schema" size={24} color={colors.primary} />
                </View>
                <Text className="font-mono text-[12px] text-on-surface-variant">Yesterday</Text>
              </View>
              <Text className="text-primary font-headline-sm text-lg font-bold mb-2">Team Onboarding Flow</Text>
              <Text className="text-on-surface-variant text-body-sm mb-4" numberOfLines={2}>Created a new collection mapping organizational hierarchy to knowledge permissions.</Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-on-secondary-container font-label-xs text-[10px] px-2 py-0.5 bg-secondary-container rounded uppercase">Created</Text>
                <Text className="text-white font-label-xs text-[10px] px-2 py-0.5 bg-primary rounded uppercase">UX</Text>
              </View>
            </View>

            <View className="flex-1 bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm">
              <View className="flex-row items-start justify-between mb-4">
                <View className="bg-error-container/30 p-2 rounded-lg">
                  <MaterialIcons name="priority-high" size={24} color={colors.error} />
                </View>
                <Text className="font-mono text-[12px] text-on-surface-variant">3d ago</Text>
              </View>
              <Text className="text-primary font-headline-sm text-lg font-bold mb-2">Security Audit Report</Text>
              <Text className="text-on-surface-variant text-body-sm mb-4" numberOfLines={2}>High-level review of cross-tenant encryption protocols in shared spaces.</Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-on-error-container font-label-xs text-[10px] px-2 py-0.5 bg-error-container rounded uppercase">Audited</Text>
                <Text className="text-white font-label-xs text-[10px] px-2 py-0.5 bg-primary rounded uppercase">GOV</Text>
              </View>
            </View>

          </View>
        </View>
      </View>
    </Screen>
  );
}
