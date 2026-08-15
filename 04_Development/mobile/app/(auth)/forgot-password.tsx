import React, { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { auth } from '../../src/shared/lib/firebase';
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordScreen() {
 const router = useRouter();
 const [email, setEmail] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [isSuccess, setIsSuccess] = useState(false);
 const { t } = useTranslation();

 const handleResetPassword = async () => {
 const normalizedEmail = email.trim();
 if (!normalizedEmail) {
 Alert.alert(t('common.validationError', 'Validation Error'), t('auth.enterEmail', 'Please enter your email address.'));
 return;
 }

 // Basic email validation
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!emailRegex.test(normalizedEmail)) {
 Alert.alert(t('common.validationError', 'Validation Error'), t('auth.invalidEmailFormat', 'Please enter a valid email address.'));
 return;
 }

 try {
 setIsLoading(true);

 // Try to check if this is a Google-only account to provide better UX
 try {
 const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail);
 if (methods.length > 0 && !methods.includes('password') && methods.includes('google.com')) {
 setIsLoading(false);
 Alert.alert(
 t('auth.googleAccount', 'Google Account'),
 t('auth.googleOnlyAccountError', 'This account was created with Google. Please continue with Google to sign in.')
 );
 return;
 }
 } catch (e: any) {
 // If fetchSignInMethodsForEmail fails (e.g. email enumeration protection is enabled),
 // we silently catch it and proceed to send the reset email anyway for privacy/security.
 }

 // Use Firebase's native password reset
 await sendPasswordResetEmail(auth, normalizedEmail);
 
 // Show generic success response regardless of actual account existence
 setIsSuccess(true);
 } catch (error: any) {
 let msg = error.message;
 // Map common errors to friendly messages
 if (error.code === 'auth/invalid-email') {
 msg = t('auth.invalidEmail', 'That email address is invalid.');
 } else if (error.code === 'auth/user-not-found') {
 // For security, we treat user-not-found as a success to avoid account enumeration
 setIsSuccess(true);
 return;
 } else if (error.code === 'auth/too-many-requests') {
 msg = t('auth.tooManyRequests', 'Too many requests. Please try again later.');
 } else if (error.code === 'auth/network-request-failed') {
 msg = t('auth.networkError', 'Network error. Please check your connection and try again.');
 }

 Alert.alert(t('auth.resetError', 'Reset Error'), msg);
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <Screen scrollable={false}>
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
 className="mr-4"
 />
 </View>

 <View className="flex-1 items-center justify-center px-margin-mobile py-xl md:px-margin-desktop">
 <View className="w-full max-w-md space-y-lg">
 
 <View className="mb-8 text-center">
 <Text className="font-display-lg text-primary text-center mb-2">
 {t('auth.forgotPasswordTitle', 'Forgot your password?')}
 </Text>
 <Text className="font-body-md text-on-surface-variant text-center leading-relaxed">
 {isSuccess 
 ? t('auth.resetSuccessDesc', 'If an account can be recovered using this email, we\'ve sent a password reset link. Please check your inbox and follow the instructions.')
 : t('auth.forgotPasswordDesc', 'Enter the email address associated with your YRecall account and we\'ll send you a password reset link.')}
 </Text>
 </View>

 {!isSuccess ? (
 <View className="flex-col gap-6">
 <View className="flex-col gap-2">
 <Text className="font-title-sm text-on-surface font-bold">{t('auth.email', 'Email address')}</Text>
 <TextInput
 value={email}
 onChangeText={setEmail}
 keyboardType="email-address"
 autoCapitalize="none"
 placeholder="alex@example.com"
 placeholderTextColor={colors.outline}
 editable={!isLoading}
 className="w-full h-14 px-4 bg-surface-container-low rounded-xl font-body-md text-base text-on-surface"
 />
 </View>

 <View className="mt-2">
 <Button
 label={isLoading ? t('common.sending', 'Sending...') : t('auth.sendResetLink', 'Send reset link')}
 fullWidth
 onPress={handleResetPassword}
 disabled={isLoading}
 />
 </View>
 
 <View className="mt-4 flex-row justify-center">
 <Text 
 className="font-title-sm text-primary font-bold py-2"
 onPress={() => router.back()}
 >
 {t('auth.backToSignIn', 'Back to Sign In')}
 </Text>
 </View>
 </View>
 ) : (
 <View className="flex-col gap-6 mt-4">
 <Button
 label={t('auth.backToSignIn', 'Back to Sign In')}
 fullWidth
 onPress={() => router.back()}
 />
 </View>
 )}

 </View>
 </View>
 </ScrollView>
 </KeyboardAvoidingView>
 </Screen>
 );
}
