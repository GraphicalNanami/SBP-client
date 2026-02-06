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
    UPDATE_PERSONAL_INFO: '/profile/personal-info',
    UPLOAD_PICTURE: '/profile/upload-picture',
  },
  EXPERIENCE: {
    ME: '/experience/me',
    UPDATE: '/experience',
    PATCH: '/experience',
  },
  WALLETS: {
    LIST: '/wallets',
    CREATE: '/wallets',
    UPDATE: (id: string) => `/wallets/${id}`,
    DELETE: (id: string) => `/wallets/${id}`,
    VERIFY: (id: string) => `/wallets/${id}/verify`,
    SET_PRIMARY: (id: string) => `/wallets/${id}/set-primary`,
  },
  SOCIAL: {
    CONNECT_GITHUB: '/social/github/connect',
    CONNECT_TWITTER: '/social/twitter/connect',
    DISCONNECT: (provider: string) => `/social/${provider}`,
  },
  ORGANIZATIONS: {
    LIST: '/organizations',
    CREATE: '/organizations',
    ME: '/organizations/me',
    BY_ID: (id: string) => `/organizations/${id}`,
    PROFILE: (id: string) => `/organizations/${id}/profile`,
    SOCIAL_LINKS: (id: string) => `/organizations/${id}/social-links`,
    MEMBERS: (id: string) => `/organizations/${id}/members`,
    INVITE_MEMBER: (id: string) => `/organizations/${id}/members/invite`,
    MEMBER_ROLE: (orgId: string, memberId: string) => `/organizations/${orgId}/members/${memberId}/role`,
    REMOVE_MEMBER: (orgId: string, memberId: string) => `/organizations/${orgId}/members/${memberId}`,
    HACKATHONS: (id: string) => `/organizations/${id}/hackathons`,
  },
} as const;