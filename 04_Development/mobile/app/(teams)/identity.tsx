import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const PURPOSES = [
  { id: 'marketing', label: 'Marketing', icon: 'campaign' as const },
  { id: 'engineering', label: 'Engineering', icon: 'groups' as const },
  { id: 'sales', label: 'Sales', icon: 'payments' as const },
  { id: 'product', label: 'Product', icon: 'inventory-2' as const },
  { id: 'design', label: 'Design', icon: 'draw' as const },
  { id: 'executive', label: 'Executive', icon: 'stars' as const },
];

export default function TeamsIdentity() {
  const router = useRouter();
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');

  const workspaceUrl = teamName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  return (
    <Screen scrollable={true}>
      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-xl">
        
        {/* Header / Intro */}
        <View className="flex-col gap-4">
          <View className="bg-secondary-container/30 px-3 py-1 rounded-full self-start">
            <Text className="text-on-secondary-container text-[10px] font-bold tracking-widest uppercase">
              Workspace Initialization
            </Text>
          </View>

          <Text className="font-display-lg text-[44px] text-primary font-bold leading-tight">
            Create your <Text className="text-secondary italic">collaborative</Text> orbit.
          </Text>
          
          <Text className="text-body-md text-on-surface-variant">
            Set up a dedicated environment for your team's collective intelligence. Define your identity and purpose to begin syncing workflows.
          </Text>
        </View>

        {/* Setup Form Container */}
        <View className="bg-white rounded-[24px] p-6 shadow-sm flex-col gap-8">
          
          {/* Identity Section */}
          <View className="flex-col gap-4">
            <View className="border-b border-surface-container-highest pb-2 mb-2">
              <Text className="font-headline-md text-xl font-bold text-primary">Team Identity</Text>
            </View>

            {/* Logo Upload */}
            <View className="flex-col items-center gap-2 mb-4">
              <Text className="text-on-surface-variant text-[10px] font-bold tracking-widest self-start">TEAM LOGO</Text>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-32 h-32 rounded-3xl bg-surface-container-low border-2 border-dashed border-outline-variant flex-col items-center justify-center">
                <MaterialIcons name="add-photo-alternate" size={40} color={colors.outline} />
                <Text className="text-caption-sm text-outline font-bold mt-2">Upload Image</Text>
              </TouchableOpacity>
            </View>

            {/* Name Input */}
            <View className="flex-col gap-1">
              <Text className="text-on-surface-variant text-[10px] font-bold tracking-widest">TEAM NAME</Text>
              <TextInput 
                className="w-full h-14 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 text-body-md"
                placeholder="e.g., Global Innovation Lab"
                placeholderTextColor={colors['on-surface-variant']}
                value={teamName}
                onChangeText={setTeamName}
              />
            </View>

            {/* URL Input */}
            <View className="flex-col gap-1 mt-2">
              <Text className="text-on-surface-variant text-[10px] font-bold tracking-widest">WORKSPACE URL</Text>
              <View className="w-full h-14 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 flex-row items-center">
                <Text className="text-outline text-body-md pr-2">os.ai/</Text>
                <TextInput 
                  className="flex-1 text-body-md"
                  placeholder="innovation-lab"
                  placeholderTextColor={colors['on-surface-variant']}
                  value={workspaceUrl}
                  editable={false}
                />
              </View>
            </View>
          </View>

          {/* Purpose Selection */}
          <View className="flex-col gap-4">
            <View className="border-b border-surface-container-highest pb-2 mb-2 flex-row justify-between items-end">
              <Text className="font-headline-md text-xl font-bold text-primary">Core Purpose</Text>
              <Text className="text-caption-sm text-on-surface-variant">Select primary focus</Text>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {PURPOSES.map((purpose) => {
                const isSelected = selectedPurpose === purpose.id;
                return (
                  <TouchableOpacity 
                    key={purpose.id}
                    className={`w-[47%] p-4 rounded-xl border ${isSelected ? 'border-secondary bg-secondary-container/30' : 'border-outline-variant bg-surface-container-lowest'} flex-col gap-2 items-start`}
                    onPress={() => setSelectedPurpose(purpose.id)}
                  >
                    <MaterialIcons name={purpose.icon} size={24} color={colors.secondary} />
                    <Text className="font-bold text-[12px] text-primary tracking-widest">{purpose.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Actions */}
          <View className="flex-col gap-3 mt-4">
            <Button 
              variant="primary" 
              label="Create Workspace"
              onPress={() => router.push('/(teams)/central')} 
            />
            <Button 
              variant="outline" 
              label="Cancel"
              onPress={() => router.back()} 
            />
          </View>

        </View>
      </View>
    </Screen>
  );
}
