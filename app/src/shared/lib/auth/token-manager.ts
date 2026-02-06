/**
 * Token Manager
 * Manages token storage in sessionStorage + memory for security
 */

class TokenManager {
  private accessToken: string | null = null;
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  constructor() {
    // Initialize from sessionStorage on creation (client-side only)
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    try {
      this.accessToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
      // Also set global variable for API client
      (globalThis as { __accessToken__?: string | null }).__accessToken__ = this.accessToken;
    } catch (error) {
      console.warn('Failed to load tokens from storage:', error);
    }
  }

  /**
   * Get access token (try memory first, fallback to sessionStorage)
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    if (this.accessToken) {
      return this.accessToken;
    }
    
    try {
      this.accessToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
      return this.accessToken;
    } catch {
      return null;
    }
  }

  /**
   * Store access token in memory and sessionStorage
   */
  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    
    this.accessToken = token;
    (globalThis as { __accessToken__?: string | null }).__accessToken__ = token;
    
    try {
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.warn('Failed to store access token:', error);
    }
  }

  /**
   * Get refresh token from sessionStorage
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Store refresh token in sessionStorage
   */
  setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.warn('Failed to store refresh token:', error);
    }
  }

  /**
   * Clear all tokens from memory and storage
   */
  clearTokens(): void {
    this.accessToken = null;
    (globalThis as { __accessToken__?: string | null }).__accessToken__ = null;
    
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to clear tokens:', error);
    }
  }

  /**
   * Check if user is authenticated (has tokens)
   */
  isAuthenticated(): boolean {
    return Boolean(this.getAccessToken() && this.getRefreshToken());
  }
}

// Create and export singleton instance
export const tokenManager = new TokenManager();