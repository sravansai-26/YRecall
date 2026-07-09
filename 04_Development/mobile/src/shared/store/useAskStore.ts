import { create } from 'zustand';

interface AskState {
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
}

export const useAskStore = create<AskState>((set) => ({
  activeConversationId: null,
  setActiveConversationId: (id) => set({ activeConversationId: id }),
}));
