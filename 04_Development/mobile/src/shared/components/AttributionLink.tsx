import { Pressable, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AttributionLinkProps {
  label: string;
  onPress?: () => void;
}

export default function AttributionLink({ label, onPress }: AttributionLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center self-start gap-1 rounded-full bg-surface-container-low px-3 py-1 border border-outline-variant active:bg-surface-container"
    >
      <MaterialIcons name="link" size={14} color="#737780" />
      <Text className="font-label-xs text-on-surface-variant">{label}</Text>
    </Pressable>
  );
}
