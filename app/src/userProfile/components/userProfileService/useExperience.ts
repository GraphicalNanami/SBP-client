/**
 * useExperience Hook
 * Business logic for professional experience management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { experienceService } from './experience-service';
import { handleApiError } from '@/src/shared/utils/error-handler';
import type { Experience, UpdateExperiencePayload } from '@/src/userProfile/types/experience.types';

interface UseExperienceReturn {
  experience: Experience | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  updateExperience: (payload: UpdateExperiencePayload) => Promise<boolean>;
  addRole: (role: string) => Promise<boolean>;
  removeRole: (role: string) => Promise<boolean>;
  addLanguage: (language: string) => Promise<boolean>;
  removeLanguage: (language: string) => Promise<boolean>;
  addTool: (tool: string) => Promise<boolean>;
  removeTool: (tool: string) => Promise<boolean>;
  refreshExperience: () => Promise<void>;
}

export function useExperience(): UseExperienceReturn {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExperience = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await experienceService.getExperience();
      setExperience(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateExperience = useCallback(async (payload: UpdateExperiencePayload): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);
      const updated = await experienceService.updateExperience(payload);
      setExperience(updated);
      return true;
    } catch (err) {
      setError(handleApiError(err));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const addRole = useCallback(async (role: string): Promise<boolean> => {
    if (!experience) return false;
    const updatedRoles = [...experience.roles, role];
    return updateExperience({ roles: updatedRoles });
  }, [experience, updateExperience]);

  const removeRole = useCallback(async (role: string): Promise<boolean> => {
    if (!experience) return false;
    const updatedRoles = experience.roles.filter((r) => r !== role);
    return updateExperience({ roles: updatedRoles });
  }, [experience, updateExperience]);

  const addLanguage = useCallback(async (language: string): Promise<boolean> => {
    if (!experience) return false;
    const updated = [...experience.programmingLanguages, language];
    return updateExperience({ programmingLanguages: updated });
  }, [experience, updateExperience]);

  const removeLanguage = useCallback(async (language: string): Promise<boolean> => {
    if (!experience) return false;
    const updated = experience.programmingLanguages.filter((l) => l !== language);
    return updateExperience({ programmingLanguages: updated });
  }, [experience, updateExperience]);

  const addTool = useCallback(async (tool: string): Promise<boolean> => {
    if (!experience) return false;
    const updated = [...experience.developerTools, tool];
    return updateExperience({ developerTools: updated });
  }, [experience, updateExperience]);

  const removeTool = useCallback(async (tool: string): Promise<boolean> => {
    if (!experience) return false;
    const updated = experience.developerTools.filter((t) => t !== tool);
    return updateExperience({ developerTools: updated });
  }, [experience, updateExperience]);

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  return {
    experience,
    isLoading,
    error,
    isSaving,
    updateExperience,
    addRole,
    removeRole,
    addLanguage,
    removeLanguage,
    addTool,
    removeTool,
    refreshExperience: fetchExperience,
  };
}
