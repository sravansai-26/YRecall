import React, { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, Screen, OTPInput } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../src/services/api';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    
    // States: 'request' -> 'verify' -> 'complete'
    const [step, setStep] = useState<'request' | 'verify' | 'complete'>('request');
    
    // Form state
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // ==========================================
    // STEP 1: REQUEST OTP
    // ==========================================
    const handleRequestReset = async () => {
        const normalizedEmail = email.trim();
        if (!normalizedEmail) {
            Alert.alert(t('common.validationError', 'Validation Error'), t('auth.enterEmail', 'Please enter your email address.'));
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            Alert.alert(t('common.validationError', 'Validation Error'), t('auth.invalidEmailFormat', 'Please enter a valid email address.'));
            return;
        }

        try {
            setIsLoading(true);
            await apiClient.post('/auth/password-reset/request', { email: normalizedEmail });
            // Always move to verify step for security (avoids enumeration)
            setStep('verify');
        } catch (error: any) {
            Alert.alert(t('auth.resetError', 'Error'), error.response?.data?.detail || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================
    // STEP 2: VERIFY OTP
    // ==========================================
    const handleVerifyCode = async () => {
        if (!code.trim() || code.length !== 6) {
            Alert.alert(t('common.validationError', 'Validation Error'), 'Please enter the 6-digit code.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await apiClient.post('/auth/password-reset/verify', { 
                email: email.trim(), 
                code: code.trim() 
            });
            
            if (response.data.success && response.data.reset_token) {
                setResetToken(response.data.reset_token);
                setStep('complete');
            } else {
                throw new Error("Invalid response");
            }
        } catch (error: any) {
            Alert.alert('Verification Failed', error.response?.data?.detail || 'Invalid verification code.');
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================
    // STEP 3: COMPLETE RESET
    // ==========================================
    const handleCompleteReset = async () => {
        if (!newPassword || newPassword.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters.');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            Alert.alert('Password Mismatch', 'The passwords do not match.');
            return;
        }

        try {
            setIsLoading(true);
            await apiClient.post('/auth/password-reset/complete', { 
                reset_token: resetToken, 
                new_password: newPassword 
            });
            setIsSuccess(true);
        } catch (error: any) {
            Alert.alert('Update Failed', error.response?.data?.detail || 'Failed to update password. Session may have expired.');
            setStep('request'); // Fall back to start if token expired
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
                            onPress={() => {
                                if (isSuccess) router.back();
                                else if (step === 'verify') setStep('request');
                                else if (step === 'complete') setStep('verify');
                                else router.back();
                            }}
                            className="mr-4"
                        />
                    </View>

                    <View className="flex-1 items-center justify-center px-margin-mobile py-xl md:px-margin-desktop">
                        <View className="w-full max-w-md space-y-lg">
                            
                            {/* Title & Description */}
                            <View className="mb-8 text-center">
                                <Text className="font-display-lg text-primary text-center mb-2">
                                    {isSuccess ? 'Password Changed' : 
                                     step === 'complete' ? 'Create a new password' :
                                     step === 'verify' ? 'Check your email' :
                                     t('auth.forgotPasswordTitle', 'Forgot your password?')}
                                </Text>
                                <Text className="font-body-md text-on-surface-variant text-center leading-relaxed">
                                    {isSuccess 
                                        ? 'Your password has been changed successfully.'
                                        : step === 'complete' 
                                            ? 'Enter your new password below.'
                                            : step === 'verify'
                                                ? 'Enter the 6-digit verification code we sent to your registered email.'
                                                : t('auth.forgotPasswordDesc', 'Enter the email address associated with your YRecall account and we\'ll send you a verification code.')}
                                </Text>
                            </View>

                            {/* Forms based on step */}
                            {!isSuccess && step === 'request' && (
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
                                            className="w-full h-14 px-4 bg-surface-container-lowest rounded-xl font-body-md text-base text-on-surface border border-surface-variant shadow-sm"
                                            style={{ elevation: 1 }}
                                        />
                                    </View>
                                    <View className="mt-2">
                                        <Button
                                            label={isLoading ? 'Sending...' : 'Send verification code'}
                                            fullWidth
                                            onPress={handleRequestReset}
                                            disabled={isLoading}
                                        />
                                    </View>
                                </View>
                            )}

                            {!isSuccess && step === 'verify' && (
                                <View className="flex-col gap-6">
                                    <View className="flex-col gap-2">
                                        <Text className="font-title-sm text-on-surface font-bold">Verification Code</Text>
                                        <OTPInput
                                            code={code}
                                            setCode={setCode}
                                            disabled={isLoading}
                                        />
                                    </View>
                                    <View className="mt-2">
                                        <Button
                                            label={isLoading ? 'Verifying...' : 'Verify code'}
                                            fullWidth
                                            onPress={handleVerifyCode}
                                            disabled={isLoading || code.length !== 6}
                                        />
                                    </View>
                                    <View className="mt-4 flex-row justify-center">
                                        <Text 
                                            className="font-title-sm text-primary font-bold py-2"
                                            onPress={handleRequestReset}
                                            disabled={isLoading}
                                        >
                                            Resend code
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {!isSuccess && step === 'complete' && (
                                <View className="flex-col gap-6">
                                    <View className="flex-col gap-2">
                                        <Text className="font-title-sm text-on-surface font-bold">New Password</Text>
                                        <View className="w-full h-14 bg-surface-container-lowest rounded-xl flex-row items-center pr-4 border border-surface-variant shadow-sm" style={{ elevation: 1 }}>
                                            <TextInput
                                                value={newPassword}
                                                onChangeText={setNewPassword}
                                                secureTextEntry={!showNewPassword}
                                                placeholder="••••••••"
                                                placeholderTextColor={colors.outline}
                                                editable={!isLoading}
                                                className="flex-1 h-full px-4 font-body-md text-base text-on-surface"
                                            />
                                            <MaterialIcons 
                                                name={showNewPassword ? 'visibility' : 'visibility-off'} 
                                                size={24} 
                                                color={colors['on-surface-variant']} 
                                                onPress={() => setShowNewPassword(!showNewPassword)}
                                            />
                                        </View>
                                    </View>
                                    <View className="flex-col gap-2 mt-4">
                                        <Text className="font-title-sm text-on-surface font-bold">Confirm Password</Text>
                                        <View className="w-full h-14 bg-surface-container-lowest rounded-xl flex-row items-center pr-4 border border-surface-variant shadow-sm" style={{ elevation: 1 }}>
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
                                            label={isLoading ? 'Changing...' : 'Change password'}
                                            fullWidth
                                            onPress={handleCompleteReset}
                                            disabled={isLoading || !newPassword || !confirmPassword}
                                        />
                                    </View>
                                </View>
                            )}

                            {isSuccess && (
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
