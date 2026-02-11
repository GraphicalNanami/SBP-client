/**
 * Hackathon API Service
 * Handles all hackathon-related API calls using the centralized API client
 */

import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type {
  BackendHackathon,
  BackendTrack,
  BackendCustomQuestion,
  BackendPrize,
  BackendHackathonAdministrator,
  BackendJudge,
  BackendRegistration,
  BackendSubmission,
  BackendWinner,
  CreateHackathonPayload,
  UpdateHackathonGeneralPayload,
  UpdateHackathonPayload,
  UpdateSubmissionRequirementsPayload,
  TrackPayload,
  CustomQuestionPayload,
  PrizePayload,
  InviteAdminPayload,
  UpdateAdminPermissionsPayload,
  InviteJudgePayload,
  UpdateJudgeTracksPayload,
  AssignWinnerPayload,
  UpdateDistributionPayload,
  ListHackathonsQuery,
  PaginatedHackathonsResponse,
  PublicHackathonsQuery,
  PublicHackathonsResponse,
  BackendHackathonCategory,
  BackendHackathonVisibility,
  BackendHackathonStatus,
  BackendQuestionType,
} from '@/src/hackathon/types/backend.types';
import type {
  Hackathon,
  HackathonTrack,
  CustomQuestion,
  HackathonPrize,
  HackathonAdmin,
  HackathonJudge,
  HackathonBuilder,
  HackathonProject,
  HackathonCategory,
  HackathonVisibility,
  HackathonStatus,
} from '@/src/hackathon/types/hackathon.types';

// ============================================
// Data Transformation Utilities
// ============================================

/**
 * Map backend category to frontend format
 */
function transformCategory(backendCategory: BackendHackathonCategory): HackathonCategory {
  const categoryMap: Record<BackendHackathonCategory, HackathonCategory> = {
    DEFI: 'DeFi on Stellar',
    NFT: 'Real World Assets',
    GAMING: 'Soroban Smart Contracts',
    SOCIAL: 'Wallets & Identity',
    INFRASTRUCTURE: 'Developer Tooling',
    TOOLING: 'Developer Tooling',
    EDUCATION: 'Developer Tooling',
    DAO: 'Anchors & On/Off Ramps',
    GENERAL: 'Other',
  };
  return categoryMap[backendCategory] || 'Other';
}

/**
 * Map frontend category to backend format
 */
function transformCategoryToBackend(frontendCategory: HackathonCategory | ''): BackendHackathonCategory | undefined {
  if (!frontendCategory) return undefined;

  const categoryMap: Record<HackathonCategory, BackendHackathonCategory> = {
    'Soroban Smart Contracts': 'GAMING',
    'Payments & Remittances': 'DEFI',
    'Anchors & On/Off Ramps': 'DAO',
    'DeFi on Stellar': 'DEFI',
    'Real World Assets': 'NFT',
    'Cross-border Payments': 'DEFI',
    'Developer Tooling': 'TOOLING',
    'Wallets & Identity': 'SOCIAL',
    'Other': 'GENERAL',
  };
  return categoryMap[frontendCategory] || 'GENERAL';
}

/**
 * Map backend visibility to frontend format
 */
function transformVisibility(backendVisibility: BackendHackathonVisibility): HackathonVisibility {
  return backendVisibility === 'PUBLIC' ? 'Public' : 'Private';
}

/**
 * Map frontend visibility to backend format
 */
function transformVisibilityToBackend(frontendVisibility: HackathonVisibility): BackendHackathonVisibility {
  return frontendVisibility === 'Public' ? 'PUBLIC' : 'PRIVATE';
}

/**
 * Map backend status to frontend format
 */
function transformStatus(backendStatus: BackendHackathonStatus): HackathonStatus {
  const statusMap: Record<BackendHackathonStatus, HackathonStatus> = {
    DRAFT: 'Draft',
    UNDER_REVIEW: 'Under Review',
    APPROVED: 'Active',
    REJECTED: 'Rejected',
    ENDED: 'Ended',
    CANCELLED: 'Cancelled',
    ARCHIVED: 'Cancelled', // Map ARCHIVED to Cancelled for frontend
  };
  return statusMap[backendStatus] || 'Draft';
}

/**
 * Transform backend track to frontend format
 */
function transformTrack(backend: BackendTrack): HackathonTrack {
  return {
    id: backend._id,
    name: backend.name,
    description: backend.description,
    order: backend.order,
  };
}

/**
 * Transform backend custom question to frontend format
 */
function transformCustomQuestion(backend: BackendCustomQuestion): CustomQuestion {
  return {
    id: backend._id,
    label: backend.questionText,
    type: backend.questionType.toLowerCase() as 'text' | 'select' | 'checkbox',
    options: backend.options,
    required: backend.isRequired,
  };
}

/**
 * Transform backend prize to frontend format
 */
function transformPrize(backend: BackendPrize): HackathonPrize {
  return {
    id: backend._id,
    name: backend.name,
    trackId: backend.trackId || null,
    placements: backend.placements.map((p) => ({
      id: `${backend._id}-${p.placement}`,
      label: `${p.placement}${p.placement === 1 ? 'st' : p.placement === 2 ? 'nd' : p.placement === 3 ? 'rd' : 'th'} Place`,
      amount: p.amount,
      currency: 'USDC', // Will be from hackathon prizeAsset
      winnerId: null,
    })),
  };
}

/**
 * Transform backend hackathon to frontend format
 */
function transformHackathon(backend: BackendHackathon): Hackathon {
  return {
    id: backend.uuid,
    organizationId: backend.organizationId,
    status: transformStatus(backend.status),
    general: {
      name: backend.name,
      category: transformCategory(backend.category),
      visibility: transformVisibility(backend.visibility),
      poster: backend.posterUrl || '',
      prizePool:  backend.prizePool,
      prizeAsset: backend.prizeAsset,
      tags: backend.tags || [],
      startTime: new Date(backend.startTime).toISOString(),
      preRegEndTime: backend.preRegistrationEndTime ? new Date(backend.preRegistrationEndTime).toISOString() : '',
      submissionDeadline: new Date(backend.submissionDeadline).toISOString(),
      venue: backend.venue.toLowerCase() === 'online' ? 'Online' : 'In-Person',
      venueLocation: backend.venue.toLowerCase() !== 'online' ? backend.venue : '',
      submissionRequirements: backend.submissionRequirements?.customInstructions || '',
      adminContact: backend.adminContact,
      customQuestions: (backend.customRegistrationQuestions || backend.customQuestions || []).map(transformCustomQuestion),
    },
    tracks: (backend.tracks || []).filter((t) => t.isActive).map(transformTrack),
    description: backend.description || backend.overview || '',
    admins: [], // Will be fetched separately
    prizes: (backend.prizes || []).filter((p) => p.isActive).map(transformPrize),
    judges: [], // Will be fetched separately
    builders: [], // Will be fetched from registrations endpoint
    projects: [], // Will be fetched from submissions endpoint
    createdAt: new Date(backend.createdAt).toISOString(),
    updatedAt: new Date(backend.updatedAt).toISOString(),
  };
}

/**
 * Transform backend hackathon to card data format
 * Used for listing/grid views
 */
export function transformHackathonToCard(backend: BackendHackathon): {
  id: string;
  name: string;
  tagline: string;
  category: string;
  status: 'Upcoming' | 'Ongoing' | 'Ended';
  poster: string;
  prizePool: number;
  prizeAsset: string;
  startTime: string;
  submissionDeadline: string;
  tags: string[];
  venue: string;
  organizationName: string;
  organizationLogo: string;
  builderCount: number;
  projectCount: number;
} {
  // Determine status based on dates
  // Dates from API are already ISO strings, convert to Date for comparison
  const now = new Date();
  const startTime = new Date(backend.startTime);
  const submissionDeadline = new Date(backend.submissionDeadline);

  let status: 'Upcoming' | 'Ongoing' | 'Ended';
  if (backend.status === 'ENDED' || backend.status === 'CANCELLED' || submissionDeadline < now) {
    status = 'Ended';
  } else if (startTime > now) {
    status = 'Upcoming';
  } else {
    status = 'Ongoing';
  }

  return {
    id: backend.slug, // Use slug for URL routing (not uuid)
    name: backend.name,
    tagline: backend.description || backend.overview || '',
    category: transformCategory(backend.category),
    status,
    poster: backend.posterUrl || '',
    // Handle prizePool as either string or number
    prizePool: typeof backend.prizePool === 'string' ? parseFloat(backend.prizePool) || 0 : backend.prizePool,
    prizeAsset: backend.prizeAsset,
    // Dates are already ISO strings from the API
    startTime: typeof backend.startTime === 'string' ? backend.startTime : new Date(backend.startTime).toISOString(),
    submissionDeadline: typeof backend.submissionDeadline === 'string' ? backend.submissionDeadline : new Date(backend.submissionDeadline).toISOString(),
    tags: backend.tags || [],
    venue: backend.venue,
    organizationName: '', // Will need to be fetched separately or included in response
    organizationLogo: '',
    builderCount: backend.analytics?.registrationCount || backend.analyticsTracking?.registrationCount || 0,
    projectCount: backend.analytics?.submissionCount || backend.analyticsTracking?.submissionCount || 0,
  };
}

/**
 * Transform frontend hackathon general to backend create payload
 */
function transformToCreatePayload(
  general: Pick<Hackathon['general'], 'name' | 'category' | 'visibility' | 'prizePool' | 'prizeAsset' | 'tags' | 'startTime' | 'preRegEndTime' | 'submissionDeadline' | 'venue' | 'venueLocation' | 'adminContact' | 'poster'>,
  organizationId: string,
  description?: string,
  tracks?: HackathonTrack[]
): CreateHackathonPayload {
  const payload: CreateHackathonPayload = {
    name: general.name,
    category: transformCategoryToBackend(general.category)!,
    visibility: transformVisibilityToBackend(general.visibility),
    prizePool: String(general.prizePool),  // Convert to string
    prizeAsset: general.prizeAsset,
    tags: general.tags,
    startTime: new Date(general.startTime),
    preRegistrationEndTime: general.preRegEndTime ? new Date(general.preRegEndTime) : undefined,
    submissionDeadline: new Date(general.submissionDeadline),
    venue: general.venue === 'Online' ? 'Online' : general.venueLocation,
    description: description && description.trim() ? description : 'description',  // Use provided description or fallback to 'description'
    adminContact: general.adminContact,
    organizationId,
    posterUrl: general.poster || undefined,
  };

  // Include tracks if provided (exclude temp IDs)
  if (tracks && tracks.length > 0) {
    payload.tracks = tracks.map((track) => ({
      _id: track.id && track.id.startsWith('track-') ? undefined : track.id,
      name: track.name,
      description: track.description,
      order: track.order,
      isActive: true,
    }));
  }

  return payload;
}

/**
 * Transform frontend hackathon to backend update payload
 * Only includes fields that are present in the hackathon object
 */
function transformToUpdatePayload(hackathon: Hackathon): UpdateHackathonPayload {
  const payload: UpdateHackathonPayload = {};

  // Basic Information
  if (hackathon.general.name) payload.name = hackathon.general.name;
  if (hackathon.general.category) {
    payload.category = transformCategoryToBackend(hackathon.general.category);
  }
  payload.visibility = transformVisibilityToBackend(hackathon.general.visibility);
  if (hackathon.general.poster) payload.posterUrl = hackathon.general.poster;
  if (hackathon.general.prizePool) payload.prizePool = hackathon.general.prizePool;
  if (hackathon.general.prizeAsset) payload.prizeAsset = hackathon.general.prizeAsset;
  if (hackathon.general.tags) payload.tags = hackathon.general.tags;
  // Always include description, use 'description' as fallback if empty
  payload.description = hackathon.description && hackathon.description.trim() ? hackathon.description : 'description';
  if (hackathon.general.venue) {
    payload.venue = hackathon.general.venue === 'Online' ? 'Online' : hackathon.general.venueLocation;
  }
  if (hackathon.general.adminContact) payload.adminContact = hackathon.general.adminContact;

  // Timeline
  if (hackathon.general.startTime) payload.startTime = new Date(hackathon.general.startTime);
  if (hackathon.general.preRegEndTime) {
    payload.preRegistrationEndTime = new Date(hackathon.general.preRegEndTime);
  }
  if (hackathon.general.submissionDeadline) {
    payload.submissionDeadline = new Date(hackathon.general.submissionDeadline);
  }

  // Tracks - Transform to backend format
  if (hackathon.tracks && hackathon.tracks.length > 0) {
    payload.tracks = hackathon.tracks.map((track) => ({
      _id: track.id && track.id.startsWith('track-') ? undefined : track.id, // Exclude temp IDs
      name: track.name,
      description: track.description,
      order: track.order,
      isActive: true,
    }));
  }

  // Prizes - Transform to backend format
  if (hackathon.prizes && hackathon.prizes.length > 0) {
    payload.prizes = hackathon.prizes.map((prize) => ({
      _id: prize.id && prize.id.startsWith('prize-') ? undefined : prize.id, // Exclude temp IDs
      name: prize.name,
      trackId: prize.trackId || undefined,
      placements: prize.placements.map((p) => ({
        placement: parseInt(p.label.match(/\d+/)?.[0] || '1'),
        amount: p.amount,
      })),
      isActive: true,
    }));
  }

  // Custom Questions - Transform to backend format
  if (hackathon.general.customQuestions && hackathon.general.customQuestions.length > 0) {
    payload.customRegistrationQuestions = hackathon.general.customQuestions.map((q, index) => ({
      _id: q.id.startsWith('question-') ? undefined : q.id, // Exclude temp IDs
      questionText: q.label,
      questionType: q.type.toUpperCase() as BackendQuestionType,
      options: q.options,
      isRequired: q.required,
      order: index,
    }));
  }

  // Submission Requirements
  if (hackathon.general.submissionRequirements) {
    payload.submissionRequirements = {
      customInstructions: hackathon.general.submissionRequirements,
    };
  }

  return payload;
}

// ============================================
// Hackathon API Service
// ============================================

export const hackathonApi = {
  // ========================================
  // Public Endpoints
  // ========================================

  /**
   * List public hackathons with filters
   * Uses /hackathons/public/list endpoint
   */
  async listPublicHackathons(query?: PublicHackathonsQuery): Promise<PublicHackathonsResponse> {
    const params = new URLSearchParams();
    if (query?.filter) params.append('filter', query.filter);
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.offset !== undefined) params.append('offset', query.offset.toString());

    const endpoint = params.toString()
      ? `${ENDPOINTS.HACKATHONS.PUBLIC_LIST}?${params.toString()}`
      : ENDPOINTS.HACKATHONS.PUBLIC_LIST;

    return apiClient.get<PublicHackathonsResponse>(endpoint);
  },

  /**
   * Get public hackathon detail by slug
   */
  async getPublicHackathon(slug: string): Promise<Hackathon> {
    const backend = await apiClient.get<BackendHackathon>(
      ENDPOINTS.HACKATHONS.PUBLIC_DETAIL(slug)
    );
    return transformHackathon(backend);
  },

  // ========================================
  // Organizer Endpoints
  // ========================================

  /**
   * Create a new hackathon
   */
  async createHackathon(
    general: Pick<Hackathon['general'], 'name' | 'category' | 'visibility' | 'prizePool' | 'prizeAsset' | 'tags' | 'startTime' | 'preRegEndTime' | 'submissionDeadline' | 'venue' | 'venueLocation' | 'adminContact' | 'poster'>,
    organizationId: string,
    description?: string,
    tracks?: HackathonTrack[]
  ): Promise<Hackathon> {
    const payload = transformToCreatePayload(general, organizationId, description, tracks);
    const backend = await apiClient.post<BackendHackathon>(
      ENDPOINTS.HACKATHONS.CREATE,
      payload
    );
    return transformHackathon(backend);
  },

  /**
   * Get hackathon by ID
   */
  async getHackathon(id: string): Promise<Hackathon> {
    const backend = await apiClient.get<BackendHackathon>(ENDPOINTS.HACKATHONS.BY_ID(id));
    return transformHackathon(backend);
  },

  /**
   * List hackathons by organization ID
   */
  async getOrganizationHackathons(orgId: string): Promise<Hackathon[]> {
    const backends = await apiClient.get<BackendHackathon[]>(
      ENDPOINTS.HACKATHONS.BY_ORG(orgId)
    );
    return backends.map(transformHackathon);
  },

  /**
   * Update hackathon (comprehensive update with all fields)
   * Uses the single PATCH /hackathons/:id endpoint
   */
  async updateHackathon(id: string, hackathon: Hackathon): Promise<Hackathon> {
    const payload = transformToUpdatePayload(hackathon);
    const backend = await apiClient.patch<BackendHackathon>(
      ENDPOINTS.HACKATHONS.UPDATE(id),
      payload
    );
    return transformHackathon(backend);
  },

  /**
   * Update hackathon general info
   */
  async updateGeneral(id: string, updates: UpdateHackathonGeneralPayload): Promise<Hackathon> {
    const backend = await apiClient.patch<BackendHackathon>(
      ENDPOINTS.HACKATHONS.UPDATE_GENERAL(id),
      updates
    );
    return transformHackathon(backend);
  },

  /**
   * Update submission requirements
   */
  async updateSubmissionRequirements(
    id: string,
    requirements: UpdateSubmissionRequirementsPayload
  ): Promise<Hackathon> {
    const backend = await apiClient.patch<BackendHackathon>(
      ENDPOINTS.HACKATHONS.UPDATE_SUBMISSION_REQUIREMENTS(id),
      requirements
    );
    return transformHackathon(backend);
  },

  /**
   * Submit hackathon for review
   */
  async submitForReview(id: string): Promise<Hackathon> {
    const backend = await apiClient.post<BackendHackathon>(
      ENDPOINTS.HACKATHONS.SUBMIT_FOR_REVIEW(id),
      {}
    );
    return transformHackathon(backend);
  },

  /**
   * Cancel hackathon
   */
  async cancelHackathon(id: string): Promise<Hackathon> {
    const backend = await apiClient.patch<BackendHackathon>(
      ENDPOINTS.HACKATHONS.CANCEL(id),
      {}
    );
    return transformHackathon(backend);
  },

  /**
   * Archive hackathon
   */
  async archiveHackathon(id: string): Promise<Hackathon> {
    const backend = await apiClient.patch<BackendHackathon>(
      ENDPOINTS.HACKATHONS.ARCHIVE(id),
      {}
    );
    return transformHackathon(backend);
  },

  // ========================================
  // Tracks
  // ========================================

  /**
   * List tracks for a hackathon
   */
  async getTracks(hackathonId: string): Promise<HackathonTrack[]> {
    const backends = await apiClient.get<BackendTrack[]>(
      ENDPOINTS.HACKATHONS.TRACKS(hackathonId)
    );
    return backends.map(transformTrack);
  },

  /**
   * Create a new track
   */
  async createTrack(hackathonId: string, payload: TrackPayload): Promise<HackathonTrack> {
    const backend = await apiClient.post<BackendTrack>(
      ENDPOINTS.HACKATHONS.TRACKS(hackathonId),
      payload
    );
    return transformTrack(backend);
  },

  /**
   * Update a track
   */
  async updateTrack(
    hackathonId: string,
    trackId: string,
    payload: TrackPayload
  ): Promise<HackathonTrack> {
    const backend = await apiClient.patch<BackendTrack>(
      ENDPOINTS.HACKATHONS.TRACK_BY_ID(hackathonId, trackId),
      payload
    );
    return transformTrack(backend);
  },

  /**
   * Delete a track
   */
  async deleteTrack(hackathonId: string, trackId: string): Promise<void> {
    await apiClient.delete<void>(ENDPOINTS.HACKATHONS.TRACK_BY_ID(hackathonId, trackId));
  },

  // ========================================
  // Custom Questions
  // ========================================

  /**
   * List custom questions for a hackathon
   */
  async getCustomQuestions(hackathonId: string): Promise<CustomQuestion[]> {
    const backends = await apiClient.get<BackendCustomQuestion[]>(
      ENDPOINTS.HACKATHONS.CUSTOM_QUESTIONS(hackathonId)
    );
    return backends.map(transformCustomQuestion);
  },

  /**
   * Create a custom question
   */
  async createCustomQuestion(
    hackathonId: string,
    payload: CustomQuestionPayload
  ): Promise<CustomQuestion> {
    const backend = await apiClient.post<BackendCustomQuestion>(
      ENDPOINTS.HACKATHONS.CUSTOM_QUESTIONS(hackathonId),
      payload
    );
    return transformCustomQuestion(backend);
  },

  /**
   * Update a custom question
   */
  async updateCustomQuestion(
    hackathonId: string,
    questionId: string,
    payload: CustomQuestionPayload
  ): Promise<CustomQuestion> {
    const backend = await apiClient.patch<BackendCustomQuestion>(
      ENDPOINTS.HACKATHONS.CUSTOM_QUESTION_BY_ID(hackathonId, questionId),
      payload
    );
    return transformCustomQuestion(backend);
  },

  /**
   * Delete a custom question
   */
  async deleteCustomQuestion(hackathonId: string, questionId: string): Promise<void> {
    await apiClient.delete<void>(
      ENDPOINTS.HACKATHONS.CUSTOM_QUESTION_BY_ID(hackathonId, questionId)
    );
  },

  // ========================================
  // Prizes
  // ========================================

  /**
   * List prizes for a hackathon
   */
  async getPrizes(hackathonId: string): Promise<HackathonPrize[]> {
    const backends = await apiClient.get<BackendPrize[]>(
      ENDPOINTS.HACKATHONS.PRIZES(hackathonId)
    );
    return backends.map(transformPrize);
  },

  /**
   * Create a prize
   */
  async createPrize(hackathonId: string, payload: PrizePayload): Promise<HackathonPrize> {
    const backend = await apiClient.post<BackendPrize>(
      ENDPOINTS.HACKATHONS.PRIZES(hackathonId),
      payload
    );
    return transformPrize(backend);
  },

  /**
   * Update a prize
   */
  async updatePrize(
    hackathonId: string,
    prizeId: string,
    payload: PrizePayload
  ): Promise<HackathonPrize> {
    const backend = await apiClient.patch<BackendPrize>(
      ENDPOINTS.HACKATHONS.PRIZE_BY_ID(hackathonId, prizeId),
      payload
    );
    return transformPrize(backend);
  },

  /**
   * Delete a prize
   */
  async deletePrize(hackathonId: string, prizeId: string): Promise<void> {
    await apiClient.delete<void>(ENDPOINTS.HACKATHONS.PRIZE_BY_ID(hackathonId, prizeId));
  },

  // ========================================
  // Administrators
  // ========================================

  /**
   * List administrators for a hackathon
   */
  async getAdministrators(hackathonId: string): Promise<BackendHackathonAdministrator[]> {
    return apiClient.get<BackendHackathonAdministrator[]>(
      ENDPOINTS.HACKATHONS.ADMINISTRATORS(hackathonId)
    );
  },

  /**
   * Invite an administrator
   */
  async inviteAdministrator(
    hackathonId: string,
    payload: InviteAdminPayload
  ): Promise<BackendHackathonAdministrator> {
    return apiClient.post<BackendHackathonAdministrator>(
      ENDPOINTS.HACKATHONS.INVITE_ADMIN(hackathonId),
      payload
    );
  },

  /**
   * Update administrator permissions
   */
  async updateAdminPermissions(
    hackathonId: string,
    adminId: string,
    payload: UpdateAdminPermissionsPayload
  ): Promise<BackendHackathonAdministrator> {
    return apiClient.patch<BackendHackathonAdministrator>(
      ENDPOINTS.HACKATHONS.ADMIN_PERMISSIONS(hackathonId, adminId),
      payload
    );
  },

  /**
   * Remove an administrator
   */
  async removeAdministrator(hackathonId: string, adminId: string): Promise<void> {
    await apiClient.delete<void>(ENDPOINTS.HACKATHONS.REMOVE_ADMIN(hackathonId, adminId));
  },

  // ========================================
  // Judges
  // ========================================

  /**
   * List judges for a hackathon
   */
  async getJudges(hackathonId: string): Promise<BackendJudge[]> {
    return apiClient.get<BackendJudge[]>(ENDPOINTS.HACKATHONS.JUDGES(hackathonId));
  },

  /**
   * Invite a judge
   */
  async inviteJudge(hackathonId: string, payload: InviteJudgePayload): Promise<BackendJudge> {
    return apiClient.post<BackendJudge>(
      ENDPOINTS.HACKATHONS.INVITE_JUDGE(hackathonId),
      payload
    );
  },

  /**
   * Update judge tracks
   */
  async updateJudgeTracks(
    hackathonId: string,
    judgeId: string,
    payload: UpdateJudgeTracksPayload
  ): Promise<BackendJudge> {
    return apiClient.patch<BackendJudge>(
      ENDPOINTS.HACKATHONS.JUDGE_TRACKS(hackathonId, judgeId),
      payload
    );
  },

  /**
   * Remove a judge
   */
  async removeJudge(hackathonId: string, judgeId: string): Promise<void> {
    await apiClient.delete<void>(ENDPOINTS.HACKATHONS.REMOVE_JUDGE(hackathonId, judgeId));
  },

  // ========================================
  // Winners
  // ========================================

  /**
   * List winners for a hackathon
   */
  async getWinners(hackathonId: string): Promise<BackendWinner[]> {
    return apiClient.get<BackendWinner[]>(ENDPOINTS.HACKATHONS.WINNERS(hackathonId));
  },

  /**
   * Assign a winner
   */
  async assignWinner(hackathonId: string, payload: AssignWinnerPayload): Promise<BackendWinner> {
    return apiClient.post<BackendWinner>(
      ENDPOINTS.HACKATHONS.ASSIGN_WINNER(hackathonId),
      payload
    );
  },

  /**
   * Update prize distribution
   */
  async updateDistribution(
    hackathonId: string,
    winnerId: string,
    payload: UpdateDistributionPayload
  ): Promise<BackendWinner> {
    return apiClient.patch<BackendWinner>(
      ENDPOINTS.HACKATHONS.UPDATE_DISTRIBUTION(hackathonId, winnerId),
      payload
    );
  },

  /**
   * Remove a winner
   */
  async removeWinner(hackathonId: string, winnerId: string): Promise<void> {
    await apiClient.delete<void>(ENDPOINTS.HACKATHONS.REMOVE_WINNER(hackathonId, winnerId));
  },

  // ========================================
  // Analytics
  // ========================================

  /**
   * Get hackathon insights
   */
  async getInsights(hackathonId: string): Promise<Record<string, unknown>> {
    return apiClient.get<Record<string, unknown>>(ENDPOINTS.HACKATHONS.INSIGHTS(hackathonId));
  },

  /**
   * Get daily trends
   */
  async getDailyTrends(hackathonId: string): Promise<Record<string, unknown>> {
    return apiClient.get<Record<string, unknown>>(ENDPOINTS.HACKATHONS.DAILY_TRENDS(hackathonId));
  },

  /**
   * Get traffic sources
   */
  async getTrafficSources(hackathonId: string): Promise<Record<string, unknown>> {
    return apiClient.get<Record<string, unknown>>(ENDPOINTS.HACKATHONS.TRAFFIC_SOURCES(hackathonId));
  },

  // ========================================
  // Registrations (Organizer View)
  // ========================================

  /**
   * List registrations for a hackathon
   */
  async getRegistrations(hackathonId: string): Promise<BackendRegistration[]> {
    return apiClient.get<BackendRegistration[]>(ENDPOINTS.HACKATHONS.REGISTRATIONS(hackathonId));
  },

  /**
   * Export registrations as CSV
   */
  async exportRegistrations(hackathonId: string): Promise<Blob> {
    // This would return a blob for CSV download
    return apiClient.get<Blob>(ENDPOINTS.HACKATHONS.EXPORT_REGISTRATIONS(hackathonId));
  },

  // ========================================
  // Submissions (Organizer View)
  // ========================================

  /**
   * List submissions for a hackathon
   */
  async getSubmissions(hackathonId: string): Promise<BackendSubmission[]> {
    return apiClient.get<BackendSubmission[]>(ENDPOINTS.HACKATHONS.SUBMISSIONS(hackathonId));
  },

  /**
   * Get submission detail
   */
  async getSubmission(hackathonId: string, submissionId: string): Promise<BackendSubmission> {
    return apiClient.get<BackendSubmission>(
      ENDPOINTS.HACKATHONS.SUBMISSION_BY_ID(hackathonId, submissionId)
    );
  },

  /**
   * Update submission status
   */
  async updateSubmissionStatus(
    hackathonId: string,
    submissionId: string,
    status: string
  ): Promise<BackendSubmission> {
    return apiClient.patch<BackendSubmission>(
      ENDPOINTS.HACKATHONS.UPDATE_SUBMISSION_STATUS(hackathonId, submissionId),
      { status }
    );
  },
};
