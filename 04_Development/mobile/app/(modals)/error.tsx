import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';

export default function ConnectionError() {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      setShowToast(true);
    }, 1500);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <Screen className="bg-background">
      <View className="flex-1 items-center justify-center px-margin-mobile md:px-margin-desktop py-12 relative w-full max-w-4xl mx-auto">

        {/* Hero Illustration Area */}
        <View className="mb-8 items-center justify-center animate-pulse">
          <View className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-surface-container-low border-4 border-white/50 relative overflow-hidden items-center justify-center shadow-md">
            <MaterialIcons name="cloud-off" size={120} color={colors.primary} className="opacity-40" />
            {/* Inner glow effect mock */}
            <View className="absolute inset-0 rounded-full border-2 border-secondary/20" />
          </View>
        </View>

        {/* Error Messaging */}
        <View className="mb-12 items-center flex-col">
          <Text className="font-display-lg text-4xl md:text-5xl font-bold text-primary mb-4 text-center">Moments of Stillness</Text>
          <Text className="font-body-md text-base text-on-surface-variant max-w-xl text-center leading-relaxed">
            YRecall is currently having trouble reaching the cloud. While we re-establish a secure connection, your local intelligence layer is still active.
          </Text>
        </View>

        {/* Bento-style Feature Grid */}
        <View className="w-full flex-col md:flex-row gap-4 mb-12">

          {/* Local Search Card */}
          <View className="flex-1 bg-white/70 p-6 rounded-[24px] shadow-sm border border-white flex-col items-start">
            <View className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center mb-4">
              <MaterialIcons name="database" size={24} color={colors['on-secondary-container']} />
            </View>
            <Text className="font-title-sm text-xl font-bold text-primary mb-2">Local Memory</Text>
            <Text className="font-body-md text-base text-on-surface-variant leading-relaxed">
              Search your last 30 days of captures directly from your device's cache.
            </Text>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="mt-4 flex-row items-center gap-1 ">
              <Text className="text-secondary font-bold text-base">Open Local Search</Text>
              <MaterialIcons name="arrow-forward" size={18} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Capture Card */}
          <View className="flex-1 bg-white/70 p-6 rounded-[24px] shadow-sm border border-white flex-col items-start">
            <View className="w-12 h-12 bg-tertiary-fixed rounded-xl flex items-center justify-center mb-4">
              <MaterialIcons name="edit-note" size={28} color={colors['on-tertiary-fixed-variant']} />
            </View>
            <Text className="font-title-sm text-xl font-bold text-primary mb-2">Instant Capture</Text>
            <Text className="font-body-md text-base text-on-surface-variant leading-relaxed">
              Keep recording your thoughts. We'll sync them automatically once you're back online.
            </Text>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="mt-4 flex-row items-center gap-1 ">
              <Text className="text-secondary font-bold text-base">Start Note</Text>
              <MaterialIcons name="add" size={20} color={colors.secondary} />
            </TouchableOpacity>
          </View>

        </View>

        {/* Primary Action */}
        <View className="flex-col items-center gap-4 w-full">
          <TouchableOpacity
            onPress={handleRetry}
            disabled={isRetrying}
            className="w-full md:w-auto px-8 h-14 bg-primary rounded-2xl flex-row items-center justify-center gap-2  shadow-md"
          >
            {isRetrying ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <MaterialIcons name="refresh" size={20} color="#ffffff" />
            )}
            <Text className="text-white font-bold text-base">{isRetrying ? 'Checking...' : 'Retry Connection'}</Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-error" />
            <Text className="font-caption-sm text-xs text-outline">Offline Mode Active</Text>
          </View>
        </View>

      </View>

      {/* Toast Overlay */}
      {showToast && (
        <View className="absolute bottom-12 self-center bg-white/90 px-6 py-4 rounded-full shadow-lg border border-outline-variant/30 flex-row items-center gap-2">
          <MaterialIcons name="info" size={20} color={colors.secondary} />
          <Text className="font-body-md text-primary text-base font-medium">Sync will resume automatically.</Text>
        </View>
      )}
    </Screen>
  );
}
