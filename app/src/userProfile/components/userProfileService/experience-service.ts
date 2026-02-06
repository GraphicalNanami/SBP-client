/**
 * Experience Service
 * API integration for professional experience and skills
 */

import { apiClient } from '@/src/shared/lib/api/client';
import { ENDPOINTS } from '@/src/shared/lib/api/endpoints';
import type { Experience, UpdateExperiencePayload } from '@/src/userProfile/types/experience.types';

class ExperienceService {
  /**
   * Get current user's experience data
   */
  async getExperience(): Promise<Experience> {
    return apiClient.get<Experience>(ENDPOINTS.EXPERIENCE.ME);
  }

  /**
   * Replace entire experience record
   */
  async updateExperience(payload: UpdateExperiencePayload): Promise<Experience> {
    return apiClient.put<Experience>(ENDPOINTS.EXPERIENCE.UPDATE, payload);
  }

  /**
   * Partially update experience (add/remove tags)
   */
  async patchExperience(payload: Partial<UpdateExperiencePayload>): Promise<Experience> {
    return apiClient.patch<Experience>(ENDPOINTS.EXPERIENCE.PATCH, payload);
  }
}

export const experienceService = new ExperienceService();
