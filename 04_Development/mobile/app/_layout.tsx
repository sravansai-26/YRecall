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

function RootNavigationHandler() {
  const { user, isLoading, hasCompletedOnboarding } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const isRoot = (segments as string[]).length === 0;

    const navigate = () => {
      if (!hasCompletedOnboarding) {
        if (!inOnboardingGroup) {
          router.replace('/(onboarding)/intro-1');
        }
        return;
      }

      if (!user) {
        if (!inAuthGroup) {
          router.replace('/(auth)');
        }
        return;
      }

      if (inAuthGroup || inOnboardingGroup || isRoot) {
        router.replace('/(main)/(tabs)');
      }
    };

    const timeoutId = setTimeout(navigate, 0);
    return () => clearTimeout(timeoutId);
  }, [user, isLoading, hasCompletedOnboarding, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

import { QueryProvider } from '../src/providers/QueryProvider';
import { setupApiInterceptors } from '../src/services/api/interceptors';
import { StatusBar } from 'expo-status-bar';

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