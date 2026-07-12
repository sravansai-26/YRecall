import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
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

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (plan.id === 'free') return;

    if (!RazorpayCheckout || !RazorpayCheckout.open) {
      Alert.alert(
        'Client Build Required',
        'Payment integration requires a custom dev client build. It will not work in standard Expo Go.'
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
        image: 'https://your-logo-url.com/logo.png',
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

      RazorpayCheckout.open(options)
        .then(async (data: any) => {
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
        })
        .catch((error: any) => {
          if (error?.code !== 0) {
            Alert.alert('Payment Failed', error?.description || 'Unknown error');
          }
        });
    } catch (error) {
      Alert.alert('Error', 'Could not initiate payment. Please try again later.');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription?',
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
      const fileUri = FileSystem.documentDirectory + `YRecall_Invoice_${invoiceId.slice(0, 8)}.pdf`;
      const token = await user?.getIdToken();

      const { uri } = await FileSystem.downloadAsync(url, fileUri, {
        headers: { Authorization: `Bearer ${token}` }
      });

      try {
        const Sharing = require('expo-sharing');
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Downloaded', `Invoice saved successfully to ${uri}`);
        }
      } catch (e) {
        Alert.alert('Downloaded', `Invoice saved successfully to ${uri}`);
      }
    } catch (error) {
      Alert.alert('Download Failed', 'There was an error downloading the invoice.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoadingPlans || isLoadingSub) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  const currentPlanName = subscription?.plan?.name || 'Free Plan';
  const status = subscription?.status || 'active';

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Billing & Subscription</Text>
        </View>

        <ScrollView style={styles.scrollContainer}>
          <View style={styles.currentPlanCard}>
            <Text style={styles.sectionLabel}>CURRENT PLAN</Text>
            <View style={styles.currentPlanRow}>
              <View>
                <Text style={styles.currentPlanName}>{currentPlanName}</Text>
                {subscription?.cancel_at_period_end ? (
                  <Text style={styles.statusError}>Cancels at period end</Text>
                ) : status !== 'active' ? (
                  <Text style={styles.statusError}>{status.toUpperCase()}</Text>
                ) : (
                  <Text style={styles.statusActive}>Active</Text>
                )}
              </View>
              {isPremium && status === 'active' && !subscription?.cancel_at_period_end && (
                <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel Plan</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.plansSection}>
            <Text style={styles.sectionLabel}>AVAILABLE PLANS</Text>

            <View style={styles.billingCycleToggle}>
              <TouchableOpacity
                onPress={() => setBillingCycle('monthly')}
                style={[styles.toggleButton, billingCycle === 'monthly' && styles.toggleButtonActive]}
              >
                <Text style={[styles.toggleText, billingCycle === 'monthly' && styles.toggleTextActive]}>Monthly</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setBillingCycle('yearly')}
                style={[styles.toggleButton, billingCycle === 'yearly' && styles.toggleButtonActivePrimary]}
              >
                <Text style={[styles.toggleText, billingCycle === 'yearly' && styles.toggleTextActiveWhite]}>Yearly (Save 20%)</Text>
              </TouchableOpacity>
            </View>

            {plans?.map((plan) => {
              if (plan.id === 'free') return null;

              const isCurrentPlan = subscription?.plan_id === plan.id && status === 'active';
              const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
              const perMonthText = billingCycle === 'yearly' ? `₹${(price / 12).toFixed(0)}/mo billed annually` : `₹${price}/mo`;

              return (
                <View key={plan.id} style={[styles.planCard, isCurrentPlan && styles.planCardCurrent]}>
                  <View style={styles.planHeader}>
                    <Text style={styles.planTitle}>{plan.name}</Text>
                    {plan.id === 'pro' && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>BEST VALUE</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.planDescription}>{plan.description}</Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceAmount}>₹{price}</Text>
                    <Text style={styles.pricePeriod}>{billingCycle === 'monthly' ? '/mo' : '/yr'}</Text>
                  </View>

                  <Text style={styles.perMonthText}>{perMonthText}</Text>

                  <View style={styles.featuresList}>
                    {plan.features?.map((feature, idx) => (
                      <View key={idx} style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                        <Text style={styles.featureText}>{feature.replace(/_/g, ' ')}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    disabled={isCurrentPlan || createOrder.isPending}
                    onPress={() => handleSubscribe(plan)}
                    style={[styles.subscribeButton, isCurrentPlan && styles.subscribeButtonDisabled]}
                  >
                    {createOrder.isPending ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={[styles.subscribeButtonText, isCurrentPlan && styles.subscribeButtonTextDisabled]}>
                        {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          <View style={styles.invoicesSection}>
            <Text style={styles.sectionLabel}>PURCHASE HISTORY</Text>
            <View style={styles.invoicesCard}>
              {isLoadingInvoices ? (
                <View style={styles.invoicesEmpty}>
                  <ActivityIndicator color={colors.primary} />
                </View>
              ) : !invoices || invoices.length === 0 ? (
                <View style={styles.invoicesEmpty}>
                  <MaterialIcons name="receipt-long" size={32} color={colors.outline} style={{ marginBottom: 8 }} />
                  <Text style={styles.invoicesEmptyText}>No invoices available</Text>
                </View>
              ) : (
                invoices.map((inv, index) => (
                  <View key={inv.id}>
                    <View style={styles.invoiceRow}>
                      <View>
                        <Text style={styles.invoiceAmount}>₹{inv.amount} ({inv.currency})</Text>
                        <Text style={styles.invoiceDate}>
                          {format(new Date(inv.created_at), 'MMM dd, yyyy')} • {inv.status}
                        </Text>
                      </View>
                      <TouchableOpacity
                        disabled={downloadingId === inv.id}
                        onPress={() => downloadInvoice(inv.id)}
                        style={styles.downloadButton}
                      >
                        {downloadingId === inv.id ? (
                          <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                          <MaterialIcons name="download" size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    </View>
                    {index < invoices.length - 1 && <View style={styles.divider} />}
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 64,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 8
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.outline,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4
  },
  currentPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }
  },
  currentPlanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  currentPlanName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4
  },
  statusError: {
    fontSize: 14,
    color: colors.error
  },
  statusActive: {
    fontSize: 14,
    color: colors.secondary
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151'
  },
  plansSection: {
    marginBottom: 32
  },
  billingCycleToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 30,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 26
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }
  },
  toggleButtonActivePrimary: {
    backgroundColor: colors.primary,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280'
  },
  toggleTextActive: {
    fontWeight: 'bold',
    color: colors.primary
  },
  toggleTextActiveWhite: {
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }
  },
  planCardCurrent: {
    borderColor: colors.primary,
    borderWidth: 2
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)'
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4
  },
  priceAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primary
  },
  pricePeriod: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
    marginBottom: 6
  },
  perMonthText: {
    fontSize: 12,
    color: colors.secondary,
    marginBottom: 24
  },
  featuresList: {
    marginBottom: 24,
    gap: 12
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center'
  },
  subscribeButtonDisabled: {
    backgroundColor: '#F3F4F6'
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  subscribeButtonTextDisabled: {
    color: '#6B7280'
  },
  invoicesSection: {
    marginBottom: 40
  },
  invoicesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }
  },
  invoicesEmpty: {
    paddingVertical: 32,
    alignItems: 'center'
  },
  invoicesEmptyText: {
    fontSize: 14,
    color: '#6B7280'
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  invoiceAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2
  },
  invoiceDate: {
    fontSize: 12,
    color: '#6B7280'
  },
  downloadButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 8,
    borderRadius: 20
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 16
  }
});