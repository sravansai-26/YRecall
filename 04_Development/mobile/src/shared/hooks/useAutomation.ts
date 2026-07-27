import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api/client';

export interface Reminder {
 id: string;
 title: string;
 description?: string;
 priority: string;
 due_date?: string;
 status: string;
 created_by_automation: boolean;
 confidence_score?: number;
 ai_reasoning?: string;
}

export interface Suggestion {
 id: string;
 suggestion_type: string;
 proposed_configuration: any;
 reasoning?: string;
}

export function useReminders(status: string = "pending") {
 return useQuery({
 queryKey: ['reminders', status],
 queryFn: async () => {
 const { data } = await apiClient.get<Reminder[]>(`/automation/reminders?status=${status}`);
 return data;
 }
 });
}

export function useUpdateReminder() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async ({ id, updates }: { id: string, updates: Partial<Reminder> }) => {
 const { data } = await apiClient.put(`/automation/reminders/${id}`, updates);
 return data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['reminders'] });
 }
 });
}

export function useDeleteReminder() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async (id: string) => {
 const { data } = await apiClient.delete(`/automation/reminders/${id}`);
 return data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['reminders'] });
 }
 });
}

export function useSuggestions() {
 return useQuery({
 queryKey: ['automation-suggestions'],
 queryFn: async () => {
 const { data } = await apiClient.get<Suggestion[]>('/automation/suggestions');
 return data;
 }
 });
}

export function useAcceptSuggestion() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async (id: string) => {
 const { data } = await apiClient.post(`/automation/suggestions/${id}/accept`);
 return data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['automation-suggestions'] });
 queryClient.invalidateQueries({ queryKey: ['reminders'] });
 }
 });
}

export function useDismissSuggestion() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async (id: string) => {
 const { data } = await apiClient.post(`/automation/suggestions/${id}/dismiss`);
 return data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['automation-suggestions'] });
 }
 });
}

// --- Automation Center Extensions ---

export interface WorkflowTrigger {
 trigger_type: string;
 configuration: any;
}

export interface WorkflowAction {
 action_type: string;
 configuration: any;
}

export interface WorkflowCondition {
 condition_type: string;
 configuration: any;
}

export interface Workflow {
 id: string;
 name: string;
 description?: string;
 is_active: boolean;
 triggers: WorkflowTrigger[];
 actions: WorkflowAction[];
 conditions: WorkflowCondition[];
}

export interface ExecutionLog {
 message: string;
 level: string;
 created_at: string;
}

export interface Execution {
 id: string;
 workflow_id: string;
 workflow_name: string;
 status: string;
 started_at: string;
 completed_at?: string;
 error_message?: string;
 logs: ExecutionLog[];
}

export interface AutomationStats {
 running_automations: number;
 scheduled: number;
 paused: number;
 completed_today: number;
 completed_this_week: number;
 failed_executions: number;
 pending_approvals: number;
 queued_jobs: number;
 success_rate: number;
}

export function useAutomationStats() {
 return useQuery({
 queryKey: ['automation-stats'],
 queryFn: async () => {
 const { data } = await apiClient.get<AutomationStats>('/automation/stats');
 return data;
 }
 });
}

export function useWorkflows() {
 return useQuery({
 queryKey: ['automation-workflows'],
 queryFn: async () => {
 const { data } = await apiClient.get<Workflow[]>('/automation/workflows');
 return data;
 }
 });
}

export function useExecutions() {
 return useQuery({
 queryKey: ['automation-executions'],
 queryFn: async () => {
 const { data } = await apiClient.get<Execution[]>('/automation/executions');
 return data;
 },
 refetchInterval: 10000 // refresh every 10s for live feel
 });
}

export function useCreateWorkflow() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async (workflowData: Partial<Workflow>) => {
 const { data } = await apiClient.post(`/automation/workflows`, workflowData);
 return data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['automation-workflows'] });
 queryClient.invalidateQueries({ queryKey: ['automation-stats'] });
 }
 });
}

export function useUpdateWorkflow() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async ({ id, updates }: { id: string, updates: Partial<Workflow> }) => {
 const { data } = await apiClient.put(`/automation/workflows/${id}`, updates);
 return data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['automation-workflows'] });
 queryClient.invalidateQueries({ queryKey: ['automation-stats'] });
 }
 });
}

export function useDeleteWorkflow() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: async (id: string) => {
 const { data } = await apiClient.delete(`/automation/workflows/${id}`);
 return data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['automation-workflows'] });
 queryClient.invalidateQueries({ queryKey: ['automation-stats'] });
 }
 });
}
