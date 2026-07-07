import { useState, useEffect } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useCameraPermissions } from 'expo-camera';
import { getRecordingPermissionsAsync, requestRecordingPermissionsAsync } from 'expo-audio';
import { PermissionResponse } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';

export default function OnboardingPermissions() {
  const router = useRouter();
  
  const [cameraStatus, requestCameraPermission] = useCameraPermissions();
  const [micStatus, setMicStatus] = useState<PermissionResponse | null>(null);
  const [notifStatus, setNotifStatus] = useState<Notifications.PermissionStatus | null>(null);

  useEffect(() => {
    Notifications.getPermissionsAsync().then(status => {
      setNotifStatus(status.status);
    });
    getRecordingPermissionsAsync().then(status => {
      setMicStatus(status);
    });
  }, []);

  const requestMicPermission = async () => {
    const status = await requestRecordingPermissionsAsync();
    setMicStatus(status);
    return status;
  };

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotifStatus(status);
    return status === 'granted';
  };

  const handleToggleMic = async (value: boolean) => {
    if (value) {
      const result = await requestMicPermission();
      if (!result.granted) {
        Alert.alert('Permission Denied', 'Microphone access is recommended for voice notes, but you can continue without it.');
      }
    }
  };

  const handleToggleCamera = async (value: boolean) => {
    if (value) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert('Permission Denied', 'Camera access is recommended for visual memories, but you can continue without it.');
      }
    }
  };

  const handleToggleNotif = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert('Permission Denied', 'Notifications are recommended for insights, but you can continue without them.');
      }
    }
  };

  const isMicGranted = micStatus?.granted ?? false;
  const isCameraGranted = cameraStatus?.granted ?? false;
  const isNotifGranted = notifStatus === 'granted';

  return (
    <Screen scrollable>
      <View className="flex-row items-center justify-between px-margin-mobile py-base h-16 w-full max-w-7xl mx-auto">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="auto-awesome" size={24} color={colors.primary} />
          <Text className="font-headline-md text-[24px] font-bold text-primary">YRecall</Text>
        </View>
        <MaterialIcons 
          name="close" 
          size={24} 
          color={colors['on-surface-variant']} 
          onPress={() => router.back()}
        />
      </View>

      <View className="flex-1 w-full max-w-2xl px-margin-mobile pt-xl pb-xxl flex-col gap-xl self-center">
        <View className="flex-col gap-base text-center md:text-left">
          <Text className="font-display-lg-mobile md:font-display-lg text-primary tracking-tight">
            Grant YRecall Wisdom
          </Text>
          <Text className="font-body-md text-on-surface-variant max-w-md">
            To capture your world, YRecall needs access to your camera and microphone.
          </Text>
        </View>

        <View className="flex-col gap-md">
          {/* Mic */}
          <View className="flex-row items-center justify-between p-lg bg-surface-container-lowest rounded-2xl shadow-sm">
            <View className="flex-row items-start gap-md flex-1">
              <View className="w-12 h-12 items-center justify-center rounded-xl bg-primary-fixed">
                <MaterialIcons name="mic" size={24} color={colors.primary} />
              </View>
              <View className="flex-col gap-xs flex-1 pr-4">
                <Text className="font-title-sm text-primary">Microphone</Text>
                <Text className="font-body-md text-on-surface-variant leading-tight">
                  Used to process ambient audio notes and voice-driven recall sessions.
                </Text>
              </View>
            </View>
            <Switch
              value={isMicGranted}
              onValueChange={handleToggleMic}
              trackColor={{ false: colors['outline-variant'], true: colors.primary }}
              thumbColor={colors['surface-container-lowest']}
            />
          </View>

          {/* Camera (Photos) */}
          <View className="flex-row items-center justify-between p-lg bg-surface-container-lowest rounded-2xl shadow-sm">
            <View className="flex-row items-start gap-md flex-1">
              <View className="w-12 h-12 items-center justify-center rounded-xl bg-secondary-fixed">
                <MaterialIcons name="camera-alt" size={24} color={colors.secondary} />
              </View>
              <View className="flex-col gap-xs flex-1 pr-4">
                <Text className="font-title-sm text-primary">Camera & Photos</Text>
                <Text className="font-body-md text-on-surface-variant leading-tight">
                  Enables YRecall to catalog your visual memories for instant retrieval.
                </Text>
              </View>
            </View>
            <Switch
              value={isCameraGranted}
              onValueChange={handleToggleCamera}
              trackColor={{ false: colors['outline-variant'], true: colors.primary }}
              thumbColor={colors['surface-container-lowest']}
            />
          </View>

          {/* Notifications */}
          <View className="flex-row items-center justify-between p-lg bg-surface-container-lowest rounded-2xl shadow-sm">
            <View className="flex-row items-start gap-md flex-1">
              <View className="w-12 h-12 items-center justify-center rounded-xl bg-surface-container-highest">
                <MaterialIcons name="notifications-active" size={24} color={colors['on-surface-variant']} />
              </View>
              <View className="flex-col gap-xs flex-1 pr-4">
                <Text className="font-title-sm text-primary">Notifications</Text>
                <Text className="font-body-md text-on-surface-variant leading-tight">
                  Receive timely insights and reminders to help strengthen your mental recall.
                </Text>
              </View>
            </View>
            <Switch
              value={isNotifGranted}
              onValueChange={handleToggleNotif}
              trackColor={{ false: colors['outline-variant'], true: colors.primary }}
              thumbColor={colors['surface-container-lowest']}
            />
          </View>
        </View>

        <View className="flex-col gap-md pt-lg pb-xxl">
          <Button
            label="Continue"
            fullWidth
            onPress={() => router.push('/(onboarding)/persona')}
          />
          <Text className="font-caption-sm text-center text-on-surface-variant/70 px-xl">
            You can proceed even without granting permissions. You can change these later in your device settings.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
