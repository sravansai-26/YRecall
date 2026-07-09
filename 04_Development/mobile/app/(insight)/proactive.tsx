import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button, ConfidenceBadge } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

// Custom toggle switch for the automations
const ToggleSwitch = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onToggle}
      className={`w-12 h-6 rounded-full flex-row items-center px-1 ${active ? 'bg-secondary' : 'bg-outline-variant'}`}
      style={{ justifyContent: active ? 'flex-end' : 'flex-start' }}
    >
      <View className="w-4 h-4 bg-white rounded-full shadow-sm" />
    </TouchableOpacity>
  );
};

export default function ProactiveExecutionHub() {
  const router = useRouter();
  
  const [automations, setAutomations] = useState({
    reschedule: true,
    wellness: true,
    portfolio: false,
  });

  return (
    <Screen scrollable={true}>
      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-xl">
        {/* Welcome & Status Header */}
        <View className="flex-col gap-2">
          <Text className="font-display-lg text-[32px] text-primary font-bold tracking-tight">System Execution</Text>
          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            <Text className="font-data-mono text-[14px] text-on-surface-variant font-bold uppercase tracking-widest">
              Active Processing: Life-Data Sync
            </Text>
          </View>
        </View>

        {/* Content Layout */}
        <View className="flex-col gap-lg md:flex-row">
          
          {/* LEFT COLUMN: Proactive Actions */}
          <View className="flex-col gap-lg flex-1">
            
            {/* Action Card: Health */}
            <View className="bg-surface-container-lowest border border-outline-variant p-lg rounded-[24px] flex-col md:flex-row gap-6 shadow-sm">
              <View className="flex-1">
                <View className="flex-row items-center gap-3 mb-4">
                  <View className="bg-secondary-fixed px-3 py-1.5 rounded-full">
                    <Text className="text-on-secondary-fixed text-label-xs font-bold uppercase tracking-widest">Health Intelligence</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="verified" size={16} color={colors['on-surface-variant']} />
                    <Text className="text-body-sm text-on-surface-variant">Source: Biometric Sync</Text>
                  </View>
                </View>
                <Text className="font-headline-md text-[24px] font-bold text-primary mb-2">Supplement Optimization Drafted</Text>
                <Text className="text-body-md text-on-surface-variant leading-relaxed mb-6">
                  Biometric data suggests persistent low Vitamin D levels across 14 days. I've drafted a supplement order matching your dietary preferences (Vegan, 2000IU capsules).
                </Text>
                
                <View className="mb-6">
                  <ConfidenceBadge confidence={94} />
                </View>

                <View className="flex-row flex-wrap gap-4">
                  <Button variant="primary" icon="bolt" label="Execute Order" />
                  <Button variant="outline" label="Review Details" />
                </View>
              </View>
              
              {/* Image side - hidden on narrow screens in real app, we use a fixed height for mobile */}
              <View className="h-48 w-full md:w-48 bg-surface-container rounded-xl overflow-hidden border border-outline-variant mt-4 md:mt-0">
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBup47FzqoW-WShfHTPQCZKYpBBGEm8KOryakM88GPLgbhvgjkfRiPTkcMVBzsrde_4vx4KXRorx9xk9nCaFps8dwH9vfI7CAV4vOVKMAqaEnReDNSIoCh1ERTKANmeoUY3Cwm17Zd_dYEVdx3OoY8rmDnB6BiCEnLIiND-1O4C3tmPNExfCYZRM8OtVT1oU-mvlCRJV5gAvBfsRIIcra4u0EAagwmmat3jti1CofH-bIC0WvPQsTr6TLmo80tGv4cQPHkOZ0N7qG8' }}
                  className="w-full h-full"
                />
              </View>
            </View>

            {/* Action Card: Travel */}
            <View className="bg-surface-container-lowest border border-outline-variant p-lg rounded-[24px] flex-col md:flex-row gap-6 shadow-sm">
              <View className="flex-1">
                <View className="flex-row items-center gap-3 mb-4">
                  <View className="bg-tertiary-fixed px-3 py-1.5 rounded-full">
                    <Text className="text-on-tertiary-fixed text-label-xs font-bold uppercase tracking-widest">Logistics Layer</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="calendar-today" size={16} color={colors['on-surface-variant']} />
                    <Text className="text-body-sm text-on-surface-variant">Source: Calendar & Traffic</Text>
                  </View>
                </View>
                <Text className="font-headline-md text-[24px] font-bold text-primary mb-2">Early Flight Departure Required</Text>
                <Text className="text-body-md text-on-surface-variant leading-relaxed mb-6">
                  Heavy traffic detected on I-95 due to construction. To maintain your 92% punctuality rating, I recommend departing 35 minutes earlier. Car is pre-conditioned for 6:15 AM.
                </Text>
                
                <View className="mb-6">
                  <ConfidenceBadge confidence={82} />
                </View>

                <View className="flex-row flex-wrap gap-4">
                  <Button variant="primary" icon="check-circle" label="Update Schedule" />
                  <Button variant="outline" label="Adjust Buffer" />
                </View>
              </View>
              
              <View className="h-48 w-full md:w-48 bg-surface-container rounded-xl overflow-hidden border border-outline-variant relative mt-4 md:mt-0">
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC73stvEMU5NM1PZcSSsmml0DWD2WTLWVZNJvNbezsAgPB-0W7DrKuatqRIDX-Dao-nsarLPQs-7AUBN0Thx0cbdZC4pzi9GRZfWaIO_G5T5o1VbMdNr3RypaJ67EKDhd_rsyWWSoDTinJymQJ6ZJ5c3n2Ov1tltwu7eH8fNXK5FbcKwIJ3c7gUUKFtYtZ6WT8Ege0ZC5yRhJdtwCjT4laXDxds0m9pYbOhazM2GZM_oArT9tm6oig2mH-jRqzZ_KZAjTLPfN7xEW0' }}
                  className="w-full h-full opacity-80"
                />
                <View className="absolute inset-0 bg-secondary/10 pointer-events-none" />
              </View>
            </View>

            {/* Bento Grid: Minor Task Updates */}
            <View className="flex-col md:flex-row gap-lg">
              <View className="flex-1 bg-surface-container-low p-lg rounded-[24px] border border-outline-variant">
                <Text className="font-headline-md text-[18px] font-bold text-primary mb-2">Finance Sweep</Text>
                <Text className="text-body-sm text-on-surface-variant mb-4 leading-relaxed">
                  Idle cash ({'>'} $4k) detected in checking. Proposed transfer to High-Yield Savings.
                </Text>
                <View className="flex-row justify-between items-center mt-auto pt-2">
                  <Text className="text-[#059669] font-data-mono font-bold">98% Match</Text>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
                    <Text className="text-secondary font-bold text-label-xs uppercase tracking-wider">Execute</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-1 bg-surface-container-low p-lg rounded-[24px] border border-outline-variant">
                <Text className="font-headline-md text-[18px] font-bold text-primary mb-2">Subscription Audit</Text>
                <Text className="text-body-sm text-on-surface-variant mb-4 leading-relaxed">
                  Detected unused "DesignPro" seat for 3 months. Cancel now to save $45/mo?
                </Text>
                <View className="flex-row justify-between items-center mt-auto pt-2">
                  <Text className="text-[#D97706] font-data-mono font-bold">74% Match</Text>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
                    <Text className="text-secondary font-bold text-label-xs uppercase tracking-wider">Review</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </View>

          {/* RIGHT COLUMN: Automation & Learning */}
          <View className="flex-col gap-lg flex-1 md:max-w-md">
            
            {/* Automation Hub */}
            <View className="bg-primary-container p-lg rounded-[24px] shadow-sm flex-col gap-6">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="settings-suggest" size={24} color={colors.white} />
                <Text className="font-headline-md text-xl font-bold text-white">Active Automations</Text>
              </View>

              <View className="flex-col gap-6">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-white font-bold text-body-md mb-1">Auto-Reschedule</Text>
                    <Text className="text-white/60 text-body-sm">Conflicts with {'>'}80% priority score</Text>
                  </View>
                  <ToggleSwitch 
                    active={automations.reschedule} 
                    onToggle={() => setAutomations(prev => ({...prev, reschedule: !prev.reschedule}))} 
                  />
                </View>

                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-white font-bold text-body-md mb-1">Wellness Adjustments</Text>
                    <Text className="text-white/60 text-body-sm">Biometric-driven dietary drafts</Text>
                  </View>
                  <ToggleSwitch 
                    active={automations.wellness} 
                    onToggle={() => setAutomations(prev => ({...prev, wellness: !prev.wellness}))} 
                  />
                </View>

                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-white font-bold text-body-md mb-1">Portfolio Balancing</Text>
                    <Text className="text-white/60 text-body-sm">Weekly risk-aligned shifts</Text>
                  </View>
                  <ToggleSwitch 
                    active={automations.portfolio} 
                    onToggle={() => setAutomations(prev => ({...prev, portfolio: !prev.portfolio}))} 
                  />
                </View>
              </View>

              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full mt-4 py-4 border border-white/20 rounded-xl items-center justify-center bg-white/5">
                <Text className="text-white/90 font-bold text-label-xs uppercase tracking-widest">
                  Configure Master Rulebook
                </Text>
              </TouchableOpacity>
            </View>

            {/* Feedback Loop */}
            <View className="bg-surface-container-high p-lg rounded-[24px] border border-outline-variant">
              <View className="flex-row items-center gap-2 mb-4">
                <MaterialIcons name="model-training" size={20} color={colors.secondary} />
                <Text className="font-bold text-label-xs uppercase tracking-widest text-primary">Continuous Learning</Text>
              </View>
              
              <Text className="text-body-md text-on-surface mb-6">
                How was my decision to suggest an early flight today?
              </Text>

              <View className="flex-row gap-4 mb-4">
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl items-center justify-center shadow-sm">
                  <MaterialIcons name="thumb-up" size={20} color={colors['on-surface']} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl items-center justify-center shadow-sm">
                  <MaterialIcons name="thumb-down" size={20} color={colors['on-surface']} />
                </TouchableOpacity>
              </View>

              <Text className="text-center text-[11px] text-on-surface-variant italic">
                Calibration improves execution accuracy by ~12% per interaction.
              </Text>
            </View>

            {/* Intelligent Status */}
            <View className="bg-surface-container rounded-[24px] min-h-[200px] overflow-hidden relative">
              <View className="absolute inset-0 bg-primary/80" />
              <View className="absolute bottom-6 left-6 right-6">
                <Text className="text-white font-data-mono text-[12px] opacity-80 uppercase tracking-widest mb-1">Cognitive Core Load</Text>
                <Text className="text-white font-headline-md text-[24px] font-bold">Processing Contextual Nuance...</Text>
              </View>
            </View>

          </View>
        </View>
      </View>
    </Screen>
  );
}
