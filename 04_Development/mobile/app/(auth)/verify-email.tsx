import React, { useState } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, Screen, OTPInput } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../src/services/api';
import { auth } from '../../src/shared/lib/firebase';

export default function VerifyEmailScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const { t } = useTranslation();
    
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyCode = async () => {
        if (!code.trim() || code.length !== 6) {
            Alert.alert(t('common.validationError', 'Validation Error'), 'Please enter the 6-digit code.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await apiClient.post('/auth/email-verification/verify', { 
                email: email, 
                code: code.trim() 
            });
            
            if (response.data.success) {
                // If user is currently signed in, reload their profile to pick up emailVerified=true
                if (auth.currentUser) {
                    await auth.currentUser.reload();
                }
                
                // Navigate to the main app onboarding/home
                // The router layout usually handles redirecting authenticated users automatically, 
                // but we can explicitly push them to the main layout.
                router.replace('/(main)/home');
            }
        } catch (error: any) {
            Alert.alert('Verification Failed', error.response?.data?.detail || 'Invalid verification code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setIsLoading(true);
            await apiClient.post('/auth/email-verification/request', { email });
            Alert.alert('Code Sent', `We sent a new 6-digit code to ${email}`);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.detail || 'Failed to resend code.');
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
                                    Verify your email
                                </Text>
                                <Text className="font-body-md text-on-surface-variant text-center leading-relaxed">
                                    We sent a 6-digit verification code to
                                    {"\n"}
                                    <Text className="font-bold text-on-surface">{email}</Text>
                                </Text>
                            </View>

                            <View className="flex-col gap-6">
                                <View className="flex-col gap-2">
                                    <OTPInput
                                        code={code}
                                        setCode={setCode}
                                        disabled={isLoading}
                                    />
                                </View>
                                <View className="mt-2">
                                    <Button
                                        label={isLoading ? 'Verifying...' : 'Verify'}
                                        fullWidth
                                        onPress={handleVerifyCode}
                                        disabled={isLoading || code.length !== 6}
                                    />
                                </View>
                                
                                <View className="mt-4 flex-col items-center gap-4">
                                    <Text 
                                        className="font-title-sm text-primary font-bold py-2"
                                        onPress={handleResend}
                                        disabled={isLoading}
                                    >
                                        Resend code
                                    </Text>
                                    
                                    <Text 
                                        className="font-title-sm text-on-surface-variant py-2"
                                        onPress={() => router.back()}
                                    >
                                        Change email
                                    </Text>
                                </View>
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    );
}
