import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Text, ActivityIndicator, TextInput, Image, Linking, Platform, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Stack as ExpoStack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { capturesApi } from '../../../src/modules/captures/services/api';
import { colors } from '../../../src/shared/theme/colors';

export default function LocationCaptureScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [address, setAddress] = useState<Location.LocationGeocodedAddress | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Debounce for Nominatim search
    useEffect(() => {
        if (searchQuery.trim().length < 3) {
            setSuggestions([]);
            return;
        }
        
        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=5`);
                const data = await res.json();
                setSuggestions(data);
            } catch (err) {
                console.warn('Nominatim error', err);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSelectSuggestion = (suggestion: any) => {
        const lat = parseFloat(suggestion.lat);
        const lon = parseFloat(suggestion.lon);
        setLocation({
            coords: {
                latitude: lat,
                longitude: lon,
                altitude: null,
                accuracy: 10,
                altitudeAccuracy: null,
                heading: null,
                speed: null
            },
            timestamp: Date.now()
        });
        setAddress({
            name: suggestion.name || '',
            street: suggestion.address?.road || '',
            city: suggestion.address?.city || suggestion.address?.town || '',
            region: suggestion.address?.state || '',
            country: suggestion.address?.country || '',
            postalCode: suggestion.address?.postcode || '',
            isoCountryCode: suggestion.address?.country_code || '',
            district: suggestion.address?.county || '',
            subregion: suggestion.address?.state_district || '',
            timezone: ''
        } as any);
        setSearchQuery('');
        setSuggestions([]);
    };

    const fetchLocation = async () => {
        setIsFetching(true);
        setErrorMsg(null);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setIsFetching(false);
                return;
            }

            const locPromise = Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });
            
            const timeoutPromise = new Promise<Location.LocationObject>((_, reject) => 
                setTimeout(() => reject(new Error('Location request timed out')), 15000)
            );

            const loc = await Promise.race([locPromise, timeoutPromise]);
            setLocation(loc);

            let reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude
            });

            if (reverseGeocode && reverseGeocode.length > 0) {
                setAddress(reverseGeocode[0] || null);
            }
        } catch (err) {
            setErrorMsg('Failed to get location. Ensure GPS is enabled.');
            console.warn(err);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    const handleSave = async () => {
        if (!location && !searchQuery) return;
        setIsUploading(true);
        
        try {
            await capturesApi.createLocation({
                latitude: location?.coords.latitude || 0,
                longitude: location?.coords.longitude || 0,
                altitude: location?.coords.altitude || undefined,
                accuracy: location?.coords.accuracy || undefined,
                address_override: searchQuery || undefined
            } as any);
            console.log('Location saved successfully');
            router.back();
        } catch (err) {
            console.error('Failed to save location:', err);
            setErrorMsg('Failed to save location. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleOpenWithMaps = () => {
        if (!location) return;
        const lat = location.coords.latitude;
        const lng = location.coords.longitude;
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = address?.name || 'Custom Location';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        
        if (url) {
            Linking.openURL(url);
        }
    };

    return (
        <View style={styles.container}>
            <ExpoStack.Screen 
                options={{
                    headerShown: true,
                    headerTitle: 'Location Capture',
                    headerStyle: { backgroundColor: colors['surface-container-lowest'] },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
                            <Ionicons name="arrow-back" size={24} color={colors['on-surface']} />
                        </Pressable>
                    ),
                    headerRight: () => (
                        <Pressable 
                            onPress={handleSave} 
                            disabled={isUploading || isFetching || (!location && !searchQuery)}
                            style={[
                                styles.saveBtn,
                                (isUploading || isFetching || (!location && !searchQuery)) && { opacity: 0.5 }
                            ]}
                        >
                            {isUploading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.saveBtnText}>Save</Text>
                            )}
                        </Pressable>
                    )
                }}
            />
            
            <View style={styles.content}>
                {/* Manual Address Input */}
                <View style={{ width: '100%', zIndex: 10 }}>
                    <View style={[styles.searchContainer, suggestions.length > 0 && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginBottom: 0 }]}>
                        <Ionicons name="search" size={20} color={colors['on-surface-variant']} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for a place..."
                            placeholderTextColor={colors['on-surface-variant']}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {isSearching && <ActivityIndicator size="small" color={colors.primary} />}
                    </View>
                    
                    {suggestions.length > 0 && (
                        <View style={styles.suggestionsContainer}>
                            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
                                {suggestions.map((item, index) => (
                                    <Pressable 
                                        key={index} 
                                        style={styles.suggestionItem}
                                        onPress={() => handleSelectSuggestion(item)}
                                    >
                                        <Ionicons name="location-outline" size={18} color={colors.primary} style={{ marginRight: 8, marginTop: 2 }} />
                                        <Text style={styles.suggestionText} numberOfLines={2}>{item.display_name}</Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                {isFetching ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 16 }} />
                        <Text style={styles.loadingText}>Finding you...</Text>
                    </View>
                ) : errorMsg ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="warning-outline" size={32} color={colors.error} style={{ marginBottom: 12 }} />
                        <Text style={styles.errorText}>{errorMsg}</Text>
                        <Pressable onPress={fetchLocation} style={{ marginTop: 16, padding: 8, backgroundColor: colors.primary, borderRadius: 8 }}>
                            <Text style={{ color: 'white', fontFamily: 'PublicSans_600SemiBold' }}>Retry</Text>
                        </Pressable>
                    </View>
                ) : location ? (
                    <View style={styles.infoContainer}>
                        
                        {/* Map Preview */}
                        <View style={styles.mapContainer}>
                            <WebView 
                                source={{ uri: `https://www.openstreetmap.org/export/embed.html?bbox=${location.coords.longitude-0.005},${location.coords.latitude-0.005},${location.coords.longitude+0.005},${location.coords.latitude+0.005}&layer=mapnik&marker=${location.coords.latitude},${location.coords.longitude}` }}
                                style={styles.mapImage} 
                                scrollEnabled={false}
                                pointerEvents="none"
                            />
                        </View>

                        <Pressable onPress={handleOpenWithMaps} style={styles.openWithBtn}>
                            <Ionicons name="map-outline" size={20} color={colors.primary} />
                            <Text style={styles.openWithText}>Open with Maps</Text>
                        </Pressable>

                        <View style={{ height: 24 }} />

                        <Text style={styles.mainAddress}>
                            {address?.name || address?.street || 'Unknown Street'}
                        </Text>
                        
                        <Text style={styles.subAddress}>
                            {[address?.city, address?.region, address?.country].filter(Boolean).join(', ')}
                        </Text>
                        
                        <View style={styles.coordinatesCard}>
                            <View style={styles.coordRow}>
                                <Text style={styles.coordLabel}>Latitude</Text>
                                <Text style={styles.coordValue}>{location.coords.latitude.toFixed(6)}°</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.coordRow}>
                                <Text style={styles.coordLabel}>Longitude</Text>
                                <Text style={styles.coordValue}>{location.coords.longitude.toFixed(6)}°</Text>
                            </View>
                            {location.coords.altitude && (
                                <>
                                    <View style={styles.divider} />
                                    <View style={styles.coordRow}>
                                        <Text style={styles.coordLabel}>Altitude</Text>
                                        <Text style={styles.coordValue}>{location.coords.altitude.toFixed(1)}m</Text>
                                    </View>
                                </>
                            )}
                            {location.coords.accuracy && (
                                <>
                                    <View style={styles.divider} />
                                    <View style={styles.coordRow}>
                                        <Text style={styles.coordLabel}>Accuracy</Text>
                                        <Text style={styles.coordValue}>±{location.coords.accuracy.toFixed(1)}m</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors['surface-container-lowest'],
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
    },
    searchContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors['surface-container'],
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors['outline-variant'],
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'PublicSans_400Regular',
        fontSize: 16,
        color: colors['on-surface'],
        height: '100%',
    },
    suggestionsContainer: {
        width: '100%',
        backgroundColor: colors['surface-container'],
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: colors['outline-variant'],
        marginBottom: 24,
        overflow: 'hidden',
    },
    suggestionItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors['outline-variant'] + '40',
    },
    suggestionText: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 14,
        color: colors['on-surface'],
        flex: 1,
    },
    mapContainer: {
        width: '100%',
        height: 200,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: colors['surface-container-high'],
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0.8,
    },
    mapPin: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    openWithBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: `${colors.primary}15`,
        borderRadius: 24,
    },
    openWithText: {
        marginLeft: 8,
        color: colors.primary,
        fontFamily: 'PublicSans_600SemiBold',
        fontSize: 14,
    },
    saveBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    saveBtnText: {
        color: 'white',
        fontFamily: 'PublicSans_600SemiBold',
        fontSize: 14,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    loadingText: {
        fontFamily: 'PublicSans_500Medium',
        fontSize: 16,
        color: colors['on-surface-variant'],
    },
    errorContainer: {
        alignItems: 'center',
        backgroundColor: `${colors.error}15`,
        padding: 24,
        borderRadius: 16,
        marginTop: 40,
    },
    errorText: {
        fontFamily: 'PublicSans_500Medium',
        fontSize: 16,
        color: colors.error,
        textAlign: 'center',
    },
    infoContainer: {
        width: '100%',
        alignItems: 'center',
    },
    mainAddress: {
        fontFamily: 'PublicSans_700Bold',
        fontSize: 24,
        color: colors['on-surface'],
        textAlign: 'center',
        marginBottom: 8,
    },
    subAddress: {
        fontFamily: 'PublicSans_400Regular',
        fontSize: 16,
        color: colors['on-surface-variant'],
        textAlign: 'center',
        marginBottom: 32,
    },
    coordinatesCard: {
        width: '100%',
        backgroundColor: colors['surface-container'],
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors['outline-variant'],
    },
    coordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    coordLabel: {
        fontFamily: 'PublicSans_500Medium',
        fontSize: 15,
        color: colors['on-surface-variant'],
    },
    coordValue: {
        fontFamily: 'PublicSans_600SemiBold',
        fontSize: 15,
        color: colors['on-surface'],
        fontVariant: ['tabular-nums'],
    },
    divider: {
        height: 1,
        backgroundColor: colors['outline-variant'],
        opacity: 0.5,
    }
});