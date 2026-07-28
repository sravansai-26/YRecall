import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';
import { apiClient } from '../../../../src/services/api/client';

export function TestingTab() {
  const sendTest = async (category: string) => {
    try {
      await apiClient.post('/notifications/test', { category });
      Alert.alert('Sent!', `A real ${category} notification was triggered in the background engine.`);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const tests = ['Account', 'Capture', 'Security', 'Reminders', 'Emergency', 'AI'];

  return (
    <ScrollView className="flex-1 mt-4 px-2" showsVerticalScrollIndicator={false}>
      <Text className="font-title-md font-bold text-on-surface mb-2">Notification Testing</Text>
      <Text className="font-body-sm text-on-surface-variant mb-4">
        Simulate real application events to verify the centralized Notification Engine.
      </Text>
      
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {tests.map(test => (
          <TouchableOpacity 
            key={test}
            onPress={() => sendTest(test)}
            className="bg-surface-container rounded-xl p-4 w-[48%] items-center border border-outline-variant/30 active:opacity-70"
          >
            <MaterialIcons name="send" size={24} color={colors.primary} />
            <Text className="font-title-sm font-bold text-on-surface mt-2">{test}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
