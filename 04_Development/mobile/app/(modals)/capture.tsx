import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../src/services/api/client';
import { useRouter } from 'expo-router';

export default function CaptureScreen() {
  const [text, setText] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (captureText: string) => {
      const res = await apiClient.post('/captures', {
        type: 'text',
        content_text: captureText,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['captures'] });
      router.back();
    },
    onError: (error: any) => {
      if (!error.response) {
        Alert.alert('Error', 'No internet connection.');
      } else if (error.response.status === 401) {
        Alert.alert('Error', 'Session expired.\nPlease sign in again.');
      } else {
        Alert.alert('Error', 'Unable to save memory.');
      }
    }
  });

  const handleSave = () => {
    if (!text.trim()) return;
    mutate(text);
  };

  return (
    <Screen scrollable={false}>
      {/* Top Header */}
      <View className="bg-surface z-40 h-16 w-full flex-row items-center justify-between px-margin-mobile">
        <View className="flex-row items-center gap-md">
          <View className="w-10 h-10 rounded-full bg-secondary-container items-center justify-center border border-outline-variant">
             <MaterialIcons name="person" size={24} color={colors['on-secondary-container']} />
          </View>
          <Text className="font-headline-md font-bold text-primary">YRecall</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full ">
          <MaterialIcons name="close" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 w-full max-w-xl mx-auto px-margin-mobile pt-16" contentContainerStyle={{ paddingBottom: 120, alignItems: 'center' }}>
        {/* Header Text */}
        <View className="text-center mb-xl items-center">
          <Text className="font-headline-md text-[32px] text-primary mb-sm font-bold">What's on your mind?</Text>
          <Text className="text-on-surface-variant font-body-md text-center">Capture everything, YRecall handles the rest.</Text>
        </View>

        {/* Text Input replacing Waveform */}
        <View className="w-full max-w-md min-h-[128px] justify-center mb-xxl bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30">
          <TextInput
            className="font-body-md text-primary text-center flex-1"
            placeholder="Type your memory here..."
            placeholderTextColor={colors.outline}
            multiline
            value={text}
            onChangeText={setText}
            editable={!isPending}
          />
        </View>

        {/* Capture Grid */}
        <View className="flex-row flex-wrap justify-between w-full mb-xxl gap-y-6">
          {[
            { icon: 'edit-note', label: 'Text' },
            { icon: 'mic', label: 'Voice' },
            { icon: 'photo-camera', label: 'Photo' },
            { icon: 'description', label: 'Document' },
            { icon: 'link', label: 'Link' },
            { icon: 'document-scanner', label: 'Scan' },
            { icon: 'content-paste', label: 'Clipboard' },
            { icon: 'location-on', label: 'Location' },
          ].map((item, index) => (
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} key={index} className="flex-col items-center gap-sm w-[22%]">
              <View className="w-16 h-16 rounded-2xl bg-white/70 border border-outline-variant items-center justify-center shadow-sm">
                <MaterialIcons name={item.icon as any} size={28} color={colors.primary} />
              </View>
              <Text className="font-label-xs text-on-surface-variant mt-2">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tactile Button -> Save Button */}
        <View className="items-center gap-md">
          <TouchableOpacity 
            onPress={handleSave}
            disabled={isPending || !text.trim()}
            className={`w-24 h-24 rounded-full ${text.trim() ? 'bg-primary' : 'bg-surface-variant'} items-center justify-center shadow-lg border-4 border-white/20`}
          >
            {isPending ? (
              <ActivityIndicator color={colors.white} size="large" />
            ) : (
              <MaterialIcons name="check" size={40} color={text.trim() ? colors.white : colors.outline} />
            )}
          </TouchableOpacity>
          <Text className="font-label-xs font-bold text-primary uppercase tracking-widest mt-4">
            {isPending ? 'Saving...' : (text.trim() ? 'Press to Save' : 'Hold to Quick Capture')}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
