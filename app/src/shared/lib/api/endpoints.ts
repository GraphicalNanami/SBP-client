/**
 * API Endpoints Configuration
 */

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  PROFILE: {
    ME: '/profile/me',
  },
} as const;