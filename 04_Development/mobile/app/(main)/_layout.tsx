import { Stack } from 'expo-router';
import { useSubscription, useUsage } from '../../src/modules/billing/api';

function GlobalHooks() {
  useSubscription();
  useUsage();
  return null;
}

export default function MainLayout() {
  return (
    <>
      <GlobalHooks />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
