import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';

interface Citation {
  content: string;
}

interface CitationCardProps {
  citations: Citation[];
}

export function CitationCard({ citations }: CitationCardProps) {
  if (!citations || citations.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sources</Text>
      <View style={styles.chipsContainer}>
        {citations.slice(0, 3).map((cit, idx) => (
          <View key={idx} style={styles.chip}>
            <MaterialIcons name="article" size={14} color={colors['on-surface-variant']} />
            <Text style={styles.chipText} numberOfLines={1}>
              {cit.content.slice(0, 40).trim()}...
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors['surface-container-high'],
  },
  title: {
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 12,
    color: colors['on-surface-variant'],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors['surface-container-low'],
    borderWidth: 1,
    borderColor: colors['surface-container-high'],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    maxWidth: '100%',
  },
  chipText: {
    fontFamily: 'PublicSans_500Medium',
    fontSize: 12,
    color: colors['on-surface-variant'],
    flexShrink: 1,
  }
});
