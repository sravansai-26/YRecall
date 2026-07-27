import React, { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { auth } from '../../src/shared/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthStore } from '../../src/shared/store/useAuthStore';
import { useTranslation } from 'react-i18next';

export default function AuthEmail() {
 const router = useRouter();
 const { setLoading } = useAuthStore();
 const [isLogin, setIsLogin] = useState(true);
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const { t } = useTranslation();

 const handleAuth = async () => {
 if (!email || !password) {
 Alert.alert(t('common.validationError', 'Validation Error'), t('auth.enterEmailPassword', 'Please enter both email and password.'));
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
 if (error.code === 'auth/email-already-in-use') msg = t('auth.emailInUse', 'That email address is already in use!');
 if (error.code === 'auth/invalid-email') msg = t('auth.invalidEmail', 'That email address is invalid!');
 if (error.code === 'auth/weak-password') msg = t('auth.weakPassword', 'Password is not strong enough.');
 if (error.code === 'auth/invalid-credential') msg = t('auth.invalidCredential', 'Invalid credentials provided.');
 
 Alert.alert(t('auth.authError', 'Authentication Error'), msg);
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
 {isLogin ? t('auth.welcomeBack', 'Welcome Back') : t('auth.createAccount', 'Create Account')}
 </Text>
 <Text className="font-body-md text-on-surface-variant text-center">
 {isLogin ? t('auth.signInToAccess', 'Sign in to access your second brain.') : t('auth.signUpToStart', 'Sign up to start building your digital life.')}
 </Text>
 </View>

 <View className="flex-col gap-4">
 <View className="flex-col gap-2">
 <Text className="font-title-sm text-on-surface font-bold">{t('auth.email', 'Email')}</Text>
 <TextInput
 value={email}
 onChangeText={setEmail}
 keyboardType="email-address"
 autoCapitalize="none"
 placeholder="alex@example.com"
 className="w-full h-14 px-4 bg-surface-container-low rounded-xl font-body-md text-base text-on-surface"
 />
 </View>

 <View className="flex-col gap-2">
 <Text className="font-title-sm text-on-surface font-bold">{t('auth.password', 'Password')}</Text>
 <TextInput
 value={password}
 onChangeText={setPassword}
 secureTextEntry
 placeholder="••••••••"
 className="w-full h-14 px-4 bg-surface-container-low rounded-xl font-body-md text-base text-on-surface"
 />
 </View>
 </View>

 <View className="mt-8">
 <Button
 label={isLogin ? t('auth.signIn', "Sign In") : t('auth.signUp', "Sign Up")}
 fullWidth
 onPress={handleAuth}
 />
 </View>

 <View className="mt-6 flex-row justify-center">
 <Text className="font-body-md text-on-surface-variant">
 {isLogin ? t('auth.dontHaveAccount', "Don't have an account? ") : t('auth.alreadyHaveAccount', "Already have an account? ")}
 </Text>
 <Text 
 className="font-title-sm text-primary font-bold"
 onPress={() => setIsLogin(!isLogin)}
 >
 {isLogin ? t('auth.signUp', 'Sign Up') : t('auth.signIn', 'Sign In')}
 </Text>
 </View>

 </View>
 </View>
 </ScrollView>
 </KeyboardAvoidingView>
 </Screen>
 );
}
