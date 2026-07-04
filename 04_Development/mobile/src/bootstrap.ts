import { setupApiInterceptors } from '@/services/api';

let isBootstrapped = false;

export function bootstrapApp(): void {
  if (isBootstrapped) {
    return;
  }

  setupApiInterceptors();
  isBootstrapped = true;
}
