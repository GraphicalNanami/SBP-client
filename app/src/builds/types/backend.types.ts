/**
 * Backend API Types for Builds
 * Based on the actual API endpoint specification from documentation
 */

import type { BuildCategory, BuildStatus, BackendBuildCategory } from './build.types';
import { BACKEND_TO_DISPLAY } from './build.types';
import type { BuildCardData } from '../components/buildUI/BuildCard';

// ============================================
// API Response Types - Public Endpoints
// ============================================

export interface PublicBuildsListResponse {
  builds: {
    uuid: string;
    slug: string;
    name: string;
    tagline: string;
    category: BackendBuildCategory;
    logo?: string;
    publishedAt: string;
  }[];
  total: number;
}

export interface MyBuildsResponse {
  builds: BackendBuild[];
}

// ============================================
// API Response Types - Private/Detailed
// ============================================

export interface BackendBuild {
  uuid: string;
  slug: string;
  name: string;
  tagline: string;
  category: BackendBuildCategory;
  status: BuildStatus;
  visibility: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
  logo?: string;
  publishedAt?: string;
  
  // Optional detailed fields (present in full build response)
  vision?: string;
  description?: string;
  githubRepository?: string;
  website?: string;
  demoVideo?: string;
  socialLinks?: { platform: string; url: string; }[];
  teamDescription?: string;
  teamLeadTelegram?: string;
  contactEmail?: string;
  teamSocials?: string[];
  contractAddress?: string;
  stellarAddress?: string;
  
  // Team information
  teamMembers?: BackendTeamMember[];
  statusHistory?: unknown[];
}

export interface BackendTeamMember {
  uuid: string;
  userId: string;
  role: 'LEAD' | 'MEMBER';
  status: 'PENDING' | 'ACCEPTED';
  permissions: {
    canEdit: boolean;
    canInvite: boolean;
    canSubmit: boolean;
  };
}

// ============================================
// Request Payload Types
// ============================================

export interface CreateBuildPayload {
  name: string;
  tagline: string;
  category: BackendBuildCategory;
  vision?: string;
  description?: string;
  logo?: string;
  githubRepository?: string;
  website?: string;
  demoVideo?: string;
  socialLinks?: { platform: string; url: string; }[];
  teamDescription?: string;
  teamLeadTelegram?: string;
  contactEmail?: string;
  teamSocials?: string[];
}

export interface PublishBuildPayload {
  contractAddress: string; // 56 chars
  stellarAddress: string;  // 56 chars  
  visibility: 'PUBLIC' | 'UNLISTED';
}

export interface InviteTeamMemberPayload {
  email: string;
  role: 'MEMBER' | 'LEAD';
  permissions: {
    canEdit: boolean;
    canInvite: boolean;
    canSubmit: boolean;
  };
}

export interface TransferLeadershipPayload {
  newLeadUuid: string;
}

// ============================================
// API Query Types
// ============================================

export interface ListPublicBuildsQuery {
  category?: BuildCategory;
  search?: string;
  sortBy?: 'publishedAt' | 'createdAt' | 'viewCount' | 'name';
  limit?: number;
  offset?: number;
}

// ============================================
// Submissions Module Types
// ============================================

export interface CreateSubmissionPayload {
  buildUuid: string;
  hackathonUuid: string;
  selectedTrackUuids: string[];
  customAnswers: {
    questionUuid: string;
    answer: string;
  }[];
}

export interface BackendSubmission {
  uuid: string;
  buildUuid: string;
  hackathonUuid: string;
  status: 'DRAFT' | 'SUBMITTED' | 'WINNER';
  submittedAt?: string;
  judgingDetails?: {
    scores: {
      judgeId: string;
      score: number;
      feedback: string;
    }[];
  };
}

export interface JudgeSubmissionPayload {
  score: number;
  feedback: string;
}

export interface SelectWinnerPayload {
  prizeUuid: string;
  placement: number;
  announcement?: string;
}

// ============================================
// Helper Functions
// ============================================

export function transformBuildToCard(backendBuild: BackendBuild | PublicBuildsListResponse['builds'][0]): BuildCardData {
  return {
    id: backendBuild.uuid,
    slug: backendBuild.slug,
    name: backendBuild.name,
    tagline: backendBuild.tagline,
    category: BACKEND_TO_DISPLAY[backendBuild.category] || 'Other', // Transform backend category to display category
    status: 'status' in backendBuild ? backendBuild.status : 'Published', // Assume published for public list
    logo: backendBuild.logo || '',
    techStack: [], // Not available in listing API response
    website: 'website' in backendBuild ? backendBuild.website || '' : '',
    liveDemo: 'website' in backendBuild ? backendBuild.website || '' : '', // Use website as fallback
    publishedAt: backendBuild.publishedAt || new Date().toISOString(),
    viewCount: 0, // Not available in listing API response
    teamSize: 'teamMembers' in backendBuild ? backendBuild.teamMembers?.length || 1 : 1,
  };
}