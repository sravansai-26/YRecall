import { View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../src/services/api/client';
import { useMemo } from 'react';

const { width } = Dimensions.get('window');

interface EntityNode {
  name: string;
  count: number;
  type: string;
  x: number;
  y: number;
  size: number;
}

export default function KnowledgeGraphScreen() {
  const router = useRouter();

  const { data: captures, isLoading } = useQuery({
    queryKey: ['captures', 'all'],
    queryFn: async () => {
      const response = await apiClient.get('/captures?limit=100');
      return response.data.data;
    }
  });

  const nodes = useMemo(() => {
    if (!captures) return [];
    
    const entityMap: Record<string, { count: number, type: string }> = {};
    
    captures.forEach((capture: any) => {
      if (capture.entities && capture.entities.length > 0) {
        capture.entities.forEach((ent: any) => {
          const key = ent.entity_value.toLowerCase();
          if (!entityMap[key]) {
            entityMap[key] = { count: 0, type: ent.entity_type };
          }
          entityMap[key].count += 1;
        });
      }
    });

    const items = Object.keys(entityMap).map(key => ({
      name: key,
      ...entityMap[key]
    })).sort((a, b) => b.count - a.count).slice(0, 30); // Top 30

    // Distribute them in a circle or spiral
    const canvasSize = 800;
    const center = canvasSize / 2;
    
    return items.map((item, index) => {
      // Golden ratio spiral
      const angle = index * 137.5 * (Math.PI / 180);
      const radius = 50 + (index * 12);
      
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const size = Math.max(60, Math.min(120, 60 + (item.count * 15)));
      
      return {
        ...item,
        x: x - (size / 2),
        y: y - (size / 2),
        size
      };
    });
  }, [captures]);

  return (
    <Screen scrollable={false}>
      {/* TopAppBar */}
      <View className="w-full bg-surface flex-row items-center justify-between px-margin-mobile h-16 border-b border-outline-variant/10">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">Knowledge Graph</Text>
        </View>
      </View>
      
      <View className="flex-1 bg-background">
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 16, color: colors.outline }}>Mapping your memory network...</Text>
          </View>
        ) : nodes.length === 0 ? (
          <View className="flex-1 items-center justify-center p-6">
            <MaterialIcons name="hub" size={80} color={colors['primary-container']} />
            <Text className="font-headline-sm text-2xl font-bold text-primary mt-6 text-center">Your Memory Network</Text>
            <Text className="font-body-md text-base text-on-surface-variant mt-2 text-center max-w-[300px]">
              No connected ideas found. Try capturing some notes or images first!
            </Text>
          </View>
        ) : (
          <ScrollView horizontal>
            <ScrollView>
              <View style={{ width: 800, height: 800, position: 'relative' }}>
                {nodes.map((node, i) => (
                  <View 
                    key={i}
                    style={{
                      position: 'absolute',
                      left: node.x,
                      top: node.y,
                      width: node.size,
                      height: node.size,
                      borderRadius: node.size / 2,
                      backgroundColor: colors['secondary-container'],
                      borderWidth: 2,
                      borderColor: colors.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 8,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 6,
                      elevation: 4
                    }}
                  >
                    <Text 
                      style={{ 
                        color: colors['on-secondary-container'], 
                        textAlign: 'center', 
                        fontFamily: 'PublicSans_600SemiBold',
                        fontSize: Math.max(10, Math.min(16, node.size / 6))
                      }}
                      numberOfLines={2}
                    >
                      {node.name}
                    </Text>
                    <Text 
                      style={{ 
                        color: colors.primary, 
                        textAlign: 'center', 
                        fontFamily: 'PublicSans_400Regular',
                        fontSize: 10,
                        marginTop: 4
                      }}
                    >
                      {node.count} {node.count === 1 ? 'Capture' : 'Captures'}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}
