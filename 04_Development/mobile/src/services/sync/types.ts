export type SyncQueueItem = {
  id: string;
  operation: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type SyncEngine = {
  enqueue: (item: Omit<SyncQueueItem, 'id' | 'createdAt'>) => SyncQueueItem;
  flush: () => Promise<void>;
};
