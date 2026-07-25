import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { 
  useSecuritySettings, 
  useUpdateSecuritySettings, 
  useDeviceSessions, 
  useRevokeSession,
  useSecurityLogs
} from '../../../src/shared/hooks/useSecurity';
import * as LocalAuthentication from 'expo-local-authentication';
import { format, formatDistanceToNow } from 'date-fns';

export default function IdentitySecurityCenterScreen() {
  const router = useRouter();

  // Settings
  const { data: settings, isLoading: loadingSettings } = useSecuritySettings();
  const updateSettings = useUpdateSecuritySettings();
  
  // Sessions
  const { data: sessions, isLoading: loadingSessions } = useDeviceSessions();
  const revokeSession = useRevokeSession();

  // Logs
  const { data: logs, isLoading: loadingLogs } = useSecurityLogs();

  // Local State
  const [hasHardware, setHasHardware] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [authType, setAuthType] = useState<LocalAuthentication.AuthenticationType[]>([]);

  useEffect(() => {
    (async () => {
      const hardware = await LocalAuthentication.hasHardwareAsync();
      setHasHardware(hardware);
      
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsEnrolled(enrolled);
      
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      setAuthType(types);
    })();
  }, []);

  const handleToggleBiometrics = async (value: boolean) => {
    if (value) {
      if (!hasHardware || !isEnrolled) {
        Alert.alert('Unavailable', 'Biometric hardware is missing or not enrolled on this device.');
        return;
      }
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric protection',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        updateSettings.mutate({ biometric_enabled: true });
      }
    } else {
      updateSettings.mutate({ biometric_enabled: false });
    }
  };

  const handleUpdateTimeout = (seconds: number) => {
    updateSettings.mutate({ app_lock_timeout: seconds });
  };

  const toggleCategory = (category: string) => {
    if (!settings) return;
    const current = settings.protected_categories || [];
    const updated = current.includes(category) 
      ? current.filter((c: string) => c !== category)
      : [...current, category];
    updateSettings.mutate({ protected_categories: updated });
  };

  const handleRevokeSession = (id: string) => {
    Alert.alert(
      'Revoke Session',
      'Are you sure you want to sign out this device? It will immediately lose access.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Revoke', style: 'destructive', onPress: () => revokeSession.mutate(id) }
      ]
    );
  };

  if (loadingSettings) {
    return (
      <Screen className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </Screen>
    );
  }

  const isBiometricActive = settings?.biometric_enabled ?? false;

  return (
    <Screen scrollable={true} className="pb-32 bg-surface">
      {/* Header */}
      <View className="w-full sticky top-0 z-50 bg-surface/90 flex-row items-center justify-between px-margin-mobile h-16 md:px-margin-desktop border-b border-outline-variant/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">Identity Security</Text>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6">
        <View className="mb-8">
          <Text className="font-headline-md text-3xl font-bold text-on-surface mb-2">Security Center</Text>
          <Text className="text-on-surface-variant font-body-md text-base max-w-2xl">
            Control how your identity is verified, how your sessions are managed, and what content is protected by biometrics.
          </Text>
        </View>

        {/* 1. Security Overview */}
        <View className="bg-primary/10 rounded-3xl p-6 mb-8 border border-primary/20">
          <View className="flex-row items-center gap-4 mb-4">
            <MaterialCommunityIcons 
              name={isBiometricActive ? "shield-check-outline" : "shield-alert-outline"} 
              size={32} 
              color={isBiometricActive ? colors.primary : colors.error} 
            />
            <View>
              <Text className="text-on-surface font-bold text-lg">
                {isBiometricActive ? 'High Security' : 'Basic Security'}
              </Text>
              <Text className="text-on-surface-variant text-sm">
                {isBiometricActive ? 'Your account is strongly protected.' : 'Enable biometrics to enhance security.'}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-4 mt-2">
            <View className="bg-surface-container-lowest/50 px-3 py-2 rounded-xl flex-1 border border-outline-variant/30">
              <Text className="text-xs text-on-surface-variant uppercase font-bold mb-1">Active Sessions</Text>
              <Text className="text-lg font-bold text-on-surface">{sessions?.length ?? 0}</Text>
            </View>
            <View className="bg-surface-container-lowest/50 px-3 py-2 rounded-xl flex-1 border border-outline-variant/30">
              <Text className="text-xs text-on-surface-variant uppercase font-bold mb-1">Protected Areas</Text>
              <Text className="text-lg font-bold text-on-surface">{settings?.protected_categories?.length ?? 0}</Text>
            </View>
          </View>
        </View>

        {/* 2. Biometric Authentication */}
        <Text className="font-title-md font-bold text-on-surface mb-4 uppercase tracking-widest text-xs">Biometric Authentication</Text>
        <View className="bg-surface-container-lowest rounded-3xl p-2 shadow-sm border border-outline-variant/30 mb-8">
          <View className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-4 flex-1">
              <View className={`p-3 rounded-xl ${isBiometricActive ? 'bg-primary/10' : 'bg-surface-variant'}`}>
                <MaterialCommunityIcons 
                  name={authType.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) ? "face-recognition" : "fingerprint"} 
                  size={24} 
                  color={isBiometricActive ? colors.primary : colors.outline} 
                />
              </View>
              <View className="flex-col pr-4 flex-1">
                <Text className="font-bold text-base text-on-surface">Require Biometrics</Text>
                <Text className="text-sm text-on-surface-variant">Use FaceID/TouchID to verify identity</Text>
              </View>
            </View>
            <Switch 
              value={isBiometricActive}
              onValueChange={handleToggleBiometrics}
              trackColor={{ false: colors['surface-variant'], true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>

          {isBiometricActive && (
            <View className="px-4 pb-4">
              <View className="h-[1px] w-full bg-outline-variant/30 mb-4" />
              
              <Text className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">App Lock Timeout</Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  { label: 'Immediate', value: 0 },
                  { label: '1 Min', value: 60 },
                  { label: '5 Mins', value: 300 },
                  { label: 'Never', value: -1 }
                ].map((option) => {
                  const isActive = settings?.app_lock_timeout === option.value;
                  return (
                    <TouchableOpacity 
                      key={option.value}
                      onPress={() => handleUpdateTimeout(option.value)}
                      className={`px-4 py-2 rounded-full border ${isActive ? 'bg-primary border-primary' : 'bg-transparent border-outline-variant'}`}
                    >
                      <Text className={isActive ? 'text-white font-bold' : 'text-on-surface'}>{option.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* 4. Sensitive Memory Protection */}
        <Text className="font-title-md font-bold text-on-surface mb-4 uppercase tracking-widest text-xs">Protected Content</Text>
        <View className="bg-surface-container-lowest rounded-3xl p-2 shadow-sm border border-outline-variant/30 mb-8">
          {[
            { id: 'voice', icon: 'microphone', label: 'Voice Memories' },
            { id: 'photos', icon: 'image', label: 'Photos & Documents' },
            { id: 'financial', icon: 'currency-usd', label: 'Financial Records' },
            { id: 'private_collections', icon: 'folder-lock', label: 'Private Collections' },
            { id: 'passwords', icon: 'key', label: 'Credentials & Keys' },
          ].map((item, index) => {
            const isProtected = settings?.protected_categories?.includes(item.id) ?? false;
            return (
              <View key={item.id}>
                {index > 0 && <View className="h-[1px] w-full bg-outline-variant/30 mx-4" />}
                <TouchableOpacity 
                  onPress={() => toggleCategory(item.id)}
                  className="p-4 flex-row items-center justify-between"
                  disabled={!isBiometricActive}
                  style={{ opacity: isBiometricActive ? 1 : 0.5 }}
                >
                  <View className="flex-row items-center gap-3">
                    <MaterialCommunityIcons name={item.icon as any} size={20} color={colors['on-surface-variant']} />
                    <Text className="font-bold text-on-surface">{item.label}</Text>
                  </View>
                  <Switch 
                    value={isProtected}
                    onValueChange={() => toggleCategory(item.id)}
                    disabled={!isBiometricActive}
                    trackColor={{ false: colors['surface-variant'], true: colors.primary }}
                    thumbColor="#ffffff"
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* 7. Authentication Behaviour */}
        <Text className="font-title-md font-bold text-on-surface mb-4 uppercase tracking-widest text-xs">Security Triggers</Text>
        <View className="bg-surface-container-lowest rounded-3xl p-2 shadow-sm border border-outline-variant/30 mb-8">
          {[
            { key: 'require_for_opening', label: 'Opening the App', desc: 'Require verification immediately upon launch' },
            { key: 'require_for_settings', label: 'Accessing Security Settings', desc: 'Prevent unauthorized settings changes' },
            { key: 'require_for_exports', label: 'Exporting Data', desc: 'Protect against data exfiltration' },
            { key: 'require_for_deleting', label: 'Deleting Memories', desc: 'Prevent destructive actions' },
          ].map((item, index) => {
            const isActive = settings ? (settings as any)[item.key] : false;
            return (
              <View key={item.key}>
                {index > 0 && <View className="h-[1px] w-full bg-outline-variant/30 mx-4" />}
                <View className="p-4 flex-row items-center justify-between">
                  <View className="flex-col flex-1 pr-4">
                    <Text className="font-bold text-on-surface">{item.label}</Text>
                    <Text className="text-xs text-on-surface-variant mt-1">{item.desc}</Text>
                  </View>
                  <Switch 
                    value={isActive}
                    onValueChange={(val) => updateSettings.mutate({ [item.key]: val })}
                    disabled={!isBiometricActive}
                    trackColor={{ false: colors['surface-variant'], true: colors.primary }}
                    thumbColor="#ffffff"
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* 11. Privacy Controls */}
        <Text className="font-title-md font-bold text-on-surface mb-4 uppercase tracking-widest text-xs">Privacy Enhancements</Text>
        <View className="bg-surface-container-lowest rounded-3xl p-2 shadow-sm border border-outline-variant/30 mb-8">
          <View className="p-4 flex-row items-center justify-between">
            <View className="flex-col flex-1 pr-4">
              <Text className="font-bold text-on-surface">Blur App Switcher</Text>
              <Text className="text-xs text-on-surface-variant mt-1">Hides memory content when switching apps</Text>
            </View>
            <Switch 
              value={settings?.hide_app_preview ?? true}
              onValueChange={(val) => updateSettings.mutate({ hide_app_preview: val })}
              trackColor={{ false: colors['surface-variant'], true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
          <View className="h-[1px] w-full bg-outline-variant/30 mx-4" />
          <View className="p-4 flex-row items-center justify-between">
            <View className="flex-col flex-1 pr-4">
              <Text className="font-bold text-on-surface">Hide Locked Content</Text>
              <Text className="text-xs text-on-surface-variant mt-1">Blurs protected memories until unlocked</Text>
            </View>
            <Switch 
              value={settings?.hide_memory_content ?? false}
              onValueChange={(val) => updateSettings.mutate({ hide_memory_content: val })}
              trackColor={{ false: colors['surface-variant'], true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* 5. Session Management */}
        <Text className="font-title-md font-bold text-on-surface mb-4 uppercase tracking-widest text-xs">Active Sessions</Text>
        <View className="mb-8">
          {loadingSessions ? (
            <ActivityIndicator />
          ) : (
            sessions?.map((session: any) => (
              <View key={session.id} className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="bg-surface-variant p-2 rounded-full">
                    <MaterialCommunityIcons 
                      name={session.platform === 'iOS' ? 'apple' : session.platform === 'Android' ? 'android' : 'monitor'} 
                      size={20} 
                      color={colors['on-surface']} 
                    />
                  </View>
                  <View>
                    <Text className="font-bold text-on-surface">{session.device_name || 'Unknown Device'}</Text>
                    <Text className="text-xs text-on-surface-variant">
                      Last active: {formatDistanceToNow(new Date(session.last_active_at))} ago
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={() => handleRevokeSession(session.id)}
                  className="px-3 py-1.5 bg-error/10 rounded-full border border-error/20"
                >
                  <Text className="text-error font-bold text-xs uppercase">Revoke</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* 9. Emergency Protection */}
        <Text className="font-title-md font-bold text-on-surface mb-4 uppercase tracking-widest text-xs">Emergency Protection</Text>
        <View className="bg-error/5 rounded-3xl p-6 shadow-sm border border-error/20 mb-8 items-center">
          <MaterialCommunityIcons name="alert-octagon-outline" size={40} color={colors.error} className="mb-3" />
          <Text className="font-bold text-error text-lg mb-1">Emergency Lockdown</Text>
          <Text className="text-on-surface-variant text-center text-sm mb-4">
            Instantly revoke all active sessions, clear local cache, and require full authentication on all devices.
          </Text>
          <TouchableOpacity 
            onPress={() => Alert.alert('Confirm Lockdown', 'Are you sure? You will be signed out immediately.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Execute Lockdown', style: 'destructive' }])}
            className="bg-error px-6 py-3 rounded-full flex-row items-center gap-2"
          >
            <MaterialIcons name="lock-outline" size={20} color="white" />
            <Text className="text-white font-bold uppercase tracking-wider text-sm">Execute Lockdown</Text>
          </TouchableOpacity>
        </View>

        {/* 10. Security History */}
        <Text className="font-title-md font-bold text-on-surface mb-4 uppercase tracking-widest text-xs">Recent Security Events</Text>
        <View className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-outline-variant/30 mb-8">
          {loadingLogs ? (
            <ActivityIndicator />
          ) : logs && logs.length > 0 ? (
            logs.slice(0, 5).map((log: any, idx: number) => (
              <View key={log.id}>
                {idx > 0 && <View className="h-[1px] w-full bg-outline-variant/30 my-3" />}
                <View className="flex-row items-start justify-between">
                  <View className="flex-row items-start gap-3 flex-1 pr-2">
                    <MaterialCommunityIcons 
                      name={log.event_type.includes('fail') ? 'close-circle-outline' : 'check-circle-outline'} 
                      size={16} 
                      color={log.event_type.includes('fail') ? colors.error : colors.primary} 
                      style={{ marginTop: 2 }}
                    />
                    <View>
                      <Text className="font-bold text-sm text-on-surface capitalize">{log.event_type.replace(/_/g, ' ')}</Text>
                      <Text className="text-xs text-on-surface-variant mt-0.5">{log.ip_address || 'Local Device'}</Text>
                    </View>
                  </View>
                  <Text className="text-[10px] text-on-surface-variant font-bold">{format(new Date(log.created_at), 'MMM d, h:mm a')}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-center text-on-surface-variant text-sm py-4">No recent security events.</Text>
          )}
        </View>

      </View>
    </Screen>
  );
}
