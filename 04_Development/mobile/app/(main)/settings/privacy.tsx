import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function SecurityPrivacyDashboard() {
  const router = useRouter();
  
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [stealthModeEnabled, setStealthModeEnabled] = useState(false);
  const [retentionPeriod, setRetentionPeriod] = useState('30days');

  return (
    <Screen scrollable={true} className="pb-24">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-40 bg-surface/80 flex-row items-center justify-between px-margin-mobile h-16 md:px-margin-desktop">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">Security & Privacy</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(modals)/search')} className="p-2 rounded-full ">
          <MaterialIcons name="search" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-6 flex-col gap-8 w-full">
        
        {/* Hero: Vault Status */}
        <View className="overflow-hidden rounded-[24px] bg-primary p-6 md:p-12 flex-col md:flex-row items-center justify-between gap-6">
          <View className="flex-col items-center md:items-start text-center md:text-left z-10 w-full">
            <View className="mb-4 flex-row items-center justify-center gap-2 bg-secondary-container/20 px-4 py-2 rounded-full border border-secondary/30 self-center md:self-start">
              <View className="w-2 h-2 rounded-full bg-secondary" />
              <Text className="font-label-xs text-xs uppercase tracking-widest text-secondary-fixed font-bold">System Armed</Text>
            </View>
            <Text className="font-display-lg-mobile md:font-display-lg text-4xl md:text-5xl font-bold text-white mb-2 text-center md:text-left">Vault Status</Text>
            <Text className="text-white/70 max-w-md font-body-md text-base text-center md:text-left">
              Your AI ecosystem is protected by military-grade end-to-end encryption. Only your biometric signature can unlock your life's data.
            </Text>
            
            <View className="mt-6 flex-row flex-wrap gap-4 justify-center md:justify-start w-full">
              <View className="flex-row items-center gap-3 bg-white/10 px-4 py-3 rounded-xl border border-white/10">
                <MaterialIcons name="enhanced-encryption" size={24} color={colors['secondary-fixed']} />
                <Text className="font-title-sm text-base text-white font-medium">Active Encryption</Text>
              </View>
              <View className="flex-row items-center gap-3 bg-white/10 px-4 py-3 rounded-xl border border-white/10">
                <MaterialIcons name="verified-user" size={24} color={colors['secondary-fixed']} />
                <Text className="font-title-sm text-base text-white font-medium">Biometrics Locked</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-col md:flex-row gap-4 w-full">
          {/* Column: Privacy Log & Controls */}
          <View className="flex-col gap-4 flex-1">
            
            <View className="flex-row items-center justify-between px-1">
              <Text className="font-title-sm text-xl font-bold text-primary">Intelligence Privacy Log</Text>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-1">
                <Text className="text-on-secondary-container font-label-xs text-xs  font-medium">View Detailed Audit</Text>
                <MaterialIcons name="open-in-new" size={16} color={colors['on-secondary-container']} />
              </TouchableOpacity>
            </View>

            <View className="bg-white/80 rounded-[24px] overflow-hidden shadow-sm border border-outline-variant/30">
              <View className="flex-col">
                <View className="p-4 flex-row items-start gap-4  border-b border-outline-variant/20">
                  <View className="w-12 h-12 rounded-full bg-surface-container-highest items-center justify-center shrink-0">
                    <MaterialIcons name="psychology" size={24} color={colors.primary} />
                  </View>
                  <View className="flex-1 flex-col">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-title-sm text-base font-bold text-primary">Memories AI Engine</Text>
                      <Text className="font-caption-sm text-xs text-on-surface-variant">2 mins ago</Text>
                    </View>
                    <Text className="text-body-md text-base text-on-surface-variant">Accessed "Travel Memories" to curate weekly digest. Verified locally via Secure Enclave.</Text>
                    <View className="mt-2 flex-row gap-2">
                      <View className="px-2 py-0.5 rounded-full bg-tertiary-fixed-dim/20">
                        <Text className="text-on-tertiary-fixed-variant text-[10px] font-bold uppercase">Encrypted</Text>
                      </View>
                      <View className="px-2 py-0.5 rounded-full bg-surface-container-high">
                        <Text className="text-on-surface-variant text-[10px] font-bold uppercase">On-Device</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="p-4 flex-row items-start gap-4  border-b border-outline-variant/20">
                  <View className="w-12 h-12 rounded-full bg-surface-container-highest items-center justify-center shrink-0">
                    <MaterialIcons name="location-on" size={24} color={colors.primary} />
                  </View>
                  <View className="flex-1 flex-col">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-title-sm text-base font-bold text-primary">Contextual Awareness</Text>
                      <Text className="font-caption-sm text-xs text-on-surface-variant">14 mins ago</Text>
                    </View>
                    <Text className="text-body-md text-base text-on-surface-variant">Requested location data for "Home Arrival" automation trigger. Data purged immediately.</Text>
                    <View className="mt-2 flex-row gap-2">
                      <View className="px-2 py-0.5 rounded-full bg-error-container">
                        <Text className="text-on-error-container text-[10px] font-bold uppercase">Temporary Access</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="p-4 flex-row items-start gap-4  border-b border-outline-variant/20">
                  <View className="w-12 h-12 rounded-full bg-surface-container-highest items-center justify-center shrink-0">
                    <MaterialIcons name="mic" size={24} color={colors.primary} />
                  </View>
                  <View className="flex-1 flex-col">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-title-sm text-base font-bold text-primary">Voice Command Processor</Text>
                      <Text className="font-caption-sm text-xs text-on-surface-variant">1 hour ago</Text>
                    </View>
                    <Text className="text-body-md text-base text-on-surface-variant">Transcribed query: "Schedule secure backup for tonight". Audio deleted after processing.</Text>
                    <View className="mt-2 flex-row gap-2">
                      <View className="px-2 py-0.5 rounded-full bg-tertiary-fixed-dim/20">
                        <Text className="text-on-tertiary-fixed-variant text-[10px] font-bold uppercase">Processed Locally</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-surface-container-high p-4 items-center">
                <Text className="text-primary font-title-sm text-base font-medium">Show More Activity</Text>
              </TouchableOpacity>
            </View>


          </View>

          {/* Column: Sidebar Features */}
          <View className="flex-col gap-4 w-full md:w-1/3 min-w-[300px]">
            {/* Data Retention Card */}
            <View className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm border border-outline-variant/10">
              <View className="flex-row items-center gap-3 mb-4">
                <MaterialIcons name="history" size={24} color={colors.secondary} />
                <Text className="font-title-sm text-primary font-bold">Data Retention</Text>
              </View>
              <Text className="text-caption-sm text-on-surface-variant mb-6">How long should the AI OS remember your interactions?</Text>
              
              <View className="flex-col gap-2">
                <TouchableOpacity onPress={() => setRetentionPeriod('30days')} className={`w-full p-4 rounded-xl flex-row items-center justify-between ${retentionPeriod === '30days' ? 'bg-primary' : 'bg-surface-container-high'}`}>
                  <Text className={`font-body-md text-base ${retentionPeriod === '30days' ? 'text-white' : 'text-on-surface'}`}>30 Days</Text>
                  {retentionPeriod === '30days' ? <MaterialIcons name="check-circle" size={18} color="#ffffff" /> : <MaterialIcons name="radio-button-unchecked" size={18} color={colors.outline} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRetentionPeriod('90days')} className={`w-full p-4 rounded-xl flex-row items-center justify-between ${retentionPeriod === '90days' ? 'bg-primary' : 'bg-surface-container-high'}`}>
                  <Text className={`font-body-md text-base ${retentionPeriod === '90days' ? 'text-white' : 'text-on-surface'}`}>90 Days</Text>
                  {retentionPeriod === '90days' ? <MaterialIcons name="check-circle" size={18} color="#ffffff" /> : <MaterialIcons name="radio-button-unchecked" size={18} color={colors.outline} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRetentionPeriod('permanent')} className={`w-full p-4 rounded-xl flex-row items-center justify-between ${retentionPeriod === 'permanent' ? 'bg-primary' : 'bg-surface-container-high'}`}>
                  <Text className={`font-body-md text-base ${retentionPeriod === 'permanent' ? 'text-white' : 'text-on-surface'}`}>Permanent</Text>
                  {retentionPeriod === 'permanent' ? <MaterialIcons name="check-circle" size={18} color="#ffffff" /> : <MaterialIcons name="radio-button-unchecked" size={18} color={colors.outline} />}
                </TouchableOpacity>
              </View>

              <View className="mt-6 pt-6 border-t border-outline-variant/20">
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full py-3 bg-error-container rounded-xl flex-row items-center justify-center gap-2">
                  <MaterialIcons name="delete-forever" size={20} color={colors['on-error-container']} />
                  <Text className="font-title-sm text-base text-on-error-container font-medium">Wipe All Data Now</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Connected Devices Section */}
            <View className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm border border-outline-variant/10">
              <Text className="font-title-sm text-primary font-bold mb-4">Connected Devices</Text>
              <View className="flex-col gap-4">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 bg-surface-container-high rounded-full items-center justify-center">
                    <MaterialIcons name="smartphone" size={20} color={colors.primary} />
                  </View>
                  <View className="flex-1 flex-col">
                    <Text className="font-body-md text-base text-primary font-medium">iPhone 15 Pro</Text>
                    <Text className="text-caption-sm text-xs text-on-tertiary-container font-medium">This device • Active</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 bg-surface-container-high rounded-full items-center justify-center">
                    <MaterialIcons name="laptop-mac" size={20} color={colors.primary} />
                  </View>
                  <View className="flex-1 flex-col">
                    <Text className="font-body-md text-base text-primary font-medium">MacBook Air M2</Text>
                    <Text className="text-caption-sm text-xs text-on-surface-variant">Last active: 4h ago</Text>
                  </View>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2">
                    <MaterialIcons name="logout" size={20} color={colors.outline} />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full mt-6 py-3 border border-outline-variant rounded-xl items-center justify-center">
                <Text className="font-title-sm text-base text-primary font-medium">Manage All Devices</Text>
              </TouchableOpacity>
            </View>

            {/* Digital Inheritance */}
            <View className="bg-primary-container rounded-[24px] p-6 shadow-sm">
              <View className="flex-row items-center gap-3 mb-4">
                <MaterialIcons name="key" size={24} color={colors['secondary-fixed']} />
                <Text className="font-title-sm text-white font-bold">Digital Inheritance</Text>
              </View>
              <Text className="text-caption-sm text-white/80 mb-4">Assign a trusted contact to access your vault in case of emergency.</Text>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full py-3 bg-white/10 border border-white/20 rounded-xl items-center justify-center">
                <Text className="font-label-xs text-xs uppercase text-white tracking-widest font-bold">Setup Heir</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>

        {/* Security Recommendations */}
        <View className="flex-col gap-4 mt-4">
          <Text className="font-title-sm text-xl font-bold text-primary px-1">Security Recommendations</Text>
          <View className="flex-col md:flex-row gap-4">
            
            <View className="bg-secondary-container/20 border border-secondary/20 p-6 rounded-[24px] flex-row items-start gap-4 flex-1">
              <MaterialIcons name="stars" size={24} color={colors['secondary-fixed-variant']} />
              <View className="flex-col flex-1">
                <Text className="font-title-sm text-base text-primary font-bold mb-1">Update Biometrics</Text>
                <Text className="text-caption-sm text-xs text-on-surface-variant">It's been 6 months since your last scan calibration.</Text>
              </View>
            </View>
            
            <View className="bg-surface-container-high p-6 rounded-[24px] flex-row items-start gap-4 flex-1">
              <MaterialIcons name="cloud-off" size={24} color={colors.primary} />
              <View className="flex-col flex-1">
                <Text className="font-title-sm text-base text-primary font-bold mb-1">Go Offline</Text>
                <Text className="text-caption-sm text-xs text-on-surface-variant">Switch to local-only mode for upcoming sensitive travel.</Text>
              </View>
            </View>
            
            <View className="bg-surface-container-high p-6 rounded-[24px] flex-row items-start gap-4 flex-1">
              <MaterialIcons name="verified" size={24} color={colors.primary} />
              <View className="flex-col flex-1">
                <Text className="font-title-sm text-base text-primary font-bold mb-1">Privacy Score: 98</Text>
                <Text className="text-caption-sm text-xs text-on-surface-variant">Your profile is highly secured. Keep it up!</Text>
              </View>
            </View>

          </View>
        </View>

      </View>
    </Screen>
  );
}
