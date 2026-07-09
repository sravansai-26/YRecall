import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Stack as ExpoStack, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { capturesApi } from '../../../src/modules/captures/services/api';
import { colors } from '../../../src/shared/theme/colors';
import { Text } from 'react-native';

export default function NoteCaptureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleSave = async () => {
    if (!content.trim()) return;
    
    setIsSaving(true);
    try {
      await capturesApi.createNote({
        title: title.trim() || null,
        content_text: content.trim(),
        rich_text: { raw: content.trim() },
        format: 'markdown'
      });
      console.log("Note saved successfully");
      router.back();
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    // Simple markdown insertion helper (would require cursor position tracking for true implementation)
    setContent((prev) => prev + prefix + suffix);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors['surface-container-lowest'] }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ExpoStack.Screen 
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: { backgroundColor: colors['surface-container-lowest'] },
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color={colors['on-surface']} />
            </Pressable>
          ),
          headerRight: () => (
            <View className="flex-row items-center space-x-4">
              <Pressable onPress={() => setIsPinned(!isPinned)}>
                <MaterialIcons name={isPinned ? "push-pin" : "push-pin"} size={22} color={isPinned ? colors.primary : colors['on-surface-variant']} />
              </Pressable>
              <Pressable onPress={() => setIsFavorite(!isFavorite)}>
                <MaterialIcons name={isFavorite ? "favorite" : "favorite-outline"} size={22} color={isFavorite ? colors.error : colors['on-surface-variant']} />
              </Pressable>
              <Pressable onPress={handleSave} disabled={isSaving || !content.trim()}>
                <Text className={`font-public-sans-medium text-base ${content.trim() && !isSaving ? 'text-primary' : 'text-neutral-500'}`}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Text>
              </Pressable>
            </View>
          )
        }}
      />
      
      <ScrollView 
        className="flex-1 px-4 pt-2"
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          className="text-3xl font-public-sans-bold text-white mb-4"
          placeholder="Title"
          placeholderTextColor={colors['on-surface-variant']}
          value={title}
          onChangeText={setTitle}
          multiline
          maxLength={100}
        />
        
        <TextInput
          className="text-lg font-public-sans text-neutral-200 min-h-[300px]"
          placeholder="Start typing..."
          placeholderTextColor={colors['on-surface-variant']}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          autoFocus
        />
      </ScrollView>
      
      {/* Markdown Toolbar */}
      <View 
        className="flex-row items-center justify-between px-4 py-3 bg-neutral-900 border-t border-neutral-800"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <Pressable onPress={() => insertMarkdown('**', '**')} className="p-2">
          <MaterialIcons name="format-bold" size={24} color={colors['on-surface-variant']} />
        </Pressable>
        <Pressable onPress={() => insertMarkdown('_', '_')} className="p-2">
          <MaterialIcons name="format-italic" size={24} color={colors['on-surface-variant']} />
        </Pressable>
        <Pressable onPress={() => insertMarkdown('\n- ')} className="p-2">
          <MaterialIcons name="format-list-bulleted" size={24} color={colors['on-surface-variant']} />
        </Pressable>
        <Pressable onPress={() => insertMarkdown('\n1. ')} className="p-2">
          <MaterialIcons name="format-list-numbered" size={24} color={colors['on-surface-variant']} />
        </Pressable>
        <Pressable onPress={() => insertMarkdown('\n- [ ] ')} className="p-2">
          <MaterialIcons name="check-box-outline-blank" size={24} color={colors['on-surface-variant']} />
        </Pressable>
        <Pressable onPress={() => insertMarkdown('# ')} className="p-2">
          <MaterialIcons name="title" size={24} color={colors['on-surface-variant']} />
        </Pressable>
        <Pressable onPress={() => insertMarkdown('[]()')} className="p-2">
          <MaterialIcons name="link" size={24} color={colors['on-surface-variant']} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}