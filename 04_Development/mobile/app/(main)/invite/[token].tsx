import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAcceptInvitation } from '../../../src/modules/workspaces/api';
import { useWorkspaceStore } from '../../../src/modules/workspaces/store';

export default function InviteScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const acceptMutation = useAcceptInvitation();
  const { setActiveWorkspaceId } = useWorkspaceStore();

  useEffect(() => {
    if (token) {
      acceptMutation.mutate(token, {
        onSuccess: (workspace) => {
          setActiveWorkspaceId(workspace.id);
          router.replace('/(main)');
          Alert.alert("Success", `You've joined ${workspace.name}!`);
        },
        onError: (err: any) => {
          Alert.alert("Invalid Invite", "This invitation link is invalid or has expired.");
        }
      });
    }
  }, [token]);

  return (
    <Screen scrollable={false}>
      <View className="flex-1 items-center justify-center p-6 gap-6">
        <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center">
          <MaterialIcons name="group-add" size={48} color={colors.primary} />
        </View>
        
        <View className="items-center">
          <Text className="font-headline-sm text-on-surface text-center mb-2">Joining Workspace...</Text>
          <Text className="font-body-md text-on-surface-variant text-center">
            Verifying your invitation securely.
          </Text>
        </View>

        {acceptMutation.isPending && (
          <ActivityIndicator color={colors.primary} size="large" className="mt-4" />
        )}

        {acceptMutation.isError && (
          <TouchableOpacity 
            onPress={() => router.replace('/(main)')}
            className="mt-8 px-6 py-3 bg-surface-container rounded-full"
          >
            <Text className="font-label-lg text-primary">Go to Home</Text>
          </TouchableOpacity>
        )}
      </View>
    </Screen>
  );
}
