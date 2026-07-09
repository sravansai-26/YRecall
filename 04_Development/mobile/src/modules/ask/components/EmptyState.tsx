import { View, Text, StyleSheet } from 'react-native';
import { SuggestionChip } from './SuggestionChip';
import { colors } from '../../../../src/shared/theme/colors';

interface EmptyStateProps {
  onSelectQuery: (query: string) => void;
}

export function EmptyState({ onSelectQuery }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          How can I help you remember?
        </Text>
      </View>

      <View style={styles.chipContainer}>
        <SuggestionChip 
          label="What did I learn last week?" 
          onPress={() => onSelectQuery("What did I learn last week?")} 
        />
        <SuggestionChip 
          label="What ideas haven't I acted on?" 
          onPress={() => onSelectQuery("What are some ideas I had recently that I haven't acted on?")} 
        />
        <SuggestionChip 
          label="What decisions did I make today?" 
          onPress={() => onSelectQuery("What decisions did I make today?")} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'PublicSans_700Bold',
    fontSize: 24,
    color: colors['on-surface'],
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  }
});
