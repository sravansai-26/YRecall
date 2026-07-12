import { create } from 'zustand';

interface WorkspaceState {
  activeWorkspaceId: string | null; // null means "Personal Workspace"
  setActiveWorkspaceId: (id: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWorkspaceId: null,
  setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
}));
