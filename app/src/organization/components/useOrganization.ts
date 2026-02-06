'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { organizationApi } from '@/src/shared/lib/api/organizationApi';
import { hackathonApi } from '@/src/shared/lib/api/hackathonApi';
import type {
  OrganizationCreatePayload,
  OrganizationProfile,
  OrganizationStep,
  SocialLinks,
  TeamMember,
} from '../types/organization.types';
import type { Hackathon } from '@/src/hackathon/types/hackathon.types';

const EMPTY_SOCIAL_LINKS: SocialLinks = {
  x: '',
  telegram: '',
  github: '',
  discord: '',
  linkedin: '',
};

function createEmptyProfile(id: string): OrganizationProfile {
  return {
    id,
    name: '',
    slug: '',
    logo: '',
    tagline: '',
    about: '',
    website: '',
    status: 'ACTIVE',
    socialLinks: { ...EMPTY_SOCIAL_LINKS },
    teamMembers: [],
    createdAt: new Date().toISOString(),
  };
}

export function useOrganization() {
  const [step, setStep] = useState<OrganizationStep>('create');
  const [organizations, setOrganizations] = useState<OrganizationProfile[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Hackathon management state */
  const [organizationHackathons, setOrganizationHackathons] = useState<Hackathon[]>([]);
  const [isLoadingHackathons, setIsLoadingHackathons] = useState(false);
  const [hackathonsError, setHackathonsError] = useState<string | null>(null);

  /* Derived: current active org */
  const profile = useMemo(
    () => organizations.find((o) => o.id === activeOrgId) ?? createEmptyProfile('temp'),
    [organizations, activeOrgId]
  );

  /* ── Fetch organization hackathons ── */
  const fetchOrganizationHackathons = useCallback(async (orgId: string) => {
    setIsLoadingHackathons(true);
    setHackathonsError(null);

    try {
      const hackathons = await hackathonApi.getOrganizationHackathons(orgId);
      setOrganizationHackathons(hackathons);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load hackathons';
      console.error('Failed to fetch organization hackathons:', err);
      setHackathonsError(errorMessage);
    } finally {
      setIsLoadingHackathons(false);
    }
  }, []);

  /* ── Load user's organizations ── */
  const loadOrganizations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load organizations from API
      const orgs = await organizationApi.getUserOrganizations();
      
      // If user has organizations, fetch complete details for the first one (including members)
      if (orgs.length > 0) {
        const firstOrgDetails = await organizationApi.getOrganization(orgs[0].id);
        
        // Replace the first org with complete details, keep others as is
        const updatedOrgs = [firstOrgDetails, ...orgs.slice(1)];
        setOrganizations(updatedOrgs);
        
        setActiveOrgId(orgs[0].id);
        setStep('dashboard');
        
        // Fetch hackathons for the first organization
        fetchOrganizationHackathons(orgs[0].id);
      } else {
        // No organizations, stay on create form
        setOrganizations(orgs);
        setStep('create');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load organizations';
      console.error('Failed to load organizations:', err);
      setError(errorMessage);
      // If auth error, user might not be logged in - stay on create
      setStep('create');
    } finally {
      setIsLoading(false);
    }
  }, [fetchOrganizationHackathons]);

  /* ── Load organizations on mount ── */
  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  /* ── Create a new organization ── */
  const handleCreate = useCallback(
    async (payload: OrganizationCreatePayload) => {
      try {
        setIsLoading(true);
        setError(null);

        // Create organization via API
        const newOrg = await organizationApi.createOrganization(payload);

        // Fetch complete organization details to ensure all data is loaded
        const completeOrg = await organizationApi.getOrganization(newOrg.id);

        // Add to organizations list
        setOrganizations((prev) => [...prev, completeOrg]);
        setActiveOrgId(completeOrg.id);
        setStep('dashboard');

        return completeOrg;
      } catch (err: any) {
        console.error('Failed to create organization:', err);
        const errorMessage =
          err.status === 409
            ? 'Organization name already exists'
            : err.status === 400
            ? 'Invalid organization data. Please check all fields.'
            : err.message || 'Failed to create organization';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ── Switch to another organization ── */
  const handleSwitchOrg = useCallback(
    async (orgId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch organization details from API (including members)
        const orgDetails = await organizationApi.getOrganization(orgId);

        // Update the organization in state with complete details
        setOrganizations((prev) =>
          prev.map((org) => (org.id === orgId ? orgDetails : org))
        );

        setActiveOrgId(orgId);
        setStep('dashboard');
        setSaveSuccess(false);

        // Fetch hackathons for the switched organization
        fetchOrganizationHackathons(orgId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load organization details';
        console.error('Failed to switch organization:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchOrganizationHackathons]
  );

  /* ── Go to create form (from dashboard) ── */
  const handleStartCreateNew = useCallback(() => {
    setStep('create');
    setError(null);
  }, []);

  /* ── Profile field changes (scoped to active org) ── */
  const handleProfileChange = useCallback(
    (field: keyof OrganizationProfile, value: string) => {
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === activeOrgId ? { ...org, [field]: value } : org
        )
      );
    },
    [activeOrgId]
  );

  /* ── Social link changes ── */
  const handleSocialChange = useCallback(
    (field: keyof SocialLinks, value: string) => {
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === activeOrgId
            ? { ...org, socialLinks: { ...org.socialLinks, [field]: value } }
            : org
        )
      );
    },
    [activeOrgId]
  );

  /* ── Team member operations ── */
  const handleAddMember = useCallback(
    async (email: string, role: TeamMember['role']) => {
      if (!activeOrgId) return;

      try {
        setError(null);

        // Invite member via API (API handles role transformation)
        const newMember = await organizationApi.inviteMember(activeOrgId, email, role);

        // Update local state
        setOrganizations((prev) =>
          prev.map((org) =>
            org.id === activeOrgId
              ? { ...org, teamMembers: [...org.teamMembers, newMember] }
              : org
          )
        );

        return newMember;
      } catch (err: any) {
        console.error('Failed to invite member:', err);
        const errorMessage =
          err.status === 404
            ? 'User with this email not found'
            : err.status === 409
            ? 'User is already a member of this organization'
            : err.status === 403
            ? 'You do not have permission to invite members'
            : err.message || 'Failed to invite member';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [activeOrgId]
  );

  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      if (!activeOrgId) return;

      try {
        setError(null);

        // Remove member via API
        await organizationApi.removeMember(activeOrgId, memberId);

        // Update local state
        setOrganizations((prev) =>
          prev.map((org) =>
            org.id === activeOrgId
              ? { ...org, teamMembers: org.teamMembers.filter((m) => m.id !== memberId) }
              : org
          )
        );
      } catch (err: any) {
        console.error('Failed to remove member:', err);
        const errorMessage =
          err.status === 403
            ? 'You do not have permission to remove members'
            : err.status === 400
            ? 'Cannot remove the last admin'
            : err.message || 'Failed to remove member';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [activeOrgId]
  );

  const handleUpdateMemberRole = useCallback(
    async (memberId: string, role: TeamMember['role']) => {
      if (!activeOrgId) return;

      try {
        setError(null);

        // TODO: Re-enable API call when backend is ready
        // const updatedMember = await organizationApi.updateMemberRole(
        //   activeOrgId,
        //   memberId,
        //   role
        // );

        // Update local state
        setOrganizations((prev) =>
          prev.map((org) =>
            org.id === activeOrgId
              ? {
                  ...org,
                  teamMembers: org.teamMembers.map((m) =>
                    m.id === memberId ? { ...m, role } : m
                  ),
                }
              : org
          )
        );
      } catch (err: any) {
        console.error('Failed to update member role:', err);
        const errorMessage =
          err.status === 403
            ? 'You do not have permission to change member roles'
            : err.status === 400
            ? 'Cannot change role: must have at least one admin'
            : err.message || 'Failed to update member role';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [activeOrgId]
  );

  /* ── Save profile and social links ── */
  const handleSave = useCallback(async () => {
    if (!activeOrgId) return;

    const activeOrg = organizations.find((org) => org.id === activeOrgId);
    if (!activeOrg) return;

    try {
      setIsSaving(true);
      setSaveSuccess(false);
      setError(null);

      // Update profile fields
      await organizationApi.updateProfile(activeOrgId, {
        logo: activeOrg.logo || undefined,
        tagline: activeOrg.tagline || undefined,
        about: activeOrg.about || undefined,
      });

      // Update social links
      await organizationApi.updateSocialLinks(activeOrgId, activeOrg.socialLinks);

      // Refetch organization to sync with backend
      const updatedOrg = await organizationApi.getOrganization(activeOrgId);
      setOrganizations((prev) =>
        prev.map((org) => (org.id === activeOrgId ? updatedOrg : org))
      );

      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to save organization:', err);
      const errorMessage =
        err.status === 403
          ? 'You do not have permission to update this organization'
          : err.message || 'Failed to save changes';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [activeOrgId, organizations]);

  /* ── Clear error ── */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* ── Refresh hackathons ── */
  const refreshHackathons = useCallback(() => {
    if (activeOrgId) {
      fetchOrganizationHackathons(activeOrgId);
    }
  }, [activeOrgId, fetchOrganizationHackathons]);

  return {
    step,
    organizations,
    activeOrgId,
    profile,
    isSaving,
    saveSuccess,
    isLoading,
    error,
    organizationHackathons,
    isLoadingHackathons,
    hackathonsError,
    handleCreate,
    handleSwitchOrg,
    handleStartCreateNew,
    handleProfileChange,
    handleSocialChange,
    handleAddMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleSave,
    clearError,
    refreshHackathons,
  };
}
