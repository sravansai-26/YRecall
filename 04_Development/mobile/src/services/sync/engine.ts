import { getString, setString } from '@/services/storage/mmkv';

import type { SyncEngine, SyncQueueItem } from './types';

const SYNC_QUEUE_KEY = 'sync_queue';

function readQueue(): SyncQueueItem[] {
  const raw = getString(SYNC_QUEUE_KEY);

  if (!raw) {
    return [];
  }

  return JSON.parse(raw) as SyncQueueItem[];
}

function writeQueue(queue: SyncQueueItem[]): void {
  setString(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

export const syncEngine: SyncEngine = {
  enqueue(item) {
    const queueItem: SyncQueueItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      createdAt: new Date().toISOString(),
    };

    writeQueue([...readQueue(), queueItem]);

    return queueItem;
  },

  async flush() {
    writeQueue([]);
  },
};
