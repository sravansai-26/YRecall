import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const MOCK_RESULTS = [
  { id: '1', title: 'Q3 Financial Report', type: 'document', date: '2 days ago' },
  { id: '2', title: 'Product Launch Strategy', type: 'note', date: 'Last week' },
  { id: '3', title: 'Meeting with Sarah', type: 'event', date: 'Yesterday' },
];

export default function SearchModal() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filteredResults = query 
    ? MOCK_RESULTS.filter(r => r.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <Screen className="bg-surface">
      <View className={`w-full flex-row items-center px-4 pb-4 border-b border-outline-variant/30 ${Platform.OS === 'ios' ? 'pt-14' : 'pt-4'}`}>
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2 rounded-full ">
          <MaterialIcons name="close" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center bg-surface-variant/30 rounded-xl px-4 h-12">
          <MaterialIcons name="search" size={20} color={colors['on-surface-variant']} />
          <TextInput
            autoFocus
            className="flex-1 ml-2 font-body-md text-base text-on-surface h-full"
            placeholder="Search your memories..."
            placeholderTextColor={colors['on-surface-variant']}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <MaterialIcons name="cancel" size={20} color={colors['on-surface-variant']} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-2">
        {query === '' ? (
          <View className="pt-8 items-center flex-col opacity-50">
            <MaterialIcons name="search" size={48} color={colors['on-surface-variant']} />
            <Text className="font-body-md text-on-surface-variant mt-4">Start typing to search across all your data</Text>
          </View>
        ) : filteredResults.length > 0 ? (
          filteredResults.map(result => (
            <TouchableOpacity key={result.id} className="flex-row items-center justify-between p-4 border-b border-outline-variant/20 ">
              <View className="flex-row items-center flex-1 pr-4">
                <MaterialIcons 
                  name={result.type === 'document' ? 'description' : result.type === 'event' ? 'event' : 'note'} 
                  size={24} 
                  color={colors.primary} 
                />
                <View className="ml-4 flex-col flex-1">
                  <Text className="font-title-sm text-base text-on-surface font-bold">{result.title}</Text>
                  <Text className="font-caption-sm text-xs text-on-surface-variant capitalize">{result.type} • {result.date}</Text>
                </View>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={16} color={colors.outline} />
            </TouchableOpacity>
          ))
        ) : (
          <View className="pt-8 items-center flex-col opacity-50">
            <MaterialIcons name="error-outline" size={48} color={colors['on-surface-variant']} />
            <Text className="font-body-md text-on-surface-variant mt-4">No results found for "{query}"</Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
