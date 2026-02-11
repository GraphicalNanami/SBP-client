// ============================================
// Hackathon — Shared TypeScript Types
// ============================================

// --- Enums & Literals ---

export type HackathonStatus =
  | 'Draft'
  | 'Under Review'
  | 'Rejected'
  | 'Active'
  | 'Ended'
  | 'Cancelled';

export type HackathonVisibility = 'Public' | 'Private';

export type HackathonCategory =
  | 'Soroban Smart Contracts'
  | 'Payments & Remittances'
  | 'Anchors & On/Off Ramps'
  | 'DeFi on Stellar'
  | 'Real World Assets'
  | 'Cross-border Payments'
  | 'Developer Tooling'
  | 'Wallets & Identity'
  | 'Other';

export type VenueType = 'Online' | 'In-Person';

export type AdminPermission = 'Full Access' | 'Limited Access';

export type SubmissionStatus = 'Submitted' | 'Under Review' | 'Judged';

export type DistributionStatus = 'Not Started' | 'Processing' | 'Completed';

export type BuilderStatus = 'Registered' | 'Withdrawn';

// --- Core Models ---

export interface HackathonTrack {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface CustomQuestion {
  id: string;
  label: string;
  type: 'text' | 'select' | 'checkbox';
  options?: string[]; // for select type
  required: boolean;
}

export interface HackathonGeneral {
  name: string;
  category: HackathonCategory | '';
  visibility: HackathonVisibility;
  poster: string; // URL or empty
  prizePool: string;
  prizeAsset: string; // e.g. "XLM", "USDC"
  tags: string[];
  startTime: string; // ISO datetime
  preRegEndTime: string; // ISO datetime or empty
  submissionDeadline: string; // ISO datetime
  venue: VenueType;
  venueLocation: string; // address if In-Person
  submissionRequirements: string;
  adminContact: string;
  customQuestions: CustomQuestion[];
}

export interface HackathonAdmin {
  id: string;
  email: string;
  name: string;
  permission: AdminPermission;
  addedAt: string; // ISO datetime
}

export interface HackathonPrize {
  id: string;
  name: string;
  trackId: string | null; // null = "Overall"
  placements: HackathonPlacement[];
}

export interface HackathonPlacement {
  id: string;
  label: string; // e.g. "1st Place"
  amount: number;
  currency: string;
  winnerId: string | null; // project id, null = unassigned
}

export interface HackathonJudge {
  id: string;
  email: string;
  name: string;
  assignedTrackIds: string[];
  deadline: string; // ISO datetime
}

export interface HackathonBuilder {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  trackId: string | null;
  status: BuilderStatus;
  customAnswers: Record<string, string>;
}

export interface HackathonProject {
  id: string;
  name: string;
  teamName: string;
  teamMembers: string[];
  trackId: string;
  submittedAt: string;
  status: SubmissionStatus;
  repoUrl: string;
  demoUrl: string;
  description: string;
}

// --- Aggregate ---

export interface Hackathon {
  id: string;
  organizationId: string;
  status: HackathonStatus;
  general: HackathonGeneral;
  tracks: HackathonTrack[];
  description: string; // rich-text / markdown
  admins: HackathonAdmin[];
  prizes: HackathonPrize[];
  judges: HackathonJudge[];
  builders: HackathonBuilder[];
  projects: HackathonProject[];
  createdAt: string;
  updatedAt: string;
}

// --- Dashboard Tab ---

export type HackathonDashboardTab =
  | 'general'
  | 'tracks'
  | 'description'
  | 'team'
  | 'insights'
  | 'participants'
  | 'winners';
