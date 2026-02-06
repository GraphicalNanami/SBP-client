import type { User } from '@/src/shared/types/auth.types';

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
}

export interface UserProfile {
  _id: string;
  userId: string;
  bio?: string;
  stellarAddress?: string;
  socialLinks: SocialLinks;
}

export interface ProfileMeResponse {
  user: User;
  profile: UserProfile;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  stellarAddress?: string;
  socialLinks?: SocialLinks;
}
