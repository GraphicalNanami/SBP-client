'use client';

import { useState, useEffect, useCallback } from 'react';
import { profileService } from '@/src/userProfile/components/userProfileService/profile-service';
import { handleApiError } from '@/src/shared/utils/error-handler';
import type { ProfileMeResponse, UpdateProfilePayload } from '@/src/userProfile/types/profile.types';

interface UseProfileReturn {
  data: ProfileMeResponse | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [data, setData] = useState<ProfileMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await profileService.getProfile();
      setData(response);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (payload: UpdateProfilePayload): Promise<boolean> => {
    try {
      setError(null);
      const response = await profileService.updateProfile(payload);
      setData(response);
      return true;
    } catch (err) {
      setError(handleApiError(err));
      return false;
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    data,
    isLoading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  };
}
