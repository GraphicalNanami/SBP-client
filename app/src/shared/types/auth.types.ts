/**
 * Authentication Type Definitions
 */

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'USER' | 'ORGANIZER' | 'ADMIN';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

// Wallet Authentication Types
export interface WalletChallenge {
  challenge: string;
  expiresAt: string;
}

export interface WalletCheckResponse {
  exists: boolean;
  userExists: boolean;
  message: string;
}

export interface WalletLoginCredentials {
  walletAddress: string;
  signature: string;
  challenge: string;
}

export interface WalletRegisterCredentials {
  walletAddress: string;
  signature: string;
  challenge: string;
  name: string;
  email?: string;
}