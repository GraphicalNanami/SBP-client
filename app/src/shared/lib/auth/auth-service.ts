/**
 * Auth Service
 * Handles authentication API calls and token management
 */

import { apiClient } from '@/src/shared/lib/api/client';
import { ENDPOINTS } from '@/src/shared/lib/api/endpoints';
import { tokenManager } from '@/src/shared/lib/auth/token-manager';
import type { 
  User, 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials 
} from '@/src/shared/types/auth.types';

class AuthService {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // Store tokens
    tokenManager.setAccessToken(response.accessToken);
    tokenManager.setRefreshToken(response.refreshToken);

    return response.user;
  }

  /**
   * Register new user account
   */
  async register(credentials: RegisterCredentials): Promise<User> {
    const response = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.REGISTER,
      credentials
    );

    // Store tokens
    tokenManager.setAccessToken(response.accessToken);
    tokenManager.setRefreshToken(response.refreshToken);

    return response.user;
  }

  /**
   * Log out user and clear tokens
   */
  async logout(): Promise<void> {
    const refreshToken = tokenManager.getRefreshToken();
    
    if (refreshToken) {
      try {
        await apiClient.post<void>(ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      } catch (error) {
        // Log error but still clear local tokens
        console.warn('Logout API call failed:', error);
      }
    }

    // Always clear tokens locally
    tokenManager.clearTokens();
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<User> {
    const refreshToken = tokenManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );

    // Store new tokens
    tokenManager.setAccessToken(response.accessToken);
    tokenManager.setRefreshToken(response.refreshToken);

    return response.user;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(ENDPOINTS.PROFILE.ME);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }
}

// Create and export singleton instance
export const authService = new AuthService();