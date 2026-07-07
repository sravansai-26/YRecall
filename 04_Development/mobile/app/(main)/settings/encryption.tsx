import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function EncryptionSettings() {
  const router = useRouter();

  return (
    <Screen scrollable={true} className="pb-32">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface/80 flex-row items-center justify-between px-margin-mobile h-16 md:px-margin-desktop">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">Data Encryption</Text>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6">
        <View className="mb-8">
          <Text className="font-headline-md text-3xl font-bold text-on-surface mb-2">End-to-End Encryption</Text>
          <Text className="text-on-surface-variant font-body-md text-base max-w-2xl">
            Manage your encryption keys. YRecall uses zero-knowledge architecture.
          </Text>
        </View>

        <View className="bg-surface-container-lowest rounded-[24px] p-6 shadow-sm border border-outline-variant/30 max-w-2xl flex-col gap-6">
          <View className="flex-row items-center gap-4">
            <View className="bg-secondary-container p-3 rounded-xl">
              <MaterialIcons name="enhanced-encryption" size={32} color={colors['on-secondary-container']} />
            </View>
            <View className="flex-col">
              <Text className="font-bold text-lg text-on-surface">Vault Status</Text>
              <Text className="text-sm text-secondary font-medium">System Armed</Text>
            </View>
          </View>

          <View className="h-[1px] w-full bg-outline-variant/30" />

          <View className="flex-col gap-4">
            <View className="flex-col">
              <Text className="font-bold text-base text-on-surface mb-2">Recovery Phrase</Text>
              <Text className="text-sm text-on-surface-variant mb-4">Your 24-word recovery phrase is the only way to recover your data if you lose your device.</Text>
              <TouchableOpacity className="py-3 px-4 bg-primary/10 rounded-xl items-center border border-primary/20">
                <Text className="text-primary font-bold">Backup Recovery Phrase</Text>
              </TouchableOpacity>
            </View>
            
            <View className="flex-col mt-4">
              <Text className="font-bold text-base text-error mb-2">Danger Zone</Text>
              <TouchableOpacity className="py-3 px-4 bg-error-container rounded-xl items-center border border-error/20 flex-row justify-center gap-2">
                <MaterialIcons name="delete-forever" size={20} color={colors.error} />
                <Text className="text-error font-bold">Wipe All Cloud Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}
