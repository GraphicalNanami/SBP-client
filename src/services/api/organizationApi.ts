/**
 * Organization API Service
 * Handles all organization-related API calls and data transformations
 */

import api from './apiClient';
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
  return {
    id: backend._id,
    name: backend.name,
    slug: backend.slug,
    logo: backend.logo || '',
    tagline: backend.tagline || '',
    about: backend.about || '',
    website: backend.website,
    status: backend.status,
    socialLinks: {
      x: backend.socialLinks?.x || '',
      telegram: backend.socialLinks?.telegram || '',
      github: backend.socialLinks?.github || '',
      discord: backend.socialLinks?.discord || '',
      linkedin: backend.socialLinks?.linkedin || '',
    },
    teamMembers: members.map(transformMember),
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt,
  };
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
// Organization API Class
// ============================================

class OrganizationApi {
  /**
   * Create a new organization
   */
  async createOrganization(payload: OrganizationCreatePayload): Promise<OrganizationProfile> {
    const response = await api.post<CreateOrganizationResponse>('/organizations', {
      name: payload.name,
      website: payload.website,
      agreeToTerms: payload.termsAccepted,
    });

    // Transform response to frontend format
    return transformOrganization(response.organization, [
      response.membership,
    ]);
  }

  /**
   * Get all organizations for the current user
   */
  async getUserOrganizations(): Promise<OrganizationProfile[]> {
    const response = await api.get<UserOrganizationsResponse[]>('/organizations/me');

    // Fetch full details for each organization
    const organizations = await Promise.all(
      response.map(async (item) => {
        try {
          const details = await this.getOrganization(item.organization._id);
          return details;
        } catch (error) {
          // Fallback to basic info if full details fail
          console.error(`Failed to fetch details for org ${item.organization._id}:`, error);
          return transformOrganization(item.organization, []);
        }
      })
    );

    return organizations;
  }

  /**
   * Get organization details by ID
   */
  async getOrganization(orgId: string): Promise<OrganizationProfile> {
    const response = await api.get<OrganizationDetailsResponse>(`/organizations/${orgId}`);
    return transformOrganization(response.organization, response.members);
  }

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
    return api.patch<BackendOrganization>(`/organizations/${orgId}/profile`, updates);
  }

  /**
   * Update organization social links
   */
  async updateSocialLinks(orgId: string, socialLinks: SocialLinks): Promise<BackendOrganization> {
    return api.patch<BackendOrganization>(`/organizations/${orgId}/social-links`, {
      x: socialLinks.x || undefined,
      telegram: socialLinks.telegram || undefined,
      github: socialLinks.github || undefined,
      discord: socialLinks.discord || undefined,
      linkedin: socialLinks.linkedin || undefined,
    });
  }

  /**
   * Get organization members
   */
  async getMembers(
    orgId: string,
    status?: 'PENDING' | 'ACTIVE' | 'REMOVED'
  ): Promise<TeamMember[]> {
    const params = status ? `?status=${status}` : '';
    const response = await api.get<BackendOrganizationMember[]>(
      `/organizations/${orgId}/members${params}`
    );

    return response.map(transformMember);
  }

  /**
   * Invite a team member
   */
  async inviteMember(
    orgId: string,
    email: string,
    role: TeamMemberRole
  ): Promise<TeamMember> {
    const response = await api.post<BackendOrganizationMember>(
      `/organizations/${orgId}/members/invite`,
      {
        email,
        role: transformRoleToBackend(role),
      }
    );

    return transformMember(response);
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    orgId: string,
    memberId: string,
    role: TeamMemberRole
  ): Promise<TeamMember> {
    const response = await api.patch<BackendOrganizationMember>(
      `/organizations/${orgId}/members/${memberId}/role`,
      {
        role: transformRoleToBackend(role),
      }
    );

    return transformMember(response);
  }

  /**
   * Remove a team member
   */
  async removeMember(orgId: string, memberId: string): Promise<void> {
    await api.delete<void>(`/organizations/${orgId}/members/${memberId}`);
  }

  /**
   * Get organization hackathons (future feature)
   */
  async getOrganizationHackathons(orgId: string): Promise<any[]> {
    return api.get<any[]>(`/organizations/${orgId}/hackathons`);
  }
}

// Export singleton instance
export const organizationApi = new OrganizationApi();
export default organizationApi;
