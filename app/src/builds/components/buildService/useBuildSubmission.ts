'use client';

import { useState, useCallback, useEffect } from 'react';
import type {
  BuildSubmission,
  BuildDashboardTab,
  BuildDetails,
  BuildLinks,
  BuildTeam,
  BuildStellar,
  BuildCategory
} from '@/src/builds/types/build.types';
import { CATEGORY_MAPPING, BACKEND_TO_DISPLAY } from '@/src/builds/types/build.types';
import type { CreateBuildPayload, BackendBuild } from '@/src/builds/types/backend.types';
import * as buildsApi from './buildsApi';

/**
 * Transform BuildSubmission to CreateBuildPayload for API calls
 */
function transformToPayload(build: BuildSubmission): CreateBuildPayload {
  // Convert frontend category to backend category
  const backendCategory = build.details.category
    ? CATEGORY_MAPPING[build.details.category as BuildCategory]
    : 'OTHER';

  return {
    name: build.details.name,
    tagline: build.details.tagline,
    category: backendCategory,
    vision: build.details.vision || undefined,
    description: build.details.description,
    logo: build.details.logo || undefined,
    githubRepository: build.links.github || undefined,
    website: build.links.website || undefined,
    demoVideo: build.links.demoVideo || undefined,
    socialLinks: build.links.socialLinks.length > 0 ? build.links.socialLinks : undefined,
    teamDescription: build.team.description || undefined,
    teamLeadTelegram: build.team.teamLeadTelegram || undefined,
    contactEmail: build.team.contactEmail || undefined,
    teamSocials: build.team.teamSocials.length > 0
      ? build.team.teamSocials.map(link => link.url)
      : undefined,
  };
}

/**
 * Transform BackendBuild to BuildSubmission for UI state
 */
function transformFromBackend(backendBuild: BackendBuild): BuildSubmission {
  // Convert backend category to frontend category
  const frontendCategory = BACKEND_TO_DISPLAY[backendBuild.category] || 'Other';

  return {
    id: backendBuild.uuid,
    userId: '', // Not provided by backend
    status: backendBuild.status,
    details: {
      name: backendBuild.name,
      logo: backendBuild.logo || '',
      tagline: backendBuild.tagline,
      vision: backendBuild.vision || '',
      description: backendBuild.description || '',
      category: frontendCategory,
      techStack: [] // Not stored in backend yet
    },
    links: {
      github: backendBuild.githubRepository || '',
      website: backendBuild.website || '',
      demoVideo: backendBuild.demoVideo || '',
      liveDemo: backendBuild.website || '', // Use website as fallback
      socialLinks: backendBuild.socialLinks || []
    },
    team: {
      description: backendBuild.teamDescription || '',
      teamLeadTelegram: backendBuild.teamLeadTelegram || '',
      teamSocials: (backendBuild.teamSocials || []).map(url => ({ platform: 'Website', url })),
      contactEmail: backendBuild.contactEmail || ''
    },
    stellar: {
      contractAddress: backendBuild.contractAddress || '',
      stellarAddress: backendBuild.stellarAddress || '',
      networkType: '' // Not provided by backend in current schema
    },
    createdAt: backendBuild.publishedAt || new Date().toISOString(),
    updatedAt: backendBuild.publishedAt || new Date().toISOString(),
    publishedAt: backendBuild.publishedAt || ''
  };
}

export function useBuildSubmission() {
  // Initial state
  const [build, setBuild] = useState<BuildSubmission>({
    id: '',
    userId: '',
    status: 'Draft',
    details: {
      name: '',
      logo: '',
      tagline: '',
      vision: '',
      description: '',
      category: '',
      techStack: []
    },
    links: {
      github: '',
      website: '',
      demoVideo: '',
      liveDemo: '',
      socialLinks: []
    },
    team: {
      description: '',
      teamLeadTelegram: '',
      teamSocials: [],
      contactEmail: ''
    },
    stellar: {
      contractAddress: '',
      stellarAddress: '',
      networkType: ''
    },
    createdAt: '',
    updatedAt: '',
    publishedAt: ''
  });

  // Tab navigation
  const [activeTab, setActiveTab] = useState<BuildDashboardTab>('details');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create initial draft on mount
  useEffect(() => {
    async function initializeDraft() {
      try {
        setIsInitializing(true);

        // Create an empty draft build
        const initialPayload: CreateBuildPayload = {
          name: 'Untitled Build',
          tagline: '',
          category: 'Other',
        };

        const createdBuild = await buildsApi.createBuild(initialPayload);
        const transformedBuild = transformFromBackend(createdBuild);

        setBuild(transformedBuild);
      } catch (err) {
        console.error('Failed to create initial draft:', err);
        setError('Failed to initialize build. Please try again.');
      } finally {
        setIsInitializing(false);
      }
    }

    initializeDraft();
  }, []);

  // Validation helper
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Computed validation for publish (based on API requirements)
  const canPublish =
    build.details.tagline.trim() !== '' &&
    build.details.category !== '' &&
    build.details.vision.trim() !== '' &&
    build.details.description.trim() !== '' &&
    build.team.description.trim() !== '' &&
    build.team.teamLeadTelegram.trim() !== '' &&
    build.team.contactEmail.trim() !== '' &&
    isValidEmail(build.team.contactEmail) &&
    build.stellar.contractAddress.trim() !== '' &&
    build.stellar.stellarAddress.trim() !== '';

  // Update handlers
  const updateDetails = useCallback((details: Partial<BuildDetails>) => {
    setBuild(prev => ({
      ...prev,
      details: { ...prev.details, ...details }
    }));
  }, []);

  const updateLinks = useCallback((links: Partial<BuildLinks>) => {
    setBuild(prev => ({
      ...prev,
      links: { ...prev.links, ...links }
    }));
  }, []);

  const updateTeam = useCallback((team: Partial<BuildTeam>) => {
    setBuild(prev => ({
      ...prev,
      team: { ...prev.team, ...team }
    }));
  }, []);

  const updateStellar = useCallback((stellar: Partial<BuildStellar>) => {
    setBuild(prev => ({
      ...prev,
      stellar: { ...prev.stellar, ...stellar }
    }));
  }, []);

  // Array manipulation helpers
  const addTechStack = useCallback((tech: string) => {
    if (tech.trim() && !build.details.techStack.includes(tech.trim())) {
      updateDetails({ 
        techStack: [...build.details.techStack, tech.trim()] 
      });
    }
  }, [build.details.techStack, updateDetails]);

  const removeTechStack = useCallback((index: number) => {
    const newTechStack = build.details.techStack.filter((_, i) => i !== index);
    updateDetails({ techStack: newTechStack });
  }, [build.details.techStack, updateDetails]);

  const addSocialLink = useCallback((platform: string, url: string, type: 'links' | 'team') => {
    if (platform.trim() && url.trim()) {
      const newLink = { platform: platform.trim(), url: url.trim() };
      
      if (type === 'links') {
        updateLinks({
          socialLinks: [...build.links.socialLinks, newLink]
        });
      } else {
        updateTeam({
          teamSocials: [...build.team.teamSocials, newLink]
        });
      }
    }
  }, [build.links.socialLinks, build.team.teamSocials, updateLinks, updateTeam]);

  const removeSocialLink = useCallback((index: number, type: 'links' | 'team') => {
    if (type === 'links') {
      const newSocialLinks = build.links.socialLinks.filter((_, i) => i !== index);
      updateLinks({ socialLinks: newSocialLinks });
    } else {
      const newTeamSocials = build.team.teamSocials.filter((_, i) => i !== index);
      updateTeam({ teamSocials: newTeamSocials });
    }
  }, [build.links.socialLinks, build.team.teamSocials, updateLinks, updateTeam]);

  // Save and publish actions
  const handleSave = useCallback(async () => {
    if (!build.id) {
      console.error('Cannot save: Build ID is missing');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Transform build to API payload (only send changed fields)
      const payload = transformToPayload(build);

      // Call PATCH endpoint to save draft
      const updatedBuild = await buildsApi.updateBuild(build.id, payload);
      const transformedBuild = transformFromBackend(updatedBuild);

      setBuild(transformedBuild);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err) {
      console.error('Save failed:', err);
      setError('Failed to save build. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [build]);

  const handlePublish = useCallback(async () => {
    if (!canPublish || !build.id) return;

    try {
      setIsSaving(true);
      setError(null);

      // First, save the current draft state
      const payload = transformToPayload(build);
      await buildsApi.updateBuild(build.id, payload);

      // Then publish the build (both addresses are required)
      const publishPayload = {
        contractAddress: build.stellar.contractAddress,
        stellarAddress: build.stellar.stellarAddress,
        visibility: 'PUBLIC' as const,
      };

      const publishedBuild = await buildsApi.publishBuild(build.id, publishPayload);
      const transformedBuild = transformFromBackend(publishedBuild);

      setBuild(transformedBuild);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err) {
      console.error('Publish failed:', err);
      setError('Failed to publish build. Please check all required fields.');
    } finally {
      setIsSaving(false);
    }
  }, [canPublish, build]);

  return {
    // State
    build,
    activeTab,
    isSaving,
    saveSuccess,
    canPublish,
    isInitializing,
    error,

    // Actions
    setActiveTab,
    updateDetails,
    updateLinks,
    updateTeam,
    updateStellar,
    addTechStack,
    removeTechStack,
    addSocialLink,
    removeSocialLink,
    handleSave,
    handlePublish
  };
}