import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { apiClient } from '../../services/api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const { user } = useAuthStore();
  const router = useRouter();
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();
  
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (lastNotificationResponse && lastNotificationResponse.notification.request.content.data) {
      const data = lastNotificationResponse.notification.request.content.data;
      handleNotificationRouting(data);
    }
  }, [lastNotificationResponse]);

  const handleNotificationRouting = (data: any) => {
    if (!data) return;
    if (data.action_type === 'open_capture' && data.related_capture_id) {
      router.push(`/(main)/memory/${data.related_capture_id}`);
    } else if (data.action_type === 'open_graph') {
      router.push(`/(main)/(tabs)/knowledge-graph`);
    } else if (data.type === 'reminder' || data.type === 'insight') {
      router.push(`/(main)/inbox`);
    }
  };

  useEffect(() => {
    if (!user) return;

    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        apiClient.put('/notifications/fcm-token', { fcm_token: token }).catch(err => console.log('Failed to save FCM token:', err));
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // In-app notification received
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      handleNotificationRouting(response.notification.request.content.data);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [user]);

  return { expoPushToken };
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    // Using default expo project ID. If you have your own google-services.json for FCM, use getDevicePushTokenAsync()
    token = (await Notifications.getDevicePushTokenAsync()).data;
    console.log("Device Push Token: ", token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}
