import { View, Text, ScrollView, Image, TextInput, Alert, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useAcceptInvitation } from '../../src/modules/workspaces/api';
import { useWorkspaceStore } from '../../src/modules/workspaces/store';

export default function TeamsJoin() {
  const router = useRouter();
  const { token: urlToken } = useLocalSearchParams<{ token?: string }>();
  const [token, setToken] = useState(urlToken || '');
  const acceptMutation = useAcceptInvitation();
  const { setActiveWorkspaceId } = useWorkspaceStore();

  const handleJoin = () => {
    if (!token.trim()) {
      Alert.alert('Error', 'Please enter a valid Invite Code.');
      return;
    }
    
    acceptMutation.mutate(token.trim(), {
      onSuccess: (data) => {
        setActiveWorkspaceId(data.id);
        router.replace('/(teams)/team-space');
      },
      onError: (err: any) => {
        Alert.alert('Access Denied', err.response?.data?.detail || 'Invalid invite code.');
      }
    });
  };

  return (
    <Screen scrollable={true} avoidKeyboard={true}>
      
      {/* Dynamic Graphic Hero - Edge to Edge */}
      <View className="w-full h-64 relative bg-surface-container-highest">
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop' }} 
          className="w-full h-full object-cover" 
        />
        {/* Back Button Overlay */}
        <View className="absolute top-4 left-4 z-40">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View className="px-margin-mobile flex-col gap-8 pb-32">
        
        {/* Introduction Text Block */}
        <View className="mt-8 items-center">
          <View className="bg-primary/10 w-16 h-16 rounded-full items-center justify-center mb-4">
            <MaterialIcons name="vpn-key" size={32} color={colors.primary} />
          </View>
          <Text className="font-display-md text-4xl text-primary font-bold text-center leading-tight">
            Unlock your Team.
          </Text>
          <Text className="text-body-lg text-on-surface-variant text-center mt-3 max-w-sm px-4">
            Enter your secure access code to connect with your team's collective intelligence.
          </Text>
        </View>

        {/* The Join Action Box */}
        <View className="bg-white rounded-[32px] p-8 shadow-sm border border-surface-container-highest items-center mt-2">
          <Text className="font-title-lg font-bold text-primary mb-2 text-center">Have an Invite Code?</Text>
          <Text className="text-body-md text-on-surface-variant text-center mb-6">
            Ask your workspace owner for their 8-character access code.
          </Text>
          
          <View className="w-full max-w-sm gap-4 flex-col items-center">
            <TextInput 
              className="w-full h-16 rounded-2xl bg-surface-container-lowest px-4 text-headline-md text-primary border-2 border-primary/20 text-center font-bold tracking-[0.2em] uppercase"
              placeholder="A1B2C3D4"
              placeholderTextColor={colors['on-surface-variant']}
              value={token}
              onChangeText={setToken}
              maxLength={8}
              autoCapitalize="characters"
            />
            <View className="mt-2 w-full">
              <Button 
                variant="primary" 
                label={acceptMutation.isPending ? "Authenticating..." : "Join Workspace"} 
                icon="arrow-forward"
                onPress={handleJoin} 
                disabled={acceptMutation.isPending || token.length < 4}
              />
            </View>
          </View>
        </View>

        {/* Value Props / Advertising Content */}
        <View className="flex-col gap-4 mt-6">
           <Text className="font-label-md uppercase tracking-widest text-secondary font-bold text-center mb-2">Why Join a Workspace?</Text>
           
           <View className="flex-col gap-4">
              <View className="flex-row bg-white p-6 rounded-3xl border border-surface-container-highest items-center shadow-sm">
                 <View className="w-14 h-14 bg-primary/10 rounded-2xl items-center justify-center mr-4">
                    <MaterialIcons name="hub" size={28} color={colors.primary} />
                 </View>
                 <View className="flex-1">
                    <Text className="font-title-sm font-bold text-primary">Shared Memory</Text>
                    <Text className="text-body-sm text-on-surface-variant mt-1">Access the collective knowledge and captures of your entire team instantly.</Text>
                 </View>
              </View>
              <View className="flex-row bg-white p-6 rounded-3xl border border-surface-container-highest items-center shadow-sm">
                 <View className="w-14 h-14 bg-secondary/10 rounded-2xl items-center justify-center mr-4">
                    <MaterialIcons name="auto-awesome" size={28} color={colors.secondary} />
                 </View>
                 <View className="flex-1">
                    <Text className="font-title-sm font-bold text-primary">AI Synthesis</Text>
                    <Text className="text-body-sm text-on-surface-variant mt-1">Let our OS summarize cross-team discussions and surface hidden insights.</Text>
                 </View>
              </View>
           </View>
        </View>

        {/* Create Workspace Upsell Block */}
        <View className="bg-primary p-8 rounded-[32px] flex-col items-center justify-center mt-8 shadow-sm">
            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-6">
              <MaterialIcons name="rocket-launch" size={32} color="white" />
            </View>
            <Text className="font-title-lg font-bold text-white text-center">Don't have a team yet?</Text>
            <Text className="text-body-md text-white/90 text-center mt-3 mb-8">
              Start your own workspace, invite others, and elevate your workflow.
            </Text>
            <TouchableOpacity onPress={() => router.replace('/(teams)/start')} className="bg-white px-8 py-4 rounded-full shadow-sm w-full items-center">
               <Text className="font-bold text-primary text-title-sm">Create Workspace</Text>
            </TouchableOpacity>
        </View>

      </View>
    </Screen>
  );
}
