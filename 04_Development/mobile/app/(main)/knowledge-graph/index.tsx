import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { graphApi } from '../../../src/modules/graph/api';

export default function KnowledgeGraphScreen() {
  const router = useRouter();
  const [data, setData] = useState<{ nodes: any[]; links: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchGraph();
  }, []);

  const fetchGraph = async () => {
    try {
      setLoading(true);
      const res = await graphApi.getNetwork();
      setData(res.data);
      setError(false);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const onMessage = (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'NODE_CLICKED') {
        router.push(`/(main)/knowledge-graph/entity/${msg.id}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
      <script src="https://d3js.org/d3.v7.min.js"></script>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background-color: #fafafa; overflow: hidden; font-family: -apple-system, system-ui, sans-serif; }
        #graph { width: 100%; height: 100%; }
        .node circle { stroke: #fff; stroke-width: 1.5px; }
        .node text { font-size: 10px; fill: #1c1b1f; pointer-events: none; font-weight: 500; }
        .link { stroke: #cac4d0; stroke-opacity: 0.6; }
      </style>
    </head>
    <body>
      <div id="graph"></div>
      <script>
        const data = ${JSON.stringify(data || { nodes: [], links: [] })};
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        
        const zoom = d3.zoom()
          .scaleExtent([0.1, 4])
          .on("zoom", (event) => {
            g.attr("transform", event.transform);
          });
          
        const svg = d3.select("#graph").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);
            
        const g = svg.append("g");
        
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2));
            
        const link = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .join("line")
            .attr("class", "link")
            .attr("stroke-width", d => Math.sqrt(d.value));
            
        const node = g.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(data.nodes)
            .join("g")
            .attr("class", "node")
            .on("click", (event, d) => {
               window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'NODE_CLICKED', id: d.id }));
            });
            
        node.append("circle")
            .attr("r", 15)
            .attr("fill", d => color(d.group));
            
        node.append("text")
            .attr("x", 18)
            .attr("y", 3)
            .text(d => d.name);
            
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
                
            node
                .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
        });
      </script>
    </body>
    </html>
  `;

  return (
    <Screen scrollable={false} className="flex-1 bg-surface">
      <View className="absolute top-0 w-full z-40 bg-surface/80 flex-row items-center justify-between px-margin-mobile h-16 border-b border-outline-variant/10">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">Neural Network</Text>
        </View>
        <TouchableOpacity onPress={fetchGraph} className="p-2 rounded-full">
          <MaterialIcons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 pt-16">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="font-body-md text-on-surface-variant mt-4">Connecting memories...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center p-6">
            <MaterialIcons name="error-outline" size={48} color={colors.error} />
            <Text className="font-body-md text-on-surface-variant mt-4 text-center">Failed to load graph.</Text>
            <TouchableOpacity onPress={fetchGraph} className="mt-6 px-6 py-3 bg-primary rounded-full">
              <Text className="text-white font-bold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : data?.nodes.length === 0 ? (
          <View className="flex-1 items-center justify-center p-6">
            <View className="w-16 h-16 rounded-2xl bg-secondary/10 items-center justify-center mb-4">
              <MaterialIcons name="hub" size={32} color={colors.secondary} />
            </View>
            <Text className="font-headline-sm text-lg font-bold text-primary">No connections yet</Text>
            <Text className="font-body-md text-on-surface-variant mt-2 text-center">Capture some memories to start building your neural network.</Text>
          </View>
        ) : (
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={{ flex: 1, backgroundColor: 'transparent' }}
            onMessage={onMessage}
            scrollEnabled={false}
            bounces={false}
          />
        )}
      </View>
    </Screen>
  );
}
