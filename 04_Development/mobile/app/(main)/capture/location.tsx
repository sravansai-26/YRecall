import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, ActivityIndicator } from 'react-native';
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
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setIsFetching(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setIsFetching(false);
          return;
        }

        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        setLocation(loc);

        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
          setAddress(reverseGeocode[0] || null);
        }
      } catch (err) {
        setErrorMsg('Failed to get location');
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!location) return;
    setIsUploading(true);
    
    try {
      await capturesApi.createLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || undefined,
        accuracy: location.coords.accuracy || undefined,
      });
      // The backend will handle geocoding based on lat/lng or we could pass the address fields.
      // Assuming backend uses lat/lng to fetch city/state etc or it's provided in the payload if added.
      console.log('Location saved successfully');
      router.back();
    } catch (err) {
      console.error('Failed to save location:', err);
      setErrorMsg('Failed to save location. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ExpoStack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Current Location',
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
              disabled={isUploading || isFetching || !location}
              style={[
                styles.saveBtn,
                (isUploading || isFetching || !location) && { opacity: 0.5 }
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
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={48} color={colors.primary} />
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
          </View>
        ) : location ? (
          <View style={styles.infoContainer}>
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
    paddingTop: '10%',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
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
    marginBottom: 40,
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