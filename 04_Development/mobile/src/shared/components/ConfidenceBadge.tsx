import { View, Text } from 'react-native';

interface ConfidenceBadgeProps {
  confidence: number;
}

export default function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const isHigh = confidence >= 90;
  const isMed = confidence >= 70 && confidence < 90;
  
  const bgColor = isHigh ? 'bg-tertiary-fixed' : isMed ? 'bg-secondary-fixed' : 'bg-surface-container-high';
  const textColor = isHigh ? 'text-on-tertiary-fixed' : isMed ? 'text-on-secondary-fixed' : 'text-on-surface-variant';
  
  return (
    <View className={`flex-row items-center rounded-full px-2 py-1 ${bgColor}`}>
      <Text className={`font-label-xs ${textColor}`}>
        {confidence}% Confidence
      </Text>
    </View>
  );
}
