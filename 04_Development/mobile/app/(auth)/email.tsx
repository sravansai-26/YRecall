import React, { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { auth } from '../../src/shared/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthStore } from '../../src/shared/store/useAuthStore';

export default function AuthEmail() {
  const router = useRouter();
  const { setLoading } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Routing handled by _layout.tsx based on auth state
    } catch (error: any) {
      setLoading(false);
      let msg = error.message;
      if (error.code === 'auth/email-already-in-use') msg = 'That email address is already in use!';
      if (error.code === 'auth/invalid-email') msg = 'That email address is invalid!';
      if (error.code === 'auth/weak-password') msg = 'Password is not strong enough.';
      if (error.code === 'auth/invalid-credential') msg = 'Invalid credentials provided.';
      
      Alert.alert('Authentication Error', msg);
    }
  };

  return (
    <Screen scrollable>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <View className="w-full flex-row items-center px-margin-mobile py-base h-16">
            <MaterialIcons 
              name="arrow-back" 
              size={24} 
              color={colors.primary} 
              onPress={() => router.back()}
              className="mr-2"
            />
            <MaterialIcons name="auto-awesome" size={24} color={colors.primary} />
            <Text className="ml-2 font-headline-md text-[24px] font-bold text-primary tracking-tight">
              YRecall
            </Text>
          </View>

          <View className="flex-1 items-center justify-center px-margin-mobile py-xl md:px-margin-desktop">
            <View className="w-full max-w-md space-y-lg">
              
              <View className="mb-6 text-center">
                <Text className="font-display-lg text-primary text-center mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </Text>
                <Text className="font-body-md text-on-surface-variant text-center">
                  {isLogin ? 'Sign in to access your second brain.' : 'Sign up to start building your digital life.'}
                </Text>
              </View>

              <View className="flex-col gap-4">
                <View className="flex-col gap-2">
                  <Text className="font-title-sm text-on-surface font-bold">Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="alex@example.com"
                    className="w-full h-14 px-4 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-base text-on-surface"
                  />
                </View>

                <View className="flex-col gap-2">
                  <Text className="font-title-sm text-on-surface font-bold">Password</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="••••••••"
                    className="w-full h-14 px-4 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-base text-on-surface"
                  />
                </View>
              </View>

              <View className="mt-8">
                <Button
                  label={isLogin ? "Sign In" : "Sign Up"}
                  fullWidth
                  onPress={handleAuth}
                />
              </View>

              <View className="mt-6 flex-row justify-center">
                <Text className="font-body-md text-on-surface-variant">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </Text>
                <Text 
                  className="font-title-sm text-primary font-bold"
                  onPress={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </View>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
