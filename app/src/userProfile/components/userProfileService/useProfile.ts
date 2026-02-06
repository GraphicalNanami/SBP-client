/**
 * useProfile Hook
 * Business logic for profile management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { profileService } from './profile-service';
import { handleApiError } from '@/src/shared/utils/error-handler';
import type { 
  ProfileMeResponse, 
  UpdatePersonalInfoPayload, 
  UserProfile 
} from '@/src/userProfile/types/profile.types';

interface UseProfileReturn {
  data: ProfileMeResponse | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  updatePersonalInfo: (payload: UpdatePersonalInfoPayload) => Promise<boolean>;
  uploadProfilePicture: (file: File) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [data, setData] = useState<ProfileMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
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

  const updatePersonalInfo = useCallback(async (payload: UpdatePersonalInfoPayload): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      const updatedProfile = await profileService.updatePersonalInfo(payload);
      
      // Update local state
      if (data) {
        setData({ ...data, profile: updatedProfile });
      }
      return true;
    } catch (err) {
      setError(handleApiError(err));
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [data]);

  const uploadProfilePicture = useCallback(async (file: File): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);
      
      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return false;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('File type must be JPEG, PNG, or WebP');
        return false;
      }

      const response = await profileService.uploadProfilePicture(file);
      
      // Update local state
      if (data) {
        setData({
          ...data,
          profile: {
            ...data.profile,
            profilePictureUrl: response.profilePictureUrl,
          },
        });
      }
      return true;
    } catch (err) {
      setError(handleApiError(err));
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [data]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    data,
    profile: data?.profile || null,
    isLoading,
    error,
    isUpdating,
    updatePersonalInfo,
    uploadProfilePicture,
    refreshProfile: fetchProfile,
  };
}
