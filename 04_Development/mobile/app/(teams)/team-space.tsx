import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function TeamSpace() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      {/* Top AppBar */}
      <View className="w-full top-0 sticky z-40 bg-surface flex-row justify-between items-center h-16 px-margin-mobile border-b border-outline-variant/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="menu" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl text-primary tracking-tight">YRecall</Text>
        </View>
        <View className="flex-row items-center gap-6">
          <View className="hidden md:flex-row gap-6">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-title-sm text-on-surface-variant ">Team Space</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-title-sm text-on-surface-variant ">Archives</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-title-sm text-on-surface-variant ">Analytics</Text></TouchableOpacity>
          </View>
          <View className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed">
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChVIz7Jems1e1ihxeQnMRBbkcTQr7LS_9-s6RhSZmySJH0vgDA02el0jPM9lBkwFTaT-QEoga428nKmDGhC2Vp2inZrMdgmuwwRJDQ-qCxbOXIiq3Y0MBit3m6R88ZEv1vXZdy-n0qeIWY8EtdIdbbPx9AGVs9OWHGTYpXqCsqczrAdOCX5usX9L2lrM6B1Q-HyHEtsxvNXFiPQ7LGZTrRKLgcXGZYPimYhSVGupbHIAvtztUCPttRZo2Pv3lkzy-amqi6bildHB4' }}
              className="w-full h-full object-cover"
            />
          </View>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile py-6 flex-col gap-6">
        
        {/* Header Section */}
        <View className="flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <View>
            <Text className="font-label-xs uppercase tracking-widest text-secondary mb-2">Enterprise Workspace</Text>
            <Text className="font-display-lg text-[36px] md:text-[44px] text-primary font-bold">Project Nova Team</Text>
            <Text className="text-body-md text-on-surface-variant max-w-xl">
              Synchronized intelligence and shared captures for the Q4 Strategic Expansion initiative.
            </Text>
          </View>
          <Button 
            variant="primary" 
            label="New Capture" 
            icon="add"
          />
        </View>

        {/* Bento Grid */}
        <View className="flex-col lg:flex-row flex-wrap gap-6">
          
          {/* AI Insights */}
          <View className="flex-col lg:w-[65%] bg-white rounded-[24px] p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden">
            <View className="absolute top-0 right-0 p-8 opacity-10">
              <MaterialIcons name="auto-awesome" size={120} color={colors.secondary} />
            </View>
            
            <View className="flex-row items-center gap-2 mb-6 z-10">
              <MaterialIcons name="auto-awesome" size={24} color={colors.secondary} />
              <Text className="font-title-sm text-lg text-primary font-bold">AI Team Summary</Text>
            </View>

            <View className="flex-col sm:flex-row gap-6 z-10">
              <View className="flex-col gap-4 flex-1">
                <View className="p-4 bg-surface-container-low rounded-xl">
                  <Text className="text-body-md text-on-surface leading-relaxed">
                    Team focus has shifted towards <Text className="font-bold text-secondary">API Infrastructure</Text> this week. Captured discussions suggest a potential bottleneck in the auth-flow integration.
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <View className="px-3 py-1 bg-secondary-container rounded-full">
                    <Text className="font-label-xs text-on-secondary-container">Critical Path</Text>
                  </View>
                  <View className="px-3 py-1 bg-tertiary-fixed rounded-full">
                    <Text className="font-label-xs text-on-tertiary-fixed-variant">Risk Detected</Text>
                  </View>
                </View>
              </View>

              <View className="flex-col gap-4 flex-1">
                <Text className="font-label-xs uppercase text-on-surface-variant tracking-wider font-bold">Top Shared Resources</Text>
                <View className="flex-col gap-2">
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 p-2  rounded-lg">
                    <MaterialIcons name="description" size={20} color={colors.secondary} />
                    <Text className="font-body-md text-primary font-medium">v2_Deployment_Specs.pdf</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 p-2  rounded-lg">
                    <MaterialIcons name="link" size={20} color={colors.secondary} />
                    <Text className="font-body-md text-primary font-medium">Figma: Nova Design System</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Team Members */}
          <View className="flex-col flex-1 bg-white rounded-[24px] p-6 shadow-sm border border-outline-variant/30">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="font-title-sm text-lg text-primary font-bold">Active Members</Text>
              <View className="bg-secondary-container px-2 py-0.5 rounded-full">
                <Text className="font-label-xs text-on-secondary-container font-bold">8 Online</Text>
              </View>
            </View>

            <ScrollView className="flex-1 max-h-[300px]" showsVerticalScrollIndicator={false}>
              <View className="flex-col gap-4">
                
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="relative">
                      <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP4WkpMz9WmLRIlzXPZUlyfxsZtRM4ZGjnypgGOiKwAINE-GXhBqVFDKqJorVRlmaWWmDvuKDeVd6xP6yCVCYu584EVIja1aDcbmWQLgY8BGbOb6rqBDtuosEayNw7UY29xQpJrzNufMkb0G2ME9IWoCFvPPD7npLie362YRWvqHPIUbMa0vVua0s3Rk_mAdF2XEe843m9cQyuWYMjQjAnurLIRePpSLG4N9h5ae75l6voPHY7dPVZdY45yHjQiH36cEywH0vwwH0' }} className="w-10 h-10 rounded-full" />
                      <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    </View>
                    <View>
                      <Text className="font-body-md font-semibold text-primary">Marcus Chen</Text>
                      <Text className="text-caption-sm text-on-surface-variant">Lead Architect</Text>
                    </View>
                  </View>
                  <MaterialIcons name="chat-bubble" size={20} color={colors['on-surface-variant']} />
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="relative">
                      <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLuD8N5tCoOGFy-ADMNrk7tkSBnui49iV825FYvEcQAaWjveaoGNIiQ2fvcXFx-PEswggcGZmDdRJnyiTsLI8reBNH1IEorxrGbXeHGqtEX2eTvD8vv4v2M0xQGKPc8fnBvN4t4xyZ-YFbrrvmcjTV1JAsumnSXMDYwazSJY9QosWiHm7gNCCmpfVQPg_OXNEkHGrT-YT_mWs7L_qGUODs9aoQOBORxmRrwMsQkaZwd6WUtBc_VetEOf3zsWymkKzYBB7kypenRF4' }} className="w-10 h-10 rounded-full" />
                      <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    </View>
                    <View>
                      <Text className="font-body-md font-semibold text-primary">Elena Rodriguez</Text>
                      <Text className="text-caption-sm text-on-surface-variant">Product Design</Text>
                    </View>
                  </View>
                  <MaterialIcons name="chat-bubble" size={20} color={colors['on-surface-variant']} />
                </View>

                <View className="flex-row items-center justify-between opacity-60">
                  <View className="flex-row items-center gap-3">
                    <View className="relative">
                      <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE_AJ5wHrS8YaxrbHreNguWtozfOw4Btwg2PkBLQE08HHoGRqxFmSI0C3Abt98f1NWmc7vPZObwei45qNLOc0dKR-EUmaKj2miSDdO4mDfpN2zzrkmHpkmtE9C1uLpf6BUOnSGUZZNvYSS8do5UXgTg5hstT4x6bcS3tP0bWbgp3DurnXkjZtHwwbAR2fa96XSBgKJkcby2RUded8aGP_jSN_O6iKZ8MzNdVzz3yoM1uuv-1C6F2oZk4jFuo7_GEiT1qa6Wb_SZWw' }} className="w-10 h-10 rounded-full" />
                      <View className="absolute bottom-0 right-0 w-3 h-3 bg-surface-variant border-2 border-white rounded-full" />
                    </View>
                    <View>
                      <Text className="font-body-md font-semibold text-primary">James Wilson</Text>
                      <Text className="text-caption-sm text-on-surface-variant">DevOps • Away</Text>
                    </View>
                  </View>
                  <MaterialIcons name="chat-bubble" size={20} color={colors['on-surface-variant']} />
                </View>

              </View>
            </ScrollView>

            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="mt-4 pt-4 border-t border-outline-variant items-center">
              <Text className="font-label-xs font-bold text-secondary">View All 24 Members</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-col md:flex-row flex-wrap gap-6 mt-2 pb-16">
          
          {/* Deadlines */}
          <View className="flex-col md:w-[30%] bg-primary rounded-[24px] p-6 shadow-lg">
            <Text className="font-title-sm text-lg font-bold text-white mb-6">Upcoming</Text>
            
            <View className="flex-col gap-6">
              <View className="border-l-2 border-secondary-fixed pl-4">
                <Text className="text-[10px] font-bold text-primary-fixed opacity-80 uppercase tracking-tighter">Oct 24 • 10:00 AM</Text>
                <Text className="font-body-md font-semibold text-white mt-1">Sprint Review</Text>
              </View>
              
              <View className="border-l-2 border-error pl-4">
                <Text className="text-[10px] font-bold text-error-container opacity-80 uppercase tracking-tighter">Oct 26 • Final</Text>
                <Text className="font-body-md font-semibold text-white mt-1">Beta Launch Gate</Text>
              </View>
              
              <View className="border-l-2 border-outline-variant pl-4 opacity-50">
                <Text className="text-[10px] font-bold text-primary-fixed uppercase tracking-tighter">Nov 02</Text>
                <Text className="font-body-md font-semibold text-white mt-1">User Testing</Text>
              </View>
            </View>
          </View>

          {/* Shared Activity Feed */}
          <View className="flex-col flex-1 bg-white rounded-[24px] p-6 shadow-sm border border-outline-variant/30">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="font-title-sm text-lg font-bold text-primary">Project Captures</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2  rounded-lg">
                  <MaterialIcons name="filter-list" size={20} color={colors['on-surface-variant']} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2  rounded-lg">
                  <MaterialIcons name="search" size={20} color={colors['on-surface-variant']} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-col lg:flex-row gap-6">
              
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-col flex-1">
                <View className="relative rounded-2xl overflow-hidden mb-3 aspect-video">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnq0dvHz8xHluOEMxCgU0m7RHG5KkBl-jQuM6YKgTAO69OBX2pa8rMYWCUs_f0ZBfPyMw_kfEjf8IcYhH5dTmk8AxJjZriwmV9gbL9p_k02ut6NV_9Jmp8YDitcSttOlMNa7yqvE9ZGgIhZvu5cHtMAUYSrH3CSjut-l4Zn3AZLlQnUV12QKA9qzMWniLxmoQYtlE0zqcjGq2g9k1h0dn-f09cFv5pbzlTaQVz_ssLd5G42-Ejms460EZvrkF9UCDPX6ZskqLISTA' }} className="w-full h-full object-cover" />
                  <View className="absolute inset-0 bg-black/20" />
                  <View className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full flex-row items-center gap-1">
                    <MaterialIcons name="image" size={14} color={colors.secondary} />
                    <Text className="text-[10px] font-bold text-primary">Snapshot</Text>
                  </View>
                </View>
                <View className="flex-row items-start gap-3">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4xD7mbLab87SiW1PhhPwUwLauFY49vKbFqszly0rEbc6T4RcYfqhadYtb_HESKKOm2cDig9Zg3I2EVSf_wTfqMgtQLPt_GoFfAMBMYV6GIrbIkz8qRgIEu8AWAFtFqInRK6s4CjKpmZ7XY2Zo2j6KSbrGB5uV6BfpXaclR8r53xRTjiJd0V3xs5xX0ZFNm3IKU2_lksoH3L8B5tD49gMTRNZAjKtg-UJ3CqDWfAgbhUPfH6hA-qsj4QP_3-ww_OtxCgkbw9__1xs' }} className="w-8 h-8 rounded-full flex-shrink-0" />
                  <View className="flex-1">
                    <Text className="font-body-md font-bold text-primary mb-1">Architecture Workshop Notes</Text>
                    <Text className="text-caption-sm text-on-surface-variant" numberOfLines={2}>Shared by Marcus Chen • 2 hours ago. Summary: Scalability concerns addressed for the legacy migration phase...</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-col flex-1">
                <View className="bg-surface-container-low rounded-2xl p-6 aspect-video flex-col justify-between border border-outline-variant mb-3">
                  <View className="flex-row justify-between items-start">
                    <View className="bg-primary/5 p-3 rounded-xl">
                      <MaterialIcons name="mic" size={24} color={colors.secondary} />
                    </View>
                    <Text className="text-[10px] font-bold text-on-surface-variant">42:12 Duration</Text>
                  </View>
                  <View>
                    <Text className="font-body-md font-bold text-primary">Weekly Sync Recording</Text>
                    <View className="mt-2 flex-row -space-x-2">
                      <View className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                      <View className="w-6 h-6 rounded-full border-2 border-white bg-slate-300" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

            </View>
          </View>

        </View>
      </View>
    </Screen>
  );
}
