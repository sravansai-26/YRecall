import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../src/shared/theme/colors';
import { searchSettings, SettingEntry } from '../../src/modules/settings/SettingsRegistry';

export default function SearchModal() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SettingEntry[]>([]);

    useEffect(() => {
        setResults(searchSettings(query));
    }, [query]);

    const renderItem = ({ item }: { item: SettingEntry }) => (
        <TouchableOpacity 
            className="flex-row items-center p-4 border-b border-outline-variant/30 bg-surface-container-lowest active:bg-surface-container-low"
            onPress={() => {
                router.dismiss();
                // @ts-ignore
                router.push(item.route);
            }}
        >
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                <MaterialIcons name="settings" size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
                <Text className="font-title-sm text-base text-on-surface font-bold">{item.title}</Text>
                <Text className="font-body-sm text-sm text-on-surface-variant mt-1">{item.description}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-surface"
        >
            <View className="flex-row items-center p-4 border-b border-outline-variant/30 pt-12">
                <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
                    <MaterialIcons name="arrow-back" size={24} color={colors.on_surface} />
                </TouchableOpacity>
                <View className="flex-1 flex-row items-center bg-surface-container-high rounded-full px-4 h-12">
                    <MaterialIcons name="search" size={20} color={colors.outline} />
                    <TextInput
                        className="flex-1 h-full ml-2 font-body-lg text-base text-on-surface"
                        placeholder="Search settings..."
                        placeholderTextColor={colors.outline}
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')} className="p-1">
                            <MaterialIcons name="close" size={20} color={colors.on_surface_variant} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center pt-20 px-6">
                        <MaterialIcons name="search-off" size={48} color={colors.outline} />
                        <Text className="font-title-md text-lg text-on-surface mt-4 text-center">No settings found</Text>
                        <Text className="font-body-md text-base text-on-surface-variant mt-2 text-center">Try searching for different keywords</Text>
                    </View>
                }
            />
        </KeyboardAvoidingView>
    );
}
