import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface InsightCardProps {
  title: string;
  content: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export default function InsightCard({ title, content, icon = 'auto-awesome' }: InsightCardProps) {
  return (
    <View className="relative overflow-hidden rounded-[24px] bg-surface-dim p-lg shadow-sm">
      <View className="absolute right-0 top-0 p-4 opacity-20">
        <MaterialIcons name={icon} size={80} color={colors.primary} />
      </View>
      <View className="relative z-10">
        <View className="mb-3 flex-row items-center gap-2">
          <MaterialIcons name="flare" size={20} color={colors.secondary} />
          <Text className="font-headline-md text-[20px] text-primary">{title}</Text>
        </View>
        <Text className="font-body-md leading-relaxed text-on-surface-variant">
          {content}
        </Text>
      </View>
    </View>
  );
}
