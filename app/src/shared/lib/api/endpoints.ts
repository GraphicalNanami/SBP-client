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
    UPDATE: '/profile/me',
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