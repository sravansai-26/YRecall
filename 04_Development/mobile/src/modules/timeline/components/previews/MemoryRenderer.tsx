import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../src/shared/theme/colors';
import { PreviewProps } from './types';
import { getPreviewRenderer } from './PreviewRegistry';
import Markdown from 'react-native-markdown-display';

const markdownStyles = {
  body: { color: colors['on-surface'], fontSize: 16, lineHeight: 24 },
  heading1: { color: colors.primary, marginTop: 16, marginBottom: 8 },
  code_inline: { backgroundColor: colors['surface-variant'], padding: 4, borderRadius: 4, fontFamily: 'monospace' },
};

export const MemoryRenderer: React.FC<PreviewProps> = ({ capture, variant, onPress }) => {
  const isCompact = variant === 'compact';
  
  // 1. Security Validation & Permissions Check (Pipeline Stage 1)
  // if (capture.is_encrypted && !isUnlocked) return <EncryptedPreview />
  
  // 2. Resolve Specific Content Renderer (Pipeline Stage 2)
  const SpecificRenderer = getPreviewRenderer(capture.type);

  // 3. Render Pipeline
  return (
    <View className="w-full">
      {/* Specific Media / Attachment Preview */}
      <SpecificRenderer capture={capture} variant={variant} onPress={onPress} />

      {/* Universal Text Blocks Pipeline */}
      {/* We only render these here if we want a unified text layout. 
          For compact mode, some renderers might want custom text placement, but a unified approach is cleaner. */}
      
      {/* Transcript / OCR / Scanned Text / Content (Full Mode Only) */}
      {!isCompact && (capture.transcript || capture.ocr_text || capture.content_text) && (
        <View className="bg-surface-container-lowest p-6 rounded-[28px] mb-6 shadow-sm">
          <Text className="font-title-sm font-bold text-primary mb-3">
            {capture.transcript ? 'Transcript' : capture.ocr_text ? 'Scanned Text' : 'Content'}
          </Text>
          <View className="markdown-container">
            <Markdown style={markdownStyles}>
              {capture.transcript || capture.ocr_text || capture.content_text || ''}
            </Markdown>
          </View>
        </View>
      )}

      {/* Universal AI Summary */}
      {capture.summary && !isCompact && (
        <View className="bg-secondary-container/20 p-6 rounded-[28px] mb-6 shadow-sm">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-8 h-8 rounded-full bg-secondary-container items-center justify-center">
              <MaterialIcons name="auto-awesome" size={16} color={colors.secondary} />
            </View>
            <Text className="font-title-sm font-bold text-secondary">AI Summary</Text>
          </View>
          <View>
            <Text className="text-body-md text-on-surface leading-relaxed">
              {capture.summary}
            </Text>
          </View>
        </View>
      )}

      {/* Entities Extraction (Full Mode Only) */}
      {!isCompact && capture.entities && capture.entities.length > 0 && (
        <View className="mb-8">
          <Text className="font-title-sm font-bold text-primary mb-3">Extracted Knowledge</Text>
          <View className="flex-row flex-wrap gap-2">
            {capture.entities.map((entity: any, i: number) => (
              <View key={i} className="bg-surface-container-high px-4 py-2.5 rounded-xl">
                <Text className="text-on-surface-variant font-medium text-label-sm tracking-wide">{entity.entity_value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
