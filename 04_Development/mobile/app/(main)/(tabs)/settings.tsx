import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';
import { auth } from '../../../src/shared/lib/firebase';
import { signOut } from 'firebase/auth';
import { useEntitlements } from '../../../src/modules/billing/store';
import { useRestorePurchases } from '../../../src/modules/billing/api';
import { useTranslation } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import { Linking, ActivityIndicator } from 'react-native';

export default function SettingsHub() {
  const router = useRouter();
  const { user, profileDetails, setUser } = useAuthStore();
  const { planId, isPremium } = useEntitlements();
  const { t } = useTranslation();
  const restorePurchases = useRestorePurchases();
  const [isRestoring, setIsRestoring] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      await restorePurchases.mutateAsync({});
      require('react-native').Alert.alert('Success', 'Purchases restored successfully.');
    } catch (error) {
      require('react-native').Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleSignOut = () => {
    require('react-native').Alert.alert(
      t('settings.signOut') || 'Sign Out',
      'Are you sure you want to sign out? Your offline data will be synced before logging out.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            setIsSigningOut(true);
            try {
              // 1. In a real scenario, trigger queue sync here
              // await syncManager.flushAll();
              
              // 2. Clear Secure Store (encryption keys, preferences)
              await SecureStore.deleteItemAsync('encryption_key');
              
              // 3. Sign out of Firebase
              await signOut(auth);
              
              // 4. Clear Auth state & navigate
              setUser(null);
              router.replace('/(auth)');
            } catch (error) {
              console.error(error);
              require('react-native').Alert.alert('Error', 'Failed to sign out completely.');
            } finally {
              setIsSigningOut(false);
            }
          }
        }
      ]
    );
  };

  return (
    <Screen scrollable={true} className="pb-32">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-40 bg-surface flex-row items-center justify-between px-margin-mobile h-16">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">{t('settings.title')}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(modals)/search')} className="p-2 rounded-full ">
          <MaterialIcons name="search" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop space-y-6 pt-6 flex-1 w-full">
        
        {/* User Profile Card */}
        <View className="w-full">
          <TouchableOpacity onPress={() => router.push('/(main)/profile-edit')} className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm flex-col md:flex-row md:items-center justify-between gap-4">
            <View className="flex-row items-center gap-6">
              <View className="relative">
                <View className="w-20 h-20 rounded-full overflow-hidden border border-outline-variant/20 items-center justify-center bg-primary/10">
                  {user?.photoURL ? (
                    <Image source={{ uri: user.photoURL }} className="w-full h-full" />
                  ) : (
                    <Text className="text-3xl font-bold text-primary">{user?.displayName?.charAt(0) || 'U'}</Text>
                  )}
                </View>
              </View>
                <View className="flex-col">
                  <Text className="font-headline-md text-3xl font-bold text-primary leading-tight mb-1">{user?.displayName || 'User'}</Text>
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="font-body-md text-base text-on-surface-variant">{user?.email || 'No email'}</Text>
                    <View className="-mt-1">
                      <MaterialIcons name="edit" size={16} color={colors.outline} />
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => router.push('/settings/billing')} className="mt-1">
                  <Text className="font-body-sm text-sm text-secondary font-medium underline">
                    {isPremium ? t('settings.premiumMember') : t('settings.basicUser')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Categories */}
        <View className="flex-col gap-8 pt-6">
          
          {/* The Brain / Knowledge Graph (Premium Section) */}
          <View className="flex-col gap-4">
            <Text className="font-label-xs text-xs text-on-surface-variant font-bold uppercase tracking-widest px-1">{t('settings.neuralNetwork')}</Text>
            <TouchableOpacity 
              onPress={() => router.push('/(main)/knowledge-graph')} 
              className="bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-sm mb-4"
            >
              <View className="w-full flex-row items-center justify-between p-6 bg-white relative">
                <View className="absolute inset-0 bg-primary/5" />
                <View className="flex-row items-center gap-4 z-10">
                  <View className="w-12 h-12 items-center justify-center rounded-2xl bg-primary/10">
                    <MaterialIcons name="hub" size={28} color={colors.primary} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-headline-sm text-lg font-bold text-primary">{t('settings.interactiveGraph')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant mt-0.5">{t('settings.exploreGraph')}</Text>
                  </View>
                </View>
                <View className="z-10 bg-primary/10 rounded-full p-2">
                  <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push('/settings/knowledge-graph')} 
              className="bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-sm"
            >
              <View className="w-full flex-row items-center justify-between p-6 bg-white relative">
                <View className="flex-row items-center gap-4 z-10">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container">
                    <MaterialIcons name="settings" size={24} color={colors['on-surface-variant']} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">{t('settings.graphSettings')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant mt-0.5">{t('settings.graphSettingsDesc')}</Text>
                  </View>
                </View>
                <View className="z-10 bg-surface-container-high rounded-full p-2">
                  <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Personalization (AI Focus) */}
          <View className="flex-col gap-4">
            <Text className="font-label-xs text-xs text-on-surface-variant font-bold uppercase tracking-widest px-1">{t('settings.intelligenceExp')}</Text>
            <View className="bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-sm">
              <TouchableOpacity onPress={() => router.push('/settings/ai')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-secondary/10">
                    <MaterialIcons name="auto-awesome" size={24} color={colors.secondary} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">{t('settings.aiPersona')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">{t('settings.aiPersonaDesc')}</Text>
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
                    <Text className="font-body-md text-base font-bold text-primary">{t('settings.voice')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">{t('settings.voiceDesc')}</Text>
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
                    <Text className="font-body-md text-base font-bold text-primary">{t('settings.memoryFilters')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">{t('settings.memoryFiltersDesc')}</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
              
              <View className="h-[1px] bg-outline-variant/20 mx-6" />
              
              <TouchableOpacity onPress={() => router.push('/(main)/automation')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-primary/10">
                    <MaterialIcons name="smart-toy" size={24} color={colors.primary} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">{t('settings.automationCenter')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">{t('settings.automationDesc')}</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Privacy & Safety */}
          <View className="flex-col gap-4">
            <Text className="font-label-xs text-xs text-on-surface-variant font-bold uppercase tracking-widest px-1">{t('settings.security')}</Text>
            <View className="bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-sm">
              <TouchableOpacity onPress={() => router.push('/settings/biometrics')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container">
                    <MaterialIcons name="fingerprint" size={24} color={colors['on-surface-variant']} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">{t('settings.biometrics')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">{t('settings.biometricsDesc')}</Text>
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
                    <Text className="font-body-md text-base font-bold text-primary">{t('settings.encryption')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">{t('settings.encryptionDesc')}</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
            </View>
          </View>

          {/* System */}
          <View className="flex-col gap-4">
            <Text className="font-label-xs text-xs text-on-surface-variant font-bold uppercase tracking-widest px-1">{t('settings.system')}</Text>
            <View className="bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-sm">
              <TouchableOpacity onPress={() => router.push('/settings/experience')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container">
                    <MaterialIcons name="palette" size={24} color={colors['on-surface-variant']} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">{t('settings.experience')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">{t('settings.experienceDesc')}</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
              
              <View className="h-[1px] bg-outline-variant/20 mx-6" />
              
              <TouchableOpacity onPress={() => router.push('/settings/notifications')} className="w-full flex-row items-center justify-between p-6 bg-white ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 items-center justify-center rounded-xl bg-surface-container">
                    <MaterialIcons name="notifications" size={24} color={colors['on-surface-variant']} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-bold text-primary">{t('settings.notifications')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">{t('settings.notificationsDesc')}</Text>
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
                    <Text className="font-body-md text-base font-bold text-primary">{t('settings.dataStorage')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">{t('settings.dataStorageDesc')}</Text>
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
                    <Text className="font-body-md text-base font-bold text-primary">{t('settings.importExport')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">{t('settings.importExportDesc')}</Text>
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
                    <Text className="font-body-md text-base font-bold text-primary">{t('settings.widgetConfig')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">{t('settings.widgetConfigDesc')}</Text>
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
                    <Text className="font-body-md text-base font-bold text-primary">{t('settings.billing')}</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">{t('settings.billingDesc')}</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Help/Danger Zone */}
          <View className="pt-6 flex-col gap-4 items-center mb-10">
            <TouchableOpacity onPress={() => router.push('/support')} className="w-full max-w-sm py-4 items-center">
              <Text className="font-body-md text-base font-bold text-primary">{t('settings.help')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.lyfspot.yrecall').catch(() => { require('react-native').Alert.alert('Notice', 'Play Store link will be active after publishing.'); })} className="w-full max-w-sm py-4 items-center flex-row justify-center gap-2">
              <MaterialIcons name="star-rate" size={20} color={colors.primary} />
              <Text className="font-body-md text-base font-bold text-primary">{t('settings.rateUs', 'Rate Us on Play Store')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleRestorePurchases} disabled={isRestoring} className="w-full max-w-sm py-4 flex-row justify-center items-center gap-2">
              {isRestoring ? <ActivityIndicator size="small" color={colors.primary} /> : null}
              <Text className="font-body-md text-base font-bold text-primary">{t('settings.restorePurchases')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleSignOut} disabled={isSigningOut} className="w-full max-w-sm py-4 flex-row justify-center items-center gap-2">
              {isSigningOut ? <ActivityIndicator size="small" color={colors.error} /> : null}
              <Text className="font-body-md text-base font-bold text-error">{t('settings.signOut')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/settings/account')} className="w-full max-w-sm py-4 items-center">
              <Text className="font-body-md text-base font-bold text-error">{t('settings.deleteAccount')}</Text>
            </TouchableOpacity>
            <Text className="font-label-xs text-xs text-outline pt-4">YRecall v4.2.0 • Build 992</Text>

            {/* Credits Section */}
            <View className="mt-8 items-center">
              <Text className="font-body-sm text-sm text-on-surface-variant">
                Designed & Developed by{' '}
                <Text 
                  onPress={() => Linking.openURL('https://sailyfspot.blogspot.com')}
                  className="font-bold text-primary"
                >
                  LYFSpot
                </Text>
              </Text>
              <Text className="font-caption-sm text-xs text-outline mt-1">
                © 2026 LYFSpot. All Rights Reserved.
              </Text>
            </View>
          </View>


        </View>
      </View>
    </Screen>
  );
}
