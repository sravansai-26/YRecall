import { View, Text, StyleSheet } from 'react-native';
import { SuggestionChip } from './SuggestionChip';
import { colors } from '../../../../src/shared/theme/colors';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
 onSelectQuery: (query: string) => void;
}

export function EmptyState({ onSelectQuery }: EmptyStateProps) {
 const { t } = useTranslation();
 return (
 <View style={styles.container}>
 <View style={styles.header}>
 <Text style={styles.title}>
 {t('ask.helpRemember', 'How can I help you remember?')}
 </Text>
 </View>

 <View style={styles.chipContainer}>
 <SuggestionChip 
 label={t('ask.chip1', 'What did I learn last week?')} 
 onPress={() => onSelectQuery(t('ask.chip1', 'What did I learn last week?'))} 
 />
 <SuggestionChip 
 label={t('ask.chip2', "What ideas haven't I acted on?")} 
 onPress={() => onSelectQuery(t('ask.chip2Long', "What are some ideas I had recently that I haven't acted on?"))} 
 />
 <SuggestionChip 
 label={t('ask.chip3', 'What decisions did I make today?')} 
 onPress={() => onSelectQuery(t('ask.chip3', 'What decisions did I make today?'))} 
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
