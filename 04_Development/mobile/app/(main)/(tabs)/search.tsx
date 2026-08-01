import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';
import { Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { capturesApi, Capture } from '../../../src/modules/captures/services/api';
import { TimelineCard } from '../../../src/modules/timeline/components/TimelineCard';

export default function SearchIndex() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { t } = useTranslation();

    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    
    const [results, setResults] = useState<Capture[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Custom debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Fetch initial results when debounced query changes
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            setIsLoading(false);
            setHasMore(false);
            return;
        }

        let isMounted = true;
        
        const fetchInitial = async () => {
            setIsLoading(true);
            try {
                const res = await capturesApi.searchCaptures(debouncedQuery.trim(), 0, 20);
                if (isMounted) {
                    setResults(res.data);
                    setPage(1);
                    setHasMore(res.meta.page < res.meta.total_pages);
                }
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchInitial();
        
        return () => { isMounted = false; };
    }, [debouncedQuery]);

    const loadMore = async () => {
        if (isLoading || isFetchingMore || !hasMore || !debouncedQuery.trim()) return;
        
        setIsFetchingMore(true);
        try {
            const skip = page * 20;
            const res = await capturesApi.searchCaptures(debouncedQuery.trim(), skip, 20);
            setResults(prev => [...prev, ...res.data]);
            setPage(prev => prev + 1);
            setHasMore(res.meta.page < res.meta.total_pages);
        } catch (err) {
            console.error("Load more error:", err);
        } finally {
            setIsFetchingMore(false);
        }
    };

    const handleCardPress = useCallback((c: Capture) => {
        router.push(`/(main)/memory/${c.id}` as any);
    }, [router]);

    const renderItem = ({ item }: { item: Capture }) => (
        <View className="mb-4">
            <TimelineCard capture={item} onPress={handleCardPress} />
        </View>
    );

    return (
        <Screen scrollable={false}>
            {/* Header */}
            <View className="w-full bg-surface z-40 px-margin-mobile py-sm h-16 flex-row items-center justify-between">
                <View className="flex-row items-center gap-md">
                    <MaterialIcons 
                        name="arrow-back" 
                        size={24} 
                        color={colors.primary} 
                        onPress={() => router.back()}
                    />
                    <Text className="font-title-sm font-bold text-primary">{t('search.title', 'Search')}</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/(main)/profile-edit' as any)} className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high items-center justify-center">
                    {user?.photoURL ? (
                        <Image source={{ uri: user.photoURL }} className="w-full h-full" />
                    ) : (
                        <MaterialIcons name="person" size={24} color={colors.primary} />
                    )}
                </TouchableOpacity>
            </View>

            <View className="flex-1 w-full max-w-3xl mx-auto px-margin-mobile pt-lg">
                {/* Search Bar */}
                <View className="mb-md relative">
                    <View className="absolute inset-y-0 left-0 pl-md justify-center z-10">
                        <MaterialIcons name="search" size={24} color={colors.outline} />
                    </View>
                    <TextInput
                        className="w-full h-[56px] pl-[52px] pr-[52px] bg-surface-container-low rounded-xl font-body-lg text-primary"
                        placeholder={t('search.placeholder', 'Search your memory graph...')}
                        placeholderTextColor={colors['outline-variant']}
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                    />
                    {query.length > 0 && (
                        <View className="absolute inset-y-0 right-0 pr-md justify-center z-10">
                            <TouchableOpacity onPress={() => setQuery('')}>
                                <MaterialIcons name="close" size={24} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Content */}
                <View className="flex-1 mt-4">
                    {!query.trim() ? (
                        <View className="items-center justify-center pt-20 opacity-50">
                            <MaterialIcons name="search" size={64} color={colors.outline} className="mb-4" />
                            <Text className="font-title-md text-outline">What are you looking for?</Text>
                            <Text className="font-body-md text-outline mt-2 text-center max-w-[250px]">
                                Search across notes, documents, transcripts, entities, and URLs.
                            </Text>
                        </View>
                    ) : isLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : results.length === 0 ? (
                        <View className="items-center justify-center pt-20 opacity-60">
                            <MaterialIcons name="sentiment-dissatisfied" size={64} color={colors.outline} className="mb-4" />
                            <Text className="font-title-md text-outline">No results found</Text>
                        </View>
                    ) : (
                        <FlashList
                            data={results}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            estimatedItemSize={150}
                            showsVerticalScrollIndicator={false}
                            onEndReached={loadMore}
                            onEndReachedThreshold={0.5}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            ListFooterComponent={
                                isFetchingMore ? (
                                    <View className="py-4 items-center justify-center">
                                        <ActivityIndicator color={colors.primary} />
                                    </View>
                                ) : null
                            }
                        />
                    )}
                </View>
            </View>
        </Screen>
    );
}
