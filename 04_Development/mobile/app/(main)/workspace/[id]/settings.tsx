import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Switch } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../../src/shared/components';
import { colors } from '../../../../src/shared/theme/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../src/services/api/client';
import { useWorkspaceStore } from '../../../../src/modules/workspaces/store';

export default function WorkspaceSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setActiveWorkspaceId } = useWorkspaceStore();

  const [themeColor, setThemeColor] = useState<string | null>(null);

  const { data: workspace, isLoading: isLoadingWorkspace } = useQuery({
    queryKey: ['workspace', id],
    queryFn: async () => {
      const res = await apiClient.get(`/collaboration/workspaces/${id}`);
      setThemeColor(res.data.theme_color);
      return res.data;
    }
  });

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['workspace-members', id],
    queryFn: async () => {
      const res = await apiClient.get(`/collaboration/workspaces/${id}/members`);
      return res.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiClient.put(`/collaboration/workspaces/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', id] });
    }
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiClient.delete(`/collaboration/workspaces/${id}/members/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', id] });
    }
  });

  const generateInviteMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post(`/collaboration/workspaces/${id}/invitations`, { role: 'viewer' });
    }
  });

  const handleUpdateTheme = (color: string) => {
    setThemeColor(color);
    updateMutation.mutate({ theme_color: color });
  };

  if (isLoadingWorkspace || !workspace) {
    return (
      <Screen scrollable={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </Screen>
    );
  }

  const PREDEFINED_COLORS = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#3b82f6', // Blue
  ];

  return (
    <Screen>
      <View className="flex-row items-center p-4 border-b border-outline-variant/30 bg-surface">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="font-title-lg text-on-surface">Workspace Settings</Text>
      </View>

      <View className="p-4 gap-6">
        {/* Theme Section */}
        <View className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30">
          <View className="flex-row items-center gap-2 mb-4">
            <Ionicons name="color-palette" size={20} color={colors.primary} />
            <Text className="font-title-md text-primary">Theme Color</Text>
          </View>
          
          <View className="flex-row gap-3">
            {PREDEFINED_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                onPress={() => handleUpdateTheme(color)}
                style={{ backgroundColor: color }}
                className={`w-12 h-12 rounded-full items-center justify-center ${themeColor === color ? 'border-2 border-on-surface' : ''}`}
              >
                {themeColor === color && <MaterialIcons name="check" size={20} color="#fff" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Invite Link Section */}
        <View className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="link" size={20} color={colors.primary} />
              <Text className="font-title-md text-primary">Invite Link</Text>
            </View>
            <TouchableOpacity 
              className="bg-primary/10 px-3 py-1 rounded-full"
              onPress={() => generateInviteMutation.mutate()}
            >
              <Text className="font-label-md text-primary">
                {generateInviteMutation.isPending ? 'Generating...' : 'Generate New'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="font-body-sm text-on-surface-variant mb-2">
            Share this link with others to grant them access to this workspace.
          </Text>
          {generateInviteMutation.data && (
            <View className="bg-surface p-3 rounded-lg flex-row items-center justify-between border border-outline-variant/30">
              <Text className="font-body-md text-on-surface flex-1" numberOfLines={1}>yrecall://invite/{generateInviteMutation.data.token}</Text>
              <TouchableOpacity className="ml-2">
                <MaterialIcons name="content-copy" size={20} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Members Section */}
        <View className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30">
          <View className="flex-row items-center gap-2 mb-4">
            <MaterialIcons name="people" size={20} color={colors.primary} />
            <Text className="font-title-md text-primary">Members</Text>
          </View>
          
          {isLoadingMembers ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <View className="gap-3">
              {members?.map((member: any) => (
                <View key={member.id} className="flex-row items-center justify-between bg-surface p-3 rounded-xl border border-outline-variant/30">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                      <Text className="font-title-sm text-primary">{member.user_id.substring(0, 2).toUpperCase()}</Text>
                    </View>
                    <View>
                      <Text className="font-title-sm text-on-surface">User {member.user_id.substring(0, 4)}</Text>
                      <Text className="font-body-sm text-secondary capitalize">{member.role}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity onPress={() => removeMemberMutation.mutate(member.user_id)}>
                    <MaterialIcons name="person-remove" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Danger Zone */}
        <View className="mt-4">
          <TouchableOpacity 
            onPress={() => {
              setActiveWorkspaceId(null);
              router.replace('/(main)/workspaces');
            }}
            className="flex-row items-center justify-center gap-2 py-3"
          >
            <MaterialIcons name="exit-to-app" size={20} color={colors.error} />
            <Text className="font-label-lg text-error">Leave Workspace</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Screen>
  );
}
