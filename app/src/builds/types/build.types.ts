export type BuildStatus = 'Draft' | 'Published' | 'Archived';
export type BuildCategory = 'DeFi' | 'NFT & Gaming' | 'Payments' | 'Infrastructure'
  | 'Developer Tools' | 'Social Impact' | 'Other';
export type NetworkType = 'Testnet' | 'Mainnet';

export interface BuildDetails {
  name: string;
  logo: string;
  tagline: string; // max 120 chars
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
  description: string;
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