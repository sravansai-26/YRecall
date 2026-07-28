import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, RefreshControl, Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../src/shared/store/useAuthStore';
import { updateProfile, signOut } from 'firebase/auth';
import { auth } from '../../src/shared/lib/firebase';
import { useUserProfile, useUpdateUserProfile } from '../../src/modules/users/hooks';
import { useEntitlements } from '../../src/modules/billing/store';
import { useQueryClient } from '@tanstack/react-query';
import { useWorkspaceStore } from '../../src/modules/workspaces/store';
import * as ImagePicker from 'expo-image-picker';
import { uploadProfilePhoto } from '../../src/modules/users/api';
import { useAskStore } from '../../src/shared/store/useAskStore';

export default function ProfileSettings() {
 const router = useRouter();
 const queryClient = useQueryClient();
 const { user, setUser } = useAuthStore();
 const { isPremium, planId } = useEntitlements();
 const { data: profileData, isLoading, isError, refetch, isRefetching } = useUserProfile();
 const updateUserMutation = useUpdateUserProfile();
 
 const [isEditing, setIsEditing] = useState(false);
 const [isUploading, setIsUploading] = useState(false);
 const [formData, setFormData] = useState({
 username: '',
 display_name: '',
 bio: '',
 occupation: '',
 country: '',
 social_links: '',
 website: ''
 });

 useEffect(() => {
 if (profileData?.user) {
 setFormData({
 username: profileData.user.username || '',
 display_name: profileData.user.display_name || user?.displayName || '',
 bio: profileData.user.bio || '',
 occupation: profileData.user.occupation || '',
 country: profileData.user.country || '',
 social_links: profileData.user.social_links?.main || '',
 website: profileData.user.website || ''
 });
 }
 }, [profileData, user]);

 const handleSave = async () => {
 try {
 await updateUserMutation.mutateAsync({
 ...formData,
 social_links: { main: formData.social_links }
 });
 
 if (auth.currentUser && formData.display_name !== user?.displayName) {
 await updateProfile(auth.currentUser, {
 displayName: formData.display_name,
 });
 setUser({ ...auth.currentUser });
 }
 
 // Also push to backend explicitly just to be safe
 try {
     await updateUserMutation.mutateAsync({
         display_name: formData.display_name,
         username: formData.username,
         bio: formData.bio,
         occupation: formData.occupation,
         country: formData.country,
         website: formData.website,
         social_links: { main: formData.social_links }
     });
 } catch (backendError) {
     console.log('Backend sync error:', backendError);
     // We don't block the UI if backend fails, auth profile is already updated
 }
 
 setIsEditing(false);
 } catch (error: any) {
 Alert.alert('Error', error.message || 'Failed to update profile.');
 }
 };

 const handleImageUpload = async () => {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets[0] && auth.currentUser) {
            setIsUploading(true);
            const downloadURL = await uploadProfilePhoto(result.assets[0].uri);
            
            await updateProfile(auth.currentUser, {
                photoURL: downloadURL
            });
            setUser({ ...auth.currentUser });
            
            // Note: backend is already updated via the /photo endpoint
            await refetch();
        }
    } catch (error: any) {
        Alert.alert('Upload Error', 'Failed to upload image. ' + (error.message || ''));
    } finally {
        setIsUploading(false);
    }
 };

 const handleSignOut = async () => {
 Alert.alert(
 'Confirm Sign Out',
 'Are you sure you want to sign out?',
 [
 { text: 'Cancel', style: 'cancel' },
 { 
 text: 'Sign Out', 
 style: 'destructive',
 onPress: async () => {
 try {
 await signOut(auth);
    // Clear local state and cache securely
    useWorkspaceStore.getState().setActiveWorkspaceId(null);
    useAskStore.getState().setActiveConversationId(null);
    queryClient.clear();
    
    useAuthStore.getState().setUser(null);
    router.replace('/(auth)');
 } catch (error) {
 Alert.alert('Error', 'Failed to sign out.');
 }
 }
 }
 ]
 );
 };

 if (isLoading && !profileData) {
 return (
 <Screen scrollable={false} className="items-center justify-center">
 <ActivityIndicator size="large" color={colors.primary} />
 </Screen>
 );
 }
 
 const dbUser = profileData?.user;
 const stats = profileData?.statistics;
 
 const memberSince = dbUser?.created_at ? new Date(dbUser.created_at).getFullYear().toString() : new Date().getFullYear().toString();

 return (
 <Screen scrollable={false} className="pb-0">
 {/* TopAppBar */}
 <View className="w-full bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16 ">
 <View className="flex-row items-center gap-4">
 <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
 <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
 </TouchableOpacity>
 <Text className="font-headline-md text-2xl font-bold text-primary">Profile Identity</Text>
 </View>
 <TouchableOpacity 
 onPress={() => isEditing ? handleSave() : setIsEditing(true)} 
 disabled={updateUserMutation.isPending}
 className={`px-4 py-2 rounded-full ${isEditing ? 'bg-primary' : 'bg-surface-container-high'}`}
 >
 {updateUserMutation.isPending ? (
 <ActivityIndicator size="small" color="#fff" />
 ) : (
 <Text className={`font-bold ${isEditing ? 'text-white' : 'text-primary'}`}>
 {isEditing ? 'Save' : 'Edit'}
 </Text>
 )}
 </TouchableOpacity>
 </View>

 <KeyboardAwareScrollView 
 className="flex-1 w-full"
 contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
 enableOnAndroid={true}
 extraScrollHeight={20}
 keyboardShouldPersistTaps="handled"
 refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
 >
 <View className="w-full max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-6 flex-1">
 {/* Profile Header (Read-only / Top Section) */}
 <View className="flex-col md:flex-row md:items-start gap-8 mb-8 pb-8">
 <View className="relative self-start">
        <TouchableOpacity disabled={!isEditing || isUploading} onPress={handleImageUpload}>
            <Image 
                source={{ uri: user?.photoURL || dbUser?.photo_url || 'https://api.dicebear.com/7.x/avataaars/png?seed=' + (dbUser?.id || 'default') }} 
                className="w-32 h-32 rounded-full border border-outline/20" 
            />
            {isUploading && (
                <View className="absolute inset-0 bg-black/50 rounded-full items-center justify-center">
                    <ActivityIndicator color="#fff" />
                </View>
            )}
        </TouchableOpacity>
        {isEditing && (
        <TouchableOpacity 
            onPress={handleImageUpload}
            className="absolute bottom-0 right-0 p-3 bg-secondary rounded-full shadow-sm border-2 border-surface"
        >
            <MaterialIcons name="photo-camera" size={20} color="#fff" />
        </TouchableOpacity>
        )}
      </View>
 
 <View className="flex-col flex-1 justify-center py-2 gap-2">
 <View className="flex-row flex-wrap items-center gap-3">
 <Text className="font-headline-md text-3xl md:text-4xl font-bold text-on-surface">{formData.display_name}</Text>
 {dbUser?.email && (
 <View className="bg-green-500/10 px-2 py-1 rounded-full flex-row items-center gap-1">
 <MaterialIcons name="verified" size={14} color="#22c55e" />
 <Text className="text-[#22c55e] text-[10px] font-bold uppercase tracking-wider">Verified</Text>
 </View>
 )}
 {isPremium && (
 <View className="bg-[#FFD700]/10 border-[#FFD700]/30 px-2 py-1 rounded-full flex-row items-center gap-1 shadow-sm">
 <MaterialIcons name="stars" size={14} color="#D4AF37" />
 <Text className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">Pro</Text>
 </View>
 )}
 </View>
 <Text className="text-on-surface-variant font-medium text-lg">@{formData.username || 'username'}</Text>
 
 <View className="flex-row items-center gap-4 mt-2">
 <Text className="text-outline text-sm">Member since {memberSince}</Text>
 <View className="w-1 h-1 bg-outline rounded-full" />
 <Text className="text-outline text-sm">{dbUser?.email}</Text>
 </View>
 
 {!isEditing && formData.bio && (
 <Text className="text-on-surface-variant text-base mt-2 leading-relaxed">{formData.bio}</Text>
 )}
 </View>
 </View>

 {/* Edit Form OR Stats */}
 {isEditing ? (
 <View className="flex-col gap-6 mb-10">
 <View className="flex-row items-center gap-2 mb-2">
 <MaterialIcons name="manage-accounts" size={20} color={colors.primary} />
 <Text className="font-title-md font-bold text-primary uppercase tracking-widest text-xs">Profile Information</Text>
 </View>
 
 <View className="flex-col md:flex-row gap-6">
 <View className="flex-col gap-2 flex-1">
 <Text className="font-title-sm text-on-surface font-bold">Display Name</Text>
 <TextInput
 value={formData.display_name}
 onChangeText={(text) => setFormData(prev => ({ ...prev, display_name: text }))}
 className="w-full h-14 px-4 bg-surface-container-low rounded-xl font-body-md text-base"
 style={{ color: colors['on-surface'] }}
 placeholderTextColor={colors['outline-variant']}
 placeholder="e.g. Alex Thorne"
 />
 </View>
 <View className="flex-col gap-2 flex-1">
 <Text className="font-title-sm text-on-surface font-bold">Username</Text>
 <TextInput
 value={formData.username}
 onChangeText={(text) => setFormData(prev => ({ ...prev, username: text.toLowerCase() }))}
 autoCapitalize="none"
 className="w-full h-14 px-4 bg-surface-container-low rounded-xl font-body-md text-base"
 style={{ color: colors['on-surface'] }}
 placeholderTextColor={colors['outline-variant']}
 placeholder="e.g. alexthorne"
 />
 </View>
 </View>
 
 <View className="flex-col gap-2">
 <Text className="font-title-sm text-on-surface font-bold">Bio</Text>
 <TextInput
 value={formData.bio}
 onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
 multiline
 numberOfLines={3}
 className="w-full min-h-[100px] p-4 bg-surface-container-low rounded-xl font-body-md text-base"
 style={{ color: colors['on-surface'], textAlignVertical: 'top' }}
 placeholderTextColor={colors['outline-variant']}
 placeholder="Tell us a bit about yourself"
 />
 </View>

 <View className="flex-col md:flex-row gap-6">
 <View className="flex-col gap-2 flex-1">
 <Text className="font-title-sm text-on-surface font-bold">Occupation</Text>
 <TextInput
 value={formData.occupation}
 onChangeText={(text) => setFormData(prev => ({ ...prev, occupation: text }))}
 className="w-full h-14 px-4 bg-surface-container-low rounded-xl font-body-md text-base"
 style={{ color: colors['on-surface'] }}
 placeholderTextColor={colors['outline-variant']}
 placeholder="e.g. Researcher"
 />
 </View>
 <View className="flex-col gap-2 flex-1">
 <Text className="font-title-sm text-on-surface font-bold">Country</Text>
 <TextInput
 value={formData.country}
 onChangeText={(text) => setFormData(prev => ({ ...prev, country: text }))}
 className="w-full h-14 px-4 bg-surface-container-low rounded-xl font-body-md text-base"
 style={{ color: colors['on-surface'] }}
 placeholderTextColor={colors['outline-variant']}
 placeholder="e.g. United Kingdom"
 />
 </View>
 </View>
 
 <View className="flex-col md:flex-row gap-6">
 <View className="flex-col gap-2 flex-1">
 <Text className="font-title-sm text-on-surface font-bold">Website</Text>
 <TextInput
 value={formData.website}
 onChangeText={(text) => setFormData(prev => ({ ...prev, website: text }))}
 autoCapitalize="none"
 className="w-full h-14 px-4 bg-surface-container-low rounded-xl font-body-md text-base"
 style={{ color: colors['on-surface'] }}
 placeholderTextColor={colors['outline-variant']}
 placeholder="e.g. https://alexthorne.design"
 />
 </View>
 <View className="flex-col gap-2 flex-1">
 <Text className="font-title-sm text-on-surface font-bold">Social Media URLs</Text>
 <TextInput
 value={formData.social_links}
 onChangeText={(text) => setFormData(prev => ({ ...prev, social_links: text }))}
 autoCapitalize="none"
 className="w-full h-14 px-4 bg-surface-container-low rounded-xl font-body-md text-base"
 style={{ color: colors['on-surface'] }}
 placeholderTextColor={colors['outline-variant']}
 placeholder="e.g. https://x.com/alexthorne"
 />
 </View>
 </View>
 </View>
 ) : (
 <View className="flex-col gap-10 mb-10">
 {/* Quick Stats Grid */}
 <View>
 <View className="flex-row items-center gap-2 mb-4">
 <MaterialIcons name="insights" size={20} color={colors.primary} />
 <Text className="font-title-md font-bold text-primary uppercase tracking-widest text-xs">Intelligence Footprint</Text>
 </View>
 
 <View className="flex-row flex-wrap gap-4">
 <View className="flex-[1] min-w-[150px] bg-surface-container-lowest p-5 rounded-[20px]">
 <View className="flex-row items-center justify-between mb-2">
 <Text className="font-label-sm text-outline font-bold uppercase tracking-widest">Memories</Text>
 <MaterialIcons name="history" size={18} color={colors.secondary} />
 </View>
 <Text className="font-headline-md text-2xl font-bold text-on-surface">{stats?.timeline_memories || 0}</Text>
 </View>
 
 <View className="flex-[1] min-w-[150px] bg-surface-container-lowest p-5 rounded-[20px]">
 <View className="flex-row items-center justify-between mb-2">
 <Text className="font-label-sm text-outline font-bold uppercase tracking-widest">Captures</Text>
 <MaterialIcons name="camera" size={18} color={colors.primary} />
 </View>
 <Text className="font-headline-md text-2xl font-bold text-on-surface">{stats?.captures_total || 0}</Text>
 </View>
 
 <View className="flex-[1] min-w-[150px] bg-surface-container-lowest p-5 rounded-[20px]">
 <View className="flex-row items-center justify-between mb-2">
 <Text className="font-label-sm text-outline font-bold uppercase tracking-widest">KG Entities</Text>
 <MaterialIcons name="hub" size={18} color={colors['on-surface-variant']} />
 </View>
 <Text className="font-headline-md text-2xl font-bold text-on-surface">{stats?.knowledge_graph_entities || 0}</Text>
 </View>
 
 <View className="flex-[1] min-w-[150px] bg-surface-container-lowest p-5 rounded-[20px]">
 <View className="flex-row items-center justify-between mb-2">
 <Text className="font-label-sm text-outline font-bold uppercase tracking-widest">Streak</Text>
 <MaterialIcons name="local-fire-department" size={18} color="#f97316" />
 </View>
 <Text className="font-headline-md text-2xl font-bold text-on-surface">{dbUser?.current_streak || 0}</Text>
 </View>
 </View>
 </View>
 
 {/* Extended Details */}
 {(formData.occupation || formData.country || formData.website || formData.social_links) && (
 <View>
 <View className="flex-row items-center gap-2 mb-4">
 <MaterialIcons name="badge" size={20} color={colors.primary} />
 <Text className="font-title-md font-bold text-primary uppercase tracking-widest text-xs">Public Details</Text>
 </View>
 <View className="bg-surface-container-lowest rounded-[24px] overflow-hidden">
 {formData.occupation && (
 <View className="flex-row items-center p-4 ">
 <View className="w-10 h-10 items-center justify-center bg-surface-container rounded-full mr-4">
 <MaterialIcons name="work" size={20} color={colors['on-surface-variant']} />
 </View>
 <View>
 <Text className="text-xs text-outline font-medium">Occupation</Text>
 <Text className="text-on-surface font-bold text-base">{formData.occupation}</Text>
 </View>
 </View>
 )}
 {formData.country && (
 <View className="flex-row items-center p-4 ">
 <View className="w-10 h-10 items-center justify-center bg-surface-container rounded-full mr-4">
 <MaterialIcons name="public" size={20} color={colors['on-surface-variant']} />
 </View>
 <View>
 <Text className="text-xs text-outline font-medium">Location</Text>
 <Text className="text-on-surface font-bold text-base">{formData.country}</Text>
 </View>
 </View>
 )}
 {formData.website && (
 <TouchableOpacity 
    className="flex-row items-center p-4 " 
    onPress={() => Linking.openURL(formData.website.startsWith('http') ? formData.website : `https://${formData.website}`).catch(() => Alert.alert('Invalid URL', 'Cannot open this website.'))}
  >
 <View className="w-10 h-10 items-center justify-center bg-surface-container rounded-full mr-4">
 <MaterialIcons name="language" size={20} color={colors['on-surface-variant']} />
 </View>
 <View className="flex-1">
 <Text className="text-xs text-outline font-medium">Website</Text>
 <Text className="text-primary font-bold text-base text-blue-500 underline" numberOfLines={1}>{formData.website}</Text>
 </View>
 </TouchableOpacity>
 )}
 {formData.social_links && (
 <TouchableOpacity 
    className="flex-row items-center p-4"
    onPress={() => Linking.openURL(formData.social_links.startsWith('http') ? formData.social_links : `https://${formData.social_links}`).catch(() => Alert.alert('Invalid URL', 'Cannot open this link. Please provide a full URL.'))}
  >
 <View className="w-10 h-10 items-center justify-center bg-surface-container rounded-full mr-4">
 <MaterialIcons name="share" size={20} color={colors['on-surface-variant']} />
 </View>
 <View className="flex-1">
 <Text className="text-xs text-outline font-medium">Social Links</Text>
 <Text className="text-primary font-bold text-base text-blue-500 underline" numberOfLines={1}>{formData.social_links}</Text>
 </View>
 </TouchableOpacity>
 )}
 </View>
 </View>
 )}
 
 </View>
 )}
 </View>
 </KeyboardAwareScrollView>
 </Screen>
 );
}
