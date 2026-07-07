import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function LifeRecoveryDashboard() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-xl">
        
        {/* Header Section */}
        <View className="flex-col gap-2 mb-2">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="w-3 h-3 bg-error rounded-full animate-pulse" />
            <Text className="font-bold text-label-xs text-error tracking-widest uppercase">CRITICAL ANOMALY DETECTED</Text>
          </View>
          <Text className="font-display-lg text-[32px] md:text-[48px] text-on-surface font-bold tracking-tight">
            Life Recovery Dashboard
          </Text>
          <Text className="text-body-md text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
            Active monitoring has identified high-impact deviations from your scheduled baseline. Select a protocol to initiate systemic recovery.
          </Text>
        </View>

        {/* Bento Grid for Recovery Protocols */}
        <View className="flex-col gap-lg">
          
          <View className="flex-col md:flex-row gap-lg">
            {/* Primary Critical Card: Flight Missed */}
            <View className="flex-[2] bg-surface-container-lowest/80 border border-error/20 p-lg rounded-[24px] shadow-sm relative overflow-hidden">
              <View className="absolute top-0 right-0 p-4">
                <View className="bg-error px-2 py-1 rounded-full">
                  <Text className="text-white font-bold text-[10px] uppercase tracking-widest">ACTION REQUIRED</Text>
                </View>
              </View>

              <View className="flex-col h-full">
                <View className="flex-row items-start gap-4 mb-6">
                  <View className="p-3 bg-error-container rounded-xl">
                    <MaterialIcons name="flight-takeoff" size={28} color={colors['on-error-container']} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-headline-md text-[24px] font-bold text-on-surface leading-tight">Missed Connection: LHR to JFK</Text>
                    <Text className="text-on-surface-variant font-data-mono text-body-sm mt-1">Flight BA175 • Scheduled 09:45 • Current 10:15</Text>
                  </View>
                </View>

                <View className="flex-col sm:flex-row gap-4 mb-6">
                  <View className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex-1">
                    <Text className="font-bold text-label-xs text-on-surface-variant uppercase tracking-widest mb-1">STAKEHOLDERS</Text>
                    <Text className="font-body-md font-bold text-on-surface">4 Notified</Text>
                    <View className="flex-row mt-2">
                      <View className="w-6 h-6 rounded-full border-2 border-surface bg-slate-200 -mr-2" />
                      <View className="w-6 h-6 rounded-full border-2 border-surface bg-slate-300 -mr-2" />
                      <View className="w-6 h-6 rounded-full border-2 border-surface bg-slate-400" />
                    </View>
                  </View>
                  <View className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex-1">
                    <Text className="font-bold text-label-xs text-on-surface-variant uppercase tracking-widest mb-1">ACCOMODATION</Text>
                    <Text className="font-body-md font-bold text-on-surface">Pending Update</Text>
                    <Text className="text-[12px] text-on-surface-variant mt-1">The Edition New York</Text>
                  </View>
                  <View className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex-1">
                    <Text className="font-bold text-label-xs text-on-surface-variant uppercase tracking-widest mb-1">RECOVERY COST</Text>
                    <Text className="font-body-md font-bold text-secondary">$1,240.00 EST</Text>
                    <Text className="text-[12px] text-on-surface-variant mt-1">Insurance applicable</Text>
                  </View>
                </View>

                <View className="mt-auto flex-col gap-3">
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full py-4 bg-primary rounded-xl flex-row items-center justify-center gap-2">
                    <Text className="text-white font-bold text-[16px]">Execute Protocol: Full Travel Recovery</Text>
                    <MaterialIcons name="bolt" size={20} color={colors.white} />
                  </TouchableOpacity>
                  <View className="flex-row gap-3">
                    <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 py-3 border border-outline rounded-xl items-center justify-center">
                      <Text className="text-on-surface-variant font-bold text-label-xs uppercase tracking-widest">Modify Actions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 py-3 border border-outline rounded-xl items-center justify-center">
                      <Text className="text-on-surface-variant font-bold text-label-xs uppercase tracking-widest">Ignore (Manual)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Health Status Card */}
            <View className="flex-[1] bg-surface-container-lowest/80 border border-outline-variant rounded-[24px] p-lg flex-col">
              <View className="flex-row justify-between items-start mb-6">
                <View>
                  <Text className="font-bold text-label-xs text-on-surface-variant uppercase tracking-widest">VITAL ANOMALY</Text>
                  <Text className="font-headline-md text-xl font-bold text-on-surface mt-1">Sudden Recovery Drop</Text>
                </View>
                <View className="p-2 bg-secondary-container/10 rounded-full">
                  <MaterialIcons name="monitor-heart" size={24} color={colors.secondary} />
                </View>
              </View>

              <View className="flex-1 flex-col justify-between">
                <View className="h-24 relative mb-4 flex-row items-end gap-1">
                  <View className="flex-1 bg-secondary/20 h-[50%] rounded-t" />
                  <View className="flex-1 bg-secondary/20 h-[66%] rounded-t" />
                  <View className="flex-1 bg-secondary/20 h-[75%] rounded-t" />
                  <View className="flex-1 bg-error h-[100%] rounded-t" />
                  <View className="flex-1 bg-error/60 h-[66%] rounded-t" />
                </View>

                <View className="flex-col gap-3 mb-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-body-sm text-on-surface-variant">Heart Rate Variability</Text>
                    <Text className="text-body-sm font-data-mono font-bold text-error">-24% Deviation</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-body-sm text-on-surface-variant">Sleep Quality</Text>
                    <Text className="text-body-sm font-data-mono font-bold text-on-surface">4.2h (Disturbed)</Text>
                  </View>
                </View>

                <View className="p-4 bg-surface-container rounded-xl">
                  <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">SUGGESTED ACTION</Text>
                  <Text className="text-body-sm text-on-surface mb-4">Baseline suggests high cortisol. Rescheduling deep-focus work to tomorrow morning.</Text>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full py-2.5 bg-secondary rounded items-center justify-center">
                    <Text className="text-white font-bold text-label-xs uppercase tracking-widest">Authorize Schedule Shift</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </View>

          <View className="flex-col md:flex-row gap-lg">
            
            {/* Financial Irregularity Card */}
            <View className="flex-[1] bg-surface-container-lowest/80 border border-outline-variant rounded-[24px] p-lg">
              <View className="flex-row items-center gap-2 mb-6">
                <MaterialIcons name="payments" size={24} color={colors.secondary} />
                <Text className="font-bold text-label-xs text-on-surface uppercase tracking-widest">FINANCIAL INTEGRITY</Text>
              </View>
              
              <View className="mb-4">
                <Text className="text-[32px] font-bold font-data-mono text-on-surface leading-tight">$2,450.00</Text>
                <Text className="text-body-sm text-on-surface-variant mt-1">Unexpected recurring charge detected</Text>
              </View>

              <View className="flex-col gap-3 mb-6">
                <View className="flex-row items-start gap-3 p-3 bg-surface-container-high rounded-xl border border-outline-variant/30">
                  <MaterialIcons name="warning" size={20} color={colors['on-surface-variant']} />
                  <View className="flex-1">
                    <Text className="font-bold text-[12px] text-on-surface">Cloud Infrastructure (Overage)</Text>
                    <Text className="text-[12px] text-on-surface-variant">Zone: us-east-1 • $12.40/hr</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full py-3 border border-secondary rounded-xl items-center justify-center">
                <Text className="text-secondary font-bold text-label-xs uppercase tracking-widest">Terminate & Audit</Text>
              </TouchableOpacity>
            </View>

            {/* Network/Environmental Card */}
            <View className="flex-[2] bg-surface-container-lowest/80 border border-outline-variant rounded-[24px] p-lg flex-col md:flex-row gap-6">
              
              <View className="flex-1">
                <Text className="font-bold text-label-xs text-on-surface uppercase tracking-widest mb-4">ENVIRONMENTAL SCAN</Text>
                <View className="flex-col gap-4">
                  <View className="flex-row items-center gap-3">
                    <MaterialIcons name="home" size={24} color={colors.primary} />
                    <View>
                      <Text className="text-body-sm font-bold text-on-surface">Home Security</Text>
                      <Text className="text-[10px] text-on-surface-variant uppercase tracking-widest">Armed • No issues</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <MaterialIcons name="wifi-off" size={24} color={colors.error} />
                    <View>
                      <Text className="text-body-sm font-bold text-on-surface">HQ Network</Text>
                      <Text className="text-[10px] text-error uppercase tracking-widest">ISP Outage • 4G Failover Active</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="flex-[1.5] border-t md:border-t-0 md:border-l border-outline-variant pt-6 md:pt-0 md:pl-6">
                <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">CONTINGENCY LOG</Text>
                <View className="flex-col gap-2 font-data-mono text-[12px]">
                  <View className="flex-row items-center gap-2 opacity-70">
                    <View className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    <Text className="text-on-surface">09:42: Detect flight departure without user check-in</Text>
                  </View>
                  <View className="flex-row items-center gap-2 opacity-70">
                    <View className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    <Text className="text-on-surface">09:45: Ping Travel Agent API (Success)</Text>
                  </View>
                  <View className="flex-row items-center gap-2 opacity-70">
                    <View className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    <Text className="text-on-surface">09:46: Locate alternative flights (3 found)</Text>
                  </View>
                  <View className="flex-row items-center gap-2 opacity-70">
                    <View className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    <Text className="text-on-surface">09:50: Drafted 'Late Arrival' emails for Client Alpha</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="w-1.5 h-1.5 bg-error rounded-full animate-pulse" />
                    <Text className="text-on-surface font-bold text-error">10:15: Awaiting user confirmation to execute</Text>
                  </View>
                </View>
              </View>

            </View>

          </View>
        </View>

        {/* AI Assistant / Context Bar */}
        <View className="mt-4 p-lg bg-primary-container rounded-[24px] flex-col md:flex-row items-start md:items-center gap-6">
          <View className="p-4 bg-primary rounded-full relative">
            <MaterialIcons name="psychology" size={32} color={colors.white} />
            <View className="absolute bottom-0 right-0 w-4 h-4 bg-secondary rounded-full border-2 border-primary-container" />
          </View>
          <View className="flex-1">
            <Text className="font-headline-md text-[18px] text-white leading-relaxed">
              "I've pre-drafted the recovery plan for your missed flight. Execution will notify the hotel, rebook your 6PM flight, and move your morning meeting to 2PM tomorrow. Shall I proceed?"
            </Text>
            <View className="flex-row gap-4 mt-6">
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-6 py-3 bg-secondary rounded-full items-center justify-center">
                <Text className="text-white font-bold text-label-xs uppercase tracking-widest">Yes, execute all</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-6 py-3 border border-on-primary-container/30 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-label-xs uppercase tracking-widest">Show details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    </Screen>
  );
}
