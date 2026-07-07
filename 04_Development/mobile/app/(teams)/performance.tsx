import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function Performance() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      {/* TopAppBar */}
      <View className="w-full top-0 sticky z-40 bg-surface-container border-b border-outline-variant/10 shadow-sm h-16 px-4 md:px-margin-desktop flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="hub" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl font-bold text-primary tracking-tight">YRecall Teams</Text>
        </View>
        <View className="hidden md:flex-row gap-8">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-label-xs text-primary font-bold uppercase tracking-widest">Activity</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-label-xs text-on-surface-variant uppercase tracking-widest ">Graph</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-label-xs text-on-surface-variant uppercase tracking-widest ">Members</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-label-xs text-on-surface-variant uppercase tracking-widest ">Settings</Text></TouchableOpacity>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="flex-row -space-x-2">
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACaf1aEAaImTlkJJZyvx2VUYMv4ZRJzQYNsVOSGIMT176IKi3IxCJnv-Bk4Q32ofvHTS8jdliseSLApIt2SWlgljV2Pf96lK3YFQ8jAU19soiHnah1uHEm_8zDcv1alxcPr4DMM2S_s-J6eVG4k2W_b_5Vf9GJeQxf99ZbBGvh4MUbtryzmnm0YUDxOx-KWdTxus1TuibAnpCCgVMGIhHFb1a1xgIkInECTgPdETA4bHzfmkcumdBTSLF_L89VdmUoEq1XEPjjG1M' }} className="w-8 h-8 rounded-full border-2 border-surface" />
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdTAWsTbXF_M5zCEra7uZYGD3xRnYKjhvZQfv_0QI111J6G3QAqEvi-CnVVzzeTJySxdx_AmV8dQhLMpBvcWmFbVXbgMd7qugypfzg1nvbglqWTOsew4IQPBZvbiKNIkuzdQhJKG9yUuPaentL2u4QatpOGqcWiPjZ-puuRAaFjueDWcp8heryX6LFwP9RAF7b_yq7kgEgw4S14LdPO5pUzTVxLxqCH1AaguAMmim9UX_cOtxJo0PSKCOiXybZTM_SGV_QRQR-WH4' }} className="w-8 h-8 rounded-full border-2 border-surface" />
            <View className="w-8 h-8 rounded-full border-2 border-surface bg-secondary-container items-center justify-center"><Text className="text-[10px] text-on-secondary-container font-bold">+4</Text></View>
          </View>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-primary px-4 py-2 rounded-xl flex-row items-center gap-2">
            <MaterialIcons name="bolt" size={14} color="#ffffff" />
            <Text className="text-white font-bold text-body-sm">Presence</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="w-full max-w-[1280px] mx-auto px-4 md:px-margin-desktop py-8 pb-24 flex-col">
        
        {/* Executive Overview */}
        <View className="mb-12 flex-col">
          <View className="flex-row items-end justify-between mb-6">
            <View className="flex-col">
              <Text className="font-headline-lg text-[32px] text-primary tracking-tight font-bold">Executive ROI Overview</Text>
              <Text className="text-on-surface-variant font-body-md">Quantifying the impact of the AI Life OS across Engineering Alpha.</Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-3 py-1.5 border border-outline-variant rounded flex-row items-center gap-1">
                <Text className="text-body-sm font-bold text-primary">Last 30 Days</Text>
                <MaterialIcons name="expand-more" size={14} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-3 py-1.5 bg-primary rounded flex-row items-center gap-2">
                <MaterialIcons name="download" size={14} color="#ffffff" />
                <Text className="text-white text-body-sm font-bold">Export</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bento Grid Metrics */}
          <View className="flex-col md:flex-row gap-6">
            
            <View className="flex-1 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm flex-col justify-between">
              <View className="flex-row justify-between items-start">
                <MaterialIcons name="psychology" size={32} color={colors.secondary} />
                <View className="bg-secondary-container px-2 py-0.5 rounded-full flex-row items-center gap-1">
                  <MaterialIcons name="trending-up" size={12} color={colors['on-secondary-container']} />
                  <Text className="text-on-secondary-container text-[11px] font-bold">+24%</Text>
                </View>
              </View>
              <View className="mt-8 flex-col">
                <Text className="text-on-surface-variant font-label-xs uppercase tracking-widest mb-1">Knowledge Capital Growth</Text>
                <Text className="font-display-lg text-[48px] text-primary font-bold">12,482 <Text className="font-headline-sm text-[20px] font-normal text-on-surface-variant">nodes</Text></Text>
              </View>
              <View className="mt-4 border-t border-outline-variant/10 pt-4 flex-row justify-between">
                <Text className="text-body-sm text-on-surface-variant">Avg synthesis rate</Text>
                <Text className="text-body-sm font-mono text-primary font-bold">142/day</Text>
              </View>
            </View>

            <View className="flex-1 bg-primary p-6 rounded-xl border border-primary-container shadow-lg flex-col justify-between relative overflow-hidden">
              <View className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <MaterialIcons name="timer" size={120} color="#ffffff" className="-mr-8 -mt-8" />
              </View>
              <View className="flex-row justify-between items-start relative z-10">
                <MaterialIcons name="bolt" size={32} color={colors['primary-fixed-dim']} />
                <View className="bg-white/10 px-2 py-0.5 rounded-full">
                  <Text className="text-white text-[11px] font-bold">Optimized</Text>
                </View>
              </View>
              <View className="mt-8 relative z-10 flex-col">
                <Text className="text-primary-fixed-dim font-label-xs uppercase tracking-widest mb-1">Time Saved by AI Retrieval</Text>
                <Text className="font-display-lg text-[48px] text-white font-bold">140<Text className="font-headline-sm text-[20px] font-normal text-primary-fixed-dim">h/mo</Text></Text>
              </View>
              <View className="mt-4 border-t border-white/10 pt-4 flex-row justify-between relative z-10">
                <Text className="text-body-sm text-primary-fixed-dim">Recouped Operational Cost</Text>
                <Text className="text-body-sm font-mono text-white font-bold">$18,200</Text>
              </View>
            </View>

            <View className="flex-1 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm flex-col justify-between">
              <View className="flex-row justify-between items-start">
                <MaterialIcons name="diversity-3" size={32} color={colors.secondary} />
                <View className="bg-secondary-container px-2 py-0.5 rounded-full">
                  <Text className="text-on-secondary-container text-[11px] font-bold">High</Text>
                </View>
              </View>
              <View className="mt-8 flex-col">
                <Text className="text-on-surface-variant font-label-xs uppercase tracking-widest mb-1">Team Alignment Score</Text>
                <Text className="font-display-lg text-[48px] text-primary font-bold">92<Text className="font-headline-sm text-[20px] font-normal text-on-surface-variant">%</Text></Text>
              </View>
              <View className="mt-4 border-t border-outline-variant/10 pt-4 flex-col">
                <View className="w-full bg-surface-container rounded-full h-1.5">
                  <View className="bg-secondary h-1.5 rounded-full w-[92%]" />
                </View>
                <View className="flex-row justify-between mt-2">
                  <Text className="text-[10px] font-bold text-on-surface-variant uppercase">Cohesion</Text>
                  <Text className="text-[10px] font-bold text-on-surface-variant uppercase">Peak Level</Text>
                </View>
              </View>
            </View>

          </View>
        </View>

        {/* Knowledge Growth & AI Impact */}
        <View className="flex-col lg:flex-row gap-8 mb-12">
          
          <View className="flex-[2] bg-white rounded-xl border border-outline-variant/20 p-8 shadow-sm flex-col">
            <View className="flex-row items-center justify-between mb-8">
              <View className="flex-col">
                <Text className="font-headline-sm text-[20px] font-bold text-primary">Knowledge Growth</Text>
                <Text className="text-body-sm text-on-surface-variant">Node accumulation by functional department.</Text>
              </View>
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1.5"><View className="w-3 h-3 rounded-full bg-primary" /><Text className="text-body-sm font-bold text-primary">Eng</Text></View>
                <View className="flex-row items-center gap-1.5"><View className="w-3 h-3 rounded-full bg-secondary" /><Text className="text-body-sm font-bold text-primary">Prod</Text></View>
                <View className="flex-row items-center gap-1.5"><View className="w-3 h-3 rounded-full bg-outline" /><Text className="text-body-sm font-bold text-primary">Mark</Text></View>
              </View>
            </View>
            
            <View className="h-64 w-full flex-row items-end gap-1 px-2 border-b border-l border-outline-variant/20 relative">
              <View className="absolute inset-0 flex-col justify-between opacity-20">
                <View className="border-t border-outline border-dashed w-full h-[1px]" />
                <View className="border-t border-outline border-dashed w-full h-[1px]" />
                <View className="border-t border-outline border-dashed w-full h-[1px]" />
              </View>
              <View className="w-full h-full bg-surface-container/30 relative" />
              <View className="absolute left-[75%] top-[10%] bg-primary px-3 py-2 rounded-lg items-center">
                <Text className="text-white font-bold text-[11px]">Eng Peak</Text>
                <Text className="text-white opacity-80 text-[11px]">Synthesis surge</Text>
              </View>
            </View>
            
            <View className="flex-row justify-between mt-4">
              <Text className="text-mono text-[12px] text-on-surface-variant">JAN</Text>
              <Text className="text-mono text-[12px] text-on-surface-variant">FEB</Text>
              <Text className="text-mono text-[12px] text-on-surface-variant">MAR</Text>
              <Text className="text-mono text-[12px] text-on-surface-variant">APR</Text>
              <Text className="text-mono text-[12px] text-on-surface-variant">MAY</Text>
              <Text className="text-mono text-[12px] text-on-surface-variant">JUN</Text>
            </View>
          </View>

          <View className="flex-[1] bg-surface-container-low rounded-xl border border-outline-variant/20 p-8 flex-col">
            <View className="flex-row items-center gap-2 mb-6">
              <MaterialIcons name="analytics" size={24} color={colors.secondary} />
              <Text className="font-headline-sm text-xl font-bold text-primary">Impact Synthesis</Text>
            </View>
            
            <View className="flex-1 flex-col gap-6">
              <View className="bg-white p-4 rounded-lg border-l-4 border-l-secondary shadow-sm">
                <Text className="text-label-xs font-bold text-secondary uppercase mb-1">Duplicate Prevention</Text>
                <Text className="text-body-md text-primary font-bold">"Architectural Schema 4.0"</Text>
                <Text className="text-body-sm text-on-surface-variant mt-2 italic">AI flagged a matching research node from Engineering Beta, preventing 12 hours of re-modeling effort.</Text>
              </View>

              <View className="bg-white p-4 rounded-lg border-l-4 border-l-primary shadow-sm">
                <Text className="text-label-xs font-bold text-primary uppercase mb-1">Silo Identification</Text>
                <Text className="text-body-md text-primary font-bold">Marketing & API Docs</Text>
                <Text className="text-body-sm text-on-surface-variant mt-2 italic">Found 48% semantic overlap. Automated sync now maintains feature naming consistency across channels.</Text>
              </View>

              <View className="bg-primary-container p-4 rounded-lg">
                <View className="flex-row items-center gap-2 mb-2">
                  <MaterialIcons name="auto-awesome" size={14} color="#ffffff" />
                  <Text className="text-label-xs font-bold text-white uppercase">AI Insight</Text>
                </View>
                <Text className="text-body-sm text-white leading-relaxed">Knowledge density is highest in <Text className="font-bold">Technical Debt</Text> nodes. Suggest a synthesis sprint to resolve overlapping documentation.</Text>
              </View>
            </View>
            
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="mt-6 items-center">
              <Text className="text-body-sm font-bold text-primary">Review All 14 Synthesis Logs</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Engagement & Participation */}
        <View className="flex-col md:flex-row gap-8">
          
          <View className="flex-1 bg-white rounded-xl border border-outline-variant/20 p-6 shadow-sm flex-col">
            <View className="flex-row items-center gap-2 mb-4">
              <MaterialIcons name="trending-up" size={24} color={colors.secondary} />
              <Text className="font-headline-sm text-xl font-bold text-primary">Trending Intelligence</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              <View className="bg-secondary-container px-3 py-1 rounded-full flex-row items-center gap-1 border border-secondary/10"><Text className="text-on-secondary-container text-body-sm font-bold">#CloudNative</Text><Text className="text-[10px] text-on-secondary-container opacity-70">x42</Text></View>
              <View className="bg-surface-container-high px-3 py-1 rounded-full flex-row items-center gap-1 border border-outline-variant/20"><Text className="text-primary text-body-sm font-bold">#RustCore</Text><Text className="text-[10px] text-primary opacity-70">x38</Text></View>
              <View className="bg-surface-container-high px-3 py-1 rounded-full flex-row items-center gap-1 border border-outline-variant/20"><Text className="text-primary text-body-sm font-bold">#VectorSearch</Text><Text className="text-[10px] text-primary opacity-70">x31</Text></View>
              <View className="bg-surface-container-high px-3 py-1 rounded-full flex-row items-center gap-1 border border-outline-variant/20"><Text className="text-primary text-body-sm font-bold">#LatencyReduction</Text><Text className="text-[10px] text-primary opacity-70">x29</Text></View>
            </View>
            
            <View className="mt-8 flex-col gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded bg-primary items-center justify-center"><Text className="text-white font-bold">1</Text></View>
                  <View className="flex-col">
                    <Text className="text-body-md font-bold text-primary">Cross-Team API Protocol</Text>
                    <Text className="text-body-sm text-on-surface-variant">12 nodes updated today</Text>
                  </View>
                </View>
                <MaterialIcons name="open-in-new" size={20} color={colors['outline-variant']} />
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded bg-surface-container border border-outline-variant/20 items-center justify-center"><Text className="text-primary font-bold">2</Text></View>
                  <View className="flex-col">
                    <Text className="text-body-md font-bold text-primary">Q3 Infrastructure Roadmap</Text>
                    <Text className="text-body-sm text-on-surface-variant">4 active contributors</Text>
                  </View>
                </View>
                <MaterialIcons name="open-in-new" size={20} color={colors['outline-variant']} />
              </View>
            </View>
          </View>

          <View className="flex-1 bg-white rounded-xl border border-outline-variant/20 p-6 shadow-sm flex-col">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="group" size={24} color={colors.secondary} />
                <Text className="font-headline-sm text-xl font-bold text-primary">Top Contributors</Text>
              </View>
              <Text className="text-label-xs text-secondary font-bold uppercase tracking-widest">View All</Text>
            </View>
            
            <View className="flex-col gap-4">
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center justify-between p-3 rounded-lg bg-surface-container-low">
                <View className="flex-row items-center gap-3">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbdJGD2PX7KqnWnFbYDHh_yuJBFf4f803ap7JRzY4WHI18--MtrWGOfteOHliCDI3NJGiTmDfOz7UIa3MWjXqREDjzWkQk_4LP--uSdc2KsyLTbeklXCakRS005CUObtQ7dNMh9NHsN64hJF_78DuoqF3s1MRxlWE9Gi9RndXX5GHiGqDdFrNrIktiUe39qZi8yhAwvVpjaqF_jY62_VgsD4uKzwTd16ITXnf6tQC2_xn2dQpkYtq1dvIW1nJfr_K25PPZtYN7EIA' }} className="w-12 h-12 rounded-full object-cover" />
                  <View className="flex-col">
                    <Text className="text-body-md font-bold text-primary">Sarah Chen</Text>
                    <Text className="text-body-sm text-on-surface-variant">Lead Architect</Text>
                  </View>
                </View>
                <View className="flex-col items-end">
                  <Text className="text-body-md font-mono font-bold text-primary">1,240</Text>
                  <Text className="text-[10px] font-label-xs text-on-surface-variant uppercase tracking-widest">Nodes Added</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center justify-between p-3 rounded-lg bg-surface-container-low">
                <View className="flex-row items-center gap-3">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR7ZjQ-ZDome-9NrPNeRGxulleTsCmBwoZqjf4V6kML30tphN0eNQscOaSJtrmzHDdiFxPAKDWkpxxsBqW48gcE_DrjUnmrMuKhGdsQ3-JC-IKoN8wpSZVZzFTC4Lg0A57Nas5zGJgYj1KV7eCMnysvo3ic2EDwb5LdTym9_z0ZyyyUscH3yj2_y3IBRuxvx3ubd4UEImEvKmAw_BPgioGFGvvYQJcxSTF7Ig0RRFFkTUhAVfL2MNTN_w3907MbUScrDrn_leHcMU' }} className="w-12 h-12 rounded-full object-cover" />
                  <View className="flex-col">
                    <Text className="text-body-md font-bold text-primary">Marcus Holloway</Text>
                    <Text className="text-body-sm text-on-surface-variant">Staff Engineer</Text>
                  </View>
                </View>
                <View className="flex-col items-end">
                  <Text className="text-body-md font-mono font-bold text-primary">982</Text>
                  <Text className="text-[10px] font-label-xs text-on-surface-variant uppercase tracking-widest">Nodes Added</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center justify-between p-3 rounded-lg bg-surface-container-low">
                <View className="flex-row items-center gap-3">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2sX7Lkm3FPN5_wjQ2nchqKePa-iEtXzUD0RzzTYw-PfGlWtagAcLjFzEIVX9NzkLjGL0o0I9V5n6r02hGsEg8FIZwBzxJy5MOGv-DpyLVcVYTB_FNdWl-ZeHHd6Wn5U3o6SPyRd0CTp8RSEfZl3anj0RZzUqVHP_1J3fLgyiAVSvdKARZ7QE69KOYXnlZmHqAT-gbpd8d1Eajj90qCwkNhf_xGHIOE06u3gPOsbbdSPCCNKdAopcEq09q2U26Siq7GBYdaGXDV-U' }} className="w-12 h-12 rounded-full object-cover" />
                  <View className="flex-col">
                    <Text className="text-body-md font-bold text-primary">Elena Rodriguez</Text>
                    <Text className="text-body-sm text-on-surface-variant">Product Design</Text>
                  </View>
                </View>
                <View className="flex-col items-end">
                  <Text className="text-body-md font-mono font-bold text-primary">754</Text>
                  <Text className="text-[10px] font-label-xs text-on-surface-variant uppercase tracking-widest">Nodes Added</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

        </View>

      </View>
    </Screen>
  );
}
