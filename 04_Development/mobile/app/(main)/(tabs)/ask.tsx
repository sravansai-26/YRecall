import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';

export default function AssistantHub() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [query, setQuery] = useState('');

  return (
    <Screen scrollable={false}>
      {/* Top Header */}
      <View className="bg-surface z-40 h-16 w-full flex-row items-center justify-between px-margin-mobile">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.push('/(main)/profile-edit')} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center border border-outline-variant/20 overflow-hidden">
             {user?.photoURL ? (
               <Image source={{ uri: user.photoURL }} className="w-full h-full" />
             ) : (
               <MaterialIcons name="person" size={24} color={colors.primary} />
             )}
          </TouchableOpacity>
          <Text className="font-display-lg-mobile text-[36px] font-bold text-primary tracking-tight">YRecall</Text>
        </View>
        <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-10 h-10 items-center justify-center rounded-full ">
          <MaterialIcons name="notifications" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full max-w-2xl mx-auto"
      >
        <ScrollView className="flex-1 px-margin-mobile" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Header */}
          <View className="text-center py-xl items-center">
            <Text className="font-headline-md text-primary mb-2 font-bold text-center">Hello, how can I help you remember?</Text>
            <Text className="text-on-surface-variant font-body-md text-center">Search your conversations, notes, and life timeline.</Text>
          </View>

          {/* Suggested Questions */}
          <View className="flex-row flex-wrap gap-sm justify-center mb-xl">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-lg py-3 bg-white border border-outline-variant rounded-xl shadow-sm">
              <Text className="text-on-surface-variant text-body-md">"What did we discuss in the design review?"</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-lg py-3 bg-white border border-outline-variant rounded-xl shadow-sm">
              <Text className="text-on-surface-variant text-body-md">"Find my notes on the cabin trip"</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-lg py-3 bg-white border border-outline-variant rounded-xl shadow-sm">
              <Text className="text-on-surface-variant text-body-md">"Remind me when my subscription is due"</Text>
            </TouchableOpacity>
          </View>

          {/* Chat Messages */}
          <View className="flex-col gap-lg">
            {/* AI Message */}
            <View className="flex-col items-start max-w-[85%]">
              <View className="bg-primary rounded-3xl rounded-tl-sm p-lg shadow-xl border border-primary-fixed/20">
                <Text className="font-body-md leading-relaxed text-white">
                  Based on your notes from the June design review, you discussed prioritizing the <Text className="font-bold">Minimalist-Tactile</Text> interface and ensuring that AI components have a unique visual "depth" using subtle teal strokes. You also mentioned a "Fluid 8px Grid" to maintain spaciousness.
                </Text>
                
                {/* Sources */}
                <View className="mt-lg pt-md border-t border-white/10 flex-col gap-sm">
                  <Text className="font-label-xs text-secondary-fixed uppercase tracking-wider">Sources</Text>
                  <View className="flex-row flex-wrap gap-xs">
                    <View className="flex-row items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                      <MaterialIcons name="description" size={14} color={colors.white} />
                      <Text className="text-caption-sm text-white/90">Design_Audit_2023.md</Text>
                    </View>
                    <View className="flex-row items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                      <MaterialIcons name="chat" size={14} color={colors.white} />
                      <Text className="text-caption-sm text-white/90">Slack conversation w/ Sarah</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* User Message */}
            <View className="flex-col items-end self-end max-w-[85%]">
              <View className="bg-surface-container-high rounded-3xl rounded-tr-sm p-lg shadow-sm border border-outline-variant/30">
                <Text className="font-body-md text-on-surface">Remind me what we decided for the typography in the system.</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Input Bar */}
        <View className="absolute bottom-6 left-0 right-0 px-margin-mobile">
          <View className="bg-white rounded-full shadow-lg border border-outline-variant/20 flex-row items-center gap-3 p-2">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-10 h-10 rounded-full items-center justify-center">
              <MaterialIcons name="add-circle" size={24} color={colors['on-surface-variant']} />
            </TouchableOpacity>
            <TextInput
              className="flex-1 bg-transparent font-body-md text-primary h-12"
              placeholder="Ask anything..."
              placeholderTextColor={colors.outline}
              value={query}
              onChangeText={setQuery}
            />
            <View className="flex-row items-center gap-2 pr-2">
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-10 h-10 rounded-full items-center justify-center">
                <MaterialIcons name="mic" size={24} color={colors['on-surface-variant']} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-10 h-10 rounded-full items-center justify-center bg-primary shadow-sm">
                <MaterialIcons name="arrow-upward" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
