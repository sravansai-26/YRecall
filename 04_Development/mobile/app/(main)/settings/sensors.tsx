import { View, Text, ScrollView, TouchableOpacity, Switch, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';

export default function SensorSettings() {
  const router = useRouter();
  
  const [audioAmbient, setAudioAmbient] = useState(true);
  const [ruleTherapy, setRuleTherapy] = useState(true);
  const [ruleDinner, setRuleDinner] = useState(true);
  const [ruleSleep, setRuleSleep] = useState(false);

  // Fake wave animation values
  const waves = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => useRef(new Animated.Value(20)).current);

  useEffect(() => {
    if (audioAmbient) {
      const animations = waves.map((wave) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(wave, {
              toValue: Math.random() * 80 + 10,
              duration: 300 + Math.random() * 500,
              useNativeDriver: false,
            }),
            Animated.timing(wave, {
              toValue: 20,
              duration: 300 + Math.random() * 500,
              useNativeDriver: false,
            })
          ])
        );
      });
      animations.forEach(a => a.start());
      return () => animations.forEach(a => a.stop());
    }
  }, [audioAmbient]);

  return (
    <Screen scrollable={true} className="pb-24 bg-background">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16 border-b border-outline-variant/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl font-bold text-primary">Contextual Awareness</Text>
        </View>
        <View className="flex-row items-center gap-6">
          <View className="hidden md:flex-row gap-6 mr-4">
            <Text className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-2 py-1">System Health</Text>
            <Text className="font-label-caps text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-1 border-b-2 border-primary">Privacy Lab</Text>
          </View>
          <View className="w-8 h-8 rounded-full bg-secondary-container items-center justify-center">
            <MaterialIcons name="person" size={20} color={colors['on-secondary-container']} />
          </View>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-8 flex-col gap-6 w-full">
        
        {/* Header Section */}
        <View className="flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <View className="flex-col">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              <Text className="font-label-caps text-[10px] font-bold text-[#059669] uppercase tracking-widest">Sensors Nominal</Text>
            </View>
            <Text className="font-headline-md text-3xl font-bold text-primary mb-1">Contextual Awareness</Text>
            <Text className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
              Manage the real-time telemetry feeding your personal OS. Define boundaries for automated awareness and active privacy shielding.
            </Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 border border-outline-variant rounded-xl  bg-white">
              <Text className="text-on-surface font-bold text-[10px] uppercase tracking-widest">Export Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 bg-primary rounded-xl  shadow-sm">
              <Text className="text-white font-bold text-[10px] uppercase tracking-widest">Flush Cache</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Bento Grid */}
        <View className="flex-col md:flex-row flex-wrap gap-4">
          
          {/* Sensor Feed: Audio Ambient */}
          <View className="w-full md:w-[35%] xl:w-[30%] bg-white/70 p-6 rounded-[24px] shadow-sm border border-outline-variant/30 flex-col gap-4 min-w-[280px]">
            <View className="flex-row justify-between items-start">
              <View className="flex-row items-center gap-3">
                <View className="p-2 bg-secondary/10 rounded-xl">
                  <MaterialIcons name="mic" size={20} color={colors.secondary} />
                </View>
                <Text className="font-bold text-base text-on-surface">Audio Ambient</Text>
              </View>
              <Switch 
                value={audioAmbient}
                onValueChange={setAudioAmbient}
                trackColor={{ false: colors['outline-variant'], true: colors.secondary }}
                thumbColor="#ffffff"
              />
            </View>
            <View className="h-24 flex-row items-end gap-1 px-2 overflow-hidden justify-around">
              {waves.map((wave, i) => (
                <Animated.View 
                  key={i} 
                  style={{ 
                    width: 4, 
                    height: wave.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
                    backgroundColor: colors.secondary, 
                    opacity: 0.3 + (i % 3) * 0.2,
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2 
                  }} 
                />
              ))}
            </View>
            <View className="flex-row justify-between border-t border-outline-variant/30 pt-4">
              <Text className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status: {audioAmbient ? 'Active' : 'Muted'}</Text>
              <Text className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Latency: 14MS</Text>
            </View>
          </View>

          {/* Sensor Feed: Location Context */}
          <View className="flex-1 bg-white/70 p-6 rounded-[24px] shadow-sm border border-outline-variant/30 relative overflow-hidden flex-col justify-between min-w-[320px]">
            <View className="z-10 flex-col flex-1 justify-between">
              <View className="flex-row justify-between items-start">
                <View className="flex-row items-center gap-3">
                  <View className="p-2 bg-secondary/10 rounded-xl">
                    <MaterialIcons name="location-on" size={20} color={colors.secondary} />
                  </View>
                  <View className="flex-col">
                    <Text className="font-bold text-base text-on-surface">Location Semantic Context</Text>
                    <Text className="text-xs text-on-surface-variant">Currently identifying: "Private Workspace"</Text>
                  </View>
                </View>
                <View className="flex-row gap-2 items-center">
                  <View className="px-2 py-1 bg-[#059669]/10 rounded">
                    <Text className="text-[#059669] font-bold text-[10px] uppercase tracking-widest">High Confidence</Text>
                  </View>
                  <MaterialIcons name="settings" size={20} color={colors['on-surface-variant']} />
                </View>
              </View>
              
              <View className="mt-8 flex-row flex-wrap gap-4">
                <View className="border border-outline-variant/30 p-3 rounded-xl bg-surface/50 flex-1 min-w-[100px]">
                  <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Proximity</Text>
                  <Text className="font-bold text-sm text-on-surface">0.4m (Desk)</Text>
                </View>
                <View className="border border-outline-variant/30 p-3 rounded-xl bg-surface/50 flex-1 min-w-[100px]">
                  <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Accuracy</Text>
                  <Text className="font-bold text-sm text-on-surface">+/- 1.2m</Text>
                </View>
                <View className="border border-outline-variant/30 p-3 rounded-xl bg-surface/50 flex-1 min-w-[100px]">
                  <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Geofence</Text>
                  <Text className="font-bold text-sm text-on-surface">Home/Work</Text>
                </View>
                <View className="border border-outline-variant/30 p-3 rounded-xl bg-surface/50 flex-1 min-w-[100px]">
                  <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Satellites</Text>
                  <Text className="font-bold text-sm text-on-surface">12 Fixed</Text>
                </View>
              </View>
            </View>
            {/* Background Map Placeholder */}
            <View className="absolute right-0 bottom-0 top-0 w-1/2 opacity-5 pointer-events-none">
              <MaterialIcons name="map" size={200} color={colors.primary} style={{ position: 'absolute', right: -50, bottom: -50 }} />
            </View>
          </View>

        </View>

        <View className="flex-col md:flex-row flex-wrap gap-4">
          
          {/* Contextual Shushing */}
          <View className="flex-[1.5] min-w-[320px] bg-white/70 p-6 rounded-[24px] shadow-sm border border-outline-variant/30 flex-col">
            <View className="flex-row items-center gap-3 mb-6">
              <View className="p-2 bg-primary/5 rounded-xl">
                <MaterialIcons name="volume-off" size={24} color={colors.primary} />
              </View>
              <View className="flex-col">
                <Text className="font-headline-md text-2xl font-bold text-on-surface">Contextual Shushing</Text>
                <Text className="text-xs text-on-surface-variant">Automated privacy rules triggered by environmental states.</Text>
              </View>
            </View>
            
            <View className="flex-col gap-3">
              {/* Rule 1 */}
              <View className="flex-row items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/30  transition-colors group">
                <View className="flex-row gap-4 items-center flex-1 pr-4">
                  <MaterialIcons name="medical-services" size={24} color={colors['on-surface-variant']} />
                  <View className="flex-col">
                    <Text className="font-bold text-sm text-on-surface group-">Therapy Sessions</Text>
                    <Text className="text-xs text-on-surface-variant">Mute all logs + Kill ambient audio processing</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-4">
                  <Text className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hidden sm:flex">IF 'CALENDAR' = 'THERAPY'</Text>
                  <Switch value={ruleTherapy} onValueChange={setRuleTherapy} trackColor={{ false: colors['outline-variant'], true: colors.secondary }} thumbColor="#ffffff" />
                </View>
              </View>

              {/* Rule 2 */}
              <View className="flex-row items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/30  transition-colors group">
                <View className="flex-row gap-4 items-center flex-1 pr-4">
                  <MaterialIcons name="restaurant" size={24} color={colors['on-surface-variant']} />
                  <View className="flex-col">
                    <Text className="font-bold text-sm text-on-surface group-">Family Dinner</Text>
                    <Text className="text-xs text-on-surface-variant">Defer work notifications + Ignore productivity metrics</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-4">
                  <Text className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hidden sm:flex">IF 'TIME' {'>'} 18:30 & 'GEO' = 'HOME'</Text>
                  <Switch value={ruleDinner} onValueChange={setRuleDinner} trackColor={{ false: colors['outline-variant'], true: colors.secondary }} thumbColor="#ffffff" />
                </View>
              </View>

              {/* Rule 3 */}
              <View className="flex-row items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/30  transition-colors group">
                <View className="flex-row gap-4 items-center flex-1 pr-4">
                  <MaterialIcons name="bed" size={24} color={colors['on-surface-variant']} />
                  <View className="flex-col">
                    <Text className="font-bold text-sm text-on-surface group-">Sleep Protocol</Text>
                    <Text className="text-xs text-on-surface-variant">Minimum telemetry mode (Biometrics only)</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-4">
                  <Text className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hidden sm:flex">IF 'BIOMETRIC' = 'REM'</Text>
                  <Switch value={ruleSleep} onValueChange={setRuleSleep} trackColor={{ false: colors['outline-variant'], true: colors.secondary }} thumbColor="#ffffff" />
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full mt-4 py-3 border-2 border-dashed border-outline-variant/50 rounded-xl items-center justify-center  transition-all">
              <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">+ Add New Custom Boundary</Text>
            </TouchableOpacity>
          </View>

          {/* Biometric Streams */}
          <View className="flex-1 min-w-[280px] bg-white/70 p-6 rounded-[24px] shadow-sm border border-outline-variant/30 flex-col gap-6">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-3">
                <View className="p-2 bg-[#DC2626]/10 rounded-xl">
                  <MaterialIcons name="monitor-heart" size={24} color="#DC2626" />
                </View>
                <Text className="font-bold text-base text-on-surface">Biometric Streams</Text>
              </View>
              <Text className="font-bold text-[10px] text-[#DC2626] uppercase tracking-widest">Streaming</Text>
            </View>

            <View className="flex-col gap-6">
              <View className="flex-col">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-medium text-on-surface">Heart Rate (BPM)</Text>
                  <Text className="font-bold text-sm text-secondary">72 BPM</Text>
                </View>
                <View className="w-full h-1.5 bg-outline-variant/30 rounded-full overflow-hidden">
                  <View className="h-full bg-secondary rounded-full w-[65%]" />
                </View>
              </View>

              <View className="flex-col">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-medium text-on-surface">Cortisol Proxy (Stress)</Text>
                  <View className="flex-row items-center gap-2">
                    <View className="w-2 h-2 rounded-full bg-[#D97706]" />
                    <Text className="font-bold text-sm text-[#D97706]">Elevated (0.82)</Text>
                  </View>
                </View>
                <View className="w-full h-1.5 bg-outline-variant/30 rounded-full overflow-hidden">
                  <View className="h-full bg-[#D97706] rounded-full w-[82%]" />
                </View>
              </View>

              <View className="flex-col">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-medium text-on-surface">Focus Metric</Text>
                  <Text className="font-bold text-sm text-secondary">Optimal</Text>
                </View>
                <View className="w-full h-1.5 bg-outline-variant/30 rounded-full overflow-hidden">
                  <View className="h-full bg-secondary rounded-full w-[94%]" />
                </View>
              </View>
            </View>

            <View className="mt-auto p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <Text className="text-[11px] leading-relaxed text-on-surface-variant italic">
                "Biometric data is processed locally on the secure enclave. YRecall uses these streams to weight context importance, but never transmits raw pulse or stress signatures."
              </Text>
            </View>
          </View>
        </View>

        {/* App Usage & Focus */}
        <View className="w-full bg-white/70 p-6 rounded-[24px] shadow-sm border border-outline-variant/30 flex-col md:flex-row justify-between gap-6">
          <View className="flex-1 flex-col">
            <Text className="font-headline-md text-2xl font-bold text-on-surface mb-1">App Usage Visibility</Text>
            <Text className="text-sm text-on-surface-variant mb-6">Control which applications contribute to the OS context model.</Text>
            
            <View className="flex-col sm:flex-row gap-4">
              <View className="flex-1 p-4 border border-outline-variant/30 rounded-xl flex-row items-center justify-between bg-surface/50">
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-surface-container-highest rounded-lg items-center justify-center">
                    <MaterialIcons name="terminal" size={16} color={colors['on-surface']} />
                  </View>
                  <Text className="font-medium text-sm text-on-surface">IDE & Tools</Text>
                </View>
                <Text className="font-bold text-[10px] text-secondary uppercase tracking-widest">Full Access</Text>
              </View>
              
              <View className="flex-1 p-4 border border-outline-variant/30 rounded-xl flex-row items-center justify-between bg-surface/50">
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-surface-container-highest rounded-lg items-center justify-center">
                    <MaterialIcons name="mail" size={16} color={colors['on-surface']} />
                  </View>
                  <Text className="font-medium text-sm text-on-surface">Email Clients</Text>
                </View>
                <Text className="font-bold text-[10px] text-[#D97706] uppercase tracking-widest">Summarized</Text>
              </View>
              
              <View className="flex-1 p-4 border border-outline-variant/30 rounded-xl flex-row items-center justify-between bg-surface/50">
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-surface-container-highest rounded-lg items-center justify-center">
                    <MaterialIcons name="chat" size={16} color={colors['on-surface']} />
                  </View>
                  <Text className="font-medium text-sm text-on-surface">Messengers</Text>
                </View>
                <Text className="font-bold text-[10px] text-error uppercase tracking-widest">Blocked</Text>
              </View>
            </View>
          </View>

          <View className="w-full md:w-64 flex-col justify-center items-center p-6 border-t md:border-t-0 md:border-l border-outline-variant/30 md:pl-10">
            <View className="w-32 h-32 rounded-full border-4 border-secondary/20 items-center justify-center relative overflow-hidden">
              <View className="absolute bottom-0 w-full h-[80%] bg-secondary/10" />
              <View className="absolute bottom-[80%] w-full h-[4px] bg-secondary" />
              <View className="items-center z-10">
                <Text className="font-headline-md text-3xl font-bold text-on-surface">80%</Text>
                <Text className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">OS Confidence</Text>
              </View>
            </View>
          </View>
        </View>

      </View>
    </Screen>
  );
}
