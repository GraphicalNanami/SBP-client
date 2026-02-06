/**
 * API Client
 * Base fetch wrapper with automatic token injection and error handling
 */

import { config } from '@/src/shared/lib/config/env';
import { handleApiError } from '@/src/shared/utils/error-handler';
import type { ApiError } from '@/src/shared/types/api.types';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get access token from TokenManager
    const accessToken = this.getAccessToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw errorData;
      }

      // Handle successful response
      const data = await response.json();
      return data;
    } catch (error) {
      // Re-throw API errors as-is, transform other errors
      if (this.isApiError(error)) {
        throw error;
      }
      throw new Error(handleApiError(error));
    }
  }

  private async parseErrorResponse(response: Response): Promise<ApiError> {
    try {
      const errorData = await response.json();
      return {
        status: response.status,
        message: errorData.message || `HTTP ${response.status}`,
        field: errorData.field,
      };
    } catch {
      // If parsing fails, create a generic error
      return {
        status: response.status,
        message: `HTTP ${response.status}`,
      };
    }
  }

  private isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'message' in error
    );
  }

  private getAccessToken(): string | null {
    // This will be injected by TokenManager when it's created
    if (typeof window === 'undefined') return null;
    
    // Try memory first, then sessionStorage
    const memoryToken = (globalThis as any).__accessToken__;
    if (memoryToken) return memoryToken;
    
    try {
      return sessionStorage.getItem('accessToken');
    } catch {
      return null;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient(config.apiUrl);