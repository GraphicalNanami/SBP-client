/**
 * Organization API Service
 * Handles all organization-related API calls using the centralized API client
 */

import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type {
  OrganizationCreatePayload,
  OrganizationProfile,
  TeamMember,
  TeamMemberRole,
  SocialLinks,
  CreateOrganizationResponse,
  UserOrganizationsResponse,
  OrganizationDetailsResponse,
  BackendOrganization,
  BackendOrganizationMember,
} from '@/src/organization/types/organization.types';

// ============================================
// Data Transformation Utilities
// ============================================

/**
 * Convert backend role to frontend role format
 */
function transformRole(backendRole: 'ADMIN' | 'EDITOR' | 'VIEWER'): TeamMemberRole {
  const roleMap = {
    ADMIN: 'Admin',
    EDITOR: 'Editor',
    VIEWER: 'Viewer',
  } as const;
  return roleMap[backendRole];
}

/**
 * Convert frontend role to backend role format
 */
function transformRoleToBackend(frontendRole: TeamMemberRole): 'ADMIN' | 'EDITOR' | 'VIEWER' {
  const roleMap = {
    Admin: 'ADMIN',
    Editor: 'EDITOR',
    Viewer: 'VIEWER',
  } as const;
  return roleMap[frontendRole];
}

/**
 * Convert backend status to frontend status format
 */
function transformStatus(backendStatus: 'PENDING' | 'ACTIVE' | 'REMOVED'): 'Pending' | 'Active' | 'Removed' {
  const statusMap = {
    PENDING: 'Pending',
    ACTIVE: 'Active',
    REMOVED: 'Removed',
  } as const;
  return statusMap[backendStatus];
}

/**
 * Transform backend organization to frontend format
 */
function transformOrganization(backend: BackendOrganization, members: BackendOrganizationMember[] = []): OrganizationProfile {
  if (!backend) {
    throw new Error('Organization data is undefined');
  }

  if (!backend._id) {
    console.error('Invalid organization data:', backend);
    throw new Error('Organization is missing required _id field');
  }

  console.log('🔄 Transforming organization:', {
    backend,
    hasTagline: !!backend.tagline,
    hasAbout: !!backend.about,
    hasSocialLinks: !!backend.socialLinks,
  });

  const transformed = {
    id: backend._id,
    name: backend.name || '',
    slug: backend.slug || '',
    logo: backend.logo || '',
    tagline: backend.tagline || '',
    about: backend.about || '',
    website: backend.website || '',
    status: backend.status || 'ACTIVE',
    socialLinks: {
      x: backend.socialLinks?.x || '',
      telegram: backend.socialLinks?.telegram || '',
      github: backend.socialLinks?.github || '',
      discord: backend.socialLinks?.discord || '',
      linkedin: backend.socialLinks?.linkedin || '',
    },
    teamMembers: members.map(transformMember),
    createdAt: backend.createdAt || new Date().toISOString(),
    updatedAt: backend.updatedAt,
  };

  console.log('✅ Transformed organization:', {
    id: transformed.id,
    tagline: transformed.tagline,
    about: transformed.about,
    socialLinks: transformed.socialLinks,
  });

  return transformed;
}

/**
 * Transform backend member to frontend format
 */
function transformMember(backend: BackendOrganizationMember): TeamMember {
  return {
    id: backend._id,
    email: backend.user?.email || '',
    name: backend.user?.name || 'Unknown User',
    role: transformRole(backend.role),
    status: transformStatus(backend.status),
    avatarUrl: backend.user?.avatarUrl,
    joinedAt: backend.joinedAt || backend.invitedAt,
    invitedAt: backend.invitedAt,
    invitedBy: backend.invitedBy ? {
      id: backend.invitedBy,
      name: 'Team Admin', // Will be populated if backend sends this info
    } : undefined,
  };
}

// ============================================
// Organization API Service
// ============================================

export const organizationApi = {
  /**
   * Create a new organization
   */
  async createOrganization(payload: OrganizationCreatePayload): Promise<OrganizationProfile> {
    console.log('📤 Creating organization with payload:', payload);
    
    const response = await apiClient.post<BackendOrganization>(
      ENDPOINTS.ORGANIZATIONS.CREATE,
      {
        name: payload.name,
        website: payload.website,
        agreeToTerms: payload.termsAccepted,
      }
    );

    console.log('📥 Create organization API response:', response);

    // API returns organization directly, not wrapped
    // Transform response to frontend format
    return transformOrganization(response, []);
  },

  /**
   * Get all organizations for the current user
   */
  async getUserOrganizations(): Promise<OrganizationProfile[]> {
    const response = await apiClient.get<UserOrganizationsResponse[]>(
      ENDPOINTS.ORGANIZATIONS.ME
    );

    // Transform each organization in the response
    const organizations = response.map((item) => {
      return transformOrganization(item.organization, []);
    });

    return organizations;
  },

  /**
   * Get organization details by ID
   */
  async getOrganization(orgId: string): Promise<OrganizationProfile> {
    console.log('📤 Fetching organization:', orgId);
    
    const response = await apiClient.get<BackendOrganization>(
      ENDPOINTS.ORGANIZATIONS.BY_ID(orgId)
    );
    
    console.log('📥 Get organization API response:', response);
    
    // API returns organization directly
    // Fetch members separately if needed
    let members: BackendOrganizationMember[] = [];
    try {
      members = await apiClient.get<BackendOrganizationMember[]>(
        ENDPOINTS.ORGANIZATIONS.MEMBERS(orgId)
      );
      console.log('📥 Got members:', members);
    } catch (error) {
      console.warn('Failed to fetch members:', error);
    }
    return transformOrganization(response, members);
  },

  /**
   * Update organization profile (logo, tagline, about)
   */
  async updateProfile(
    orgId: string,
    updates: {
      logo?: string;
      tagline?: string;
      about?: string;
    }
  ): Promise<BackendOrganization> {
    return apiClient.patch<BackendOrganization>(
      ENDPOINTS.ORGANIZATIONS.PROFILE(orgId),
      updates
    );
  },

  /**
   * Update organization social links
   */
  async updateSocialLinks(orgId: string, socialLinks: SocialLinks): Promise<BackendOrganization> {
    return apiClient.patch<BackendOrganization>(
      ENDPOINTS.ORGANIZATIONS.SOCIAL_LINKS(orgId),
      {
        x: socialLinks.x || undefined,
        telegram: socialLinks.telegram || undefined,
        github: socialLinks.github || undefined,
        discord: socialLinks.discord || undefined,
        linkedin: socialLinks.linkedin || undefined,
      }
    );
  },

  /**
   * Get organization members
   */
  async getMembers(
    orgId: string,
    status?: 'PENDING' | 'ACTIVE' | 'REMOVED'
  ): Promise<TeamMember[]> {
    const endpoint = status
      ? `${ENDPOINTS.ORGANIZATIONS.MEMBERS(orgId)}?status=${status}`
      : ENDPOINTS.ORGANIZATIONS.MEMBERS(orgId);

    const response = await apiClient.get<BackendOrganizationMember[]>(endpoint);
    return response.map(transformMember);
  },

  /**
   * Invite a team member
   */
  async inviteMember(
    orgId: string,
    email: string,
    role: TeamMemberRole
  ): Promise<TeamMember> {
    const response = await apiClient.post<BackendOrganizationMember>(
      ENDPOINTS.ORGANIZATIONS.INVITE_MEMBER(orgId),
      {
        email,
        role: transformRoleToBackend(role),
      }
    );

    return transformMember(response);
  },

  /**
   * Update member role
   */
  async updateMemberRole(
    orgId: string,
    memberId: string,
    role: TeamMemberRole
  ): Promise<TeamMember> {
    const response = await apiClient.patch<BackendOrganizationMember>(
      ENDPOINTS.ORGANIZATIONS.MEMBER_ROLE(orgId, memberId),
      {
        role: transformRoleToBackend(role),
      }
    );

    return transformMember(response);
  },

  /**
   * Remove a team member
   */
  async removeMember(orgId: string, memberId: string): Promise<void> {
    await apiClient.delete<void>(
      ENDPOINTS.ORGANIZATIONS.REMOVE_MEMBER(orgId, memberId)
    );
  },

  /**
   * Get organization hackathons (future feature)
   */
  async getOrganizationHackathons(orgId: string): Promise<any[]> {
    return apiClient.get<any[]>(ENDPOINTS.ORGANIZATIONS.HACKATHONS(orgId));
  },
};
