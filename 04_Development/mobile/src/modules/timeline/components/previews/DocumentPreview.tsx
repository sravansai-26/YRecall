import React from 'react';
import { View, Text, TouchableOpacity, Platform, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../src/shared/theme/colors';
import { format } from 'date-fns';
import { PreviewProps } from './types';

export const DocumentPreview: React.ComponentType<PreviewProps> = ({ capture, variant }) => {
  const isCompact = variant === 'compact';
  const fileUrl = capture.file_url;

  const handleOpenNative = () => {
    if (fileUrl) {
      Linking.openURL(fileUrl).catch(() => {});
    }
  };

  // Compact View (Timeline) - Render as a card, not an embedded webview to save performance
  if (isCompact) {
    return (
      <TouchableOpacity onPress={handleOpenNative} activeOpacity={0.8} className="mb-2">
        <View className="flex-row items-center gap-4 bg-surface-variant/30 p-4 rounded-2xl mb-3 border border-outline-variant/10">
          <View className="w-12 h-12 rounded-xl bg-error-container/20 items-center justify-center shadow-sm">
            <MaterialIcons name="picture-as-pdf" size={24} color={colors.error} />
          </View>
          <View className="flex-1">
            <Text className="text-body-lg text-on-surface font-bold" numberOfLines={1}>
              {capture.title || 'Document'}
            </Text>
            <Text className="text-body-sm text-on-surface-variant uppercase mt-1 tracking-wider font-medium">
              {capture.type} • {format(new Date(capture.created_at), 'MMM d, yyyy')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Full View (Detail) - Render embedded
  if (!fileUrl) {
    return (
      <View className="w-full p-6 bg-surface-variant/30 rounded-2xl items-center justify-center mb-6">
         <MaterialIcons name="error-outline" size={32} color={colors.error} />
         <Text className="text-on-surface-variant mt-2 font-medium">Document file not found.</Text>
      </View>
    );
  }

  // Determine the best rendering strategy
  // iOS WebView natively renders PDFs. Android needs Google Docs Viewer fallback for now.
  const webViewSource = Platform.OS === 'ios' 
    ? { uri: fileUrl } 
    : { uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}` };

  return (
    <View className="mb-6 flex-1 min-h-[500px]">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
           <MaterialIcons name="picture-as-pdf" size={20} color={colors.error} />
           <Text className="font-title-sm text-on-surface font-bold">Document Preview</Text>
        </View>
        <TouchableOpacity onPress={handleOpenNative} className="flex-row items-center gap-1 bg-surface-variant/50 px-3 py-1.5 rounded-full">
           <MaterialIcons name="open-in-new" size={16} color={colors.primary} />
           <Text className="text-caption-sm text-primary font-bold">Open Native</Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-1 w-full bg-white rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm min-h-[500px]">
        <WebView 
          source={webViewSource}
          style={{ flex: 1, width: '100%', height: '100%' }}
          startInLoadingState={true}
          scalesPageToFit={true}
          renderLoading={() => (
            <View className="absolute inset-0 items-center justify-center bg-surface-variant/10">
              <Text className="text-on-surface-variant">Loading document viewer...</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};
