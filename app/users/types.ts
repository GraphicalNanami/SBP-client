export interface User {
  uuid: string;
  name: string;
  avatar?: string;
  role: 'USER' | 'ORGANIZER' | 'ADMIN';
  createdAt: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    city?: string;
    country?: string;
    website?: string;
    profilePictureUrl?: string;
    bio?: string;
    socialLinks?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
  };
  experience?: {
    roles?: string[];
    yearsOfExperience?: number;
    web3SkillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    programmingLanguages?: string[];
    developerTools?: string[];
  };
}

export interface UsersListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: 'createdAt' | 'name' | 'experience';
  sortOrder?: 'asc' | 'desc';
}

export interface UsersListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
