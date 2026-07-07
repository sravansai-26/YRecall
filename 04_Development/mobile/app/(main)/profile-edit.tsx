import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../src/shared/store/useAuthStore';
import { updateProfile, signOut } from 'firebase/auth';
import { auth } from '../../src/shared/lib/firebase';

export default function ProfileEdit() {
  const router = useRouter();
  const { user, setUser, profileDetails, setProfileDetails } = useAuthStore();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [socialLinks, setSocialLinks] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      setPhotoURL(user.photoURL || '');
    }
    setOccupation(profileDetails?.occupation || '');
    setAddress(profileDetails?.address || '');
    setSocialLinks(profileDetails?.socialLinks || '');
  }, [user, profileDetails]);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    try {
      setIsSaving(true);
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });
      setUser({ ...auth.currentUser });
      setProfileDetails({ occupation, address, socialLinks });
      Alert.alert('Success', 'Profile updated successfully.');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
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

  return (
    <Screen scrollable={true} className="pb-24">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16 border-b border-outline-variant/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="close" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl font-bold text-primary">Edit Profile</Text>
        </View>
        <TouchableOpacity 
          onPress={handleSave} 
          disabled={isSaving}
          className={`px-4 py-2 rounded-full  ${isSaving ? 'bg-primary/50' : 'bg-primary'}`}
        >
          <Text className="text-white font-bold">{isSaving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <View className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-8 flex-col w-full">
        <View className="items-center mb-8">
          <View className="relative">
            {photoURL ? (
              <Image 
                source={{ uri: photoURL }}
                className="w-32 h-32 rounded-full border-4 border-surface"
              />
            ) : (
              <View className="w-32 h-32 rounded-full border-4 border-surface bg-surface-variant items-center justify-center">
                <MaterialIcons name="person" size={64} color={colors['on-surface-variant']} />
              </View>
            )}
            <TouchableOpacity className="absolute bottom-0 right-0 p-3 bg-secondary rounded-full shadow-sm border-2 border-surface">
              <MaterialIcons name="photo-camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-col gap-6">
          <View className="flex-col gap-2">
            <Text className="font-title-sm text-on-surface font-bold">Display Name</Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              className="w-full h-14 px-4 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-base text-on-surface"
              placeholder="e.g. Alex Thorne"
            />
          </View>
          
          <View className="flex-col gap-2">
            <Text className="font-title-sm text-on-surface font-bold">Occupation</Text>
            <TextInput
              value={occupation}
              onChangeText={setOccupation}
              className="w-full h-14 px-4 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-base text-on-surface"
              placeholder="e.g. Product Designer"
            />
          </View>

          <View className="flex-col gap-2">
            <Text className="font-title-sm text-on-surface font-bold">Address</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              className="w-full h-14 px-4 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-base text-on-surface"
              placeholder="e.g. San Francisco, CA"
            />
          </View>

          <View className="flex-col gap-2">
            <Text className="font-title-sm text-on-surface font-bold">Social Media Links</Text>
            <TextInput
              value={socialLinks}
              onChangeText={setSocialLinks}
              className="w-full h-14 px-4 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-base text-on-surface"
              placeholder="e.g. linkedin.com/in/alex"
            />
          </View>
          
          <View className="flex-col gap-2 mt-4">
            <Text className="font-title-sm text-on-surface font-bold">Email Address</Text>
            <TextInput
              value={email}
              editable={false}
              className="w-full h-14 px-4 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-base text-on-surface/50"
            />
            <Text className="text-xs text-on-surface-variant ml-1">Email cannot be changed here.</Text>
          </View>
        </View>

        <View className="mt-12 pt-6 border-t border-outline-variant/30 flex-col gap-4">
          <TouchableOpacity onPress={() => router.push('/(main)/(tabs)/settings')} className="flex-row items-center justify-between p-4 bg-surface-container-low rounded-xl">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="settings" size={24} color={colors.primary} />
              <Text className="font-body-md text-base text-primary font-medium">Account Settings</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleSignOut} className="flex-row items-center justify-between p-4 bg-error/10 rounded-xl">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="logout" size={24} color={colors.error} />
              <Text className="font-body-md text-base text-error font-medium">Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </Screen>
  );
}
