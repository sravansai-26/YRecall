import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, type PressableProps } from 'react-native';
import { colors } from '../theme/colors';

type ButtonVariant = 'primary' | 'outline' | 'text';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  icon?: keyof typeof MaterialIcons.glyphMap;
  fullWidth?: boolean;
}

export default function Button({
  label,
  variant = 'primary',
  icon,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isText = variant === 'text';

  const baseContainerClass = 'flex-row items-center justify-center rounded-full px-lg py-3 active:scale-95 transition-all';
  const variantContainerClass = isPrimary
    ? 'bg-primary shadow-sm'
    : isOutline
    ? 'border border-outline-variant bg-surface-container-low'
    : 'bg-transparent';
  
  const widthClass = fullWidth ? 'w-full' : 'self-start';

  const baseTextClass = 'font-label-xs text-[14px] ml-2';
  const variantTextClass = isPrimary
    ? 'text-white'
    : isOutline
    ? 'text-on-surface'
    : 'text-primary';

  return (
    <Pressable
      className={`${baseContainerClass} ${variantContainerClass} ${widthClass} ${className || ''}`}
      {...props}
    >
      {icon && (
        <MaterialIcons
          name={icon}
          size={20}
          color={isPrimary ? colors['on-primary'] : isOutline ? colors['on-surface'] : colors.primary}
        />
      )}
      <Text className={`${baseTextClass} ${variantTextClass} ${!icon ? 'ml-0' : ''}`}>
        {label}
      </Text>
    </Pressable>
  );
}
