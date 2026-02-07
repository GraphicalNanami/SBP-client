/**
 * Builds API Service - Updated for New API Specification
 * Handles all build-related API calls using the centralized API client
 */

import { apiClient } from '@/src/shared/lib/api/client';
import type {
  BackendBuild,
  PublicBuildsListResponse,
  CreateBuildPayload,
  PublishBuildPayload,
  InviteTeamMemberPayload,
  TransferLeadershipPayload,
  ListPublicBuildsQuery,
} from '../../types/backend.types';
import { transformBuildToCard } from '../../types/backend.types';
import type { BuildCardData } from '../buildUI/BuildCard';

/* ━━ Public Builds Operations (No Auth Required) ━━ */

/**
 * Fetch published builds (public list)
 */
export async function listPublicBuilds(query: ListPublicBuildsQuery = {}): Promise<{
  builds: BuildCardData[];
  total: number;
}> {
  const params = new URLSearchParams();
  
  if (query.category) params.append('category', query.category);
  if (query.search) params.append('search', query.search);
  if (query.sortBy) params.append('sortBy', query.sortBy);
  if (query.limit) params.append('limit', query.limit.toString());
  if (query.offset) params.append('offset', query.offset.toString());

  const response = await apiClient.get<PublicBuildsListResponse>(
    `/builds/public/list?${params.toString()}`
  );

  return {
    builds: response.builds.map(transformBuildToCard),
    total: response.total,
  };
}

/**
 * Get public build profile by slug
 */
export async function getPublicBuild(slug: string): Promise<BuildCardData> {
  const response = await apiClient.get<BackendBuild>(`/builds/public/${slug}`);
  return transformBuildToCard(response);
}

/**
 * Get my builds (authenticated user's builds)
 */
export async function getMyBuilds(): Promise<BuildCardData[]> {
  const response = await apiClient.get<BackendBuild[]>('/builds/my-builds');
  return response.map(transformBuildToCard);
}

/* ━━ Private Builds Operations (Auth Required) ━━ */

/**
 * Create new build
 */
export async function createBuild(payload: CreateBuildPayload): Promise<BackendBuild> {
  return await apiClient.post<BackendBuild>('/builds', payload);
}

/**
 * Get build details (auth required for private/draft builds)
 */
export async function getBuildById(id: string): Promise<BackendBuild> {
  return await apiClient.get<BackendBuild>(`/builds/${id}`);
}

/**
 * Update build (save draft)
 */
export async function updateBuild(id: string, payload: Partial<CreateBuildPayload>): Promise<BackendBuild> {
  return await apiClient.patch<BackendBuild>(`/builds/${id}`, payload);
}

/**
 * Publish build
 */
export async function publishBuild(id: string, payload: PublishBuildPayload): Promise<BackendBuild> {
  return await apiClient.post<BackendBuild>(`/builds/${id}/publish`, payload);
}

/**
 * Archive build
 */
export async function archiveBuild(id: string): Promise<BackendBuild> {
  return await apiClient.post<BackendBuild>(`/builds/${id}/archive`, {});
}

/* ━━ Team Management ━━ */

/**
 * Invite team member
 */
export async function inviteTeamMember(
  buildId: string,
  payload: InviteTeamMemberPayload
): Promise<{ success: boolean; message: string }> {
  return await apiClient.post<{ success: boolean; message: string }>(
    `/builds/${buildId}/team/invite`,
    payload
  );
}

/**
 * Remove team member
 */
export async function removeTeamMember(
  buildId: string,
  memberUuid: string
): Promise<{ success: boolean }> {
  return await apiClient.delete<{ success: boolean }>(
    `/builds/${buildId}/team/${memberUuid}`
  );
}

/**
 * Transfer leadership
 */
export async function transferLeadership(
  buildId: string,
  payload: TransferLeadershipPayload
): Promise<{ success: boolean }> {
  return await apiClient.post<{ success: boolean }>(
    `/builds/${buildId}/team/transfer-leadership`,
    payload
  );
}

/* ━━ Image & Media Management ━━ */

/**
 * Upload build logo/image
 */
export async function uploadBuildImage(buildId: string, imageFile: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('image', imageFile);

  return await apiClient.post<{ url: string }>(
    `/builds/${buildId}/upload-image`,
    formData
  );
}

/* ━━ Export transformation helper ━━ */
export { transformBuildToCard } from '../../types/backend.types';