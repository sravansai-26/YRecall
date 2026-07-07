import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, AIBentoCard } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';

export default function ExpenseEntity() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      {/* Top App Bar */}
      <View className="fixed top-0 w-full z-50 bg-surface h-16 flex-row justify-between items-center px-margin-mobile">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            className="p-2 rounded-full "
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-[32px] text-primary tracking-tight font-bold">Expense Detail</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full ">
            <MaterialIcons name="share" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
          <View className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaDcfi1s7yEbCNV2BTdYj6NuLd2N07-lJbir-SlOp9jcuQKkXBY_TN8uqL8-1WRGFKBgdmvv6Bz1RjFNG6mF61doqZpsJOZuKMXcAYK8I9ERKNl0cZVTQu3nzOhTzlw4896jepV46pK1fPgoNpR7RkVpnDdiFytRvz6toh1fSyvf9jFlM5Gsv1RnE8IR5Y5hGrkVpNSBII4J5pUuOazKulwtpPzi2dstMOtjpckD5n7H8qH28jQiCDzfTBk7o8mqPEMzjavIuBnK8' }} className="w-full h-full" />
          </View>
          </View>
        </View>

      <View className="px-margin-mobile pt-4 pb-32 flex-col gap-lg">
        {/* Transaction Header */}
        <View className="bg-surface-container-lowest rounded-[24px] p-lg shadow-sm border border-surface-container flex-col gap-4">
          <View className="flex-row justify-between items-start">
            <View>
              <View className="flex-row items-center px-3 py-1 bg-secondary-container rounded-full self-start mb-2">
                <MaterialIcons name="restaurant" size={14} color={colors['on-secondary-container']} />
                <Text className="ml-1 text-on-secondary-container text-label-xs font-bold uppercase">Dining</Text>
              </View>
              <Text className="font-headline-md text-[32px] text-primary font-bold">Dinner at The Glass House</Text>
              <Text className="text-body-md text-on-surface-variant mt-1">Thursday, Oct 24 • 8:42 PM</Text>
            </View>
            <View className="items-end">
              <Text className="font-display-lg-mobile text-[36px] font-bold text-primary">$142.50</Text>
              <View className="flex-row items-center mt-1">
                <MaterialIcons name="verified" size={14} color={colors['on-surface-variant']} />
                <Text className="ml-1 text-caption-sm text-on-surface-variant">Transaction Confirmed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* AI Insights Bento Grid */}
        <View className="flex-col gap-lg">
          <AIBentoCard title="AI Recall Insights">
            <Text className="text-body-md text-on-surface mb-6 leading-relaxed">
              This is your 3rd visit to <Text className="font-bold">The Glass House</Text> this quarter. You typically spend 15% more here than at other Italian venues. This transaction is likely related to the "Project Aurora" dinner you noted in your calendar for this evening.
            </Text>
            
            <View className="flex-row flex-wrap gap-2">
              <View className="flex-1 p-3 bg-surface-container-low rounded-xl">
                <Text className="text-label-xs text-on-surface-variant uppercase font-bold tracking-wider mb-1">Frequency</Text>
                <Text className="font-title-sm text-primary font-bold">Monthly</Text>
              </View>
              <View className="flex-1 p-3 bg-surface-container-low rounded-xl">
                <Text className="text-label-xs text-on-surface-variant uppercase font-bold tracking-wider mb-1">Avg Spend</Text>
                <Text className="font-title-sm text-primary font-bold">$128.00</Text>
              </View>
              <View className="flex-1 p-3 bg-surface-container-low rounded-xl">
                <Text className="text-label-xs text-on-surface-variant uppercase font-bold tracking-wider mb-1">Trend</Text>
                <Text className="font-title-sm text-secondary font-bold">+12.4%</Text>
              </View>
              <View className="flex-1 p-3 bg-surface-container-low rounded-xl">
                <Text className="text-label-xs text-on-surface-variant uppercase font-bold tracking-wider mb-1">Tax Prob.</Text>
                <Text className="font-title-sm text-primary font-bold">High</Text>
              </View>
              </View>
          </AIBentoCard>

          {/* Receipt Image */}
          <View className="bg-surface-container-lowest rounded-[24px] p-lg shadow-sm border border-surface-container h-[400px]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-title-sm text-primary font-bold text-lg">Linked Receipt</Text>
              <MaterialIcons name="fullscreen" size={24} color={colors['on-surface-variant']} />
            </View>
            <View className="flex-1 rounded-xl overflow-hidden bg-surface-container-low">
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqO-vSwiUBDjgV-lu3M23rMQb3U_Eze9Ls9MEV-4mAz9-HSPrIjZ_EiCXZ6Pby0WLUSLkqgMNa3KEEU6KbyTc1pmLNPgmaPETi_KIzqiAulRFrBSOpbO-0BNVzaaRpQS66XzIbTOIzbBCYUm7Jeu1Gwqd4tWmyp1DnFO8LQWm2rjc3jl7mfG6_XDUNmx-92aF76HROg6rwRYdZssDOLMxjgewKjmte6nT1rPqqtRu2wY71puNNYesiGNnxase_45IzXYfi5kF21q0' }} className="w-full h-full" />
            </View>
          </View>

          {/* Connections Card */}
          <View className="bg-surface-container-lowest rounded-[24px] p-lg shadow-sm border border-surface-container flex-col gap-4">
            <Text className="font-title-sm text-primary font-bold text-lg">Entity Links</Text>
            
            <View className="flex-row items-center justify-between p-3 bg-surface-container-low rounded-xl">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-lg bg-primary-container items-center justify-center">
                  <MaterialIcons name="work" size={20} color={colors['on-primary-container']} />
                </View>
                <View>
                  <Text className="text-label-xs text-on-surface-variant">Project</Text>
                  <Text className="text-body-md text-primary font-bold">Business Trip - Q4</Text>
                </View>
              </View>
              <MaterialIcons name="edit" size={20} color={colors['on-surface-variant']} />
            </View>

            <View className="flex-row items-center justify-between p-3 bg-surface-container-low rounded-xl">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-lg overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRfIiE-Tc9UzbadeTUztTO9lOvQREYQ3VEPyMqxrQgViO9scQv1cf_dZgkmpBxz1ijuYgo4NWdZsiat6Q66mBtxJU21TaN85gHZSzIWW-N3eNHtAuFqJXV0zD88mn8gpvi7Pdx56om7iwm3Nd8m61u0dRjfeLbKsguY7FEKokMJQchZ1nBr-h8XJyRumyMbbHLWLFjL2xECmGnSOovvawo4hwVzFxdNfF560BnUL6k851LYBVlZhkqIFG0n0ma4hMEhjaony77_AE' }} className="w-full h-full" />
                </View>
                <View>
                  <Text className="text-label-xs text-on-surface-variant">Linked Person</Text>
                  <Text className="text-body-md text-primary font-bold">Elena Rodriguez</Text>
                </View>
              </View>
              <MaterialIcons name="close" size={20} color={colors['on-surface-variant']} />
            </View>

            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full py-3 border-2 border-dashed border-outline-variant rounded-xl flex-row items-center justify-center gap-2">
              <MaterialIcons name="add" size={20} color={colors['on-surface-variant']} />
              <Text className="text-on-surface-variant font-bold">Link another entity</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sidebar / Action Panel */}
        <View className="flex-col gap-lg">
          {/* Actions Card */}
          <View className="bg-surface-container-lowest rounded-[24px] p-lg shadow-sm border border-surface-container flex-col gap-4">
            <Text className="font-title-sm text-primary font-bold text-lg">Actions</Text>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full h-14 bg-primary rounded-xl flex-row items-center justify-center gap-2">
              <MaterialIcons name="description" size={20} color={colors.white} />
              <Text className="text-white font-bold">Export for Expense Report</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full h-14 bg-surface-container-high rounded-xl flex-row items-center justify-center gap-2">
              <MaterialIcons name="splitscreen" size={20} color={colors.primary} />
              <Text className="text-primary font-bold">Split Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full h-14 bg-surface-container-high rounded-xl flex-row items-center justify-center gap-2">
              <MaterialIcons name="flag" size={20} color={colors.primary} />
              <Text className="text-primary font-bold">Mark for Review</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full h-14 border border-error rounded-xl flex-row items-center justify-center gap-2 mt-2">
              <MaterialIcons name="delete" size={20} color={colors.error} />
              <Text className="text-error font-bold">Delete Transaction</Text>
            </TouchableOpacity>
          </View>

          {/* Merchant Details Card */}
          <View className="bg-surface-container-lowest rounded-[24px] p-lg shadow-sm border border-surface-container flex-col gap-4">
            <Text className="font-title-sm text-primary font-bold text-lg">Merchant Details</Text>
            <View className="aspect-video w-full rounded-xl overflow-hidden grayscale contrast-125 brightness-110">
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCeeVf5d6F0dvD9dbwC4i8j0ycRkEyvtazK2VcudCKVvTXpGWXj-Oscj5eNM4q5RJwgNV-Rps5zJCdkm7zn4wvKSXMaKi9Wgg91IbWwvlEjIElplA-r2Z30w_xqr4X8FDO6pkAgOUrdWnkdRX5V8Br9SdcgdsopWCiGNv2Gv4hqeH-UAMD5g8DoA59ahoSXntJbauvT3Fq_C2xWoLPGGb65rssCLYWPW2VleUELASEUBZOcn379hdzxyESqo8WEvavGx2nXWtw5XY' }} className="w-full h-full" />
            </View>
            <View className="flex-col gap-2">
              <View className="flex-row items-start gap-2">
                <MaterialIcons name="location-on" size={20} color={colors['on-surface-variant']} />
                <Text className="text-body-md text-on-surface flex-1">123 Crystal Avenue, Downtown Seattle, WA 98101</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="call" size={20} color={colors['on-surface-variant']} />
                <Text className="text-body-md text-on-surface">(206) 555-0198</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="language" size={20} color={colors['on-surface-variant']} />
                <Text className="text-body-md text-secondary underline">www.theglasshouse.com</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}
