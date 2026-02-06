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