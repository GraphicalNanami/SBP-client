'use client';

import { useState, useCallback } from 'react';
import type { 
  BuildSubmission, 
  BuildDashboardTab, 
  BuildDetails, 
  BuildLinks, 
  BuildTeam, 
  BuildStellar,
  BuildCategory,
  NetworkType 
} from '@/src/builds/types/build.types';

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
    try {
      setIsSaving(true);
      
      // TODO: Integrate with actual API
      // For now, just simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBuild(prev => ({
        ...prev,
        status: 'Draft',
        updatedAt: new Date().toISOString()
      }));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error('Save failed:', error);
      // TODO: Handle error with toast notification
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handlePublish = useCallback(async () => {
    if (!canPublish) return;

    try {
      setIsSaving(true);
      
      // TODO: Integrate with actual API
      // For now, just simulate publish
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setBuild(prev => ({
        ...prev,
        status: 'Published',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error('Publish failed:', error);
      // TODO: Handle error with toast notification
    } finally {
      setIsSaving(false);
    }
  }, [canPublish]);

  return {
    // State
    build,
    activeTab,
    isSaving,
    saveSuccess,
    canPublish,

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