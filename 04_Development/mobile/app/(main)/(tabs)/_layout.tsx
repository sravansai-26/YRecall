import { Tabs, useRouter } from 'expo-router';
import { BottomNavBar } from '../../../src/shared/components';
import { BottomNavRoute } from '../../../src/shared/components/BottomNavBar';
import { View, Keyboard, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { CaptureHub, CaptureHubRef } from '../../../src/modules/captures/components/CaptureHub';

export default function TabsLayout() {
  const router = useRouter();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const captureHubRef = useRef<CaptureHubRef>(null);

  useEffect(() => {
    // Android triggers 'Did' events, iOS triggers 'Will' events for smooth UI transitions
    const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const hideEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

    const showSubscription = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={({ state }) => {
          const routeName = state.routes[state.index]?.name || '';
          
          let activeRoute: BottomNavRoute = 'home';
          if (routeName.startsWith('ask')) activeRoute = 'ask';
          else if (routeName.startsWith('search')) activeRoute = 'search';
          else if (routeName.startsWith('recall')) activeRoute = 'timeline';
          else if (routeName.startsWith('profile')) activeRoute = 'profile';
          else if (routeName.startsWith('settings')) activeRoute = 'settings';
          
          return (
            <BottomNavBar
              activeRoute={activeRoute}
              onNavigate={(route) => {
                if (route === 'capture') {
                  captureHubRef.current?.present();
                  return;
                }
                if (route === 'home') router.navigate('/(main)/(tabs)');
                if (route === 'ask') router.navigate('/(main)/(tabs)/ask');
                if (route === 'timeline') router.navigate('/(main)/(tabs)/recall');
                if (route === 'profile') router.navigate('/(main)/(tabs)/profile');
                if (route === 'search') router.navigate('/(main)/(tabs)/search');
                if (route === 'settings') router.navigate('/(main)/(tabs)/settings');
              }}
            />
          );
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="recall" />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="ask" />
        <Tabs.Screen name="settings" />
        <Tabs.Screen name="profile" />
      </Tabs>
      
      <CaptureHub ref={captureHubRef} />
    </View>
  );
}