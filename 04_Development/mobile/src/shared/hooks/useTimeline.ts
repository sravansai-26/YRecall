import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';
import { Capture } from '../../modules/captures/services/api';

export interface TimelineFilters {
  type?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}

interface TimelineResponse {
  success: boolean;
  message: string;
  data: Capture[];
  meta: {
    page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
  }
}

export function useTimeline(filters: TimelineFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['timeline', filters],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await apiClient.get<TimelineResponse>('/timeline', {
        params: {
          skip: pageParam,
          limit: 20,
          type: filters.type,
          search: filters.search,
          start_date: filters.start_date,
          end_date: filters.end_date
        }
      });
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.meta) return undefined;
      const { page, total_pages, page_size } = lastPage.meta;
      if (page < total_pages) {
        return page * page_size;
      }
      return undefined;
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useTimelineStats() {
  return useQuery({
    queryKey: ['timeline-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/timeline/stats');
      return data.data;
    }
  });
}

export function useCapture(id: string) {
  return useQuery({
    queryKey: ['capture', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/captures/${id}`);
      return data.data as Capture;
    },
    enabled: !!id
  });
}

export function useRelatedMemories(id: string) {
  return useQuery({
    queryKey: ['capture-related', id],
    queryFn: async () => {
      const { data } = await apiClient.get<TimelineResponse>(`/timeline/${id}/related`);
      return data.data;
    },
    enabled: !!id
  });
}
