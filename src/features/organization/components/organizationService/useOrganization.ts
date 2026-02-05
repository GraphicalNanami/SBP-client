'use client';

import { useState, useCallback, useMemo } from 'react';
import type {
  OrganizationCreatePayload,
  OrganizationProfile,
  OrganizationStep,
  SocialLinks,
  TeamMember,
} from '../../types/organization.types';

const EMPTY_SOCIAL_LINKS: SocialLinks = {
  x: '',
  telegram: '',
  github: '',
  discord: '',
  linkedin: '',
  website: '',
};

function createEmptyProfile(id: string): OrganizationProfile {
  return {
    id,
    name: '',
    logo: '',
    tagline: '',
    about: '',
    website: '',
    socialLinks: { ...EMPTY_SOCIAL_LINKS },
    teamMembers: [],
  };
}

export function useOrganization() {
  const [step, setStep] = useState<OrganizationStep>('create');
  const [organizations, setOrganizations] = useState<OrganizationProfile[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  /* Derived: current active org */
  const profile = useMemo(
    () => organizations.find((o) => o.id === activeOrgId) ?? createEmptyProfile('temp'),
    [organizations, activeOrgId]
  );

  /* ── Create a new organization ── */
  const handleCreate = useCallback(
    (payload: OrganizationCreatePayload) => {
      const id = `org-${Date.now()}`;
      const newOrg: OrganizationProfile = {
        ...createEmptyProfile(id),
        name: payload.name,
        website: payload.website,
        socialLinks: { ...EMPTY_SOCIAL_LINKS, website: payload.website },
        teamMembers: [
          {
            id: 'owner-1',
            email: 'you@example.com',
            name: 'You',
            role: 'Admin',
            joinedAt: new Date().toISOString(),
          },
        ],
      };
      setOrganizations((prev) => [...prev, newOrg]);
      setActiveOrgId(id);
      setStep('dashboard');
    },
    []
  );

  /* ── Switch to another organization ── */
  const handleSwitchOrg = useCallback(
    (orgId: string) => {
      setActiveOrgId(orgId);
      setStep('dashboard');
      setSaveSuccess(false);
    },
    []
  );

  /* ── Go to create form (from dashboard) ── */
  const handleStartCreateNew = useCallback(() => {
    setStep('create');
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
    (email: string, role: TeamMember['role']) => {
      const newMember: TeamMember = {
        id: `member-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role,
        joinedAt: new Date().toISOString(),
      };
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === activeOrgId
            ? { ...org, teamMembers: [...org.teamMembers, newMember] }
            : org
        )
      );
    },
    [activeOrgId]
  );

  const handleRemoveMember = useCallback(
    (memberId: string) => {
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === activeOrgId
            ? { ...org, teamMembers: org.teamMembers.filter((m) => m.id !== memberId) }
            : org
        )
      );
    },
    [activeOrgId]
  );

  const handleUpdateMemberRole = useCallback(
    (memberId: string, role: TeamMember['role']) => {
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
    },
    [activeOrgId]
  );

  /* ── Save ── */
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }, []);

  return {
    step,
    organizations,
    activeOrgId,
    profile,
    isSaving,
    saveSuccess,
    handleCreate,
    handleSwitchOrg,
    handleStartCreateNew,
    handleProfileChange,
    handleSocialChange,
    handleAddMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleSave,
  };
}
