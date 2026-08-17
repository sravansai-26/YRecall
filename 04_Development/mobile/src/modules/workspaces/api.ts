import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';

export interface Workspace {
 id: string;
 name: string;
 description?: string;
 avatar?: string;
 visibility: string;
 color?: string;
 created_at: string;
}

export const useWorkspaces = () => {
 return useQuery({
 queryKey: ['workspaces'],
 queryFn: async () => {
 const response = await apiClient.get<Workspace[]>('/collaboration/workspaces');
 return response.data;
 }
 });
};

export const useCreateWorkspace = () => {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async (data: Partial<Workspace>) => {
 const response = await apiClient.post<Workspace>('/collaboration/workspaces', data);
 return response.data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['workspaces'] });
 }
 });
};

export const useDeleteWorkspace = () => {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async (id: string) => {
 const { data } = await apiClient.delete(`/collaboration/workspaces/${id}`);
 return data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['workspaces'] });
 },
 });
};

export const useShareCaptureToWorkspace = () => {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async ({ workspaceId, captureId }: { workspaceId: string, captureId: string }) => {
 const { data } = await apiClient.post(`/collaboration/workspaces/${workspaceId}/captures/${captureId}`);
 return data;
 },
 onSuccess: (_, variables) => {
 queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });
 queryClient.invalidateQueries({ queryKey: ['captures'] });
 },
 });
};

export const useAcceptInvitation = () => {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async (token: string) => {
 const { data } = await apiClient.post(`/collaboration/invitations/accept?token=${token}`);
 return data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['workspaces'] });
 },
 });
};

export const useWorkspace = (id: string | null) => {
  return useQuery({
    queryKey: ['workspace', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<Workspace>(`/collaboration/workspaces/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useWorkspaceMembers = (id: string | null) => {
  return useQuery({
    queryKey: ['workspace', id, 'members'],
    queryFn: async () => {
      if (!id) return [];
      const response = await apiClient.get<any[]>(`/collaboration/workspaces/${id}/members`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useLeaveWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/collaboration/workspaces/${id}/leave`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

export const useRemoveWorkspaceMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workspaceId, userId }: { workspaceId: string, userId: string }) => {
      const { data } = await apiClient.delete(`/collaboration/workspaces/${workspaceId}/members/${userId}`);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId, 'members'] });
    },
  });
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workspaceId, data }: { workspaceId: string, data: any }) => {
      const response = await apiClient.post(`/collaboration/workspaces/${workspaceId}/invitations`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId, 'invitations'] });
    },
  });
};

export const useWorkspaceInvitations = (id: string | null) => {
  return useQuery({
    queryKey: ['workspace', id, 'invitations'],
    queryFn: async () => {
      if (!id) return [];
      const response = await apiClient.get<any[]>(`/collaboration/workspaces/${id}/invitations`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useRevokeInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workspaceId, invitationId }: { workspaceId: string, invitationId: string }) => {
      const { data } = await apiClient.delete(`/collaboration/workspaces/${workspaceId}/invitations/${invitationId}`);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId, 'invitations'] });
    },
  });
};
