import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function BillingSettings() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <Screen scrollable={true} className="pb-32">
        {/* TopAppBar */}
        <View className="w-full bg-surface flex-row items-center px-margin-mobile md:px-margin-desktop h-16 mb-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop pb-6 w-full flex-col">
          
          {/* Header */}
          <View className="mb-8 flex-col gap-1">
            <View className="flex-row items-center gap-1 mb-2">
              <Text className="font-caption-sm text-xs text-on-surface-variant">Settings</Text>
              <MaterialIcons name="chevron-right" size={14} color={colors['on-surface-variant']} />
              <Text className="font-caption-sm text-xs text-primary font-medium">Billing & Subscriptions</Text>
            </View>
            <Text className="font-headline-md text-3xl font-bold text-on-surface">Billing & Subscriptions</Text>
            <Text className="font-body-md text-base text-on-surface-variant mt-1">Manage your plan, billing details, and view your invoice history.</Text>
          </View>

          {/* Bento Layout for Billing Info */}
          <View className="flex-col md:flex-row gap-6 mb-8 w-full">
            
            {/* Current Plan Card */}
            <View className="w-full md:w-[66%] bg-white rounded-[24px] p-6 md:p-8 shadow-sm flex-col justify-between min-h-[220px] border border-outline-variant/30">
              <View className="flex-col mb-8">
                <View className="flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <View className="flex-col flex-1 sm:pr-4">
                    <View className="flex-row items-center gap-1 bg-secondary-container self-start px-2 py-0.5 rounded-full mb-3">
                      <MaterialIcons name="verified" size={12} color={colors['on-secondary-container']} />
                      <Text className="font-label-xs text-[10px] font-bold text-on-secondary-container uppercase tracking-widest">Active Plan</Text>
                    </View>
                    <Text className="font-title-sm text-xl text-primary font-bold mb-1">YRecall Premium (Annual)</Text>
                    <Text className="font-body-md text-sm text-on-surface-variant">Access to full lifetime memory retrieval, neural search, and advanced insights.</Text>
                  </View>
                  <View className="flex-col sm:items-end">
                    <Text className="font-headline-md text-3xl font-bold text-primary">$129.99</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">per year</Text>
                  </View>
                </View>
              </View>

              <View className="pt-6 border-t border-outline-variant/30 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <MaterialIcons name="event-repeat" size={24} color={colors.secondary} />
                  <View className="flex-col">
                    <Text className="font-caption-sm text-xs text-on-surface-variant">Next renewal date</Text>
                    <Text className="font-body-md text-sm font-medium text-on-surface">Oct 25, 2024</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 bg-surface-variant rounded-xl ">
                  <Text className="text-on-surface-variant font-bold text-xs">View Details</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Payment Method Card */}
            <View className="w-full md:w-[32%] bg-white rounded-[24px] p-6 shadow-sm flex-col justify-between border border-outline-variant/30">
              <View className="flex-col">
                <Text className="font-body-md text-base font-bold text-on-surface mb-4">Payment Method</Text>
                <View className="flex-row items-center gap-4 p-4 bg-surface-container rounded-xl">
                  <View className="w-10 h-6 bg-primary rounded items-center justify-center">
                    <Text className="text-white text-[8px] font-bold">VISA</Text>
                  </View>
                  <View className="flex-col">
                    <Text className="font-body-md text-base font-medium text-on-surface">•••• 4242</Text>
                    <Text className="font-caption-sm text-xs text-on-surface-variant">Expires 12/26</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="mt-8 w-full flex-row items-center justify-center gap-2  border border-outline-variant/50 rounded-xl h-12">
                <MaterialIcons name="edit" size={18} color={colors.secondary} />
                <Text className="text-secondary font-bold text-xs uppercase tracking-widest">Update Method</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Invoice History List */}
          <View className="flex-col w-full">
            <View className="flex-row items-center justify-between mb-4 px-2">
              <Text className="font-title-sm text-xl font-bold text-on-surface">Invoice History</Text>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-1">
                <Text className="text-on-surface-variant font-bold text-xs">Filter by year</Text>
                <MaterialIcons name="expand-more" size={16} color={colors['on-surface-variant']} />
              </TouchableOpacity>
            </View>

            <View className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-outline-variant/30 w-full flex-col">
              {/* Table Header */}
              <View className="flex-row px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 hidden sm:flex">
                <Text className="flex-[2] font-label-xs text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Date</Text>
                <Text className="flex-1 font-label-xs text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Amount</Text>
                <Text className="flex-1 font-label-xs text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Status</Text>
                <Text className="flex-1 font-label-xs text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Invoice</Text>
              </View>

              {/* Invoice Item 1 */}
              <View className="flex-col sm:flex-row px-6 py-4 sm:items-center border-b border-surface-container-high gap-y-3 sm:gap-y-0">
                <View className="flex-row items-center justify-between sm:hidden">
                   <Text className="font-label-xs text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Date</Text>
                   <Text className="font-body-md text-base text-on-surface font-medium">Oct 25, 2023</Text>
                </View>
                <Text className="hidden sm:flex sm:flex-[2] font-body-md text-base text-on-surface">Oct 25, 2023</Text>

                <View className="flex-row items-center justify-between sm:hidden">
                   <Text className="font-label-xs text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Amount</Text>
                   <Text className="font-body-md text-base font-medium text-on-surface">$129.99</Text>
                </View>
                <Text className="hidden sm:flex sm:flex-1 font-body-md text-base font-medium text-on-surface">$129.99</Text>

                <View className="flex-row items-center justify-between sm:hidden">
                   <Text className="font-label-xs text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</Text>
                   <View className="px-2 py-0.5 bg-tertiary-fixed rounded-full">
                    <Text className="text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-wider">Paid</Text>
                   </View>
                </View>
                <View className="hidden sm:flex sm:flex-1 items-center justify-center">
                  <View className="px-2 py-0.5 bg-tertiary-fixed rounded-full">
                    <Text className="text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-wider">Paid</Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between sm:hidden mt-2 pt-2 border-t border-outline-variant/10">
                   <Text className="font-label-xs text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Download Invoice</Text>
                   <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full border border-outline-variant/30">
                    <MaterialIcons name="file-download" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                <View className="hidden sm:flex sm:flex-1 items-end justify-center">
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full ">
                    <MaterialIcons name="file-download" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Invoice Item 2 */}
              <View className="flex-col sm:flex-row px-6 py-4 sm:items-center gap-y-3 sm:gap-y-0">
                <View className="flex-row items-center justify-between sm:hidden">
                   <Text className="font-label-xs text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Date</Text>
                   <Text className="font-body-md text-base text-on-surface font-medium">Oct 25, 2022</Text>
                </View>
                <Text className="hidden sm:flex sm:flex-[2] font-body-md text-base text-on-surface">Oct 25, 2022</Text>

                <View className="flex-row items-center justify-between sm:hidden">
                   <Text className="font-label-xs text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Amount</Text>
                   <Text className="font-body-md text-base font-medium text-on-surface">$129.99</Text>
                </View>
                <Text className="hidden sm:flex sm:flex-1 font-body-md text-base font-medium text-on-surface">$129.99</Text>

                <View className="flex-row items-center justify-between sm:hidden">
                   <Text className="font-label-xs text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</Text>
                   <View className="px-2 py-0.5 bg-tertiary-fixed rounded-full">
                    <Text className="text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-wider">Paid</Text>
                   </View>
                </View>
                <View className="hidden sm:flex sm:flex-1 items-center justify-center">
                  <View className="px-2 py-0.5 bg-tertiary-fixed rounded-full">
                    <Text className="text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-wider">Paid</Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between sm:hidden mt-2 pt-2 border-t border-outline-variant/10">
                   <Text className="font-label-xs text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Download Invoice</Text>
                   <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full border border-outline-variant/30">
                    <MaterialIcons name="file-download" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                <View className="hidden sm:flex sm:flex-1 items-end justify-center">
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full ">
                    <MaterialIcons name="file-download" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </View>
          
        </View>
      </Screen>

      {/* Floating Bottom Actions */}
      <View className="absolute bottom-10 left-0 right-0 px-margin-mobile flex-row justify-center z-50 pointer-events-box-none">
        <View className="w-full max-w-xl bg-white/95 border border-outline-variant/30 p-4 rounded-[28px] shadow-lg flex-col sm:flex-row gap-4 pointer-events-auto">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 h-14 bg-primary rounded-xl flex-row items-center justify-center gap-2  shadow-sm">
            <MaterialIcons name="upgrade" size={20} color="#ffffff" />
            <Text className="text-white font-bold text-base">Change Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 h-14 bg-surface-variant/80 rounded-xl flex-row items-center justify-center  border border-outline-variant/30">
            <Text className="text-on-surface font-bold text-base">Cancel Subscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
