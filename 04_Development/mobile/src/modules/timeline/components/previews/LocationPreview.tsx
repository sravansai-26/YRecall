import React from 'react';
import { View, Text, TouchableOpacity, Linking, Platform, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../src/shared/theme/colors';
import { PreviewProps } from './types';

export const LocationPreview: React.ComponentType<PreviewProps> = ({ capture, variant }) => {
  const isCompact = variant === 'compact';
  
  // Extract metadata
  const lat = capture.location_metadata?.latitude;
  const lng = capture.location_metadata?.longitude;
  const locationName = capture.location_metadata?.city || capture.content_text || 'Pinned Location';
  
  const handleOpenMaps = () => {
    if (!lat || !lng) return;
    
    // Abstracted map opening logic based on platform
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const label = encodeURIComponent(locationName);
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        // Fallback to browser Google Maps if native app fails
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latLng}`);
      });
    }
  };

  return (
    <TouchableOpacity onPress={handleOpenMaps} activeOpacity={0.8} className="mb-2">
      <View className={`bg-surface-variant/30 rounded-2xl overflow-hidden ${isCompact ? 'mb-3' : 'mb-4'}`}>
        
        {/* Map Visual Placeholder (Abstracted) */}
        <View className={`w-full ${isCompact ? 'h-32' : 'h-48'} bg-tertiary-container/30 items-center justify-center relative overflow-hidden`}>
           {lat && lng ? (
             <Image 
               source={{ uri: `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&size=450,450&z=15&l=sat&pt=${lng},${lat},pm2rdm` }}
               className="absolute inset-0 w-full h-full"
               resizeMode="cover"
             />
           ) : (
             <View className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
           )}
           <View className="w-16 h-16 rounded-full bg-white shadow-sm items-center justify-center z-10">
              <MaterialIcons name="location-on" size={32} color={colors.tertiary} />
           </View>
           
           {/* Coordinates Overlay */}
           {!isCompact && lat && lng && (
             <View className="absolute bottom-3 right-3 bg-black/50 px-2 py-1 rounded-md z-10">
               <Text className="text-[10px] text-white font-mono">{lat.toFixed(4)}, {lng.toFixed(4)}</Text>
             </View>
           )}
        </View>
        
        <View className="p-4 flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className="text-caption-sm text-tertiary font-bold uppercase tracking-wider mb-1">
              Location
            </Text>
            <Text className="text-body-lg text-on-surface font-bold mb-1" numberOfLines={1}>
              {locationName}
            </Text>
            {capture.summary && !isCompact && (
               <Text className="text-body-md text-on-surface-variant mt-1" numberOfLines={2}>
                 {capture.summary}
               </Text>
            )}
          </View>
          
          <View className="w-10 h-10 rounded-full bg-surface-variant items-center justify-center">
             <MaterialIcons name="navigation" size={20} color={colors.tertiary} />
          </View>
        </View>
        
      </View>
    </TouchableOpacity>
  );
};
