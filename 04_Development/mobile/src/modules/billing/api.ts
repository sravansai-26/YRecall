import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';
import { useAuthStore } from '../../shared/store/useAuthStore';
import { useBillingStore } from './store';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  features: string[];
  is_active: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  provider?: string;
  canceled_at?: string;
  plan?: SubscriptionPlan;
}

export interface Usage {
  ai_requests_count: number;
  captures_count: number;
  storage_used_bytes: number;
  workspaces_count: number;
}

export const usePlans = () => {
  return useQuery({
    queryKey: ['billing-plans'],
    queryFn: async () => {
      const res = await apiClient.get('/billing/plans');
      return res.data as SubscriptionPlan[];
    },
  });
};

export const useSubscription = () => {
  const { user } = useAuthStore();
  const { setSubscription } = useBillingStore();
  
  return useQuery({
    queryKey: ['billing-subscription', user?.id],
    queryFn: async () => {
      const res = await apiClient.get('/billing/subscription');
      const data = res.data as Subscription;
      setSubscription(data);
      return data;
    },
    enabled: !!user,
  });
};

export const useUsage = () => {
  const { user } = useAuthStore();
  const { setUsage } = useBillingStore();
  
  return useQuery({
    queryKey: ['billing-usage', user?.id],
    queryFn: async () => {
      const res = await apiClient.get('/billing/usage');
      const data = res.data as Usage;
      setUsage(data);
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (data: { plan_id: string; billing_cycle: 'monthly' | 'yearly' }) => {
      const res = await apiClient.post('/billing/create-order', data);
      return res.data;
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: async (data: { 
      plan_id: string;
      razorpay_payment_id: string; 
      razorpay_order_id: string; 
      razorpay_signature: string;
    }) => {
      const res = await apiClient.post(`/billing/verify-payment?plan_id=${data.plan_id}`, {
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_order_id: data.razorpay_order_id,
        razorpay_signature: data.razorpay_signature
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-subscription', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['billing-usage', user?.id] });
    }
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/billing/cancel');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-subscription', user?.id] });
    }
  });
};

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export const useInvoices = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['billing-invoices', user?.id],
    queryFn: async () => {
      const res = await apiClient.get('/billing/invoices');
      return res.data as Invoice[];
    },
    enabled: !!user,
  });
};
