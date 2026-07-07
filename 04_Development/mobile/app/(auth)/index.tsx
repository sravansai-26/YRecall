import React, { useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Button, Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../../src/shared/lib/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useAuthStore } from '../../src/shared/store/useAuthStore';

export default function AuthIndex() {
  const router = useRouter();
  const { setLoading } = useAuthStore();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '55044011139-jmh5ec01sl5d67hcdjhkfcsudo9k6i5e.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      
      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredential);
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      Alert.alert('Sign-In Error', error.message || 'An error occurred during Google Sign-In.');
    }
  };

  return (
    <Screen scrollable>
      <View className="w-full flex-row items-center px-margin-mobile py-base h-16">
        <MaterialIcons name="auto-awesome" size={24} color={colors.primary} />
        <Text className="ml-2 font-headline-md text-[24px] font-bold text-primary tracking-tight">
          YRecall
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-margin-mobile py-xl md:px-margin-desktop">
        <View className="w-full max-w-md items-center space-y-xl text-center">
          <View className="items-center">
            <View className="mb-gutter w-24 h-24 rounded-3xl bg-surface-container-lowest items-center justify-center shadow-lg overflow-hidden border border-outline-variant/30">
               <MaterialIcons name="all-inclusive" size={48} color={colors.primary} />
            </View>
            <Text className="font-display-lg text-primary text-center mb-sm">
              Begin your journey
            </Text>
            <Text className="font-body-md text-on-surface-variant text-center max-w-xs mx-auto">
              Create your digital life companion.
            </Text>
          </View>

          <View className="w-full mt-xl space-y-md gap-4">
            <TouchableOpacity 
              className="w-full flex-row items-center justify-center rounded-full bg-primary py-3  transition-all shadow-sm"
              onPress={handleGoogleSignIn}
            >
              <FontAwesome name="google" size={20} color="#ffffff" />
              <Text className="font-label-xs text-[14px] text-white ml-3">
                Continue with Google
              </Text>
            </TouchableOpacity>

            <View className="relative py-base items-center w-full my-2">
              <View className="absolute inset-0 items-center justify-center">
                <View className="w-full border-t border-outline-variant/50" />
              </View>
              <View className="relative bg-background px-4">
                <Text className="text-label-xs uppercase tracking-widest text-outline">or</Text>
              </View>
            </View>

            <Button
              label="Use email and password"
              variant="outline"
              icon="mail"
              fullWidth
              onPress={() => router.push('/(auth)/email')}
            />
          </View>
        </View>
      </View>

      <View className="w-full py-xl px-margin-mobile mt-auto">
        <View className="max-w-md mx-auto items-center">
          <Text className="font-caption-sm text-outline px-gutter text-center leading-relaxed">
            By continuing, you agree to YRecall's Terms of Service and Privacy Policy. We use your data to personalize your intelligence layer.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
