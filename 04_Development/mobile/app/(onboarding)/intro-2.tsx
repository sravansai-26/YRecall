import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';

export default function OnboardingIntro2() {
  const router = useRouter();

  return (
    <Screen scrollable={false}>
      <View className="flex-row items-center justify-between px-margin-mobile py-base">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="auto-awesome" size={24} color={colors.primary} />
          <Text className="font-headline-md font-bold text-primary">YRecall</Text>
        </View>
        <Text
          onPress={() => router.replace('/(onboarding)/permissions')}
          className="font-medium text-on-surface-variant "
        >
          Skip
        </Text>
      </View>

      <View className="flex-1 items-center justify-between px-margin-mobile pb-xxl">
        <View className="flex-1 w-full items-center justify-center pt-xl">
          <View className="w-full max-w-md aspect-square items-center justify-center">
            <View className="w-full h-full rounded-[40px] bg-white shadow-sm border border-outline-variant/30 overflow-hidden items-center justify-center">
               <MaterialIcons name="share" size={120} color={colors.primary} />
            </View>
          </View>
        </View>

        <View className="w-full items-center mt-xl">
          <Text className="font-display-lg text-primary text-center mb-sm">
            Recall Everything
          </Text>
          <Text className="font-body-md text-on-surface-variant text-center leading-relaxed px-4">
            Don't just bookmark. Connect concepts, people, and places automatically across your entire digital footprint.
          </Text>

          <View className="w-full mt-xxl items-center gap-xl">
            <View className="flex-row gap-2">
              <View className="w-2 h-2 rounded-full bg-outline-variant" />
              <View className="w-8 h-2 rounded-full bg-primary" />
              <View className="w-2 h-2 rounded-full bg-outline-variant" />
            </View>

            <Button
              label="Next"
              fullWidth
              icon="arrow-forward"
              onPress={() => router.push('/(onboarding)/intro-3')}
              className="mt-4"
            />
          </View>
        </View>
      </View>
    </Screen>
  );
}
