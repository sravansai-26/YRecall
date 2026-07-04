import { getDefaultMmkvStorage } from '@/lib/mmkv';

const storage = getDefaultMmkvStorage();

export function getString(key: string): string | undefined {
  return storage.getString(key);
}

export function setString(key: string, value: string): void {
  storage.set(key, value);
}

export function getBoolean(key: string): boolean | undefined {
  return storage.getBoolean(key);
}

export function setBoolean(key: string, value: boolean): void {
  storage.set(key, value);
}

export function removeItem(key: string): void {
  storage.remove(key);
}

export function clearAll(): void {
  storage.clearAll();
}

export function contains(key: string): boolean {
  return storage.contains(key);
}
