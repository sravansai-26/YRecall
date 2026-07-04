import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

interface TopAppBarProps {
  greeting: string;
  name: string;
  onNotificationPress: () => void;
  avatarUrl?: string;
}

export default function TopAppBar({
  greeting,
  name,
  onNotificationPress,
  avatarUrl,
}: TopAppBarProps) {
  return (
    <View className="bg-surface">
      <View className="h-[64px] flex-row items-center justify-between px-margin-mobile">
        <View className="flex-row items-center gap-3">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <View className="h-10 w-10 rounded-full bg-primary-fixed" />
          )}
          <View>
            <Text className="font-label-xs text-on-surface-variant">
              {greeting}
            </Text>
            <Text className="text-[16px] font-bold text-primary">{name}</Text>
          </View>
        </View>

        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full"
          onPress={onNotificationPress}
        >
          <Ionicons name="notifications-outline" size={24} color="#001e40" />
        </Pressable>
      </View>
    </View>
  );
}
