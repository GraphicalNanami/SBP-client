import { apiClient } from '@/src/shared/lib/api/client';
import { ENDPOINTS } from '@/src/shared/lib/api/endpoints';
import type { ProfileMeResponse, UpdateProfilePayload } from '@/src/userProfile/types/profile.types';

class ProfileService {
  async getProfile(): Promise<ProfileMeResponse> {
    return apiClient.get<ProfileMeResponse>(ENDPOINTS.PROFILE.ME);
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<ProfileMeResponse> {
    return apiClient.put<ProfileMeResponse>(ENDPOINTS.PROFILE.UPDATE, payload);
  }
}

export const profileService = new ProfileService();
