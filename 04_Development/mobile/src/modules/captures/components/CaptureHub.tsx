import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../../shared/theme/colors';

export type CaptureHubRef = BottomSheetModal;

const captureOptions = [
  { id: 'text', title: 'Text', icon: 'playlist-edit', family: 'MaterialCommunityIcons', route: '/(main)/capture/note' },
  { id: 'voice', title: 'Voice', icon: 'mic-outline', family: 'Ionicons', route: '/(main)/capture/voice' },
  { id: 'photo', title: 'Photo', icon: 'camera-outline', family: 'Ionicons', route: '/(main)/capture/camera' },
  { id: 'document', title: 'Document', icon: 'document-text-outline', family: 'Ionicons', route: '/(main)/capture/file' },
  { id: 'link', title: 'Link', icon: 'link-outline', family: 'Ionicons', route: '/(main)/capture/link' },
  { id: 'scan', title: 'Scan', icon: 'scan-outline', family: 'Ionicons', route: '/(main)/capture/camera' },
  { id: 'clipboard', title: 'Clipboard', icon: 'clipboard-outline', family: 'Ionicons', route: '/(main)/capture/note' },
  { id: 'location', title: 'Location', icon: 'location-outline', family: 'Ionicons', route: '/(main)/capture/location' },
];

export const CaptureHub = forwardRef<CaptureHubRef>((props, ref) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [memoryText, setMemoryText] = useState('');
  
  const snapPoints = useMemo(() => ['95%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.5}
      />
    ),
    []
  );

  const handleOptionPress = (optionRoute: string) => {
    Keyboard.dismiss();
    if (ref && 'current' in ref && ref.current) {
      ref.current.dismiss();
    }
    setTimeout(() => {
      router.push(optionRoute as any);
    }, 150);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    if (ref && 'current' in ref && ref.current) {
      ref.current.dismiss();
    }
  };

  const handleQuickCapture = () => {
    // Quick capture logic for text input
    if (memoryText.trim().length > 0) {
      // Proceed with capture logic...
      handleClose();
      // Add logic here to submit text if needed
    }
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.surface, borderRadius: 24 }}
      handleIndicatorStyle={{ display: 'none' }} // Hide default handle for custom header
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BottomSheetView style={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}>
          
          {/* Top Header */}
          <View className="flex-row items-center justify-between mb-8 px-2 mt-2">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-secondary-container items-center justify-center">
                <MaterialIcons name="person" size={24} color={colors['on-secondary-container']} />
              </View>
              <Text className="font-title-sm text-[16px] font-bold text-primary">YRecall</Text>
            </View>
            <Pressable 
              className="w-8 h-8 rounded-full items-center justify-center"
              onPress={handleClose}
            >
              <Ionicons name="close" size={28} color={colors.primary} />
            </Pressable>
          </View>

          {/* Titles */}
          <View className="items-center mb-8 px-4">
            <Text className="font-headline-md text-3xl font-extrabold text-primary text-center mb-2">
              What's on your mind?
            </Text>
            <Text className="font-body-md text-on-surface-variant text-center">
              Capture everything, YRecall handles the rest.
            </Text>
          </View>

          {/* Text Input */}
          <View className="px-4 mb-8">
            <View className="w-full bg-surface-container-low rounded-3xl min-h-[140px] p-4 border border-surface-container-highest">
              <TextInput
                style={styles.textInput}
                placeholder="Type your memory here..."
                placeholderTextColor={colors['outline-variant']}
                multiline
                value={memoryText}
                onChangeText={setMemoryText}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Options Grid */}
          <View className="flex-row flex-wrap justify-between px-4 mb-10">
            {captureOptions.map((option) => (
              <Pressable
                key={option.id}
                className="w-[23%] mb-6 items-center"
                onPress={() => handleOptionPress(option.route)}
                style={({ pressed }: { pressed: boolean }) => [
                  { opacity: pressed ? 0.7 : 1 }
                ]}
              >
                <View className="w-16 h-16 rounded-3xl bg-white items-center justify-center mb-2 shadow-sm border border-surface-container-highest">
                  {option.family === 'MaterialCommunityIcons' ? (
                    <MaterialCommunityIcons name={option.icon as any} size={28} color={colors.primary} />
                  ) : (
                    <Ionicons name={option.icon as any} size={28} color={colors.primary} />
                  )}
                </View>
                <Text className="text-primary font-public-sans text-xs text-center font-medium">
                  {option.title}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Bottom Action Area */}
          <View className="items-center mt-auto">
            <Pressable 
              className="w-20 h-20 rounded-full bg-surface-container-high items-center justify-center mb-4"
              onPress={handleQuickCapture}
              style={({ pressed }: { pressed: boolean }) => [
                { opacity: pressed ? 0.7 : 1 },
                styles.captureButtonShadow
              ]}
            >
              <MaterialCommunityIcons name="check" size={36} color={colors.outline} />
            </Pressable>
            <Text className="font-label-sm font-bold text-primary tracking-widest text-xs uppercase">
              Hold to Quick Capture
            </Text>
          </View>

        </BottomSheetView>
      </TouchableWithoutFeedback>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: 'PublicSans_400Regular',
    fontSize: 16,
    color: colors.primary,
  },
  captureButtonShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  }
});
