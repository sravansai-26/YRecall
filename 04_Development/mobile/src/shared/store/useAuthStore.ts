import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';

interface UserProfileDetails {
  occupation?: string;
  address?: string;
  socialLinks?: string;
}

interface AuthState {
  user: User | null;
  profileDetails: UserProfileDetails;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  setUser: (user: User | null) => void;
  setProfileDetails: (details: Partial<UserProfileDetails>) => void;
  setLoading: (loading: boolean) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profileDetails: {},
      isLoading: true,
      hasCompletedOnboarding: false,
      setUser: (user) => set({ user }),
      setProfileDetails: (details) => set((state) => ({ profileDetails: { ...state.profileDetails, ...details } })),
      setLoading: (loading) => set({ isLoading: loading }),
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
    }),
    {
      name: 'yrecall-auth-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        profileDetails: state.profileDetails
      }),
    }
  )
);
