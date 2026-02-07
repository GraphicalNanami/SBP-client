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
import type { CreateBuildPayload, BackendBuild } from '@/src/builds/types/backend.types';
import * as buildsApi from './buildsApi';

/**
 * Transform BuildSubmission to CreateBuildPayload for API calls
 */
function transformToPayload(build: BuildSubmission): CreateBuildPayload {
  return {
    name: build.details.name,
    tagline: build.details.tagline,
    category: build.details.category as BuildCategory,
    description: build.details.description,
    logo: build.details.logo || undefined,
    githubRepository: build.links.github || undefined,
    website: build.links.website || undefined,
    demoVideo: build.links.demoVideo || undefined,
    socialLinks: build.links.socialLinks.length > 0 ? build.links.socialLinks : undefined,
    teamDescription: build.team.description || undefined,
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
  return {
    id: backendBuild.uuid,
    userId: '', // Not provided by backend
    status: backendBuild.status,
    details: {
      name: backendBuild.name,
      logo: backendBuild.logo || '',
      tagline: backendBuild.tagline,
      description: backendBuild.description || '',
      category: backendBuild.category,
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

export function useBuildEdit(buildId: string) {
  // Initial state
  const [build, setBuild] = useState<BuildSubmission>({
    id: '',
    userId: '',
    status: 'Draft',
    details: {
      name: '',
      logo: '',
      tagline: '',
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

  // Load existing build on mount
  useEffect(() => {
    async function loadBuild() {
      try {
        setIsInitializing(true);

        // Fetch the existing build
        const existingBuild = await buildsApi.getBuildById(buildId);
        const transformedBuild = transformFromBackend(existingBuild);

        setBuild(transformedBuild);
      } catch (err) {
        console.error('Failed to load build:', err);
        setError('Failed to load build. Please try again.');
      } finally {
        setIsInitializing(false);
      }
    }

    if (buildId) {
      loadBuild();
    }
  }, [buildId]);

  // Validation helper
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Computed validation for publish
  const canPublish =
    build.details.name.trim() !== '' &&
    build.details.tagline.trim() !== '' &&
    build.details.description.trim() !== '' &&
    build.details.category !== '' &&
    build.details.techStack.length > 0 &&
    build.team.contactEmail.trim() !== '' &&
    isValidEmail(build.team.contactEmail) &&
    (build.stellar.contractAddress.trim() !== '' || build.stellar.stellarAddress.trim() !== '') &&
    build.stellar.networkType !== '';

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

      // Then publish the build
      const publishPayload = {
        contractAddress: build.stellar.contractAddress || build.stellar.stellarAddress, // Use whichever is provided
        stellarAddress: build.stellar.stellarAddress || build.stellar.contractAddress,
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
