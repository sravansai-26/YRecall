import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { auth } from '../../src/shared/lib/firebase';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

export default function ResetPasswordScreen() {
 const router = useRouter();
 const params = useLocalSearchParams();
 const oobCode = (params.oobCode as string) || '';
 
 const [newPassword, setNewPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [isVerifying, setIsVerifying] = useState(true);
 const [isValidCode, setIsValidCode] = useState(false);
 const [email, setEmail] = useState('');
 const [isSuccess, setIsSuccess] = useState(false);
 const { t } = useTranslation();

 useEffect(() => {
 const verifyCode = async () => {
 if (!oobCode) {
 setIsVerifying(false);
 return;
 }
 
 try {
 const userEmail = await verifyPasswordResetCode(auth, oobCode);
 setEmail(userEmail);
 setIsValidCode(true);
 } catch (error: any) {
 setIsValidCode(false);
 } finally {
 setIsVerifying(false);
 }
 };
 
 verifyCode();
 }, [oobCode]);

 const handleResetPassword = async () => {
 if (!newPassword || !confirmPassword) {
 Alert.alert(t('common.validationError', 'Validation Error'), t('auth.enterPasswords', 'Please enter and confirm your new password.'));
 return;
 }

 if (newPassword !== confirmPassword) {
 Alert.alert(t('common.validationError', 'Validation Error'), t('auth.passwordsDoNotMatch', 'Passwords do not match.'));
 return;
 }
 
 if (newPassword.length < 6) {
 Alert.alert(t('common.validationError', 'Validation Error'), t('auth.passwordTooShort', 'Password must be at least 6 characters long.'));
 return;
 }

 try {
 setIsLoading(true);
 await confirmPasswordReset(auth, oobCode, newPassword);
 setIsSuccess(true);
 } catch (error: any) {
 let msg = error.message;
 if (error.code === 'auth/expired-action-code') {
 msg = t('auth.expiredLink', 'This password reset link has expired. Please request a new one.');
 } else if (error.code === 'auth/invalid-action-code') {
 msg = t('auth.invalidLink', 'This password reset link is invalid or has already been used.');
 } else if (error.code === 'auth/weak-password') {
 msg = t('auth.weakPassword', 'Password is not strong enough.');
 } else if (error.code === 'auth/network-request-failed') {
 msg = t('auth.networkError', 'Network error. Please check your connection and try again.');
 }

 Alert.alert(t('auth.resetError', 'Reset Error'), msg);
 } finally {
 setIsLoading(false);
 }
 };

 if (isVerifying) {
 return (
 <Screen scrollable={false}>
 <View className="flex-1 items-center justify-center">
 <Text className="font-body-md text-on-surface-variant">
 {t('common.loading', 'Loading...')}
 </Text>
 </View>
 </Screen>
 );
 }

 return (
 <Screen scrollable={false}>
 <KeyboardAvoidingView 
 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
 className="flex-1"
 >
 <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
 
 <View className="w-full flex-row items-center px-margin-mobile py-base h-16">
 {!isSuccess && (
 <MaterialIcons 
 name="arrow-back" 
 size={24} 
 color={colors.primary} 
 onPress={() => router.replace('/(auth)/index')}
 className="mr-4"
 />
 )}
 </View>

 <View className="flex-1 items-center justify-center px-margin-mobile py-xl md:px-margin-desktop">
 <View className="w-full max-w-md space-y-lg">
 
 {!isValidCode && !isSuccess ? (
 <View className="flex-col gap-6 items-center">
 <MaterialIcons name="error-outline" size={48} color={colors.error} />
 <Text className="font-display-sm text-on-surface text-center">
 {t('auth.invalidResetLink', 'Invalid or Expired Link')}
 </Text>
 <Text className="font-body-md text-on-surface-variant text-center leading-relaxed">
 {t('auth.invalidResetLinkDesc', 'This password reset link is invalid, expired, or has already been used. Please request a new one.')}
 </Text>
 <Button
 label={t('auth.backToSignIn', 'Back to Sign In')}
 fullWidth
 onPress={() => router.replace('/(auth)/index')}
 className="mt-4"
 />
 </View>
 ) : isSuccess ? (
 <View className="flex-col gap-6 items-center">
 <View className="w-16 h-16 rounded-full bg-primary-container items-center justify-center mb-2">
 <MaterialIcons name="check" size={32} color={colors.onPrimaryContainer} />
 </View>
 <Text className="font-display-sm text-on-surface text-center">
 {t('auth.passwordUpdated', 'Password updated successfully')}
 </Text>
 <Text className="font-body-md text-on-surface-variant text-center leading-relaxed">
 {t('auth.passwordUpdatedDesc', 'Your YRecall password has been changed. You can now sign in using your new password.')}
 </Text>
 <Button
 label={t('auth.continueToSignIn', 'Continue to Sign In')}
 fullWidth
 onPress={() => router.replace('/(auth)/index')}
 className="mt-4"
 />
 </View>
 ) : (
 <>
 <View className="mb-8 text-center">
 <Text className="font-display-sm text-primary text-center mb-2">
 {t('auth.createNewPassword', 'Create a new password')}
 </Text>
 <Text className="font-body-md text-on-surface-variant text-center leading-relaxed">
 {t('auth.resettingFor', 'Resetting password for ')}
 <Text className="font-bold text-on-surface">{email}</Text>
 </Text>
 </View>

 <View className="flex-col gap-4">
 <View className="flex-col gap-2">
 <Text className="font-title-sm text-on-surface font-bold">{t('auth.newPassword', 'New password')}</Text>
 <View className="w-full h-14 bg-surface-container-low rounded-xl flex-row items-center pr-4">
 <TextInput
 value={newPassword}
 onChangeText={setNewPassword}
 secureTextEntry={!showPassword}
 placeholder="••••••••"
 placeholderTextColor={colors.outline}
 editable={!isLoading}
 className="flex-1 h-full px-4 font-body-md text-base text-on-surface"
 />
 <MaterialIcons 
 name={showPassword ? 'visibility' : 'visibility-off'} 
 size={24} 
 color={colors['on-surface-variant']} 
 onPress={() => setShowPassword(!showPassword)}
 />
 </View>
 </View>

 <View className="flex-col gap-2">
 <Text className="font-title-sm text-on-surface font-bold">{t('auth.confirmNewPassword', 'Confirm new password')}</Text>
 <View className="w-full h-14 bg-surface-container-low rounded-xl flex-row items-center pr-4">
 <TextInput
 value={confirmPassword}
 onChangeText={setConfirmPassword}
 secureTextEntry={!showConfirmPassword}
 placeholder="••••••••"
 placeholderTextColor={colors.outline}
 editable={!isLoading}
 className="flex-1 h-full px-4 font-body-md text-base text-on-surface"
 />
 <MaterialIcons 
 name={showConfirmPassword ? 'visibility' : 'visibility-off'} 
 size={24} 
 color={colors['on-surface-variant']} 
 onPress={() => setShowConfirmPassword(!showConfirmPassword)}
 />
 </View>
 </View>

 <View className="mt-6">
 <Button
 label={isLoading ? t('common.saving', 'Saving...') : t('auth.resetPassword', 'Reset Password')}
 fullWidth
 onPress={handleResetPassword}
 disabled={isLoading}
 />
 </View>
 </View>
 </>
 )}

 </View>
 </View>
 </ScrollView>
 </KeyboardAvoidingView>
 </Screen>
 );
}
