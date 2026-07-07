import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function AccountSettings() {
  const router = useRouter();

  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [eraseText, setEraseText] = useState('');

  const isWipeEnabled = confirm1 && confirm2 && eraseText === 'ERASE PERMANENTLY';

  return (
    <Screen scrollable={true} className="pb-24">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16 border-b border-outline-variant/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl font-bold text-primary">YRecall</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Text className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hidden md:flex">Account Sovereignty</Text>
          <View className="w-8 h-8 rounded-full bg-outline-variant overflow-hidden items-center justify-center">
            <MaterialIcons name="person" size={20} color={colors['on-surface']} />
          </View>
        </View>
      </View>

      <View className="max-w-[800px] mx-auto px-margin-mobile md:px-margin-desktop py-8 flex-col gap-8">
        
        {/* Hero Section */}
        <View className="flex-col gap-2">
          <Text className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface tracking-tight">Right to be Forgotten.</Text>
          <Text className="font-body-md text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Your data sovereignty is our final commitment. This process is designed to return full control of your digital intelligence back to you. Please review the implications of your departure with the same rigor we applied to securing your memories.
          </Text>
        </View>

        {/* Bento Grid: Data Breakdown & Export */}
        <View className="flex-col md:flex-row flex-wrap gap-6">
          
          {/* Export Card */}
          <View className="flex-[1.5] min-w-[300px] p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl flex-col gap-4 relative overflow-hidden group shadow-sm">
            <View className="absolute -top-4 -right-4 opacity-5 group- transition-opacity">
              <MaterialIcons name="download-for-offline" size={160} color={colors.primary} />
            </View>
            <View className="z-10 flex-col">
              <Text className="font-headline-md text-2xl font-bold text-on-surface">Export Before You Go</Text>
              <Text className="font-body-md text-sm text-on-surface-variant mt-2 mb-8">Download a comprehensive archive of your Personal Intelligence (JSON/CSV). This includes all your Recalls, Insights, and Metadata.</Text>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-6 py-3 bg-primary rounded-xl flex-row items-center justify-center gap-2 self-start  shadow-sm">
                <Text className="text-white font-bold text-xs tracking-widest uppercase">Prepare Data Archive</Text>
                <MaterialIcons name="archive" size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Intelligence Status */}
          <View className="flex-1 min-w-[250px] p-8 bg-surface-container border border-outline-variant/30 rounded-2xl flex-col justify-between">
            <View className="flex-col">
              <Text className="font-label-caps text-[10px] font-bold text-on-tertiary-container uppercase tracking-widest mb-2">Intelligence Footprint</Text>
              <View className="flex-row items-baseline gap-2">
                <Text className="text-3xl font-bold text-primary">14,204</Text>
                <Text className="text-on-surface-variant text-sm font-medium">Nodes</Text>
              </View>
            </View>
            <View className="mt-8 flex-col">
              <View className="h-1.5 bg-outline-variant/30 w-full rounded-full overflow-hidden">
                <View className="h-full bg-secondary w-3/4 rounded-full" />
              </View>
              <Text className="text-xs text-on-surface-variant mt-2 font-medium">Storage capacity: 742 MB</Text>
            </View>
          </View>

          {/* Transparency Breakdown */}
          <View className="w-full border border-outline-variant/30 rounded-2xl overflow-hidden bg-surface-container-lowest shadow-sm flex-col">
            <View className="p-4 border-b border-outline-variant/30 bg-surface-container-low">
              <Text className="font-headline-md text-xl font-bold text-on-surface">Data Treatment Policy</Text>
            </View>
            <View className="flex-col md:flex-row">
              <View className="p-6 border-b md:border-b-0 md:border-r border-outline-variant/30 flex-1 flex-col">
                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialIcons name="delete-forever" size={20} color={colors.error} />
                  <Text className="font-bold text-sm uppercase tracking-tight text-error">Complete Deletion</Text>
                </View>
                <View className="flex-col gap-3">
                  <Text className="text-sm text-on-surface-variant"><Text className="text-error font-bold">• </Text>Personal Recall Logs and Audio Transcripts</Text>
                  <Text className="text-sm text-on-surface-variant"><Text className="text-error font-bold">• </Text>Private Intelligence Layers & Vector Embeddings</Text>
                  <Text className="text-sm text-on-surface-variant"><Text className="text-error font-bold">• </Text>User Behavioral Analytics & Preference History</Text>
                  <Text className="text-sm text-on-surface-variant"><Text className="text-error font-bold">• </Text>Search Query History & Semantic Maps</Text>
                </View>
              </View>
              <View className="p-6 flex-1 flex-col">
                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialIcons name="privacy-tip" size={20} color={colors['on-tertiary-container']} />
                  <Text className="font-bold text-sm uppercase tracking-tight text-on-tertiary-container">Anonymization (Team Context)</Text>
                </View>
                <View className="flex-col gap-3">
                  <Text className="text-sm text-on-surface-variant"><Text className="font-bold">• </Text>Shared Team Contributions (Attribution Removed)</Text>
                  <Text className="text-sm text-on-surface-variant"><Text className="font-bold">• </Text>Collaborative Documents (Preserved for Continuity)</Text>
                  <Text className="text-sm text-on-surface-variant"><Text className="font-bold">• </Text>System Audit Logs (Metadata Anonymized)</Text>
                  <Text className="text-sm text-on-surface-variant"><Text className="font-bold">• </Text>Aggregate Model Training Inputs (De-identified)</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* The Wipe Mechanism */}
        <View className="bg-surface border border-outline-variant/30 p-8 rounded-2xl flex-col gap-6 shadow-sm">
          <View className="flex-row items-start gap-4">
            <View className="p-3 bg-error-container rounded-full">
              <MaterialIcons name="warning" size={24} color={colors['on-error-container']} />
            </View>
            <View className="flex-col flex-1">
              <Text className="font-headline-md text-2xl font-bold text-on-surface mb-1">Complete Memory Wipe</Text>
              <Text className="text-sm text-on-surface-variant leading-relaxed">This action is irreversible. Once initiated, the cryptographic keys associated with your personal intelligence layer will be destroyed. Not even our engineers can recover this data.</Text>
            </View>
          </View>

          <View className="bg-surface-container-high p-4 rounded-xl flex-col gap-4">
            <TouchableOpacity 
              className="flex-row items-center gap-3"
              onPress={() => setConfirm1(!confirm1)}
              activeOpacity={0.7}
            >
              <MaterialIcons name={confirm1 ? "check-box" : "check-box-outline-blank"} size={24} color={confirm1 ? colors.primary : colors.outline} />
              <Text className={`text-sm flex-1 ${confirm1 ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>I understand that all my personal data will be purged and cannot be recovered.</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-row items-center gap-3"
              onPress={() => setConfirm2(!confirm2)}
              activeOpacity={0.7}
            >
              <MaterialIcons name={confirm2 ? "check-box" : "check-box-outline-blank"} size={24} color={confirm2 ? colors.primary : colors.outline} />
              <Text className={`text-sm flex-1 ${confirm2 ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>I acknowledge that team contributions will remain in an anonymized state.</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-2 pt-2">
            <Text className="font-label-caps text-[10px] font-bold text-outline uppercase tracking-widest">Type "ERASE PERMANENTLY" to confirm</Text>
            <TextInput 
              value={eraseText}
              onChangeText={setEraseText}
              placeholder="ERASE PERMANENTLY"
              placeholderTextColor={colors['outline-variant']}
              className={`w-full bg-surface-container-lowest border ${eraseText === 'ERASE PERMANENTLY' ? 'border-error' : 'border-outline-variant'} px-4 py-3 rounded-xl font-bold text-base text-on-surface `}
              autoCapitalize="characters"
            />
          </View>

          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} 
            disabled={!isWipeEnabled}
            className={`mt-2 w-full py-4 rounded-xl items-center justify-center transition-all ${isWipeEnabled ? 'bg-error' : 'bg-surface-variant'}`}
          >
            <Text className={`font-bold text-base tracking-widest uppercase ${isWipeEnabled ? 'text-white' : 'text-outline'}`}>Initiate Purge Protocol</Text>
          </TouchableOpacity>
        </View>

        {/* Footer / Legal Compliance */}
        <View className="mt-8 border-t border-outline-variant/30 pt-6 flex-col md:flex-row justify-between items-center gap-4">
          <View className="flex-row gap-6">
            <Text className="font-label-caps text-[10px] font-bold text-on-tertiary-container uppercase tracking-widest">Privacy Policy</Text>
            <Text className="font-label-caps text-[10px] font-bold text-on-tertiary-container uppercase tracking-widest">GDPR Compliance</Text>
            <Text className="font-label-caps text-[10px] font-bold text-on-tertiary-container uppercase tracking-widest">Terms of Sovereignty</Text>
          </View>
          <Text className="font-label-caps text-[10px] font-bold text-on-tertiary-container uppercase tracking-widest">© 2024 YRECALL SYSTEMS. ALL RIGHTS RESERVED.</Text>
        </View>

      </View>
    </Screen>
  );
}
