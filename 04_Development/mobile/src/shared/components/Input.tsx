import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export default function Input({
  label,
  error,
  icon,
  className,
  ...props
}: InputProps) {
  return (
    <View className={`w-full ${className || ''}`}>
      {label && (
        <Text className="mb-2 font-label-xs text-on-surface-variant">
          {label}
        </Text>
      )}
      <View className="flex-row items-center rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 focus:border-primary">
        {icon && (
          <MaterialIcons name={icon} size={20} color={colors.outline} className="mr-3" />
        )}
        <TextInput
          className="flex-1 font-body-md text-on-surface placeholder:text-outline"
          placeholderTextColor={colors.outline}
          {...props}
        />
      </View>
      {error && (
        <Text className="mt-1 font-caption-sm text-error">{error}</Text>
      )}
    </View>
  );
}
