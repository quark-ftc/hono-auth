import { ApiResponse } from '@/commons/types/api-response';
import type { boolean, string } from 'zod';

export const createResponse = <T>({
  success,
  message,
  error,
  data,
}: Omit<ApiResponse<T>, 'timestamp'>) => {
  if (typeof message == 'undefined') {
    message = success ? 'Success' : 'Failed';
  }
  const response: ApiResponse<T> = {
    success,
    data,
    error,
    message,
    timestamp: new Date().toISOString(),
  };
  return response;
};
