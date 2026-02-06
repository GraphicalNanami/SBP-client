/**
 * API Client Configuration
 * Handles HTTP requests with authentication and error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Get authentication token from storage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  // Try localStorage first
  let token = localStorage.getItem('access_token');

  // Fallback to sessionStorage
  if (!token) {
    token = sessionStorage.getItem('access_token');
  }

  return token;
}

/**
 * Build headers with authentication if needed
 */
function buildHeaders(requiresAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Generic API request handler
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = buildHeaders(requiresAuth);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...headers,
        ...fetchOptions.headers,
      },
    });

    // Handle non-JSON responses (204 No Content)
    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || response.statusText,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(
      0,
      error instanceof Error ? error.message : 'Network error',
      null
    );
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T>(endpoint: string, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
