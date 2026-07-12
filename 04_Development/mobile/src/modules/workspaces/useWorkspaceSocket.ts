import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWorkspaceStore } from './store';
import { useAuthStore } from '../../shared/store/useAuthStore';

export const useWorkspaceSocket = () => {
  const { activeWorkspaceId } = useWorkspaceStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!activeWorkspaceId || !user) return;

    // Use environment variable or default fallback for WS URL
    // Convert http/https to ws/wss
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.22.136.223:8000/api/v1';
    const wsBase = baseUrl.replace('http://', 'ws://').replace('https://', 'wss://');
    const wsUrl = `${wsBase}/collaboration/ws/${activeWorkspaceId}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log(`[WebSocket] Connected to workspace ${activeWorkspaceId}`);
    };

    ws.current.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log('[WebSocket] Message received:', payload);

        if (payload.event === 'CAPTURE_SHARED' || payload.event === 'CAPTURE_ADDED') {
          // Refetch captures to show the new one
          queryClient.invalidateQueries({ queryKey: ['captures'] });
        }
        if (payload.event === 'WORKSPACE_UPDATED') {
          // Refetch workspace details
          queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspaceId] });
        }
      } catch (e) {
        console.error('[WebSocket] Failed to parse message', e);
      }
    };

    ws.current.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
    };

    ws.current.onclose = () => {
      console.log(`[WebSocket] Disconnected from workspace ${activeWorkspaceId}`);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [activeWorkspaceId, user, queryClient]);

  return {
    socket: ws.current
  };
};
