/**
 * Submission Types
 * Type definitions for hackathon submissions
 */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ENUMS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export enum SubmissionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  WINNER = 'WINNER',
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * MAIN ENTITIES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface CustomAnswer {
  questionUuid: string;
  answer: string;
}

export interface JudgingScore {
  judgeId: string;
  score: number;
  feedback: string;
  submittedAt: string;
}

export interface JudgingDetails {
  scores: JudgingScore[];
  averageScore?: number;
  totalScores?: number;
}

export interface Submission {
  uuid: string;
  buildUuid: string;
  hackathonUuid: string;
  selectedTrackUuids: string[];
  customAnswers: CustomAnswer[];
  status: SubmissionStatus;
  submittedAt?: string;
  judgingDetails?: JudgingDetails;
  winnerDetails?: {
    prizeUuid: string;
    placement: number;
    announcement?: string;
    announcedAt?: string;
  };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * API PAYLOADS
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface CreateSubmissionPayload {
  buildUuid: string;
  hackathonUuid: string;
  selectedTrackUuids: string[];
  customAnswers?: CustomAnswer[];
}

export interface JudgeSubmissionPayload {
  score: number;
  feedback: string;
}

export interface SelectWinnerPayload {
  prizeUuid: string;
  placement: number;
  announcement?: string;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * API RESPONSES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface SubmissionsListResponse {
  submissions: Submission[];
  total: number;
}

export interface MySubmission {
  uuid: string;
  buildUuid: string;
  hackathonUuid: string;
  status: SubmissionStatus;
  submittedAt?: string;
}
