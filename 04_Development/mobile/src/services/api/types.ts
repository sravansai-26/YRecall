export type ApiErrorResponse = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};
