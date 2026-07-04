import { createMMKV, type MMKV } from 'react-native-mmkv';

let mmkvInstance: MMKV | null = null;

export function createMmkvStorage(id: string, encryptionKey?: string): MMKV {
  return createMMKV({
    id,
    ...(encryptionKey ? { encryptionKey } : {}),
  });
}

export function getDefaultMmkvStorage(): MMKV {
  if (!mmkvInstance) {
    mmkvInstance = createMmkvStorage('yrecall-default');
  }

  return mmkvInstance;
}

export function resetDefaultMmkvStorage(): void {
  mmkvInstance = null;
}
