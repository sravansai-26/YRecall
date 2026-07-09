import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function TeamsInvite() {
  const router = useRouter();
  const [emails, setEmails] = useState('');
  const [linkExpToggle, setLinkExpToggle] = useState(true);

  return (
    <Screen scrollable={true}>
      <View className="fixed top-0 w-full z-50 bg-surface h-16 flex-row justify-between items-center px-margin-mobile border-b border-outline-variant/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="p-2 rounded-full " onPress={() => router.back()}>
            <MaterialIcons name="menu" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-xl font-bold text-primary">Team Workspace</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden border border-outline-variant">
            <MaterialIcons name="person" size={24} color={colors['on-primary-fixed']} />
          </View>
        </View>
      </View>

      <View className="px-margin-mobile pt-6 pb-32 flex-col md:flex-row gap-6">
        
        {/* Left Section: Invite Form & Pending List */}
        <View className="flex-col flex-1 gap-6">
          
          {/* Invite Form */}
          <View className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm border border-surface-container-high">
            <View className="flex-col gap-2 mb-6">
              <Text className="font-headline-md text-2xl font-bold text-primary">Invite Members</Text>
              <Text className="text-body-md text-on-surface-variant">Expand your workspace by inviting collaborators. Multiple emails should be separated by commas.</Text>
            </View>

            <View className="flex-col gap-4">
              <Text className="font-title-sm font-bold text-primary">Email Addresses</Text>
              <View className="relative">
                <TextInput 
                  className="w-full h-32 p-4 bg-surface border border-outline-variant rounded-xl text-body-md"
                  placeholder="alex@company.com, sarah@design.io..."
                  placeholderTextColor={colors['on-surface-variant']}
                  multiline={true}
                  textAlignVertical="top"
                  value={emails}
                  onChangeText={setEmails}
                />
                <View className="absolute bottom-4 right-4 flex-row items-center gap-1 bg-surface-container-high px-3 py-1 rounded-full">
                  <MaterialIcons name="mail" size={16} color={colors['on-surface-variant']} />
                  <Text className="text-label-xs font-bold text-on-surface-variant">{emails.split(',').filter(e => e.trim().length > 0).length} Emails identified</Text>
                </View>
              </View>

              <View className="flex-col md:flex-row justify-between items-start md:items-end gap-4 pt-4 border-t border-outline-variant">
                <View className="flex-col gap-2 w-full md:w-auto">
                  <Text className="font-title-sm font-bold text-primary">Assign Initial Role</Text>
                  <View className="relative">
                    <View className="w-full md:w-64 h-14 bg-surface-container-low border border-outline-variant rounded-xl flex-row items-center justify-between px-4">
                      <Text className="text-body-md text-on-surface">Editor (Can edit workspace)</Text>
                      <MaterialIcons name="expand-more" size={24} color={colors['on-surface-variant']} />
                    </View>
                  </View>
                </View>
                
                <Button 
                  variant="primary" 
                  label="Send Invitations" 
                  icon="send"
                  onPress={() => router.push('/(teams)/join')} 
                />
              </View>
            </View>
          </View>

          {/* Pending Invitations */}
          <View className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm border border-surface-container-high">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-title-sm font-bold text-primary">Pending Invitations</Text>
              <View className="bg-secondary-container px-3 py-1 rounded-full">
                <Text className="text-label-xs font-bold text-secondary">2 Pending</Text>
              </View>
            </View>

            <View className="flex-col gap-2">
              <View className="flex-row items-center justify-between p-4 rounded-xl ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
                    <Text className="font-bold text-primary">M</Text>
                  </View>
                  <View>
                    <Text className="font-body-md font-semibold text-on-surface">marcus.v@future.tech</Text>
                    <Text className="text-caption-sm text-on-surface-variant">Editor • Sent 2h ago</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
                  <Text className="text-label-xs font-bold text-primary ">Resend</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-between p-4 rounded-xl ">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
                    <Text className="font-bold text-primary">J</Text>
                  </View>
                  <View>
                    <Text className="font-body-md font-semibold text-on-surface">julia.chen@design.io</Text>
                    <Text className="text-caption-sm text-on-surface-variant">Viewer • Sent 5h ago</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
                  <Text className="text-label-xs font-bold text-primary ">Resend</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Right Section: Share Link & QR */}
        <View className="flex-col md:w-80 gap-6">
          
          {/* Quick Invite Link */}
          <View className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm border border-surface-container-high overflow-hidden relative">
            <View className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full -mr-12 -mt-12 blur-xl" />
            
            <View className="flex-row items-center gap-2 mb-4">
              <MaterialIcons name="link" size={20} color={colors.primary} />
              <Text className="font-title-sm font-bold text-primary">Quick Invite Link</Text>
            </View>

            <View className="flex-col gap-4">
              <View className="flex-row items-center justify-between p-2 bg-surface-container-low rounded-lg border border-outline-variant">
                <Text className="text-caption-sm text-on-surface-variant flex-1 px-2" numberOfLines={1}>workspace.ai/join/v4r-8k...</Text>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 bg-primary rounded-md">
                  <MaterialIcons name="content-copy" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-between py-2 border-t border-outline-variant mt-2">
                <View className="flex-col">
                  <Text className="font-label-xs font-bold uppercase tracking-wider text-on-surface">Link Expiration</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Expires in 7 days</Text>
                </View>
                <Switch 
                  value={linkExpToggle} 
                  onValueChange={setLinkExpToggle}
                  trackColor={{ false: colors['surface-container-highest'], true: colors.secondary }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>

          {/* In-Person QR */}
          <View className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm border border-surface-container-high flex-col items-center">
            <Text className="font-title-sm font-bold text-primary mb-2">In-Person Join</Text>
            <Text className="text-caption-sm text-on-surface-variant text-center mb-6">Ask your team to scan this code to join immediately.</Text>
            
            <View className="p-4 bg-white rounded-2xl border border-outline-variant shadow-sm items-center justify-center w-full aspect-square">
              <MaterialIcons name="qr-code-2" size={160} color={colors.primary} />
            </View>
          </View>

        </View>

      </View>
    </Screen>
  );
}
