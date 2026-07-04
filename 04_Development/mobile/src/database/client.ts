import { getDefaultMmkvStorage } from '@/lib/mmkv';

import type { DatabaseAdapter } from './types';

const storage = getDefaultMmkvStorage();

export const database: DatabaseAdapter = {
  get(key) {
    return storage.getString(key);
  },

  set(key, value) {
    storage.set(key, value);
  },

  remove(key) {
    storage.remove(key);
  },

  clear() {
    storage.clearAll();
  },

  getAllKeys() {
    return storage.getAllKeys();
  },
};
