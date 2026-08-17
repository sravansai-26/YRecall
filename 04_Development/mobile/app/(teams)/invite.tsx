import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useCreateInvitation, useWorkspaceInvitations, useRevokeInvitation } from '../../src/modules/workspaces/api';
import { useWorkspaceStore } from '../../src/modules/workspaces/store';

export default function TeamsInvite() {
 const router = useRouter();
 const { activeWorkspaceId } = useWorkspaceStore();
 const [emails, setEmails] = useState('');
 const [linkExpToggle, setLinkExpToggle] = useState(true);

 const createMutation = useCreateInvitation();
 const revokeMutation = useRevokeInvitation();
 const { data: pendingInvitations, isLoading: isLoadingInvites } = useWorkspaceInvitations(activeWorkspaceId);

 const handleSendInvitations = () => {
   if (!emails.trim() || !activeWorkspaceId) return;
   const emailList = emails.split(',').map(e => e.trim()).filter(e => e.length > 0);
   
   emailList.forEach(email => {
     createMutation.mutate({
       workspaceId: activeWorkspaceId,
       data: { email, role: 'editor' }
     }, {
       onError: (err: any) => {
          require('react-native').Alert.alert('Invite Error', err.response?.data?.detail || 'Failed to send invite');
       }
     });
   });
   setEmails('');
 };


 return (
 <Screen scrollable={true}>
 <View className="fixed top-0 w-full z-50 bg-surface h-16 flex-row justify-between items-center px-margin-mobile ">
 <View className="flex-row items-center gap-4">
 <TouchableOpacity className="p-2 rounded-full " onPress={() => router.back()}>
 <MaterialIcons name="menu" size={24} color={colors.primary} />
 </TouchableOpacity>
 <Text className="font-headline-md text-xl font-bold text-primary">Team Workspace</Text>
 </View>
 <View className="flex-row items-center gap-4">
 <View className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden ">
 <MaterialIcons name="person" size={24} color={colors['on-primary-fixed']} />
 </View>
 </View>
 </View>

 <View className="px-margin-mobile pt-6 pb-32 flex-col md:flex-row gap-6">
 
 {/* Left Section: Invite Form & Pending List */}
 <View className="flex-col flex-1 gap-6">
 
 {/* Invite Form */}
 <View className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm border-surface-container-high">
 <View className="flex-col gap-2 mb-6">
 <Text className="font-headline-md text-2xl font-bold text-primary">Invite Members</Text>
 <Text className="text-body-md text-on-surface-variant">Expand your workspace by inviting collaborators. Multiple emails should be separated by commas.</Text>
 </View>

 <View className="flex-col gap-4">
 <Text className="font-title-sm font-bold text-primary">Email Addresses</Text>
 <View className="relative">
 <TextInput 
 className="w-full h-32 p-4 bg-surface rounded-xl text-body-md"
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

 <View className="flex-col md:flex-row justify-between items-start md:items-end gap-4 pt-4 border-t ">
 <View className="flex-col gap-2 w-full md:w-auto">
 <Text className="font-title-sm font-bold text-primary">Assign Initial Role</Text>
 <View className="relative">
 <View className="w-full md:w-64 h-14 bg-surface-container-low rounded-xl flex-row items-center justify-between px-4">
 <Text className="text-body-md text-on-surface">Editor (Can edit workspace)</Text>
 <MaterialIcons name="expand-more" size={24} color={colors['on-surface-variant']} />
 </View>
 </View>
 </View>
 
 <Button 
 variant="primary" 
 label={createMutation.isPending ? "Sending..." : "Send Invitations"} 
 icon="send"
 onPress={handleSendInvitations} 
 disabled={createMutation.isPending || !emails.trim()}
 />
 </View>
 </View>
 </View>

 {/* Pending Invitations */}
 <View className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm border-surface-container-high">
 <View className="flex-row justify-between items-center mb-6">
 <Text className="font-title-sm font-bold text-primary">Pending Invitations</Text>
 <View className="bg-secondary-container px-3 py-1 rounded-full">
 <Text className="text-label-xs font-bold text-secondary">{pendingInvitations?.length || 0} Pending</Text>
 </View>
 </View>

 <View className="flex-col gap-2">
 {isLoadingInvites ? (
   <ActivityIndicator color={colors.primary} />
 ) : pendingInvitations?.length === 0 ? (
   <Text className="text-on-surface-variant text-sm">No pending invitations.</Text>
 ) : (
   pendingInvitations?.map((invite: any) => (
     <View key={invite.id} className="flex-row items-center justify-between p-4 rounded-xl border border-surface-container-highest mb-2">
       <View className="flex-row items-center gap-4">
         <View className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
           <Text className="font-bold text-primary">{invite.email.charAt(0).toUpperCase()}</Text>
         </View>
         <View>
           <Text className="font-body-md font-semibold text-on-surface">{invite.email}</Text>
           <Text className="text-caption-sm text-on-surface-variant">{invite.role}</Text>
         </View>
       </View>
       <TouchableOpacity onPress={() => revokeMutation.mutate({ workspaceId: activeWorkspaceId!, invitationId: invite.id })}>
         <Text className="text-label-xs font-bold text-error">Revoke</Text>
       </TouchableOpacity>
     </View>
   ))
 )}
 </View>
 </View>
 </View>

 {/* Right Section Removed (Mocked UI) */}

 </View>
 </Screen>
 );
}
