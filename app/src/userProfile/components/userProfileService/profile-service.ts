/**
 * Profile Service
 * API integration for profile management
 */

import { apiClient } from '@/src/shared/lib/api/client';
import { ENDPOINTS } from '@/src/shared/lib/api/endpoints';
import type { 
  ProfileMeResponse, 
  UpdatePersonalInfoPayload, 
  UserProfile 
} from '@/src/userProfile/types/profile.types';

class ProfileService {
  /**
   * Get complete profile data (User + Profile + Experience + Wallets)
   */
  async getProfile(): Promise<ProfileMeResponse> {
    return apiClient.get<ProfileMeResponse>(ENDPOINTS.PROFILE.ME);
  }

  /**
   * Update personal information (firstName, lastName, gender, city, country, website)
   */
  async updatePersonalInfo(payload: UpdatePersonalInfoPayload): Promise<UserProfile> {
    return apiClient.patch<UserProfile>(ENDPOINTS.PROFILE.UPDATE_PERSONAL_INFO, payload);
  }

  /**
   * Upload profile picture
   * @param file - Image file (max 5MB, JPEG/PNG/WebP)
   * @returns profilePictureUrl
   */
  async uploadProfilePicture(file: File): Promise<{ profilePictureUrl: string }> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    return apiClient.post<{ profilePictureUrl: string }>(
      ENDPOINTS.PROFILE.UPLOAD_PICTURE,
      formData
    );
  }
}

export const profileService = new ProfileService();
