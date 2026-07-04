import type { ReactNode } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

type BaseCardProps = {
  onPress?: () => void;
};

type StandardCardProps = BaseCardProps & {
  variant?: 'standard';
  title?: string;
  description?: string;
  children?: ReactNode;
};

type PhotoCardProps = BaseCardProps & {
  variant: 'photo';
  imageUrl?: string;
  title?: string;
  description?: string;
};

type QuoteCardProps = BaseCardProps & {
  variant: 'quote';
  quoteText?: string;
  quoteAttribution?: string;
};

type CardProps = StandardCardProps | PhotoCardProps | QuoteCardProps;

function StandardCard({
  title,
  description,
  children,
  onPress,
}: StandardCardProps) {
  return (
    <Pressable
      className="rounded-xl bg-white p-lg shadow-sm"
      onPress={onPress}
    >
      {title ? (
        <Text className="mb-2 font-body-md font-bold text-primary">{title}</Text>
      ) : null}
      {description ? (
        <Text className="font-caption-sm text-on-surface-variant">
          {description}
        </Text>
      ) : null}
      {children}
    </Pressable>
  );
}

function PhotoCard({
  imageUrl,
  title,
  description,
  onPress,
}: PhotoCardProps) {
  return (
    <Pressable
      className="overflow-hidden rounded-xl bg-white shadow-sm"
      onPress={onPress}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="h-48 w-full"
          resizeMode="cover"
        />
      ) : null}
      <View className="p-lg">
        {title ? (
          <Text className="mb-2 font-body-md font-bold text-on-surface">
            {title}
          </Text>
        ) : null}
        {description ? (
          <Text className="font-caption-sm text-on-surface-variant">
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function QuoteCard({
  quoteText,
  quoteAttribution,
  onPress,
}: QuoteCardProps) {
  return (
    <Pressable className="rounded-xl bg-primary p-lg" onPress={onPress}>
      {quoteText ? (
        <Text className="font-title-sm italic leading-relaxed text-primary-fixed">
          {quoteText}
        </Text>
      ) : null}
      {quoteAttribution ? (
        <Text className="mt-4 font-label-xs text-primary-fixed-dim">
          {quoteAttribution}
        </Text>
      ) : null}
    </Pressable>
  );
}

export default function Card(props: CardProps) {
  switch (props.variant) {
    case 'photo':
      return <PhotoCard {...props} />;
    case 'quote':
      return <QuoteCard {...props} />;
    default:
      return <StandardCard {...props} />;
  }
}
