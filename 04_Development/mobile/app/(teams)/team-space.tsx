import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '../../src/modules/workspaces/store';
import { useWorkspace, useWorkspaceMembers, useLeaveWorkspace, useDeleteWorkspace } from '../../src/modules/workspaces/api';
import { capturesApi, Capture } from '../../src/modules/captures/services/api';

export default function TeamSpace() {
  const router = useRouter();
  const { activeWorkspaceId } = useWorkspaceStore();
  const { data: workspace, isLoading: isLoadingWorkspace } = useWorkspace(activeWorkspaceId);
  const { data: members, isLoading: isLoadingMembers } = useWorkspaceMembers(activeWorkspaceId);
  
  const leaveMutation = useLeaveWorkspace();
  const deleteMutation = useDeleteWorkspace();

  const [captures, setCaptures] = useState<Capture[]>([]);
  const [isLoadingCaptures, setIsLoadingCaptures] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleLeave = () => {
    Alert.alert(
      'Leave Workspace',
      'Are you sure you want to leave? If you are the owner, this will fail. Owners must delete instead.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => {
            leaveMutation.mutate(activeWorkspaceId!, {
              onSuccess: () => router.replace('/(main)/workspaces'),
              onError: (err: any) => Alert.alert('Error', err.response?.data?.detail || 'Failed to leave.')
            });
        }}
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Workspace',
      'Are you sure? This cannot be undone and is only allowed for owners.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
            deleteMutation.mutate(activeWorkspaceId!, {
              onSuccess: () => router.replace('/(main)/workspaces'),
              onError: (err: any) => Alert.alert('Error', err.response?.data?.detail || 'Failed to delete.')
            });
        }}
      ]
    );
  };

  const handleCopyCode = () => {
    if (!workspace) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (activeWorkspaceId) {
      capturesApi.getWorkspaceCaptures(activeWorkspaceId)
        .then(data => setCaptures(data))
        .catch(err => console.error(err))
        .finally(() => setIsLoadingCaptures(false));
    } else {
      setIsLoadingCaptures(false);
    }
  }, [activeWorkspaceId]);

  if (isLoadingWorkspace || isLoadingMembers) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!workspace) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No Workspace Selected</Text>
      </View>
    );
  }

  const inviteCode = workspace.id.split('-')[0].toUpperCase();

  return (
    <Screen scrollable={true}>
      {/* Header */}
      <View className="w-full flex-row items-center justify-between h-16 px-margin-mobile pt-4 z-40 bg-surface">
        <TouchableOpacity onPress={() => router.replace('/(main)/workspaces')} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container-low">
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="font-title-md text-primary font-bold">Workspace Settings</Text>
        <View className="w-10 h-10" />
      </View>

      <View className="pb-32 flex-col">
        {/* Cover Graphic */}
        <View className="w-full h-32 bg-secondary-container/30 relative justify-end items-center px-margin-mobile">
           <View className="absolute -bottom-12 w-24 h-24 rounded-full overflow-hidden border-4 border-surface shadow-sm bg-surface-container-low items-center justify-center">
             {workspace.avatar ? (
               <Image source={{ uri: workspace.avatar }} className="w-full h-full object-cover" />
             ) : (
               <MaterialIcons name="groups" size={40} color={colors.primary} />
             )}
           </View>
        </View>

        {/* Identity block */}
        <View className="mt-16 px-margin-mobile items-center flex-col gap-1">
           <Text className="font-display-sm text-3xl font-bold text-primary text-center">{workspace.name}</Text>
           <Text className="text-body-md text-on-surface-variant text-center">{workspace.description || "Team Workspace"}</Text>
        </View>

        {/* Quick Access Grid */}
        <View className="px-margin-mobile mt-8 flex-col gap-4">
           {/* Invite Code */}
           <View className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-highest flex-row items-center justify-between shadow-sm">
             <View className="flex-col">
                 <Text className="font-title-sm font-bold text-primary">Invite Code</Text>
                 <Text className="text-caption-sm text-on-surface-variant">Share this code to let others join.</Text>
             </View>
             <TouchableOpacity onPress={handleCopyCode} className={`px-4 py-2 rounded-xl flex-row items-center gap-2 ${copied ? 'bg-green-100' : 'bg-primary/10'}`}>
                 <Text className={`font-bold tracking-widest ${copied ? 'text-green-700' : 'text-primary'}`}>{copied ? 'COPIED!' : inviteCode}</Text>
                 <MaterialIcons name={copied ? "check" : "content-copy"} size={16} color={copied ? colors.primary : colors.primary} />
             </TouchableOpacity>
           </View>

           {/* Active Members */}
           <View className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-highest shadow-sm">
             <View className="flex-row items-center justify-between mb-4">
                 <Text className="font-title-sm font-bold text-primary">Active Members</Text>
                 <View className="bg-secondary-container px-2 py-0.5 rounded-full">
                     <Text className="font-label-xs text-on-secondary-container font-bold">{members?.length || 0} Total</Text>
                 </View>
             </View>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row overflow-visible">
                 {members?.map((member: any, i: number) => (
                   <View key={member.id} className="flex-col items-center mr-4 w-16">
                     <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center border-2 border-white mb-1 shadow-sm relative">
                       <Text className="text-primary font-bold">{(member.user?.full_name || member.user?.email || 'U').charAt(0).toUpperCase()}</Text>
                       {member.role === 'owner' && (
                         <View className="absolute -bottom-1 -right-1 bg-secondary w-5 h-5 rounded-full items-center justify-center border border-white">
                           <MaterialIcons name="star" size={10} color="white" />
                         </View>
                       )}
                     </View>
                     <Text className="text-[10px] text-on-surface-variant text-center" numberOfLines={1}>{member.user?.full_name || member.user?.email?.split('@')[0] || 'Unknown'}</Text>
                   </View>
                 ))}
                 
                 {/* Invite Button */}
                 <TouchableOpacity onPress={handleCopyCode} className="flex-col items-center mr-4 w-16">
                   <View className="w-12 h-12 rounded-full border-2 border-dashed border-outline items-center justify-center mb-1">
                     <MaterialIcons name="add" size={20} color={colors.outline} />
                   </View>
                   <Text className="text-[10px] text-outline text-center">Invite</Text>
                 </TouchableOpacity>
             </ScrollView>
           </View>
        </View>

        {/* Project Captures */}
        <View className="px-margin-mobile mt-6">
           <Text className="font-title-sm font-bold text-primary mb-4 ml-1">Recent Captures</Text>
           <View className="flex-col gap-3">
             {isLoadingCaptures ? (
               <ActivityIndicator color={colors.primary} />
             ) : captures.length === 0 ? (
               <View className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-highest items-center">
                 <MaterialIcons name="inbox" size={32} color={colors.outline} />
                 <Text className="text-body-md text-on-surface-variant mt-2 text-center">No captures shared in this workspace yet.</Text>
               </View>
             ) : (
               captures.map((capture) => (
                 <View key={capture.id} className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-highest flex-row items-center justify-between">
                   <View className="flex-row items-center gap-3">
                     <View className="w-10 h-10 rounded-lg bg-secondary/10 items-center justify-center">
                       <MaterialIcons name={capture.source_type === 'note' ? 'edit-document' : 'image'} size={20} color={colors.secondary} />
                     </View>
                     <View>
                       <Text className="font-title-sm text-primary">{capture.title || 'Untitled'}</Text>
                       <Text className="text-caption-sm text-on-surface-variant">{new Date(capture.created_at).toLocaleDateString()}</Text>
                     </View>
                   </View>
                   <MaterialIcons name="chevron-right" size={20} color={colors.outline} />
                 </View>
               ))
             )}
           </View>
        </View>

        {/* Danger Zone */}
        <View className="px-margin-mobile mt-12 flex-col gap-4">
           <Text className="font-label-xs uppercase tracking-widest text-error font-bold ml-1">Danger Zone</Text>
           <View className="bg-error/10 p-4 rounded-2xl border border-error/20 flex-col gap-3">
               <View className="flex-row justify-between items-center">
                   <View className="flex-1 mr-4">
                       <Text className="font-title-sm font-bold text-error">Leave Workspace</Text>
                       <Text className="text-caption-sm text-error/80">Revoke your access to this team.</Text>
                   </View>
                   <Button variant="outline" label="Leave" onPress={handleLeave} disabled={leaveMutation.isPending} />
               </View>
               <View className="h-[1px] bg-error/20 my-2" />
               <View className="flex-row justify-between items-center">
                   <View className="flex-1 mr-4">
                       <Text className="font-title-sm font-bold text-error">Delete Workspace</Text>
                       <Text className="text-caption-sm text-error/80">Permanently delete everything.</Text>
                   </View>
                   <Button variant="primary" label="Delete" onPress={handleDelete} disabled={deleteMutation.isPending} />
               </View>
           </View>
        </View>
        
      </View>
    </Screen>
  );
}
