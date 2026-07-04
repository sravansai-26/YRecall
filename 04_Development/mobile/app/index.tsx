import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import TopAppBar from '@/shared/components/TopAppBar';
import Card from '@/shared/components/Card';

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <TopAppBar
        greeting="Good Morning,"
        name="Julianne"
        onNotificationPress={() => {}}
      />
      <ScrollView className="flex-1 px-margin-mobile" contentContainerStyle={{ paddingBottom: 32 }}>
        <Card
          variant="standard"
          title="Ongoing Projects"
          description="12 related memories"
        />
        <Card
          variant="photo"
          imageUrl="https://picsum.photos/400/300"
          title="Architecture Inspo"
        />
        <Card
          variant="quote"
          quoteText="The best way to predict the future is to create it."
          quoteAttribution="Alan Kay"
        />
      </ScrollView>
    </SafeAreaView>
  );
}