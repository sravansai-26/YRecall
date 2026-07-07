import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function Billing() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      {/* TopAppBar */}
      <View className="w-full top-0 sticky z-50 bg-surface-container border-b border-outline-variant/10 shadow-sm h-16 px-4 md:px-margin-desktop flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="hub" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl font-bold text-primary">Workspace Admin</Text>
        </View>
        <View className="hidden md:flex-row gap-8">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-label-xs text-on-surface-variant uppercase tracking-widest">Members</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="font-label-xs text-on-surface-variant uppercase tracking-widest">Security</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="border-b-2 border-primary"><Text className="font-label-xs text-primary font-bold uppercase tracking-widest pb-1">Billing</Text></TouchableOpacity>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-primary px-4 py-2 rounded-xl flex-row items-center gap-2">
            <MaterialIcons name="add" size={18} color="#ffffff" />
            <Text className="text-white font-body-sm font-bold">Add Seats</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 w-full max-w-[1024px] mx-auto px-4 md:px-margin-desktop py-10 pb-32">
        <View className="mb-8">
          <Text className="font-headline-lg text-[32px] text-primary tracking-tight font-bold">Billing & Usage</Text>
          <Text className="text-on-surface-variant font-body-md mt-1">Manage your team's subscription, payment methods, and usage limits.</Text>
        </View>

        <View className="flex-col gap-8">
          
          {/* Current Plan Overview */}
          <View className="bg-white rounded-2xl p-8 border border-outline-variant/20 shadow-sm flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <View className="flex-col">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="font-headline-sm text-2xl font-bold text-primary">Teams Pro</Text>
                <View className="bg-secondary-container px-2 py-0.5 rounded-full">
                  <Text className="text-on-secondary-container font-label-xs uppercase">Active</Text>
                </View>
              </View>
              <Text className="text-body-md text-on-surface-variant">Billed annually ($144/user/year). Next billing date is Oct 12, 2024.</Text>
            </View>
            <View className="flex-col md:items-end">
              <Text className="font-display-lg text-[48px] font-bold text-primary">$1,728<Text className="font-headline-sm text-[20px] font-normal text-on-surface-variant">/yr</Text></Text>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="mt-2"><Text className="text-primary font-bold">Manage Plan</Text></TouchableOpacity>
            </View>
          </View>

          {/* Usage Metrics Grid */}
          <View className="flex-col md:flex-row gap-6">
            
            <View className="flex-1 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 shadow-sm flex-col">
              <View className="flex-row items-center gap-2 mb-4">
                <MaterialIcons name="groups" size={24} color={colors.primary} />
                <Text className="font-headline-sm text-lg font-bold text-primary">Seats</Text>
              </View>
              <Text className="font-headline-md text-3xl font-bold text-primary mb-2">12 <Text className="font-body-md text-on-surface-variant font-normal">/ 15 used</Text></Text>
              <View className="w-full h-2 bg-surface-variant rounded-full overflow-hidden mb-4">
                <View className="h-full w-[80%] bg-primary" />
              </View>
              <Text className="text-body-sm text-on-surface-variant">3 available seats. $12/mo per additional seat.</Text>
            </View>

            <View className="flex-1 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 shadow-sm flex-col">
              <View className="flex-row items-center gap-2 mb-4">
                <MaterialIcons name="cloud" size={24} color={colors.secondary} />
                <Text className="font-headline-sm text-lg font-bold text-primary">Storage</Text>
              </View>
              <Text className="font-headline-md text-3xl font-bold text-primary mb-2">42 <Text className="font-body-md text-on-surface-variant font-normal">GB / 100 GB</Text></Text>
              <View className="w-full h-2 bg-surface-variant rounded-full overflow-hidden mb-4">
                <View className="h-full w-[42%] bg-secondary" />
              </View>
              <Text className="text-body-sm text-on-surface-variant">Shared across all team members.</Text>
            </View>

            <View className="flex-1 bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 shadow-sm flex-col">
              <View className="flex-row items-center gap-2 mb-4">
                <MaterialIcons name="auto-awesome" size={24} color={colors.primary} />
                <Text className="font-headline-sm text-lg font-bold text-primary">AI Compute</Text>
              </View>
              <Text className="font-headline-md text-3xl font-bold text-primary mb-2">4.2k <Text className="font-body-md text-on-surface-variant font-normal">/ 10k reqs</Text></Text>
              <View className="w-full h-2 bg-surface-variant rounded-full overflow-hidden mb-4">
                <View className="h-full w-[42%] bg-primary" />
              </View>
              <Text className="text-body-sm text-on-surface-variant">Resets in 12 days.</Text>
            </View>

          </View>

          {/* Payment Method */}
          <View className="bg-white rounded-2xl p-8 border border-outline-variant/20 shadow-sm flex-col">
            <Text className="font-headline-sm text-xl font-bold text-primary mb-6">Payment Method</Text>
            <View className="flex-row items-center justify-between p-4 rounded-xl border border-outline-variant/20 bg-surface-bright">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-8 bg-surface-container rounded border border-outline-variant/30 items-center justify-center">
                  <MaterialIcons name="credit-card" size={20} color={colors.primary} />
                </View>
                <View className="flex-col">
                  <Text className="font-bold text-primary">Visa ending in 4242</Text>
                  <Text className="text-body-sm text-on-surface-variant">Expires 12/25</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 border border-outline-variant rounded-lg">
                <Text className="font-bold text-primary">Update</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Billing History */}
          <View className="bg-white rounded-2xl p-8 border border-outline-variant/20 shadow-sm flex-col">
            <Text className="font-headline-sm text-xl font-bold text-primary mb-6">Billing History</Text>
            
            <View className="flex-col">
              {/* Table Header */}
              <View className="flex-row items-center justify-between py-3 border-b border-outline-variant/20">
                <Text className="flex-[2] font-label-xs uppercase text-on-surface-variant tracking-widest">Date</Text>
                <Text className="flex-[3] font-label-xs uppercase text-on-surface-variant tracking-widest">Description</Text>
                <Text className="flex-[1] font-label-xs uppercase text-on-surface-variant tracking-widest text-right">Amount</Text>
                <Text className="flex-[1] font-label-xs uppercase text-on-surface-variant tracking-widest text-right">Invoice</Text>
              </View>

              {/* Row 1 */}
              <View className="flex-row items-center justify-between py-4 border-b border-outline-variant/10">
                <Text className="flex-[2] text-body-md text-primary">Oct 12, 2023</Text>
                <Text className="flex-[3] text-body-md text-primary">Teams Pro - Annual (12 seats)</Text>
                <Text className="flex-[1] text-body-md text-primary font-mono text-right">$1,728.00</Text>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-[1] items-end"><MaterialIcons name="download" size={20} color={colors.primary} /></TouchableOpacity>
              </View>

              {/* Row 2 */}
              <View className="flex-row items-center justify-between py-4 border-b border-outline-variant/10">
                <Text className="flex-[2] text-body-md text-primary">Oct 12, 2022</Text>
                <Text className="flex-[3] text-body-md text-primary">Teams Pro - Annual (10 seats)</Text>
                <Text className="flex-[1] text-body-md text-primary font-mono text-right">$1,440.00</Text>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-[1] items-end"><MaterialIcons name="download" size={20} color={colors.primary} /></TouchableOpacity>
              </View>
            </View>
            
          </View>

        </View>
      </View>
    </Screen>
  );
}
