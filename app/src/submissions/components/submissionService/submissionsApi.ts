/**
 * Submissions API Service
 * Handles all submission-related API calls using the centralized API client
 */

import { apiClient } from '@/src/shared/lib/api/client';
import type {
  Submission,
  MySubmission,
  CreateSubmissionPayload,
  JudgeSubmissionPayload,
  SelectWinnerPayload,
  SubmissionsListResponse,
} from '../../types/submission.types';

/* ━━ Participant Endpoints (Build Team) ━━ */

/**
 * Create a new submission
 */
export async function createSubmission(payload: CreateSubmissionPayload): Promise<Submission> {
  return await apiClient.post<Submission>('/submissions', payload);
}

/**
 * Get user's submissions (authenticated)
 */
export async function getMySubmissions(): Promise<MySubmission[]> {
  return await apiClient.get<MySubmission[]>('/submissions/my-submissions');
}

/* ━━ Organizer & Judge Endpoints ━━ */

/**
 * List all submissions for a hackathon (organizer/judge view)
 */
export async function getHackathonSubmissions(hackathonId: string): Promise<SubmissionsListResponse> {
  return await apiClient.get<SubmissionsListResponse>(`/submissions/hackathon/${hackathonId}`);
}

/**
 * Judge a submission (score + feedback)
 */
export async function judgeSubmission(
  submissionId: string,
  payload: JudgeSubmissionPayload
): Promise<{ success: boolean; message: string }> {
  return await apiClient.post<{ success: boolean; message: string }>(
    `/submissions/${submissionId}/judge`,
    payload
  );
}

/**
 * Select a submission as winner
 */
export async function selectWinner(
  submissionId: string,
  payload: SelectWinnerPayload
): Promise<Submission> {
  return await apiClient.post<Submission>(`/submissions/${submissionId}/select-winner`, payload);
}
