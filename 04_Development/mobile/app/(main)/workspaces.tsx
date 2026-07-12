import React, { useState, memo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useWorkspaces, useCreateWorkspace } from '../../src/modules/workspaces/api';
import { useWorkspaceStore } from '../../src/modules/workspaces/store';

// Standalone footer component to prevent re-creation on every keystroke
const WorkspaceFooter = memo(({ 
  isCreating, 
  setIsCreating, 
  newWorkspaceName, 
  setNewWorkspaceName, 
  handleCreate, 
  isPending 
}: {
  isCreating: boolean;
  setIsCreating: (val: boolean) => void;
  newWorkspaceName: string;
  setNewWorkspaceName: (val: string) => void;
  handleCreate: () => void;
  isPending: boolean;
}) => {
  if (isCreating) {
    return (
      <View className="mt-4 p-4 bg-surface-container rounded-xl">
        <Text className="font-title-sm text-primary mb-2">Create New Workspace</Text>
        <TextInput
          className="bg-surface p-3 rounded-lg border border-outline-variant/30 mb-4 font-body-md text-on-surface"
          placeholder="Workspace Name (e.g., Startup Project)"
          placeholderTextColor={colors['on-surface-variant']}
          value={newWorkspaceName}
          onChangeText={setNewWorkspaceName}
          autoFocus
        />
        <View className="flex-row justify-end gap-2">
          <TouchableOpacity onPress={() => setIsCreating(false)} className="px-4 py-2">
            <Text className="font-label-md text-secondary">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleCreate} 
            className="px-4 py-2 bg-primary rounded-lg flex-row items-center justify-center min-w-[80px]"
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color={colors['on-primary']} size="small" />
            ) : (
              <Text className="font-label-md text-on-primary">Create</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={() => setIsCreating(true)} className="mt-4 p-4 border border-dashed border-primary/50 rounded-xl items-center flex-row justify-center gap-2">
      <MaterialIcons name="add" size={24} color={colors.primary} />
      <Text className="font-title-sm text-primary">Create Workspace</Text>
    </TouchableOpacity>
  );
});

export default function WorkspacesScreen() {
  const router = useRouter();
  const { data: workspaces, isLoading } = useWorkspaces();
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceStore();
  const createMutation = useCreateWorkspace();
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const handleSelect = (id: string | null) => {
    setActiveWorkspaceId(id);
    router.back();
  };

  const handleCreate = () => {
    if (!newWorkspaceName.trim()) return;
    createMutation.mutate({ name: newWorkspaceName.trim() }, {
      onSuccess: (data) => {
        setIsCreating(false);
        setNewWorkspaceName('');
        setActiveWorkspaceId(data.id);
        router.back();
      },
      onError: (error: any) => {
        const msg = error.response?.data?.detail || 'Failed to create workspace.';
        require('react-native').Alert.alert('Workspace Limit', msg);
      }
    });
  };

  return (
    <Screen scrollable={false}>
      <View className="flex-row items-center p-4 border-b border-outline-variant/30">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="font-title-lg text-primary">Switch Workspace</Text>
      </View>

      <KeyboardAvoidingView 
        className="flex-1 p-4" 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <FlatList
            data={[{ id: null, name: 'Personal Workspace' }, ...(workspaces || [])]}
            keyExtractor={(item) => item.id || 'personal'}
            ListFooterComponent={
              <WorkspaceFooter 
                isCreating={isCreating}
                setIsCreating={setIsCreating}
                newWorkspaceName={newWorkspaceName}
                setNewWorkspaceName={setNewWorkspaceName}
                handleCreate={handleCreate}
                isPending={createMutation.isPending}
              />
            }
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item.id)}
                className={`p-4 rounded-xl mb-2 flex-row justify-between items-center ${activeWorkspaceId === item.id ? 'bg-primary/10 border border-primary' : 'bg-surface-container'}`}
              >
                <View className="flex-row items-center gap-3">
                  <MaterialIcons name={item.id ? 'work' : 'person'} size={24} color={activeWorkspaceId === item.id ? colors.primary : colors.secondary} />
                  <Text className={`font-title-sm ${activeWorkspaceId === item.id ? 'text-primary' : 'text-on-surface'}`}>
                    {item.name}
                  </Text>
                </View>
                <View className="flex-row items-center gap-3">
                  {item.id && (
                    <TouchableOpacity
                      onPress={() => router.push(`/workspace/${item.id}/settings` as any)}
                      className="p-2"
                    >
                      <MaterialIcons name="settings" size={20} color={colors.secondary} />
                    </TouchableOpacity>
                  )}
                  {activeWorkspaceId === item.id && (
                    <MaterialIcons name="check" size={20} color={colors.primary} />
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}