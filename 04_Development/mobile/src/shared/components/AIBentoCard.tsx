import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface AIBentoCardProps {
  title: string;
  badgeText?: string;
  children: React.ReactNode;
  actionText?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
  containerClassName?: string;
}

export default function AIBentoCard({
  title,
  badgeText,
  children,
  actionText,
  onActionPress,
  style,
  containerClassName = "border-surface-container-highest",
}: AIBentoCardProps) {
  return (
    <View className={`bg-white rounded-[24px] p-lg shadow-sm border flex-col ${containerClassName}`} style={style}>
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="auto-awesome" size={24} color={colors.secondary} />
          <Text className="font-title-sm text-primary font-bold text-lg">{title}</Text>
        </View>
        {badgeText && (
          <View className="px-3 py-1 bg-secondary/10 rounded-full">
            <Text className="text-secondary font-label-xs text-[10px] uppercase tracking-wider font-bold">
              {badgeText}
            </Text>
          </View>
        )}
      </View>
      
      {children}
      
      {actionText && (
        <TouchableOpacity 
          className="mt-6 pt-4 border-t border-outline-variant flex-row items-center justify-between"
          onPress={onActionPress}
        >
          <Text className="text-secondary font-label-xs font-bold uppercase tracking-widest">{actionText}</Text>
          <MaterialIcons name="chevron-right" size={24} color={colors.secondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
