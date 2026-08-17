import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useCreateWorkspace } from '../../src/modules/workspaces/api';
import { useWorkspaceStore } from '../../src/modules/workspaces/store';

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
 const createMutation = useCreateWorkspace();
 const { setActiveWorkspaceId } = useWorkspaceStore();

 const workspaceUrl = teamName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  const [avatar, setAvatar] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Use base64 if available, otherwise just use uri
      const asset = result.assets[0];
      if (asset.base64) {
        setAvatar(`data:image/jpeg;base64,${asset.base64}`);
      } else {
        setAvatar(asset.uri);
      }
    }
  };

 const handleCreate = () => {
    if (!teamName.trim()) {
      require('react-native').Alert.alert('Validation Error', 'Team name is required.');
      return;
    }
    if (!selectedPurpose) {
      require('react-native').Alert.alert('Validation Error', 'Please select a core purpose for your team.');
      return;
    }
    createMutation.mutate({ 
      name: teamName.trim(),
      description: `Focus: ${selectedPurpose}`,
      avatar: avatar
    }, {
      onSuccess: (data) => {
        setActiveWorkspaceId(data.id);
        router.push('/(teams)/team-space');
      },
      onError: (error: any) => {
        const msg = error.response?.data?.detail || 'Failed to create workspace.';
        require('react-native').Alert.alert('Creation Failed', msg);
      }
    });
 };

 return (
 <Screen scrollable={true}>
 {/* Header Section */}
 <View className="px-margin-mobile pt-4 flex-row items-center">
   <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container-low">
     <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
   </TouchableOpacity>
 </View>

 <View className="px-margin-mobile pt-2 pb-32 flex-col gap-xl">
 
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
 <TouchableOpacity onPress={pickImage} className="w-32 h-32 rounded-3xl bg-surface-container-low border-2 border-dashed flex-col items-center justify-center overflow-hidden">
   {avatar ? (
     <Image source={{ uri: avatar }} className="w-full h-full object-cover" />
   ) : (
     <>
       <MaterialIcons name="add-photo-alternate" size={40} color={colors.outline} />
       <Text className="text-caption-sm text-outline font-bold mt-2">Upload Image</Text>
     </>
   )}
 </TouchableOpacity>
 </View>

 {/* Name Input */}
 <View className="flex-col gap-1">
 <Text className="text-on-surface-variant text-[10px] font-bold tracking-widest">TEAM NAME</Text>
 <TextInput 
 className="w-full h-14 rounded-xl bg-surface-container-lowest px-4 text-body-md"
 placeholder="e.g., Global Innovation Lab"
 placeholderTextColor={colors['on-surface-variant']}
 value={teamName}
 onChangeText={setTeamName}
 />
 </View>

 {/* URL Input */}
 <View className="flex-col gap-1 mt-2">
 <Text className="text-on-surface-variant text-[10px] font-bold tracking-widest">WORKSPACE URL</Text>
 <View className="w-full h-14 rounded-xl bg-surface-container-lowest px-4 flex-row items-center">
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
 className={`w-[47%] p-4 rounded-xl border-2 flex-col gap-2 items-start ${isSelected ? 'border-primary bg-primary/10' : 'border-transparent bg-surface-container-lowest'}`}
 onPress={() => setSelectedPurpose(purpose.id)}
 >
 <MaterialIcons name={purpose.icon} size={24} color={isSelected ? colors.primary : colors.secondary} />
 <Text className={`font-bold text-[12px] tracking-widest ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>{purpose.label}</Text>
 </TouchableOpacity>
 );
 })}
 </View>
 </View>

 {/* Actions */}
 <View className="flex-col gap-3 mt-4">
 <Button 
 variant="primary" 
 label={createMutation.isPending ? "Creating..." : "Create Workspace"}
 onPress={handleCreate} 
 disabled={createMutation.isPending}
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
