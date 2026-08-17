import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'central',
};

export default function TeamsLayout() {
 return (
 <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
 );
}
