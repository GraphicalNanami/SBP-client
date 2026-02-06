// ============================================
// Hackathon — Mock data for development
// ============================================

export interface HackathonCardData {
  id: string;
  name: string;
  tagline: string;
  category: string;
  status: 'Upcoming' | 'Ongoing' | 'Ended';
  poster: string;
  prizePool: number;
  prizeAsset: string;
  startTime: string;
  submissionDeadline: string;
  tags: string[];
  venue: string;
  organizationName: string;
  organizationLogo: string;
  builderCount: number;
  projectCount: number;
}

export const MOCK_HACKATHONS: HackathonCardData[] = [
  {
    id: 'hack-1',
    name: 'Soroban Buildathon 2026',
    tagline: 'Build the next generation of smart contracts on Stellar',
    category: 'Soroban Smart Contracts',
    status: 'Ongoing',
    poster: '',
    prizePool: 50000,
    prizeAsset: 'USDC',
    startTime: '2026-01-15T00:00:00Z',
    submissionDeadline: '2026-03-15T23:59:59Z',
    tags: ['Soroban', 'Smart Contracts', 'DeFi'],
    venue: 'Online',
    organizationName: 'Stellar Development Foundation',
    organizationLogo: '',
    builderCount: 342,
    projectCount: 89,
  },
  {
    id: 'hack-2',
    name: 'Stellar Payments Challenge',
    tagline: 'Reimagine cross-border payments with Stellar',
    category: 'Payments & Remittances',
    status: 'Upcoming',
    poster: '',
    prizePool: 30000,
    prizeAsset: 'XLM',
    startTime: '2026-03-01T00:00:00Z',
    submissionDeadline: '2026-04-30T23:59:59Z',
    tags: ['Payments', 'Remittances', 'Anchors'],
    venue: 'Online',
    organizationName: 'MoneyGram Access',
    organizationLogo: '',
    builderCount: 0,
    projectCount: 0,
  },
  {
    id: 'hack-3',
    name: 'Cross-border Innovation Hack',
    tagline: 'Connect financial systems across borders using Stellar',
    category: 'Cross-border Payments',
    status: 'Upcoming',
    poster: '',
    prizePool: 25000,
    prizeAsset: 'USDC',
    startTime: '2026-04-10T00:00:00Z',
    submissionDeadline: '2026-05-20T23:59:59Z',
    tags: ['Cross-border', 'Anchors', 'On/Off Ramps'],
    venue: 'San Francisco, CA',
    organizationName: 'Stellar Global',
    organizationLogo: '',
    builderCount: 0,
    projectCount: 0,
  },
  {
    id: 'hack-4',
    name: 'DeFi on Stellar Hack',
    tagline: 'Build decentralized finance applications on Stellar & Soroban',
    category: 'DeFi on Stellar',
    status: 'Ended',
    poster: '',
    prizePool: 75000,
    prizeAsset: 'USDC',
    startTime: '2025-09-01T00:00:00Z',
    submissionDeadline: '2025-11-30T23:59:59Z',
    tags: ['DeFi', 'AMM', 'Lending', 'Soroban'],
    venue: 'Online',
    organizationName: 'Stellar Development Foundation',
    organizationLogo: '',
    builderCount: 567,
    projectCount: 134,
  },
  {
    id: 'hack-5',
    name: 'Wallets & Identity Sprint',
    tagline: 'Create the next-gen wallet and identity solutions on Stellar',
    category: 'Wallets & Identity',
    status: 'Ongoing',
    poster: '',
    prizePool: 20000,
    prizeAsset: 'XLM',
    startTime: '2026-02-01T00:00:00Z',
    submissionDeadline: '2026-03-31T23:59:59Z',
    tags: ['Wallet', 'Identity', 'Freighter', 'SEP-30'],
    venue: 'Online',
    organizationName: 'SDF Labs',
    organizationLogo: '',
    builderCount: 198,
    projectCount: 45,
  },
  {
    id: 'hack-6',
    name: 'Real World Assets on Stellar',
    tagline: 'Tokenize real-world assets and bring them on-chain',
    category: 'Real World Assets',
    status: 'Upcoming',
    poster: '',
    prizePool: 40000,
    prizeAsset: 'USDC',
    startTime: '2026-05-01T00:00:00Z',
    submissionDeadline: '2026-06-30T23:59:59Z',
    tags: ['RWA', 'Tokenization', 'Compliance'],
    venue: 'Singapore',
    organizationName: 'Franklin Templeton Digital',
    organizationLogo: '',
    builderCount: 0,
    projectCount: 0,
  },
];

export const CATEGORY_OPTIONS = [
  'All',
  'Soroban Smart Contracts',
  'Payments & Remittances',
  'Anchors & On/Off Ramps',
  'DeFi on Stellar',
  'Real World Assets',
  'Cross-border Payments',
  'Developer Tooling',
  'Wallets & Identity',
  'Other',
];

export const STATUS_OPTIONS = ['All', 'Upcoming', 'Ongoing', 'Ended'] as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'prize-desc', label: 'Prize pool (high → low)' },
  { value: 'start-soonest', label: 'Start date (soonest)' },
  { value: 'deadline-soonest', label: 'Deadline (soonest)' },
] as const;
