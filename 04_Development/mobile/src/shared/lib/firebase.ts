import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
// @ts-ignore - The react-native subpath was removed in recent versions. We pull it directly from firebase/auth.
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// REPLACE THESE WITH YOUR ACTUAL FIREBASE CONFIG KEYS
const firebaseConfig = {
  apiKey: "AIzaSyCq0tfVV9JtwBDKg6EN4HgZRMoEGblEXyY",
  authDomain: "yrecall-c35ed.firebaseapp.com",
  projectId: "yrecall-c35ed",
  storageBucket: "yrecall-c35ed.firebasestorage.app",
  messagingSenderId: "55044011139",
  appId: "1:55044011139:web:0cd8b93d665e71e77297b6",
  measurementId: "G-Q30ZCDJ6Y4"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth };
