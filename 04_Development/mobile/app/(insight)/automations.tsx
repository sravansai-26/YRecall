import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

// Reusable toggle switch
const ToggleSwitch = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onToggle}
      className={`w-8 h-4 rounded-full flex-row items-center px-[2px] ${active ? 'bg-secondary' : 'bg-outline-variant'}`}
      style={{ justifyContent: active ? 'flex-end' : 'flex-start' }}
    >
      <View className="w-3 h-3 bg-white rounded-full shadow-sm" />
    </TouchableOpacity>
  );
};

export default function AutomationsHub() {
  const router = useRouter();

  const [activeAuto1, setActiveAuto1] = useState(true);
  const [activeAuto2, setActiveAuto2] = useState(false);
  const [activeAuto3, setActiveAuto3] = useState(true);

  return (
    <Screen scrollable={true}>
      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-xl">
        
        {/* Header Section */}
        <View className="flex-col gap-2 mb-2">
          <Text className="font-display-lg text-[32px] text-primary font-bold tracking-tight">Automations</Text>
          <Text className="text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
            Connect YRecall to your external ecosystem. Build workflows that trigger based on your captured memories and digital footprints.
          </Text>
        </View>

        <View className="flex-col md:flex-row gap-lg">
          {/* Main Content Area */}
          <View className="flex-col gap-lg flex-1">
            
            {/* Automation Builder Card (Major) */}
            <View className="p-lg border border-outline-variant rounded-[24px] bg-white shadow-sm flex-col gap-lg">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="font-headline-md text-xl font-bold text-primary mb-1">Workflow Builder</Text>
                  <Text className="text-body-sm text-on-surface-variant">Create a new neural trigger</Text>
                </View>
                <Button variant="primary" icon="add" label="ACTIVATE" />
              </View>

              <View className="flex-col md:flex-row gap-lg">
                {/* Trigger */}
                <View className="flex-1 p-6 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low flex-col gap-4">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="bolt" size={20} color={colors.secondary} />
                    <Text className="font-bold text-label-xs text-secondary uppercase tracking-widest">TRIGGER</Text>
                  </View>
                  <View className="border-b border-outline py-2">
                    <Text className="text-body-md font-bold text-primary">Captured Content Match</Text>
                  </View>
                  <View className="bg-white p-3 rounded-lg border border-outline-variant">
                    <Text className="text-body-sm text-on-surface-variant mb-2">Regex or Keyword</Text>
                    <TextInput 
                      className="text-body-md font-data-mono text-primary p-0"
                      placeholder="e.g. 'Receipt' or 'Invoice'"
                      placeholderTextColor={colors['on-surface-variant']}
                    />
                  </View>
                </View>

                {/* Action */}
                <View className="flex-1 p-6 rounded-xl border border-outline-variant bg-secondary-fixed/30 flex-col gap-4 relative">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="rocket-launch" size={20} color={colors.primary} />
                    <Text className="font-bold text-label-xs text-primary uppercase tracking-widest">ACTION</Text>
                  </View>
                  <View className="border-b border-outline py-2">
                    <Text className="text-body-md font-bold text-primary">Push to Webhook</Text>
                  </View>
                  <View className="bg-white p-3 rounded-lg border border-outline-variant">
                    <Text className="text-body-sm text-on-surface-variant mb-2">Destination Endpoint</Text>
                    <TextInput 
                      className="text-body-md font-data-mono text-secondary p-0"
                      value="https://api.business.com/v1/ingest"
                    />
                  </View>
                  
                  {/* AI Confidence Indicator */}
                  <View className="absolute bottom-4 right-4 flex-row items-center gap-2 bg-white px-2 py-1 rounded-full border border-outline-variant shadow-sm">
                    <View className="w-2 h-2 rounded-full bg-emerald-600" />
                    <Text className="text-[10px] font-bold text-on-surface-variant">AI Confidence: 98%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Execution Logs */}
            <View className="p-lg border border-outline-variant rounded-[24px] bg-white shadow-sm flex-col">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="font-headline-md text-xl font-bold text-primary">Execution Logs</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="border border-outline-variant px-3 py-1.5 rounded-lg ">
                    <Text className="text-[10px] font-bold text-on-surface uppercase tracking-widest">EXPORT CSV</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="border border-outline-variant px-3 py-1.5 rounded-lg ">
                    <Text className="text-[10px] font-bold text-on-surface uppercase tracking-widest">CLEAR</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-col w-[600px] md:w-full">
                  {/* Table Header */}
                  <View className="flex-row border-b border-outline-variant pb-3 mb-2">
                    <Text className="flex-[1.5] text-label-xs font-bold text-on-tertiary-container uppercase">Timestamp</Text>
                    <Text className="flex-[1.5] text-label-xs font-bold text-on-tertiary-container uppercase">Automation</Text>
                    <Text className="flex-2 text-label-xs font-bold text-on-tertiary-container uppercase">Action Taken</Text>
                    <Text className="flex-1 text-label-xs font-bold text-on-tertiary-container uppercase">Status</Text>
                    <Text className="flex-2 text-label-xs font-bold text-on-tertiary-container uppercase">LLM Log</Text>
                  </View>
                  
                  {/* Rows */}
                  <View className="flex-col gap-4 py-2">
                    <View className="flex-row items-center">
                      <Text className="flex-[1.5] text-body-sm font-data-mono text-on-surface">Oct 24, 14:02:11</Text>
                      <Text className="flex-[1.5] text-body-sm font-bold text-on-surface">Receipt Ingester</Text>
                      <Text className="flex-2 text-body-sm text-on-surface">POST {'>'} SAP Business</Text>
                      <View className="flex-1 flex-row items-center gap-1.5">
                        <View className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <Text className="text-[11px] font-bold text-emerald-600">SUCCESS</Text>
                      </View>
                      <Text className="flex-2 text-[12px] font-data-mono text-on-surface-variant" numberOfLines={1}>Identified 'Amazon AWS' invoice...</Text>
                    </View>

                    <View className="flex-row items-center">
                      <Text className="flex-[1.5] text-body-sm font-data-mono text-on-surface">Oct 24, 12:45:01</Text>
                      <Text className="flex-[1.5] text-body-sm font-bold text-on-surface">obsidian_sync</Text>
                      <Text className="flex-2 text-body-sm text-on-surface">Local Write {'>'} Vault</Text>
                      <View className="flex-1 flex-row items-center gap-1.5">
                        <View className="w-1.5 h-1.5 rounded-full bg-error" />
                        <Text className="text-[11px] font-bold text-error">TIMEOUT</Text>
                      </View>
                      <Text className="flex-2 text-[12px] font-data-mono text-on-surface-variant" numberOfLines={1}>Connection refused by local agent...</Text>
                    </View>

                    <View className="flex-row items-center">
                      <Text className="flex-[1.5] text-body-sm font-data-mono text-on-surface">Oct 24, 09:12:44</Text>
                      <Text className="flex-[1.5] text-body-sm font-bold text-on-surface">Project Tagging</Text>
                      <Text className="flex-2 text-body-sm text-on-surface">Update Meta {'>'} SQL</Text>
                      <View className="flex-1 flex-row items-center gap-1.5">
                        <View className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <Text className="text-[11px] font-bold text-emerald-600">SUCCESS</Text>
                      </View>
                      <Text className="flex-2 text-[12px] font-data-mono text-on-surface-variant" numberOfLines={1}>Added 'Priority: High' to memory chunk...</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>

            {/* Proactive Alert Banner */}
            <View className="p-6 bg-inverse-surface rounded-[24px] shadow-sm flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-secondary gap-4">
              <View className="flex-row items-center gap-4 flex-1">
                <View className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <MaterialIcons name="auto-awesome" size={24} color={colors.secondary} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-body-md text-inverse-on-surface">AI Suggestion: New Automation Pattern</Text>
                  <Text className="text-body-sm text-inverse-on-surface opacity-80 mt-1">I noticed you've been manually moving meeting transcripts to Slack. Should I create an automation for this?</Text>
                </View>
              </View>
              <View className="flex-row gap-4">
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 bg-secondary rounded-lg items-center justify-center">
                  <Text className="text-white font-bold text-label-xs uppercase tracking-widest">PROPOSE WORKFLOW</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 border border-outline-variant rounded-lg items-center justify-center">
                  <Text className="text-inverse-on-surface font-bold text-label-xs uppercase tracking-widest">DISMISS</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>

          {/* RIGHT SIDEBAR */}
          <View className="flex-col gap-lg flex-1 md:max-w-[320px]">
            
            {/* Active Automations List */}
            <View className="p-lg border border-outline-variant rounded-[24px] bg-surface shadow-sm h-[400px] flex-col">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="font-headline-md text-xl font-bold text-primary">Active</Text>
                <View className="bg-secondary-container px-2 py-1 rounded">
                  <Text className="text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">4 Running</Text>
                </View>
              </View>
              
              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="flex-col gap-3">
                  
                  {/* Item 1 */}
                  <View className="p-4 bg-white rounded-xl border border-outline-variant flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                        <MaterialIcons name="receipt-long" size={20} color={colors.secondary} />
                      </View>
                      <View>
                        <Text className="text-body-sm font-bold text-primary">Receipt {'>'} Finance</Text>
                        <Text className="text-[11px] text-on-surface-variant">Last run: 2m ago</Text>
                      </View>
                    </View>
                    <ToggleSwitch active={activeAuto1} onToggle={() => setActiveAuto1(!activeAuto1)} />
                  </View>

                  {/* Item 2 */}
                  <View className="p-4 bg-white rounded-xl border border-outline-variant flex-row items-center justify-between opacity-70">
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                        <MaterialIcons name="description" size={20} color={colors['on-surface-variant']} />
                      </View>
                      <View>
                        <Text className="text-body-sm font-bold text-primary">Research {'>'} Obsidian</Text>
                        <Text className="text-[11px] text-on-surface-variant">Paused</Text>
                      </View>
                    </View>
                    <ToggleSwitch active={activeAuto2} onToggle={() => setActiveAuto2(!activeAuto2)} />
                  </View>

                  {/* Item 3 */}
                  <View className="p-4 bg-white rounded-xl border border-outline-variant flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                        <MaterialIcons name="mail" size={20} color={colors.secondary} />
                      </View>
                      <View>
                        <Text className="text-body-sm font-bold text-primary">Daily Recap {'>'} Email</Text>
                        <Text className="text-[11px] text-on-surface-variant">Last run: 8h ago</Text>
                      </View>
                    </View>
                    <ToggleSwitch active={activeAuto3} onToggle={() => setActiveAuto3(!activeAuto3)} />
                  </View>

                </View>
              </ScrollView>
            </View>

            {/* API Status Card */}
            <View className="p-6 border border-outline-variant rounded-[24px] bg-primary-container text-on-primary shadow-sm flex-col gap-4">
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-label-xs uppercase tracking-widest text-on-primary/70">SYSTEM STATUS</Text>
                <View className="bg-emerald-500 px-2 py-0.5 rounded-full">
                  <Text className="text-[10px] text-white font-bold tracking-widest">HEALTHY</Text>
                </View>
              </View>
              <View className="py-2">
                <Text className="text-[32px] font-bold text-white leading-tight">1.2k</Text>
                <Text className="text-body-sm text-on-primary/70">Requests/hr</Text>
              </View>
              <View className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                <View className="w-[75%] h-full bg-secondary-fixed" />
              </View>
            </View>

            {/* Key Manager Card */}
            <View className="p-6 border border-outline-variant rounded-[24px] bg-white shadow-sm flex-col gap-4">
              <Text className="font-headline-md text-[18px] font-bold text-primary">API Management</Text>
              <View className="flex-col gap-4">
                
                <View className="flex-col gap-1">
                  <Text className="text-[11px] text-on-surface-variant uppercase font-bold">Production Key</Text>
                  <View className="flex-row items-center justify-between bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2">
                    <Text className="text-body-sm font-data-mono flex-1 text-primary" numberOfLines={1}>yr_live_8832...a3f1</Text>
                    <MaterialIcons name="content-copy" size={18} color={colors['on-surface-variant']} />
                  </View>
                </View>

                <View className="flex-col gap-1">
                  <Text className="text-[11px] text-on-surface-variant uppercase font-bold">Sandbox Key</Text>
                  <View className="flex-row items-center justify-between bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2">
                    <Text className="text-body-sm font-data-mono flex-1 text-primary" numberOfLines={1}>yr_test_9921...k902</Text>
                    <MaterialIcons name="content-copy" size={18} color={colors['on-surface-variant']} />
                  </View>
                </View>
                
              </View>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full py-3 mt-2 border border-outline rounded-xl items-center justify-center">
                <Text className="font-bold text-label-xs uppercase tracking-widest text-primary">REVOKE ALL KEYS</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </View>
    </Screen>
  );
}
