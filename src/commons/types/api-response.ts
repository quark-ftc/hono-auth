export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  timestamp: string;
  data?: T;
}
