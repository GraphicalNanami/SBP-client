'use client';

import { useState, useCallback } from 'react';
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

const EMPTY_PROFILE: OrganizationProfile = {
  name: '',
  logo: '',
  tagline: '',
  about: '',
  website: '',
  socialLinks: { ...EMPTY_SOCIAL_LINKS },
  teamMembers: [],
};

export function useOrganization() {
  const [step, setStep] = useState<OrganizationStep>('create');
  const [profile, setProfile] = useState<OrganizationProfile>(EMPTY_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCreate = useCallback(
    (payload: OrganizationCreatePayload) => {
      setProfile((prev) => ({
        ...prev,
        name: payload.name,
        website: payload.website,
        socialLinks: { ...prev.socialLinks, website: payload.website },
        teamMembers: [
          {
            id: 'owner-1',
            email: 'you@example.com',
            name: 'You',
            role: 'Admin',
            joinedAt: new Date().toISOString(),
          },
        ],
      }));
      setStep('dashboard');
    },
    []
  );

  const handleProfileChange = useCallback(
    (field: keyof OrganizationProfile, value: string) => {
      setProfile((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSocialChange = useCallback(
    (field: keyof SocialLinks, value: string) => {
      setProfile((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [field]: value },
      }));
    },
    []
  );

  const handleAddMember = useCallback(
    (email: string, role: TeamMember['role']) => {
      const newMember: TeamMember = {
        id: `member-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role,
        joinedAt: new Date().toISOString(),
      };
      setProfile((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newMember],
      }));
    },
    []
  );

  const handleRemoveMember = useCallback(
    (memberId: string) => {
      setProfile((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.filter((m) => m.id !== memberId),
      }));
    },
    []
  );

  const handleUpdateMemberRole = useCallback(
    (memberId: string, role: TeamMember['role']) => {
      setProfile((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.map((m) =>
          m.id === memberId ? { ...m, role } : m
        ),
      }));
    },
    []
  );

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
    profile,
    isSaving,
    saveSuccess,
    handleCreate,
    handleProfileChange,
    handleSocialChange,
    handleAddMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleSave,
  };
}
