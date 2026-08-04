import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';
import { Image, Animated } from 'react-native';
import { useAudioRecorder, RecordingPresets, requestRecordingPermissionsAsync, AudioModule } from 'expo-audio';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { capturesApi, Capture } from '../../../src/modules/captures/services/api';
import { TimelineCard } from '../../../src/modules/timeline/components/TimelineCard';

export default function SearchIndex() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useAuthStore();
    const { t } = useTranslation();

    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    
    const [results, setResults] = useState<Capture[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    
    const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Custom debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (params.mode === 'voice') {
            startVoiceSearch();
        }
    }, [params.mode]);

    const startVoiceSearch = async () => {
        if (isVoiceSearchActive) return;
        
        try {
            const { granted } = await requestRecordingPermissionsAsync();
            if (!granted) return;

            await AudioModule.setAudioModeAsync({
                allowsRecording: true,
                playsInSilentMode: true,
            });

            try {
                await recorder.prepareToRecordAsync();
            } catch (e: any) {
                if (e?.message?.includes("already been prepared")) {
                    // Safe to ignore, it's already prepared
                } else {
                    throw e;
                }
            }
            
            recorder.record();
            
            setIsVoiceSearchActive(true);
            
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
                ])
            ).start();
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopVoiceSearch = async (cancel = false) => {
        try {
            pulseAnim.stopAnimation();
            recorder.stop();
            setIsVoiceSearchActive(false);

            if (cancel) return;

            const uri = recorder.uri;
            if (!uri) return;

            setIsTranscribing(true);
            
            const filename = uri.split('/').pop() || 'search.m4a';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `audio/${match[1]}` : `audio/m4a`;

            const res = await capturesApi.transcribeMedia({
                file: {
                    uri,
                    name: filename,
                    type,
                }
            });
            
            if (res?.data?.text) {
                setQuery(res.data.text);
            }
        } catch (err) {
            console.error('Failed to transcribe', err);
            require('react-native').ToastAndroid?.show('Failed to recognize speech', require('react-native').ToastAndroid.LONG);
        } finally {
            setIsTranscribing(false);
        }
    };

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
                    <View className="absolute inset-y-0 right-0 pr-md justify-center z-10 flex-row items-center gap-2">
                        {query.length > 0 && (
                            <TouchableOpacity onPress={() => setQuery('')} className="p-1">
                                <MaterialIcons name="close" size={24} color={colors.primary} />
                            </TouchableOpacity>
                        )}
                        {!isVoiceSearchActive && !isTranscribing && (
                            <TouchableOpacity onPress={startVoiceSearch} className="p-1">
                                <MaterialIcons name="mic" size={24} color={colors.primary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {isVoiceSearchActive && (
                    <View className="bg-surface-container-high rounded-xl p-4 mb-4 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Animated.View style={{ transform: [{ scale: pulseAnim }] }} className="w-10 h-10 rounded-full bg-error items-center justify-center mr-4">
                                <MaterialIcons name="mic" size={24} color="white" />
                            </Animated.View>
                            <Text className="font-body-lg text-on-surface">Listening...</Text>
                        </View>
                        <View className="flex-row items-center gap-4">
                            <TouchableOpacity onPress={() => stopVoiceSearch(true)}>
                                <Text className="font-body-md text-error">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => stopVoiceSearch(false)} className="bg-primary px-4 py-2 rounded-full">
                                <Text className="font-title-sm text-on-primary">Search</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                
                {isTranscribing && (
                    <View className="bg-surface-container-high rounded-xl p-4 mb-4 flex-row items-center justify-center gap-4">
                        <ActivityIndicator color={colors.primary} />
                        <Text className="font-body-lg text-on-surface">Transcribing...</Text>
                    </View>
                )}

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
