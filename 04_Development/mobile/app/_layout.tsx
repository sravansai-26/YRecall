import { useEffect } from 'react';
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import '../src/global.css';
import { AuthProvider } from '../src/shared/providers/AuthProvider';
import { useAuthStore } from '../src/shared/store/useAuthStore';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// Disable strict mode for Reanimated to silence warnings about reading/writing shared values during render
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

SplashScreen.preventAutoHideAsync();

function RootNavigationHandler() {
  const { user, isLoading, hasCompletedOnboarding } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const isRoot = (segments as string[]).length === 0;

    // Full fledged onboarding process:
    // 1. Splash Screen -> handled by Expo Splash Screen
    // 2. Onboarding Screens -> required before auth
    if (!hasCompletedOnboarding) {
      if (!inOnboardingGroup) {
        router.replace('/(onboarding)/intro-1');
      }
      return;
    }

    // 3. Authentication Screen
    if (!user) {
      if (!inAuthGroup) {
        router.replace('/(auth)');
      }
      return;
    }

    // 4. Homepage (Main App)
    if (inAuthGroup || inOnboardingGroup || isRoot) {
      router.replace('/(main)/(tabs)');
    }
  }, [user, isLoading, hasCompletedOnboarding, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

import { QueryProvider } from '../src/providers/QueryProvider';
import { setupApiInterceptors } from '../src/services/api/interceptors';
import { StatusBar } from 'expo-status-bar';

// Initialize API interceptors to attach Firebase tokens
setupApiInterceptors();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PublicSans_400Regular,
    PublicSans_500Medium,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <QueryProvider>
            <AuthProvider>
              <RootNavigationHandler />
            </AuthProvider>
          </QueryProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}