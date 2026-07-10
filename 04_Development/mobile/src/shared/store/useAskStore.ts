import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AskState {
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
}

export const useAskStore = create<AskState>()(
  persist(
    (set) => ({
      activeConversationId: null,
      setActiveConversationId: (id) => set({ activeConversationId: id }),
    }),
    {
      name: 'ask-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
