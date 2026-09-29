import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useSecuritySettings } from '../hooks/useSecurity';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export function BiometricGate({ children }: { children: React.ReactNode }) {
  const { data: settings, isLoading } = useSecuritySettings();
  const [unlocked, setUnlocked] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);

  const authenticate = async () => {
    try {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        setUnlocked(true); // If biometrics were removed from device, fallback open
        return;
      }
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock YRecall',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setUnlocked(true);
      } else {
        setAuthFailed(true);
      }
    } catch (error) {
      setUnlocked(true); // Failsafe
    }
  };

  useEffect(() => {
    if (isLoading) return;
    
    // If settings don't require opening lock, or biometrics are disabled globally
    if (!settings?.biometric_enabled || !settings?.require_for_opening) {
      setUnlocked(true);
      return;
    }

    if (!unlocked && !authFailed) {
      authenticate();
    }
  }, [isLoading, settings, unlocked, authFailed]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!unlocked && settings?.require_for_opening) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <MaterialCommunityIcons name="lock" size={64} color={colors.primary} style={{ marginBottom: 16 }} />
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 24 }}>YRecall is Locked</Text>
        <TouchableOpacity 
          onPress={() => {
            setAuthFailed(false);
            authenticate();
          }}
          style={{ backgroundColor: colors.primary, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Unlock with Biometrics</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}
