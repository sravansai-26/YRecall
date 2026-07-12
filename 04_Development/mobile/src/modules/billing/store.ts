import { create } from 'zustand';
import { Subscription, Usage } from './api';

interface BillingState {
  subscription: Subscription | null;
  usage: Usage | null;
  setSubscription: (subscription: Subscription) => void;
  setUsage: (usage: Usage) => void;
  clearBilling: () => void;
}

export const useBillingStore = create<BillingState>((set) => ({
  subscription: null,
  usage: null,
  setSubscription: (subscription) => set({ subscription }),
  setUsage: (usage) => set({ usage }),
  clearBilling: () => set({ subscription: null, usage: null }),
}));

// Feature entitlements helper
export const FREE_LIMITS = {
  ai_requests_monthly: 100,
  workspaces_count: 1,
  storage_bytes: 100 * 1024 * 1024,
  captures_monthly: 50,
};

export const PLAN_FEATURES: Record<string, string[]> = {
  free: ['CREATE_WORKSPACE'],
  premium: [
    'UNLIMITED_AI',
    'ADVANCED_GRAPH',
    'AUTOMATIONS',
    'ADVANCED_SEARCH',
    'VOICE_TRANSCRIPTION',
    'PDF_ANALYSIS',
    'CREATE_WORKSPACE',
  ],
  pro: [
    'UNLIMITED_AI',
    'ADVANCED_GRAPH',
    'TEAMS',
    'AUTOMATIONS',
    'PRO_REFLECTIONS',
    'EXPORT_DATA',
    'PRIORITY_AI',
    'ADVANCED_SEARCH',
    'VOICE_TRANSCRIPTION',
    'PDF_ANALYSIS',
    'CREATE_WORKSPACE',
  ],
};

export const useEntitlements = () => {
  const subscription = useBillingStore(state => state.subscription);
  const planId = subscription?.status === 'active' ? (subscription.plan_id || 'free') : 'free';
  
  const hasEntitlement = (feature: string) => {
    const allowed = PLAN_FEATURES[planId] || PLAN_FEATURES['free'];
    return allowed.includes(feature);
  };
  
  return {
    planId,
    hasEntitlement,
    isPremium: planId === 'premium' || planId === 'pro',
    isPro: planId === 'pro',
  };
};
