export type BuildStatus = 'Draft' | 'Published' | 'Archived';

// Backend API expects these exact uppercase values
export type BackendBuildCategory = 'DEFI' | 'NFT' | 'GAMING' | 'INFRASTRUCTURE' | 'SOCIAL' | 'TOOLING' | 'DAO' | 'OTHER';

// Frontend display-friendly categories
export type BuildCategory = 'DeFi' | 'NFT & Gaming' | 'Payments' | 'Infrastructure'
  | 'Developer Tools' | 'Social Impact' | 'DAO' | 'Other';

export type NetworkType = 'Testnet' | 'Mainnet';

// Mapping frontend categories to backend categories
export const CATEGORY_MAPPING: Record<BuildCategory, BackendBuildCategory> = {
  'DeFi': 'DEFI',
  'NFT & Gaming': 'NFT',
  'Payments': 'INFRASTRUCTURE', // Payments falls under infrastructure
  'Infrastructure': 'INFRASTRUCTURE',
  'Developer Tools': 'TOOLING',
  'Social Impact': 'SOCIAL',
  'DAO': 'DAO',
  'Other': 'OTHER',
};

// Reverse mapping for display
export const BACKEND_TO_DISPLAY: Record<BackendBuildCategory, BuildCategory> = {
  'DEFI': 'DeFi',
  'NFT': 'NFT & Gaming',
  'GAMING': 'NFT & Gaming',
  'INFRASTRUCTURE': 'Infrastructure',
  'SOCIAL': 'Social Impact',
  'TOOLING': 'Developer Tools',
  'DAO': 'DAO',
  'OTHER': 'Other',
};

export interface BuildDetails {
  name: string;
  logo: string;
  tagline: string; // max 120 chars
  vision: string; // Required for publish - long-term vision statement
  description: string;
  category: BuildCategory | '';
  techStack: string[];
}

export interface BuildLinks {
  github: string;
  website: string;
  demoVideo: string;
  liveDemo: string;
  socialLinks: { platform: string; url: string }[];
}

export interface BuildTeam {
  description: string; // Maps to teamDescription in API
  teamLeadTelegram: string; // Required for publish - @handle format
  teamSocials: { platform: string; url: string }[];
  contactEmail: string;
}

export interface BuildStellar {
  contractAddress: string;
  stellarAddress: string;
  networkType: NetworkType | '';
}

export interface BuildSubmission {
  id: string;
  userId: string;
  status: BuildStatus;
  details: BuildDetails;
  links: BuildLinks;
  team: BuildTeam;
  stellar: BuildStellar;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export type BuildDashboardTab = 'details' | 'links' | 'description' | 'team' | 'stellar';