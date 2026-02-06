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
  USERS: {
    SEARCH: '/users/search',
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
  HACKATHONS: {
    // Public endpoints
    PUBLIC_LIST: '/hackathons/public/list',
    PUBLIC_DETAIL: (slug: string) => `/hackathons/public/${slug}`,

    // Organizer endpoints
    CREATE: '/hackathons',
    BY_ID: (id: string) => `/hackathons/${id}`,
    BY_ORG: (orgId: string) => `/hackathons/organization/${orgId}`,
    UPDATE: (id: string) => `/hackathons/${id}`, // Comprehensive update endpoint
    UPDATE_GENERAL: (id: string) => `/hackathons/${id}/general`,
    UPDATE_SUBMISSION_REQUIREMENTS: (id: string) => `/hackathons/${id}/submission-requirements`,
    SUBMIT_FOR_REVIEW: (id: string) => `/hackathons/${id}/submit-for-review`,
    CANCEL: (id: string) => `/hackathons/${id}/cancel`,
    ARCHIVE: (id: string) => `/hackathons/${id}/archive`,

    // Tracks
    TRACKS: (hackathonId: string) => `/hackathons/${hackathonId}/tracks`,
    TRACK_BY_ID: (hackathonId: string, trackId: string) => `/hackathons/${hackathonId}/tracks/${trackId}`,

    // Custom Questions
    CUSTOM_QUESTIONS: (hackathonId: string) => `/hackathons/${hackathonId}/custom-questions`,
    CUSTOM_QUESTION_BY_ID: (hackathonId: string, questionId: string) => `/hackathons/${hackathonId}/custom-questions/${questionId}`,

    // Prizes
    PRIZES: (hackathonId: string) => `/hackathons/${hackathonId}/prizes`,
    PRIZE_BY_ID: (hackathonId: string, prizeId: string) => `/hackathons/${hackathonId}/prizes/${prizeId}`,

    // Administrators
    ADMINISTRATORS: (hackathonId: string) => `/hackathons/${hackathonId}/administrators`,
    INVITE_ADMIN: (hackathonId: string) => `/hackathons/${hackathonId}/administrators/invite`,
    ADMIN_PERMISSIONS: (hackathonId: string, adminId: string) => `/hackathons/${hackathonId}/administrators/${adminId}/permissions`,
    REMOVE_ADMIN: (hackathonId: string, adminId: string) => `/hackathons/${hackathonId}/administrators/${adminId}`,

    // Judges
    JUDGES: (hackathonId: string) => `/hackathons/${hackathonId}/judges`,
    INVITE_JUDGE: (hackathonId: string) => `/hackathons/${hackathonId}/judges/invite`,
    JUDGE_TRACKS: (hackathonId: string, judgeId: string) => `/hackathons/${hackathonId}/judges/${judgeId}/tracks`,
    REMOVE_JUDGE: (hackathonId: string, judgeId: string) => `/hackathons/${hackathonId}/judges/${judgeId}`,

    // Winners
    WINNERS: (hackathonId: string) => `/hackathons/${hackathonId}/winners`,
    ASSIGN_WINNER: (hackathonId: string) => `/hackathons/${hackathonId}/winners`,
    UPDATE_DISTRIBUTION: (hackathonId: string, winnerId: string) => `/hackathons/${hackathonId}/winners/${winnerId}/distribution`,
    REMOVE_WINNER: (hackathonId: string, winnerId: string) => `/hackathons/${hackathonId}/winners/${winnerId}`,

    // Analytics
    INSIGHTS: (hackathonId: string) => `/hackathons/${hackathonId}/analytics/insights`,
    DAILY_TRENDS: (hackathonId: string) => `/hackathons/${hackathonId}/analytics/daily-trends`,
    TRAFFIC_SOURCES: (hackathonId: string) => `/hackathons/${hackathonId}/analytics/traffic-sources`,

    // Registrations (organizer view)
    REGISTRATIONS: (hackathonId: string) => `/hackathons/${hackathonId}/registrations`,
    EXPORT_REGISTRATIONS: (hackathonId: string) => `/hackathons/${hackathonId}/registrations/export`,

    // Submissions (organizer view)
    SUBMISSIONS: (hackathonId: string) => `/hackathons/${hackathonId}/submissions`,
    SUBMISSION_BY_ID: (hackathonId: string, submissionId: string) => `/hackathons/${hackathonId}/submissions/${submissionId}`,
    UPDATE_SUBMISSION_STATUS: (hackathonId: string, submissionId: string) => `/hackathons/${hackathonId}/submissions/${submissionId}/status`,
  },
  PARTICIPANT: {
    // Participant registration endpoints
    REGISTER: '/participant/registrations',
    MY_REGISTRATIONS: '/participant/registrations',
    UPDATE_REGISTRATION: (id: string) => `/participant/registrations/${id}`,
    CANCEL_REGISTRATION: (id: string) => `/participant/registrations/${id}`,

    // Participant submission endpoints
    SUBMIT_PROJECT: '/participant/submissions',
    MY_SUBMISSIONS: '/participant/submissions',
    SUBMISSION_DETAIL: (id: string) => `/participant/submissions/${id}`,
    UPDATE_SUBMISSION: (id: string) => `/participant/submissions/${id}`,
    DELETE_SUBMISSION: (id: string) => `/participant/submissions/${id}`,
  },
  EVENTS_INDEXER: {
    STATS: '/events-indexer/stats',
    RECENT_POSTS: '/events-indexer/posts/recent',
    MATCH_TOPIC: (topic: string) => `/events-indexer/topics/${encodeURIComponent(topic)}/match`,
  },
} as const;