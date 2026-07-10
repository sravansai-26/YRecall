import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { capturesApi } from '../services/api';

export interface QueuedCapture {
  id: string;
  type: 'note' | 'media' | 'voice';
  payload: any;
  timestamp: number;
  status: 'pending' | 'uploading' | 'failed';
  error?: string;
}

interface CaptureQueueState {
  queue: QueuedCapture[];
  addToQueue: (capture: QueuedCapture) => void;
  removeFromQueue: (id: string) => void;
  updateStatus: (id: string, status: QueuedCapture['status'], error?: string) => void;
  processQueue: () => Promise<void>;
}

export const useCaptureQueue = create<CaptureQueueState>()(
  persist(
    (set, get) => ({
      queue: [],
      addToQueue: (capture) => set((state) => ({ queue: [...state.queue, capture] })),
      removeFromQueue: (id) => set((state) => ({ queue: state.queue.filter((c) => c.id !== id) })),
      updateStatus: (id, status, error) => set((state) => ({
        queue: state.queue.map((c) => c.id === id ? { ...c, status, error } : c)
      })),
      processQueue: async () => {
        const { queue, updateStatus, removeFromQueue } = get();
        const pendingItems = queue.filter(item => item.status === 'pending' || item.status === 'failed');
        
        for (const item of pendingItems) {
          updateStatus(item.id, 'uploading');
          try {
            if (item.type === 'note') {
              await capturesApi.createNote(item.payload);
            } else if (item.type === 'media' || item.type === 'voice') {
              await capturesApi.createMedia(item.payload);
            }
            removeFromQueue(item.id);
          } catch (e: any) {
            console.error(`Failed to process queued capture ${item.id}`, e);
            updateStatus(item.id, 'failed', e.message || 'Network Error');
          }
        }
      }
    }),
    {
      name: 'capture-queue-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
