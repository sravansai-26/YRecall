import { create } from 'zustand';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

// Since expo-audio hook creates a player per component, we'll track the active player ID
// so other players know to stop.

interface AudioStore {
  activePlayerUrl: string | null;
  setActivePlayerUrl: (url: string | null) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  activePlayerUrl: null,
  setActivePlayerUrl: (url) => set({ activePlayerUrl: url }),
}));
