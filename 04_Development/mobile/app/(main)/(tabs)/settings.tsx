import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';
import { auth } from '../../../src/shared/lib/firebase';
import { signOut } from 'firebase/auth';

export default function SettingsHub() {
  const router = useRouter();
  const { user, profileDetails, setUser } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.replace('/(auth)');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Screen scrollable={true} className="pb-32">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-40 bg-surface flex-row items-center justify-between px-margin-mobile h-16">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">Settings</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(modals)/search')} className="p-2 rounded-full ">
          <MaterialIcons name="search" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop space-y-6 pt-6 flex-1 w-full">
        
        {/* User Profile Card */}
        <View className="w-full">
          <TouchableOpacity onPress={() => router.push('/(main)/profile-edit')} className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm flex-col md:flex-row md:items-center justify-between gap-4 border border-outline-variant/10 ">
            <View className="flex-row items-center gap-6">
              <View className="relative">
                <View className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/10 items-center justify-center bg-primary/10">
                  {user?.photoURL ? (
                    <Image source={{ uri: user.photoURL }} className="w-full h-full" />
                  ) : (
                    <Text className="text-3xl font-bold text-primary">{user?.displayName?.charAt(0) || 'U'}</Text>
                  )}
                </View>
              </View>
              <View className="flex-col">
                <Text className="font-headline-md text-3xl font-bold text-primary leading-tight">{user?.displayName || 'User'}</Text>
                <Text className="font-body-md text-base text-on-surface-variant mb-1">{user?.email || 'No email'}</Text>
                {profileDetails.occupation && (
                  <Text className="font-body-sm text-sm text-secondary font-medium">{profileDetails.occupation}</Text>
                )}
              </View>
            </View>
            <View className="self-start md:self-auto">
              <MaterialIcons name="edit" size={24} color={colors.outline} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Categories */}
        <View className="flex-col gap-8 pt-6">
          
          {/* Personalization (AI Focus) */}
          <View className="flex-col gap-4">
            <Text className="font-label-xs text-xs text-on-surface-variant font-bold uppercase tracking-widest px-1">Intelligence & Experience</Text>
            <View className="bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-sm border border-outline-variant/20">
              <TouchableOpacity onPress={() => router.push('/settings/ai')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-secondary/10">
                    <MaterialIcons name="auto-awesome" size={24} color={colors.secondary} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">AI Persona</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">Sophisticated & Academic</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
              
              <View className="h-[1px] bg-outline-variant/20 mx-6" />
              
              <TouchableOpacity onPress={() => router.push('/settings/voice')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-secondary/10">
                    <MaterialIcons name="record-voice-over" size={24} color={colors.secondary} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">Voice</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">Natural British (Female)</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
              
              <View className="h-[1px] bg-outline-variant/20 mx-6" />
              
              <TouchableOpacity onPress={() => router.push('/settings/memory-filters')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-secondary/10">
                    <MaterialIcons name="filter-alt" size={24} color={colors.secondary} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">Memory Filters</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">Only include positive sentiments</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Privacy & Safety */}
          <View className="flex-col gap-4">
            <Text className="font-label-xs text-xs text-on-surface-variant font-bold uppercase tracking-widest px-1">Security</Text>
            <View className="bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-sm border border-outline-variant/20">
              <TouchableOpacity onPress={() => router.push('/settings/biometrics')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container">
                    <MaterialIcons name="fingerprint" size={24} color={colors['on-surface-variant']} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">Biometrics</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">Enabled for app entry</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
              
              <View className="h-[1px] bg-outline-variant/20 mx-6" />
              
              <TouchableOpacity onPress={() => router.push('/settings/encryption')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container">
                    <MaterialIcons name="lock" size={24} color={colors['on-surface-variant']} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">Data Encryption</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">End-to-end active</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
            </View>
          </View>

          {/* System */}
          <View className="flex-col gap-4">
            <Text className="font-label-xs text-xs text-on-surface-variant font-bold uppercase tracking-widest px-1">System</Text>
            <View className="bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-sm border border-outline-variant/20">
              <TouchableOpacity onPress={() => router.push('/settings/accessibility')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container">
                    <MaterialIcons name="palette" size={24} color={colors['on-surface-variant']} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">Appearance & Accessibility</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">Light Mode • System Font Scale</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
              
              <View className="h-[1px] bg-outline-variant/20 mx-6" />
              
              <TouchableOpacity onPress={() => router.push('/settings/storage')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container">
                    <MaterialIcons name="cloud-sync" size={24} color={colors['on-surface-variant']} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">Data & Storage</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">Cloud Sync active • 1.2GB stored</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
              
              <View className="h-[1px] bg-outline-variant/20 mx-6" />
              
              <TouchableOpacity onPress={() => router.push('/settings/import-export')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container">
                    <MaterialIcons name="import-export" size={24} color={colors['on-surface-variant']} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">Import / Export</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">Data portability</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>

              <View className="h-[1px] bg-outline-variant/20 mx-6" />
              
              <TouchableOpacity onPress={() => router.push('/settings/widgets')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container">
                    <MaterialIcons name="widgets" size={24} color={colors['on-surface-variant']} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">Widget Configuration</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">System widgets setup</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
              
              <View className="h-[1px] bg-outline-variant/20 mx-6" />
              
              <TouchableOpacity onPress={() => router.push('/settings/billing')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container">
                    <MaterialIcons name="payment" size={24} color={colors['on-surface-variant']} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">Billing & Subscription</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">Manage plans and history</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Help/Danger Zone */}
          <View className="pt-6 flex-col gap-4 items-center mb-10">
            <TouchableOpacity onPress={() => router.push('/support')} className="w-full max-w-sm py-4 items-center">
              <Text className="font-body-md text-base font-bold text-primary">Help & Support</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full max-w-sm py-4 items-center">
              <Text className="font-body-md text-base font-bold text-primary">Restore Purchases</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut} className="w-full max-w-sm py-4 items-center">
              <Text className="font-body-md text-base font-bold text-error">Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/settings/account')} className="w-full max-w-sm py-4 items-center">
              <Text className="font-body-md text-base font-bold text-error">Delete Account</Text>
            </TouchableOpacity>
            <Text className="font-label-xs text-xs text-outline pt-4">YRecall v4.2.0 • Build 992</Text>
          </View>

        </View>
      </View>
    </Screen>
  );
}
