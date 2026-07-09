import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export type CaptureHubRef = BottomSheetModal;

const captureOptions = [
  { id: 'note', title: 'Note', icon: 'document-text-outline', color: '#10B981', route: '/(main)/capture/note' },
  { id: 'camera', title: 'Camera', icon: 'camera-outline', color: '#3B82F6', route: '/(main)/capture/camera' },
  { id: 'gallery', title: 'Gallery', icon: 'image-outline', color: '#8B5CF6', route: '/(main)/capture/gallery' },
  { id: 'voice', title: 'Voice', icon: 'mic-outline', color: '#F43F5E', route: '/(main)/capture/voice' },
  { id: 'file', title: 'File', icon: 'folder-outline', color: '#F59E0B', route: '/(main)/capture/file' },
  { id: 'link', title: 'Link', icon: 'link-outline', color: '#6366F1', route: '/(main)/capture/link' },
  { id: 'location', title: 'Location', icon: 'location-outline', color: '#14B8A6', route: '/(main)/capture/location' },
  { id: 'scan', title: 'Scan', icon: 'scan-outline', color: '#EC4899', route: '/(main)/capture/camera' }, // Route to camera for now
];

export const CaptureHub = forwardRef<CaptureHubRef>((props, ref) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const snapPoints = useMemo(() => ['45%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleOptionPress = (optionRoute: string) => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.dismiss();
    }
    
    // Give modal time to start dismissing before navigating
    setTimeout(() => {
      router.push(optionRoute as any);
    }, 150);
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#1E1E1E' }} // Dark mode by default for premium feel
      handleIndicatorStyle={{ backgroundColor: '#555' }}
    >
      <BottomSheetView style={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}>
        <View className="flex-row items-center justify-between mb-6 px-2">
          <Text className="text-white text-2xl font-bold font-public-sans-bold">
            Capture
          </Text>
          <Pressable 
            className="w-8 h-8 rounded-full bg-neutral-800 items-center justify-center"
            onPress={() => {
              if (ref && 'current' in ref && ref.current) {
                ref.current.dismiss();
              }
            }}
          >
            <Ionicons name="close" size={20} color="#A3A3A3" />
          </Pressable>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {captureOptions.map((option) => (
            <Pressable
              key={option.id}
              className="w-[30%] mb-4 items-center"
              onPress={() => handleOptionPress(option.route)}
              style={({ pressed }: { pressed: boolean }) => [
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <View 
                className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                style={{ backgroundColor: `${option.color}20` }} // 20% opacity background
              >
                <Ionicons name={option.icon as any} size={28} color={option.color} />
              </View>
              <Text className="text-neutral-300 font-public-sans text-sm">
                {option.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
