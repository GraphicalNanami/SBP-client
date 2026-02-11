/**
 * API Client
 * Base fetch wrapper with automatic token injection and error handling
 */

import { config } from '@/src/shared/lib/config/env';
import { handleApiError } from '@/src/shared/utils/error-handler';
import type { ApiError } from '@/src/shared/types/api.types';

class ApiClient {
  private baseUrl: string;
  private onUnauthorized: (() => void) | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set callback to handle 401 Unauthorized responses
   * This will be called by AuthContext to trigger automatic logout
   */
  setUnauthorizedHandler(handler: () => void): void {
    this.onUnauthorized = handler;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isFormData: boolean = false
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get access token from TokenManager
    const accessToken = this.getAccessToken();
    
    // Build headers object
    const headers: Record<string, string> = {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      'ngrok-skip-browser-warning': 'true', // Bypass ngrok browser warning
    };

    // Only set Content-Type for non-FormData requests
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        
        // Global Unauthorized handler - automatically logout on 401
        if (response.status === 401 && this.onUnauthorized) {
          console.warn('🔒 Unauthorized access detected - logging out user');
          this.onUnauthorized();
        }
        
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
    const memoryToken = (globalThis as { __accessToken__?: string }).__accessToken__;
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
    const isFormData = body instanceof FormData;
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: isFormData ? body : JSON.stringify(body),
      },
      isFormData
    );
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: isFormData ? body : JSON.stringify(body),
      },
      isFormData
    );
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: isFormData ? body : JSON.stringify(body),
      },
      isFormData
    );
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient(config.apiUrl);