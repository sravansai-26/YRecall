import { useEffect, useState } from 'react';
import { View, Keyboard, BackHandler, ToastAndroid } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
 useFonts,
 PublicSans_400Regular,
 PublicSans_500Medium,
 PublicSans_600SemiBold,
 PublicSans_700Bold,
} from '@expo-google-fonts/public-sans';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import '../src/global.css';

import { cssInterop } from 'nativewind';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

cssInterop(MaterialIcons, {
 className: { target: 'style' },
});
cssInterop(Ionicons, {
 className: { target: 'style' },
});
cssInterop(SafeAreaView, {
 className: { target: 'style' },
});
import { AuthProvider } from '../src/shared/providers/AuthProvider';
import { useAuthStore } from '../src/shared/store/useAuthStore';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

configureReanimatedLogger({
 level: ReanimatedLogLevel.warn,
 strict: false,
});

SplashScreen.preventAutoHideAsync();

import { usePushNotifications } from '../src/shared/hooks/usePushNotifications';

import { QueryProvider } from '../src/providers/QueryProvider';
import { setupApiInterceptors } from '../src/services/api/interceptors';
import { StatusBar } from 'expo-status-bar';
import { ExperienceProvider } from '../src/shared/providers/ExperienceProvider';

setupApiInterceptors();

function useAuthRouting() {
  const { user, isLoading, hasCompletedOnboarding } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const isRoot = (segments.length as number) === 0;

    const navigate = () => {
      if (!hasCompletedOnboarding) {
        if (!inOnboardingGroup) {
          router.replace('/(onboarding)/splash');
        }
        return;
      }

      if (!user) {
        if (!inAuthGroup) {
          router.replace('/(auth)');
        }
        return;
      }

      if (user) {
        const isPasswordProvider = user.providerData?.some(p => p.providerId === 'password');
        if (isPasswordProvider && !user.emailVerified) {
          if (segments.join('/') !== '(auth)/verify-email') {
             router.replace(`/(auth)/verify-email?email=${encodeURIComponent(user.email || '')}`);
          }
          return;
        }
      }

      if (inAuthGroup || inOnboardingGroup || isRoot) {
        router.replace('/(main)/(tabs)');
      }
    };

    const timeoutId = setTimeout(navigate, 0);
    return () => clearTimeout(timeoutId);
  }, [user, isLoading, hasCompletedOnboarding, segments]);
}

export const unstable_settings = {
  // Ensure that reloading on `/` keeps a back button present.
  initialRouteName: '(main)',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PublicSans_400Regular,
    PublicSans_500Medium,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
    Pacifico_400Regular,
  });

  usePushNotifications();
  useAuthRouting();

  const { isLoading } = useAuthStore();

  useEffect(() => {
    if ((loaded || error) && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, isLoading]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryProvider>
      <AuthProvider>
        <ExperienceProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <SafeAreaProvider>
                <Stack screenOptions={{ headerShown: false }} />
                <StatusBar style="dark" />
              </SafeAreaProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ExperienceProvider>
      </AuthProvider>
    </QueryProvider>
  );
}