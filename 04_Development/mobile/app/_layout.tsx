import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import '../src/global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}