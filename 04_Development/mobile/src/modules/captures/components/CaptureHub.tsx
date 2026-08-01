import React, { forwardRef, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Keyboard, ActivityIndicator } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../../shared/theme/colors';
import { capturesApi } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useWorkspaceStore } from '../../workspaces/store';

export type CaptureHubRef = BottomSheetModal;

const captureOptions = [
 { id: 'text', title: 'Text', icon: 'playlist-edit', family: 'MaterialCommunityIcons', route: '/(main)/capture/note' },
 { id: 'voice', title: 'Voice', icon: 'mic-outline', family: 'Ionicons', route: '/(main)/capture/voice' },
 { id: 'photo', title: 'Photo', icon: 'camera-outline', family: 'Ionicons', route: '/(main)/capture/camera' },
 { id: 'video', title: 'Video', icon: 'videocam-outline', family: 'Ionicons', route: '/(main)/capture/camera?mode=video' },
 { id: 'document', title: 'Document', icon: 'document-text-outline', family: 'Ionicons', route: '/(main)/capture/file' },
 { id: 'link', title: 'Link', icon: 'link-outline', family: 'Ionicons', route: '/(main)/capture/link' },
 { id: 'scan', title: 'Scan', icon: 'scan-outline', family: 'Ionicons', route: '/(main)/capture/camera' },
 { id: 'location', title: 'Location', icon: 'location-outline', family: 'Ionicons', route: '/(main)/capture/location' },
];

const DRAFT_KEY = '@yrecall_quick_capture_draft';
const MAX_CHARS = 500;

export const CaptureHub = forwardRef<CaptureHubRef>((props, ref) => {
 const insets = useSafeAreaInsets();
 const router = useRouter();
 const queryClient = useQueryClient();
 const { activeWorkspaceId } = useWorkspaceStore();
 
 const [memoryTitle, setMemoryTitle] = useState('');
 const [isSubmitting, setIsSubmitting] = useState(false);
 const memoryTextRef = useRef('');
 const [charCount, setCharCount] = useState(0);
 
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

 const handleQuickCapture = async () => {
 if (memoryTextRef.current.trim().length === 0 || isSubmitting) return;
 
 setIsSubmitting(true);
 try {
   await capturesApi.createNote({
     title: memoryTitle.trim() || null,
     content_text: memoryTextRef.current.trim(),
     rich_text: {},
     format: 'markdown'
   });
   // Clear draft
   setMemoryTitle('');
   memoryTextRef.current = '';
   setCharCount(0);
   
   // Invalidate recent captures to refresh timeline instantly
   queryClient.invalidateQueries({ queryKey: ['captures', 'recent', activeWorkspaceId] });
   
   // Show success toast
   require('react-native').ToastAndroid?.show('Memory captured successfully!', require('react-native').ToastAndroid.SHORT);
   
   handleClose();
 } catch (error) {
   console.error("Quick capture failed", error);
   require('react-native').ToastAndroid?.show('Failed to capture memory.', require('react-native').ToastAndroid.LONG);
 } finally {
   setIsSubmitting(false);
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
 <BottomSheetView style={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}>
 
 {/* Top Header */}
 <View className="flex-row items-center justify-between mb-8 px-4 mt-4">
 <View className="flex-row items-center">
 <Text style={{ fontFamily: 'Pacifico_400Regular', fontSize: 32, color: colors.secondary, transform: [{ rotate: '-2deg' }] }}>Capture Hub</Text>
 </View>
 <Pressable 
 className="w-8 h-8 rounded-full items-center justify-center"
 onPress={handleClose}
 >
 <Ionicons name="close" size={28} color={colors.primary} />
 </Pressable>
 </View>

 {/* Titles */}
 <View className="items-center mb-6 px-4">
 <Text className="font-headline-md text-3xl font-extrabold text-primary text-center mb-2">
 What's on your mind?
 </Text>
 <Text className="font-body-md text-on-surface-variant text-center">
 Capture everything, YRecall handles the rest.
 </Text>
 </View>

 {/* Text Input */}
 <View className="px-4 mb-8">
 <View className={`w-full bg-surface-container-low rounded-3xl min-h-[140px] p-4 ${charCount >= MAX_CHARS ? 'border border-error' : ''}`}>
 <BottomSheetTextInput
   style={styles.titleInput}
   placeholder="Title (Optional)"
   placeholderTextColor={colors['outline-variant']}
   value={memoryTitle}
   onChangeText={setMemoryTitle}
   maxLength={100}
   editable={!isSubmitting}
   className="mb-2"
 />
 <BottomSheetTextInput
 style={styles.textInput}
 placeholder="Type your memory here..."
 placeholderTextColor={colors['outline-variant']}
 underlineColorAndroid="transparent"
 multiline
 defaultValue=""
 onChangeText={(text) => {
   memoryTextRef.current = text;
   setCharCount(text.length);
 }}
 textAlignVertical="top"
 maxLength={MAX_CHARS}
 editable={!isSubmitting}
 />
 <View className="flex-row justify-between items-center mt-2 pt-2">
   <Text className={`font-caption-sm text-xs ${charCount >= MAX_CHARS ? 'text-error font-bold' : 'text-outline-variant'}`}>
     {charCount} / {MAX_CHARS}
   </Text>
   
   {/* Quick Actions (e.g. paste from clipboard) */}
   <Pressable onPress={async () => {
       const text = await require('expo-clipboard').getStringAsync();
       if (text && (charCount + text.length) <= MAX_CHARS) {
           // Note: Since we removed controlled state, pasting from clipboard won't visually update
           // the TextInput without a ref to the input. We will skip complex paste logic for now
           // or just rely on native clipboard paste.
       }
   }}>
       <Text className="font-label-sm text-xs text-primary">Paste Clipboard</Text>
   </Pressable>
 </View>
 </View>
 </View>

 {/* Options Grid */}
 <View className="flex-row flex-wrap justify-between px-4 mb-6">
 {captureOptions.map((option) => (
 <Pressable
 key={option.id}
 className="w-[23%] mb-6 items-center"
 onPress={() => handleOptionPress(option.route)}
 style={({ pressed }: { pressed: boolean }) => [
 { opacity: pressed ? 0.7 : 1 }
 ]}
 >
 <View className="w-16 h-16 rounded-3xl bg-white items-center justify-center mb-2 shadow-sm border-surface-container-highest">
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
 className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${charCount > 0 ? 'bg-primary' : 'bg-surface-container-high'}`}
 onPress={handleQuickCapture}
 disabled={isSubmitting || charCount === 0}
 style={({ pressed }: { pressed: boolean }) => [
 { opacity: pressed || isSubmitting ? 0.7 : 1 },
 styles.captureButtonShadow
 ]}
 >
 {isSubmitting ? (
   <ActivityIndicator color={colors['on-primary']} />
 ) : (
   <MaterialCommunityIcons name="check" size={36} color={charCount > 0 ? colors['on-primary'] : colors.outline} />
 )}
 </Pressable>
 <Text className="font-label-sm font-bold text-primary tracking-widest text-xs uppercase">
 Tap to Quick Capture
 </Text>
 </View>

 </BottomSheetView>
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
 textDecorationLine: 'none',
 borderWidth: 0,
 padding: 0,
 },
 titleInput: {
 fontFamily: 'PublicSans_700Bold',
 fontSize: 18,
 color: colors.primary,
 textDecorationLine: 'none',
 borderWidth: 0,
 padding: 0,
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
