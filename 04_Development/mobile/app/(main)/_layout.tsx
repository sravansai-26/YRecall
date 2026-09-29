import { Stack } from 'expo-router';
import { useSubscription, useUsage } from '../../src/modules/billing/api';
import { BiometricGate } from '../../src/shared/components';

function GlobalHooks() {
 useSubscription();
 useUsage();
 return null;
}

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function MainLayout() {
  return (
    <BiometricGate>
      <GlobalHooks />
      <Stack screenOptions={{ headerShown: false }} />
    </BiometricGate>
  );
}
