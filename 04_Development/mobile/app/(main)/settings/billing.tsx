import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import RazorpayCheckout from 'react-native-razorpay';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';
import { 
  usePlans, 
  useSubscription, 
  useCreateOrder, 
  useVerifyPayment, 
  useCancelSubscription,
  useInvoices,
  SubscriptionPlan
} from '../../../src/modules/billing/api';
import { useEntitlements } from '../../../src/modules/billing/store';

export default function BillingScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: plans, isLoading: isLoadingPlans } = usePlans();
  const { data: subscription, isLoading: isLoadingSub } = useSubscription();
  const { data: invoices, isLoading: isLoadingInvoices } = useInvoices();
  
  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();
  const cancelSubscription = useCancelSubscription();
  
  const { isPremium } = useEntitlements();

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (plan.id === 'free') return; 
    
    if (!RazorpayCheckout || !RazorpayCheckout.open) {
      Alert.alert(
        "Client Build Required", 
        "Payment integration requires a custom dev client build (expo run:android/ios). It will not work in standard Expo Go."
      );
      return;
    }

    try {
      const order = await createOrder.mutateAsync({ 
        plan_id: plan.id, 
        billing_cycle: billingCycle 
      });

      const options = {
        description: `Upgrade to ${plan.name}`,
        image: 'https://your-logo-url.com/logo.png', // Fallback logo
        currency: order.currency,
        key: order.key_id,
        amount: order.amount,
        name: 'YRecall AI Life OS',
        order_id: order.order_id,
        prefill: {
          email: user?.email || '',
          contact: '',
          name: user?.displayName || ''
        },
        theme: { color: colors.primary }
      };

      RazorpayCheckout.open(options).then(async (data: any) => {
        try {
          await verifyPayment.mutateAsync({
            plan_id: plan.id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_order_id: data.razorpay_order_id,
            razorpay_signature: data.razorpay_signature
          });
          Alert.alert('Success', `You are now on the ${plan.name} plan!`);
        } catch (error) {
          Alert.alert('Error', 'Payment verification failed on our servers.');
        }
      }).catch((error: any) => {
        if (error.code !== 0) {
            Alert.alert('Payment Failed', error.description || 'Unknown error');
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Could not initiate payment. Please try again later.');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing cycle.',
      [
        { text: 'No, Keep it', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelSubscription.mutateAsync();
              Alert.alert('Cancelled', 'Your subscription has been cancelled.');
            } catch (err) {
              Alert.alert('Error', 'Could not cancel subscription.');
            }
          }
        }
      ]
    );
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      setDownloadingId(invoiceId);
      const url = `${process.env.EXPO_PUBLIC_API_URL}/billing/invoices/${invoiceId}/download`;
      
      const fileUri = FileSystem.documentDirectory + `YRecall_Invoice_${invoiceId.slice(0,8)}.pdf`;
      
      // Need Firebase token to authenticate download request
      const token = await user?.getIdToken();
      
      const { uri } = await FileSystem.downloadAsync(url, fileUri, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      try {
        const Sharing = require('expo-sharing');
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert("Downloaded", `Invoice saved successfully to ${uri}`);
        }
      } catch (e) {
        // Native module missing or sharing failed
        Alert.alert("Downloaded", `Invoice saved successfully to ${uri}`);
      }
    } catch (error) {
      Alert.alert("Download Failed", "There was an error downloading the invoice. Please check your connection.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoadingPlans || isLoadingSub) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center bg-surface">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  const currentPlanName = subscription?.plan?.name || 'Free Plan';
  const status = subscription?.status || 'active';
  
  return (
    <Screen>
      <View className="flex-1 bg-surface">
        {/* Header */}
        <View className="w-full sticky top-0 z-40 bg-surface flex-row items-center px-4 h-16 border-b border-outline-variant/10">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-sm text-xl text-primary font-bold ml-2">Billing & Subscription</Text>
        </View>

        <ScrollView className="flex-1 px-margin-mobile md:px-margin-desktop mt-4">
          
          {/* Current Plan Section */}
          <View className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/20 mb-8">
            <Text className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-2">Current Plan</Text>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-headline-md text-3xl font-bold text-primary mb-1">{currentPlanName}</Text>
                {subscription?.cancel_at_period_end ? (
                  <Text className="font-body-sm text-sm text-error">Cancels at period end</Text>
                ) : status !== 'active' ? (
                  <Text className="font-body-sm text-sm text-error capitalize">{status}</Text>
                ) : (
                  <Text className="font-body-sm text-sm text-secondary">Active</Text>
                )}
              </View>
              {isPremium && status === 'active' && !subscription?.cancel_at_period_end && (
                <TouchableOpacity 
                  onPress={handleCancel}
                  className="bg-surface-container px-4 py-2 rounded-full border border-outline-variant/20"
                >
                  <Text className="font-label-md text-sm text-on-surface font-medium">Cancel Plan</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Upgrade Section */}
          <View className="mb-8">
            <Text className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-4 ml-2">Available Plans</Text>
            
            <View className="flex-row bg-surface-container rounded-full p-1 mb-6 border border-outline-variant/20 mx-1">
              <TouchableOpacity 
                onPress={() => setBillingCycle('monthly')}
                className={`flex-1 py-2.5 items-center rounded-full ${billingCycle === 'monthly' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text className={`font-label-md text-sm ${billingCycle === 'monthly' ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'}`}>Monthly</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setBillingCycle('yearly')}
                className={`flex-1 py-2.5 items-center rounded-full ${billingCycle === 'yearly' ? 'bg-primary shadow-sm' : ''}`}
              >
                <Text className={`font-label-md text-sm ${billingCycle === 'yearly' ? 'text-white font-bold' : 'text-on-surface-variant font-medium'}`}>Yearly (Save 20%)</Text>
              </TouchableOpacity>
            </View>

            {plans?.map((plan) => {
              if (plan.id === 'free') return null;
              
              const isCurrentPlan = subscription?.plan_id === plan.id && status === 'active';
              const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
              const perMonthText = billingCycle === 'yearly' ? `₹${(price/12).toFixed(0)}/mo billed annually` : `₹${price}/mo`;
              
              return (
                <View 
                  key={plan.id} 
                  className={`bg-surface-container-lowest rounded-3xl p-6 mb-4 border shadow-sm mx-1 ${isCurrentPlan ? 'border-primary' : 'border-outline-variant/20'}`}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="font-headline-sm text-2xl font-bold text-primary">{plan.name}</Text>
                    {plan.id === 'pro' && (
                      <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                         <Text className="font-label-xs text-primary text-[10px] font-bold uppercase">Best Value</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text className="font-body-sm text-sm text-on-surface-variant mb-6">{plan.description}</Text>
                  
                  <View className="flex-row items-end mb-6">
                    <Text className="font-headline-lg text-4xl font-black text-primary">₹{price}</Text>
                    <Text className="font-body-md text-base text-on-surface-variant ml-1 mb-1">{billingCycle === 'monthly' ? '/mo' : '/yr'}</Text>
                  </View>
                  
                  <Text className="font-body-xs text-xs text-secondary mb-6 -mt-4">{perMonthText}</Text>
                  
                  <View className="mb-6 space-y-3">
                    {plan.features?.map((feature, idx) => (
                      <View key={idx} className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                        <Text className="font-body-md text-sm text-on-surface ml-3">{feature.replace(/_/g, ' ')}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <TouchableOpacity
                    disabled={isCurrentPlan || createOrder.isPending}
                    onPress={() => handleSubscribe(plan)}
                    className={`py-4 rounded-2xl items-center shadow-sm ${
                      isCurrentPlan 
                        ? 'bg-surface-container' 
                        : 'bg-primary'
                    }`}
                  >
                    {createOrder.isPending ? (
                       <ActivityIndicator color="white" />
                    ) : (
                       <Text className={`font-label-lg text-base font-bold ${isCurrentPlan ? 'text-on-surface-variant' : 'text-white'}`}>
                         {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                       </Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* Purchase History & Invoices */}
          <View className="mb-10 mx-1">
            <Text className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-4 ml-1">Purchase History & Invoices</Text>
            <View className="bg-surface-container-lowest rounded-3xl p-2 shadow-sm border border-outline-variant/20">
              
              {isLoadingInvoices ? (
                <View className="py-6 items-center">
                   <ActivityIndicator color={colors.primary} />
                </View>
              ) : !invoices || invoices.length === 0 ? (
                <View className="py-8 items-center">
                  <MaterialIcons name="receipt-long" size={32} color={colors.outline} className="mb-2" />
                  <Text className="font-body-sm text-sm text-on-surface-variant">No invoices available</Text>
                </View>
              ) : (
                invoices.map((inv, index) => (
                  <View key={inv.id}>
                    <View className="flex-row items-center justify-between p-4">
                      <View className="flex-col">
                        <Text className="font-label-md text-sm font-bold text-on-surface mb-0.5">₹{inv.amount} ({inv.currency})</Text>
                        <Text className="font-body-xs text-xs text-on-surface-variant">
                          {format(new Date(inv.created_at), 'MMM dd, yyyy')} • <Text className="capitalize">{inv.status}</Text>
                        </Text>
                      </View>
                      
                      <TouchableOpacity 
                        disabled={downloadingId === inv.id}
                        onPress={() => downloadInvoice(inv.id)} 
                        className="bg-primary/10 p-2 rounded-full"
                      >
                        {downloadingId === inv.id ? (
                          <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                          <MaterialIcons name="download" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    </View>
                    {index < invoices.length - 1 && <View className="h-[1px] bg-outline-variant/20 mx-4" />}
                  </View>
                ))
              )}

            </View>
          </View>

        </ScrollView>
      </View>
    </Screen>
  );
}
