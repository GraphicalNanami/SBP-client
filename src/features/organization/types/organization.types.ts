export interface OrganizationCreatePayload {
  name: string;
  website: string;
  termsAccepted: boolean;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  avatarUrl?: string;
  joinedAt: string;
}

export interface OrganizationProfile {
  name: string;
  logo: string;
  tagline: string;
  about: string;
  website: string;
  socialLinks: SocialLinks;
  teamMembers: TeamMember[];
}

export interface SocialLinks {
  x: string;
  telegram: string;
  github: string;
  discord: string;
  linkedin: string;
  website: string;
}

export type OrganizationStep = 'create' | 'dashboard';
