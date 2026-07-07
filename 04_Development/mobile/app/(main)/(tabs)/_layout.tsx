import { Tabs, useRouter } from 'expo-router';
import { BottomNavBar } from '../../../src/shared/components';
import { BottomNavRoute } from '../../../src/shared/components/BottomNavBar';
import { View } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={({ state }) => {
          const routeName = state.routes[state.index].name;
          
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
                if (route === 'home') router.replace('/(main)/(tabs)');
                if (route === 'ask') router.replace('/(main)/(tabs)/ask');
                if (route === 'timeline') router.replace('/(main)/(tabs)/recall');
                if (route === 'profile') router.replace('/(main)/(tabs)/profile');
                if (route === 'search') router.replace('/(main)/(tabs)/search');
                if (route === 'settings') router.replace('/(main)/(tabs)/settings');
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
    </View>
  );
}
