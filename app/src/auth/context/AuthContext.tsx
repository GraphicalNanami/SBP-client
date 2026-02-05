'use client';

/**
 * Auth Context Provider
 * Global authentication state management using React Context
 */

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '@/src/shared/lib/auth/auth-service';
import { handleApiError } from '@/src/shared/utils/error-handler';
import type { User } from '@/src/shared/types/auth.types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = Boolean(user);

  // Clear error helper
  const clearError = () => setError(null);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      clearError();
      
      const userData = await authService.login({ email, password });
      setUser(userData);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err; // Re-throw for component handling
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      clearError();
      
      const userData = await authService.register({ email, password, name });
      setUser(userData);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err; // Re-throw for component handling
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (err) {
      console.warn('Logout failed:', err);
    } finally {
      setUser(null);
      setIsLoading(false);
      clearError();
    }
  };

  // Refresh authentication (restore session)
  const refreshAuth = async () => {
    try {
      setIsLoading(true);
      
      if (!authService.isAuthenticated()) {
        return; // No tokens, user is not logged in
      }

      const userData = await authService.refreshToken();
      setUser(userData);
    } catch (err) {
      console.warn('Auth refresh failed:', err);
      // Clear invalid tokens
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    refreshAuth();
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    signup,
    logout,
    refreshAuth,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}