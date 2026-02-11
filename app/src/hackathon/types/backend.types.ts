/**
 * Backend API Response Types for Hackathons
 * These match the NestJS backend schema exactly
 */

// ============================================
// Enums (Backend Format - UPPERCASE)
// ============================================

export type BackendHackathonStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ENDED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type BackendHackathonVisibility = 'PUBLIC' | 'PRIVATE';

export type BackendHackathonCategory =
  | 'DEFI'
  | 'NFT'
  | 'GAMING'
  | 'SOCIAL'
  | 'INFRASTRUCTURE'
  | 'TOOLING'
  | 'EDUCATION'
  | 'DAO'
  | 'GENERAL';

export type BackendQuestionType = 'TEXT' | 'SELECT' | 'CHECKBOX';

export type BackendAdminPermissionLevel = 'FULL_ACCESS' | 'LIMITED_ACCESS';

export type BackendAllowedSection =
  | 'GENERAL'
  | 'TRACKS'
  | 'DESCRIPTION'
  | 'TEAM_ACCESS'
  | 'INSIGHTS'
  | 'PARTICIPANTS'
  | 'WINNERS';

export type BackendAdminInvitationStatus = 'PENDING' | 'ACCEPTED' | 'REVOKED';

export type BackendRegistrationStatus = 'REGISTERED' | 'CANCELLED' | 'ATTENDED';

export type BackendSubmissionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'WINNER'
  | 'DISQUALIFIED';

export type BackendJudgeStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'REMOVED';

export type BackendPrizeDistributionStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED';

// ============================================
// Backend Schema Interfaces
// ============================================

/**
 * Track (embedded subdocument)
 */
export interface BackendTrack {
  uuid: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}

/**
 * Prize Placement (nested within Prize)
 */
export interface BackendPlacement {
  placement: number;
  amount: number;
}

/**
 * Prize (embedded subdocument)
 */
export interface BackendPrize {
  uuid: string;
  name: string;
  trackUuid?: string; // Optional reference to track
  placements: BackendPlacement[];
  isActive: boolean;
}

/**
 * Custom Question (embedded subdocument)
 */
export interface BackendCustomQuestion {
  uuid: string;
  questionText: string;
  questionType: BackendQuestionType;
  options?: string[];
  isRequired: boolean;
  order: number;
}

/**
 * Submission Requirements (embedded object)
 */
export interface BackendSubmissionRequirements {
  requireRepository: boolean;
  requireDemo: boolean;
  requireSorobanContractId: boolean;
  requireStellarAddress: boolean;
  requirePitchDeck: boolean;
  requireVideoDemo: boolean;
  customInstructions?: string;
}

/**
 * Approval Details (embedded object)
 */
export interface BackendApprovalDetails {
  reviewedBy?: string; // User ID
  reviewedAt?: Date;
  rejectionReason?: string;
  submittedForReviewAt?: Date;
}

/**
 * Analytics Tracking (embedded object)
 */
export interface BackendAnalyticsTracking {
  pageViews: number;
  uniqueVisitors: number;
  registrationCount: number;
  submissionCount: number;
}

/**
 * Main Hackathon Schema
 */
export interface BackendHackathon {
  uuid: string;
  name: string;
  slug: string;
  category: BackendHackathonCategory;
  visibility: BackendHackathonVisibility;
  posterUrl?: string;
  prizePool: string;  // Backend stores as string
  prizeAsset: string;
  tags?: string[];
  startTime: Date;
  preRegistrationEndTime?: Date;
  submissionDeadline: Date;
  judgingDeadline?: Date;
  venue: string;
  description?: string;
  overview?: string;
  rules?: string;
  schedule?: string;
  resources?: string;
  faq?: string;
  adminContact: string;
  organizationId: string;
  createdBy: string; // User ID
  status: BackendHackathonStatus;
  tracks?: BackendTrack[];
  prizes?: BackendPrize[];
  customQuestions?: BackendCustomQuestion[]; // Older field name
  customRegistrationQuestions?: BackendCustomQuestion[]; // Current backend field name
  submissionRequirements?: BackendSubmissionRequirements;
  approvalDetails?: BackendApprovalDetails;
  analyticsTracking?: BackendAnalyticsTracking;
  analytics?: BackendAnalyticsTracking; // Alternative field name
  createdAt: Date;
  updatedAt: Date;
  statusHistory?: Array<{
    status: BackendHackathonStatus;
    changedBy: string;
    changedAt: Date;
    id: string;
  }>;
}

/**
 * Hackathon Administrator
 */
export interface BackendHackathonAdministrator {
  id: string;
  hackathonId: string;
  userId?: string;
  email: string;
  permissionLevel: BackendAdminPermissionLevel;
  allowedSections?: BackendAllowedSection[];
  invitedBy: string; // User ID
  status: BackendAdminInvitationStatus;
  invitedAt: Date;
  acceptedAt?: Date;
}

/**
 * Judge
 */
export interface BackendJudge {
  id: string;
  hackathonId: string;
  email: string;
  userId?: string;
  assignedTrackIds: string[];
  invitedBy: string; // User ID
  status: BackendJudgeStatus;
  invitedAt: Date;
  acceptedAt?: Date;
}

/**
 * Registration
 */
export interface BackendRegistration {
  id: string;
  hackathonId: string;
  userId: string;
  userInfo: {
    name: string;
    email: string;
    avatar?: string;
  };
  selectedTrackId?: string;
  customAnswers: Array<{
    questionId: string;
    answer: unknown;
  }>;
  status: BackendRegistrationStatus;
  registeredAt: Date;
  cancelledAt?: Date;
}

/**
 * Submission Team Member
 */
export interface BackendTeamMember {
  userId?: string;
  name: string;
  email: string;
  role?: string;
}

/**
 * Submission
 */
export interface BackendSubmission {
  id: string;
  hackathonId: string;
  projectName: string;
  trackId: string;
  submittedBy: string; // User ID
  teamMembers: BackendTeamMember[];
  repositoryUrl?: string;
  demoUrl?: string;
  sorobanContractId?: string;
  stellarAddress?: string;
  pitchDeckUrl?: string;
  videoDemoUrl?: string;
  description: string;
  status: BackendSubmissionStatus;
  submittedAt?: Date;
  lastEditedAt: Date;
}

/**
 * Winner Distribution
 */
export interface BackendDistribution {
  status: BackendPrizeDistributionStatus;
  accountAddress?: string;
  transactionId?: string;
  distributedAt?: Date;
  notes?: string;
}

/**
 * Winner
 */
export interface BackendWinner {
  id: string;
  hackathonId: string;
  prizeId: string;
  placement: number;
  submissionId: string;
  prizeAmount: number;
  prizeAsset: string;
  distribution: BackendDistribution;
  announcedAt: Date;
  announcedBy: string; // User ID
}

/**
 * Analytics Event
 */
export interface BackendAnalyticsEvent {
  id: string;
  hackathonId: string;
  eventType: 'PAGE_VIEW' | 'REGISTRATION' | 'SUBMISSION' | 'CLICK_REGISTER' | 'CLICK_SUBMIT';
  metadata: {
    visitorId?: string;
    source?: string;
    userAgent?: string;
    ip?: string; // hashed
  };
  occurredAt: Date;
  createdAt: Date;
}

// ============================================
// API Request/Response Types
// ============================================

/**
 * Create Hackathon Payload
 */
export interface CreateHackathonPayload {
  name: string;
  category: BackendHackathonCategory;
  visibility: BackendHackathonVisibility;
  prizePool: string;  // Backend expects string, not number
  prizeAsset: string;
  tags?: string[];
  startTime: Date;
  preRegistrationEndTime?: Date;
  submissionDeadline: Date;
  venue: string;
  description: string;  // Required field
  adminContact: string;
  organizationId: string;
  posterUrl?: string;
  tracks?: Partial<BackendTrack>[];  // Include tracks in creation payload
}

/**
 * Update Hackathon General Info Payload
 */
export interface UpdateHackathonGeneralPayload {
  name?: string;
  category?: BackendHackathonCategory;
  visibility?: BackendHackathonVisibility;
  prizePool?: number;
  prizeAsset?: string;
  tags?: string[];
  startTime?: Date;
  preRegistrationEndTime?: Date;
  submissionDeadline?: Date;
  venue?: string;
  adminContact?: string;
  posterUrl?: string;
}

/**
 * Update Submission Requirements Payload
 */
export interface UpdateSubmissionRequirementsPayload {
  requireRepository?: boolean;
  requireDemo?: boolean;
  requireSorobanContractId?: boolean;
  requireStellarAddress?: boolean;
  requirePitchDeck?: boolean;
  requireVideoDemo?: boolean;
  customInstructions?: string;
}

/**
 * Comprehensive Update Hackathon Payload
 * Supports partial updates - all fields are optional
 * Used by PATCH /hackathons/:id endpoint
 */
export interface UpdateHackathonPayload {
  // Basic Information
  name?: string;
  category?: BackendHackathonCategory;
  visibility?: BackendHackathonVisibility;
  posterUrl?: string;
  prizePool?: string;
  prizeAsset?: string;
  tags?: string[];
  description?: string;
  overview?: string;
  rules?: string;
  schedule?: string;
  resources?: string;
  faq?: string;
  venue?: string;
  adminContact?: string;

  // Timeline
  startTime?: Date | string;
  preRegistrationEndTime?: Date | string;
  submissionDeadline?: Date | string;
  judgingDeadline?: Date | string;

  // Nested Documents - include uuid to update, omit to create
  tracks?: Array<{
    uuid?: string;
    name: string;
    description: string;
    order?: number;
    isActive?: boolean;
  }>;

  prizes?: Array<{
    uuid?: string;
    name: string;
    trackUuid?: string;
    placements: BackendPlacement[];
    isActive?: boolean;
  }>;

  customRegistrationQuestions?: Array<{
    uuid?: string;
    questionText: string;
    questionType: BackendQuestionType;
    options?: string[];
    isRequired: boolean;
    order?: number;
  }>;

  // Submission Requirements
  submissionRequirements?: UpdateSubmissionRequirementsPayload;
}

/**
 * Create/Update Track Payload
 */
export interface TrackPayload {
  name: string;
  description: string;
  order?: number;
}

/**
 * Create/Update Custom Question Payload
 */
export interface CustomQuestionPayload {
  questionText: string;
  questionType: BackendQuestionType;
  options?: string[];
  isRequired: boolean;
  order?: number;
}

/**
 * Create/Update Prize Payload
 */
export interface PrizePayload {
  name: string;
  trackUuid?: string;
  placements: BackendPlacement[];
}

/**
 * Invite Admin Payload
 */
export interface InviteAdminPayload {
  email: string;
  permissionLevel: BackendAdminPermissionLevel;
  allowedSections?: BackendAllowedSection[];
}

/**
 * Update Admin Permissions Payload
 */
export interface UpdateAdminPermissionsPayload {
  permissionLevel: BackendAdminPermissionLevel;
  allowedSections?: BackendAllowedSection[];
}

/**
 * Invite Judge Payload
 */
export interface InviteJudgePayload {
  email: string;
  assignedTrackIds: string[];
}

/**
 * Update Judge Tracks Payload
 */
export interface UpdateJudgeTracksPayload {
  assignedTrackIds: string[];
}

/**
 * Assign Winner Payload
 */
export interface AssignWinnerPayload {
  prizeId: string;
  placement: number;
  submissionId: string;
}

/**
 * Update Distribution Payload
 */
export interface UpdateDistributionPayload {
  status: BackendPrizeDistributionStatus;
  accountAddress?: string;
  transactionId?: string;
  notes?: string;
}

/**
 * List Hackathons Query Params
 */
export interface ListHackathonsQuery {
  search?: string;
  category?: BackendHackathonCategory;
  status?: BackendHackathonStatus;
  tags?: string[];
  sortBy?: 'newest' | 'prize' | 'startDate' | 'deadline';
  page?: number;
  limit?: number;
}

/**
 * Public Hackathons List Query Parameters
 * Matches the backend /hackathons/public/list endpoint
 */
export interface PublicHackathonsQuery {
  filter?: 'all' | 'upcoming' | 'ongoing' | 'past';
  limit?: number; // 1-100, default 20
  offset?: number; // 0+, default 0
}

/**
 * Paginated Hackathons Response
 */
export interface PaginatedHackathonsResponse {
  data: BackendHackathon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Public Hackathons List Response
 * Matches the backend /hackathons/public/list endpoint response
 */
export interface PublicHackathonsResponse {
  hackathons: BackendHackathon[];
  total: number;
  limit: number;
  offset: number;
}
