import { api } from '../../../src/services/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface MigrationJob {
    id: string;
    job_type: 'import' | 'export' | 'restore';
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    current_stage: string | null;
    progress_percentage: number;
    archive_format: string | null;
    categories: string[];
    processed_items: number;
    total_items: number;
    file_url: string | null;
    file_size_bytes: number | null;
    error_log: string | null;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
}

export interface ExportRequest {
    categories: string[];
    archive_format: string;
    compression_type: string;
}

export interface ImportConfirmRequest {
    file_url: string;
    restore_mode: string;
}

export const useMigrationJobs = () => {
    return useQuery<MigrationJob[]>({
        queryKey: ['migration_jobs'],
        queryFn: async () => {
            const res = await api.get('/migration/jobs');
            return res.data;
        },
        refetchInterval: (query) => {
            // Poll frequently if there are running jobs
            const data = query.state?.data as MigrationJob[] | undefined;
            const hasRunning = data?.some(j => j.status === 'running' || j.status === 'pending');
            return hasRunning ? 3000 : 30000;
        }
    });
};

export const useCreateExport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (req: ExportRequest) => {
            const res = await api.post('/migration/export', req);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['migration_jobs'] });
        }
    });
};

export const useConfirmImport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (req: ImportConfirmRequest) => {
            const res = await api.post('/migration/import', req);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['migration_jobs'] });
        }
    });
};
