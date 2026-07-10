import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../../../../src/shared/components';
import { colors } from '../../../../src/shared/theme/colors';
import { graphApi } from '../../../../src/modules/graph/api';
import { format } from 'date-fns';

export default function EntityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [entity, setEntity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchEntity();
  }, [id]);

  const fetchEntity = async () => {
    try {
      setLoading(true);
      const res = await graphApi.getEntityDetail(id);
      setEntity(res.data.data);
      setError(false);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch(type.toLowerCase()) {
      case 'person': return 'person';
      case 'organization': return 'business';
      case 'location': return 'place';
      case 'project': return 'work';
      case 'technology': return 'computer';
      default: return 'label';
    }
  };

  if (loading) {
    return (
      <Screen scrollable={false} className="flex-1 bg-surface">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (error || !entity) {
    return (
      <Screen scrollable={false} className="flex-1 bg-surface">
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-on-surface-variant mb-4">Failed to load entity details.</Text>
          <TouchableOpacity onPress={() => router.back()} className="px-6 py-2 bg-primary/10 rounded-full">
            <Text className="text-primary font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable={true} className="flex-1 bg-surface pb-32">
      <View className="w-full sticky top-0 z-40 bg-surface/90 flex-row items-center justify-between px-margin-mobile h-16 border-b border-outline-variant/10">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full">
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="font-title-sm text-lg text-primary font-bold truncate flex-1 text-center" numberOfLines={1}>{entity.name}</Text>
        <View className="w-10" />
      </View>

      <View className="px-margin-mobile pt-6">
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
            <MaterialIcons name={getIconForType(entity.type)} size={40} color={colors.primary} />
          </View>
          <Text className="font-headline-md text-2xl font-bold text-primary mb-1">{entity.name}</Text>
          <View className="bg-secondary/10 px-3 py-1 rounded-full">
            <Text className="font-label-sm text-xs text-secondary font-bold uppercase">{entity.type}</Text>
          </View>
        </View>

        {entity.description && (
          <View className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 shadow-sm mb-6">
            <Text className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-2">AI Summary</Text>
            <Text className="font-body-md text-on-surface">{entity.description}</Text>
          </View>
        )}

        <View className="mb-8">
          <Text className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-4 px-1">Connections ({entity.connections?.length || 0})</Text>
          
          <View className="gap-3">
            {entity.connections?.map((conn: any, idx: number) => (
              <TouchableOpacity 
                key={idx}
                onPress={() => router.push(`/(main)/knowledge-graph/entity/${conn.entity_id}`)}
                className="bg-white rounded-xl p-4 border border-outline-variant/20 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <MaterialCommunityIcons 
                    name={conn.direction === 'out' ? 'ray-start-arrow' : 'ray-end-arrow'} 
                    size={20} 
                    color={colors.secondary} 
                  />
                  <View>
                    <Text className="font-caption-sm text-xs text-secondary mb-0.5">{conn.relationship_type.replace(/_/g, ' ')}</Text>
                    <Text className="font-title-sm text-base font-bold text-primary">{conn.name}</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
              </TouchableOpacity>
            ))}
            
            {(!entity.connections || entity.connections.length === 0) && (
              <Text className="text-on-surface-variant italic px-1">No connections established yet.</Text>
            )}
          </View>
        </View>

      </View>
    </Screen>
  );
}
