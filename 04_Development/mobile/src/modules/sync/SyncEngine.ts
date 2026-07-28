import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { performSyncAPI, SyncRequest, SyncEntity } from './api';
import * as Device from 'expo-device';

interface SyncState {
    lastSyncTimestamp: string | null;
    isSyncing: boolean;
    lastFailedSync: string | null;
    syncDurationMs: number;
    pendingQueueSize: number;
    setSyncing: (status: boolean) => void;
    setLastSync: (timestamp: string, duration: number) => void;
    setFailedSync: (timestamp: string) => void;
}

export const useSyncStore = create<SyncState>()(
    persist(
        (set) => ({
            lastSyncTimestamp: null,
            isSyncing: false,
            lastFailedSync: null,
            syncDurationMs: 0,
            pendingQueueSize: 0,
            setSyncing: (status) => set({ isSyncing: status }),
            setLastSync: (timestamp, duration) => set({ 
                lastSyncTimestamp: timestamp, 
                syncDurationMs: duration,
                isSyncing: false,
                lastFailedSync: null
            }),
            setFailedSync: (timestamp) => set({ 
                lastFailedSync: timestamp,
                isSyncing: false 
            })
        }),
        {
            name: 'sync-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

class SyncEngineClass {
    async sync(): Promise<{ success: boolean; error?: any }> {
        const store = useSyncStore.getState();
        if (store.isSyncing) return { success: false, error: 'Already syncing' };

        store.setSyncing(true);
        const startTime = Date.now();

        try {
            // In a full offline-first app, we'd query WatermelonDB/SQLite here for local changes.
            // For this phase, we gather minimal client changes.
            const localChanges: SyncEntity[] = []; 
            
            const request: SyncRequest = {
                last_sync_timestamp: store.lastSyncTimestamp,
                client_changes: localChanges,
                client_device_id: Device.osBuildId || 'unknown_device'
            };

            const response = await performSyncAPI(request);

            if (response.success) {
                // Apply server_changes to local database here
                
                const duration = Date.now() - startTime;
                useSyncStore.getState().setLastSync(response.server_timestamp, duration);
                return { success: true };
            } else {
                throw new Error(response.status || 'Sync failed');
            }
        } catch (error: any) {
            console.error('[SyncEngine] Error:', error);
            useSyncStore.getState().setFailedSync(new Date().toISOString());
            return { success: false, error };
        }
    }
}

export const SyncEngine = new SyncEngineClass();
