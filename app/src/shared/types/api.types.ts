/**
 * API Response Type Definitions
 */

export interface ApiError {
  status: number;
  message: string;
  field?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}