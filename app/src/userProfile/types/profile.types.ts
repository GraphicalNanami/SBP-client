import type { User } from '@/src/shared/types/auth.types';
import type { Experience } from './experience.types';
import type { Wallet } from './wallet.types';

export interface SocialLinks {
  github?: {
    username: string;
    profileUrl: string;
    connectedAt: string;
  };
  twitter?: {
    handle: string;
    profileUrl: string;
    connectedAt: string;
  };
  linkedin?: string;
}

export interface UserProfile {
  userId: string;
  firstName?: string;
  lastName?: string;
  gender?: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  city?: string;
  country?: string;
  website?: string;
  profilePictureUrl?: string;
  bio?: string;
  stellarAddress?: string;
  socialLinks?: SocialLinks;
}

export interface UpdatePersonalInfoPayload {
  firstName?: string;
  lastName?: string;
  gender?: string;
  city?: string;
  country?: string;
  website?: string;
}

export interface ProfileMeResponse {
  user: User;
  profile: UserProfile;
  experience: Experience;
  wallets: Wallet[];
}
