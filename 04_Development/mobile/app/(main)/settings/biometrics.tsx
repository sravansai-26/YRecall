import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function BiometricsSettings() {
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  return (
    <Screen scrollable={true} className="pb-32">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface/80 flex-row items-center justify-between px-margin-mobile h-16 md:px-margin-desktop">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">Biometrics</Text>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6">
        <View className="mb-8">
          <Text className="font-headline-md text-3xl font-bold text-on-surface mb-2">Biometric Lock</Text>
          <Text className="text-on-surface-variant font-body-md text-base max-w-2xl">
            Protect your digital brain with hardware-level biometric authentication.
          </Text>
        </View>

        <View className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm border border-outline-variant/30 max-w-2xl flex-col gap-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <View className="bg-primary/10 p-3 rounded-xl">
                <MaterialIcons name="fingerprint" size={32} color={colors.primary} />
              </View>
              <View className="flex-col">
                <Text className="font-bold text-lg text-on-surface">Enable Biometrics</Text>
                <Text className="text-sm text-on-surface-variant">Require FaceID or TouchID</Text>
              </View>
            </View>
            <Switch 
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: colors['surface-variant'], true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>

          <View className="h-[1px] w-full bg-outline-variant/30" />

          <View className="flex-row items-center justify-between">
            <View className="flex-col flex-1 pr-4">
              <Text className="font-bold text-base text-on-surface">Immediate Lock</Text>
              <Text className="text-sm text-on-surface-variant mt-1">Lock YRecall immediately when leaving the app.</Text>
            </View>
            <Switch value={true} onValueChange={() => {}} trackColor={{ true: colors.primary }} thumbColor="#ffffff" />
          </View>
        </View>
      </View>
    </Screen>
  );
}
