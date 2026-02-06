// ============================================
// Frontend Request Types
// ============================================

export interface OrganizationCreatePayload {
  name: string;
  website: string;
  termsAccepted: boolean;
}

// ============================================
// Core Domain Types
// ============================================

export type TeamMemberRole = 'Admin' | 'Editor' | 'Viewer';
export type TeamMemberStatus = 'Pending' | 'Active' | 'Removed';
export type OrganizationStatus = 'ACTIVE' | 'SUSPENDED';

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  avatarUrl?: string;
  joinedAt: string;
  invitedAt?: string;
  invitedBy?: {
    id: string;
    name: string;
  };
}

export interface OrganizationProfile {
  id: string;
  name: string;
  slug: string;
  logo: string;
  tagline: string;
  about: string;
  website: string;
  status: OrganizationStatus;
  socialLinks: SocialLinks;
  teamMembers: TeamMember[];
  createdAt: string;
  updatedAt?: string;
}

export interface SocialLinks {
  x?: string;
  telegram?: string;
  github?: string;
  discord?: string;
  linkedin?: string;
}

export type OrganizationStep = 'create' | 'dashboard';

// ============================================
// Backend Response Types
// ============================================

export interface BackendOrganization {
  _id: string;
  name: string;
  slug: string;
  website: string;
  logo?: string;
  tagline?: string;
  about?: string;
  socialLinks?: {
    x?: string;
    telegram?: string;
    github?: string;
    discord?: string;
    linkedin?: string;
  };
  status: 'ACTIVE' | 'SUSPENDED';
  termsAcceptedAt: string;
  termsVersion: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendOrganizationMember {
  _id: string;
  organizationId: string;
  userId: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  status: 'PENDING' | 'ACTIVE' | 'REMOVED';
  invitedBy: string;
  invitedAt: string;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    _id: string;
    email: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface CreateOrganizationResponse {
  organization: BackendOrganization;
  membership: BackendOrganizationMember;
}

export interface UserOrganizationsResponse {
  organization: BackendOrganization;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  joinedAt: string;
}

export interface OrganizationDetailsResponse {
  organization: BackendOrganization;
  userRole: 'ADMIN' | 'EDITOR' | 'VIEWER';
  members: BackendOrganizationMember[];
}
