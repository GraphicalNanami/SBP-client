# Profile Backend Integration Plan

## Overview

Integrate the existing profile UI with the backend API to enable complete profile management including personal information, social accounts, professional experience, and Freighter wallet management. Backend returns data in JSON format with JWT authentication.

---

## Backend API Reference

### 1. Profile Endpoints

| Method | Path                     | Auth   | Description                                           |
|--------|--------------------------|--------|-------------------------------------------------------|
| GET    | /profile/me              | Bearer | Get complete profile (User + Profile + Experience + Wallets) |
| PATCH  | /profile/personal-info   | Bearer | Update personal info (firstName, lastName, gender, city, country, website) |
| POST   | /profile/upload-picture  | Bearer | Upload profile picture. Returns `profilePictureUrl`. |

### 2. Experience Endpoints

| Method | Path                         | Auth   | Description                                           |
|--------|------------------------------|--------|-------------------------------------------------------|
| GET    | /experience/me               | Bearer | Get current user's experience data                    |
| PUT    | /experience                  | Bearer | Create or replace entire experience record            |
| PATCH  | /experience                  | Bearer | Partially update experience (add/remove tags)         |

### 3. Wallet Endpoints

| Method | Path                         | Auth   | Description                                           |
|--------|------------------------------|--------|-------------------------------------------------------|
| GET    | /wallets                     | Bearer | Get all wallets for current user                      |
| POST   | /wallets                     | Bearer | Add a new wallet. Body: `{ address, nickname }`       |
| PATCH  | /wallets/:walletId           | Bearer | Update wallet (change nickname)                       |
| DELETE | /wallets/:walletId           | Bearer | Remove wallet from user's account                     |
| POST   | /wallets/:walletId/verify    | Bearer | Verify wallet ownership. Body: `{ signature, challenge }` |
| POST   | /wallets/:walletId/set-primary | Bearer | Set wallet as primary (unsets others)               |

<!-- ### 4. Social Accounts (Future)

| Method | Path                         | Auth   | Description                                           |
|--------|------------------------------|--------|-------------------------------------------------------|
| POST   | /social/github/connect       | Bearer | Initiate GitHub OAuth flow                            |
| POST   | /social/twitter/connect      | Bearer | Initiate Twitter OAuth flow                           |
| DELETE | /social/:provider            | Bearer | Disconnect social account                             | -->

---

## Backend Data Structures

### Profile Schema Extension
```typescript
interface Profile {
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
  socialLinks?: {
    github?: {
      username: string;
      profileUrl: string;
      connectedAt: Date;
    };
    twitter?: {
      handle: string;
      profileUrl: string;
      connectedAt: Date;
    };
    linkedin?: string;
  };
}
```

### Experience Schema
```typescript
interface Experience {
  userId: string;
  roles: string[];                    // Max 10 tags
  yearsOfExperience?: number;         // 0-60
  web3SkillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  programmingLanguages: string[];     // Max 20 tags
  developerTools: string[];           // Max 30 tags
}
```

### Wallet Schema
```typescript
interface Wallet {
  _id: string;
  userId: string;
  address: string;                    // Stellar public key (G...)
  nickname?: string;                  // Max 50 chars
  isPrimary: boolean;                 // Only one per user
  isVerified: boolean;                // After signature verification
  addedAt: Date;
  lastUsedAt?: Date;
}
```

---

## Frontend Architecture

### State Management Strategy

**Profile Data:**
- Store in React Context (`ProfileContext`) for app-wide access
- Load on mount from `/profile/me`
- Update optimistically on mutations
- Cache for 5 minutes, refresh on focus

**Experience Data:**
- Store in local state within Experience settings page
- Lazy load on tab navigation
- Debounced auto-save on changes

**Wallet Data:**
- Store in local state within Wallets settings page
- Real-time updates on add/remove/verify
- Poll for verification status during challenge flow

**Rationale:** Profile data is accessed across the app (navbar, dropdown, etc.), so Context is appropriate. Experience and Wallets are only used in settings, so local state is sufficient.

---

## Directory Structure

```
app/
├── src/
│   ├── userProfile/
│   │   ├── components/
│   │   │   ├── userProfileUI/
│   │   │   │   ├── ProfileDropdown.tsx        [EXISTING]
│   │   │   │   ├── SettingsLayout.tsx         [EXISTING]
│   │   │   │   ├── PersonalInfoForm.tsx       [MODIFY]
│   │   │   │   ├── SocialAccountsForm.tsx     [NEW]
│   │   │   │   ├── ExperienceForm.tsx         [NEW]
│   │   │   │   ├── WalletsManager.tsx         [NEW]
│   │   │   │   └── WalletCard.tsx             [NEW]
│   │   │   │
│   │   │   └── userProfileService/
│   │   │       ├── profile-service.ts         [MODIFY]
│   │   │       ├── experience-service.ts      [NEW]
│   │   │       ├── wallet-service.ts          [NEW]
│   │   │       ├── freighter-service.ts       [NEW]
│   │   │       ├── useProfile.ts              [EXISTING]
│   │   │       ├── useExperience.ts           [NEW]
│   │   │       └── useWallets.ts              [NEW]
│   │   │
│   │   ├── context/
│   │   │   └── ProfileContext.tsx             [NEW]
│   │   │
│   │   ├── types/
│   │   │   ├── profile.types.ts               [MODIFY]
│   │   │   ├── experience.types.ts            [NEW]
│   │   │   └── wallet.types.ts                [NEW]
│   │   │
│   │   ├── utils/
│   │   │   ├── validation.ts                  [NEW]
│   │   │   └── freighter.ts                   [NEW]
│   │   │
│   │   └── context.md                         [UPDATE]
│   │
│   └── shared/
│       ├── lib/
│       │   ├── api/
│       │   │   ├── client.ts                  [EXISTING]
│       │   │   └── endpoints.ts               [MODIFY]
│       │
│       ├── types/
│       │   └── auth.types.ts                  [MODIFY - Add avatar to User]
│       │
│       └── components/
│           └── factories/
│               ├── ImageUploader.tsx          [NEW]
│               └── ChipInput.tsx              [NEW]
│
├── dashboard/
│   └── settings/
│       ├── layout.tsx                         [MODIFY]
│       ├── personal-info/page.tsx             [MODIFY]
│       ├── social-accounts/page.tsx           [NEW]
│       ├── experience/page.tsx                [NEW]
│       └── wallets/page.tsx                   [NEW]
│
└── layout.tsx                                 [MODIFY - Wrap with ProfileProvider]
```

---

## Implementation Phases

### Phase 1: Foundation & Types

#### 1.1 Update Shared Types

**`app/src/shared/lib/api/endpoints.ts`**
```typescript
export const ENDPOINTS = {
  AUTH: { ... },
  PROFILE: {
    ME: '/profile/me',
    UPDATE_PERSONAL_INFO: '/profile/personal-info',
    UPLOAD_PICTURE: '/profile/upload-picture',
  },
  EXPERIENCE: {
    ME: '/experience/me',
    UPDATE: '/experience',
    PATCH: '/experience',
  },
  WALLETS: {
    LIST: '/wallets',
    CREATE: '/wallets',
    UPDATE: (id: string) => `/wallets/${id}`,
    DELETE: (id: string) => `/wallets/${id}`,
    VERIFY: (id: string) => `/wallets/${id}/verify`,
    SET_PRIMARY: (id: string) => `/wallets/${id}/set-primary`,
  },
  SOCIAL: {
    CONNECT_GITHUB: '/social/github/connect',
    CONNECT_TWITTER: '/social/twitter/connect',
    DISCONNECT: (provider: string) => `/social/${provider}`,
  },
};
```

#### 1.2 Create Profile Types

**`app/src/userProfile/types/profile.types.ts`**
```typescript
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
```

#### 1.3 Create Experience Types

**`app/src/userProfile/types/experience.types.ts`**
```typescript
export type Web3SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface Experience {
  roles: string[];
  yearsOfExperience?: number;
  web3SkillLevel?: Web3SkillLevel;
  programmingLanguages: string[];
  developerTools: string[];
}

export interface UpdateExperiencePayload {
  roles?: string[];
  yearsOfExperience?: number;
  web3SkillLevel?: Web3SkillLevel;
  programmingLanguages?: string[];
  developerTools?: string[];
}

// Predefined options for dropdowns
export const PREDEFINED_ROLES = [
  'Backend Engineer',
  'Frontend Engineer',
  'Full Stack Engineer',
  'Blockchain Engineer',
  'Smart Contract Developer',
  'DevOps Engineer',
  'Data Engineer',
  'Mobile Developer',
  'UI/UX Designer',
  'Product Manager',
] as const;

export const PREDEFINED_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Solidity',
  'Rust',
  'Python',
  'Go',
  'Java',
  'C++',
  'Swift',
  'Kotlin',
] as const;

export const PREDEFINED_TOOLS = [
  'Hardhat',
  'Foundry',
  'Truffle',
  'ethers.js',
  'web3.js',
  'Ganache',
  'Remix',
  'OpenZeppelin',
  'Metamask',
  'IPFS',
] as const;
```

#### 1.4 Create Wallet Types

**`app/src/userProfile/types/wallet.types.ts`**
```typescript
export interface Wallet {
  _id: string;
  userId: string;
  address: string;
  nickname?: string;
  isPrimary: boolean;
  isVerified: boolean;
  addedAt: string;
  lastUsedAt?: string;
}

export interface AddWalletPayload {
  address: string;
  nickname?: string;
}

export interface VerifyWalletPayload {
  signature: string;
  challenge: string;
}

export interface UpdateWalletPayload {
  nickname?: string;
}

export interface WalletChallenge {
  message: string;
  nonce: string;
  timestamp: number;
}
```

---

### Phase 2: Service Layer (API Integration)

#### 2.1 Profile Service

**`app/src/userProfile/components/userProfileService/profile-service.ts`**

Extend existing service with new methods:

```typescript
import { apiClient } from '@/src/shared/lib/api/client';
import { ENDPOINTS } from '@/src/shared/lib/api/endpoints';
import { ProfileMeResponse, UpdatePersonalInfoPayload } from '../../types/profile.types';

export const profileService = {
  // Get complete profile data
  getProfile: async (): Promise<ProfileMeResponse> => {
    return apiClient.get<ProfileMeResponse>(ENDPOINTS.PROFILE.ME);
  },

  // Update personal information
  updatePersonalInfo: async (data: UpdatePersonalInfoPayload): Promise<UserProfile> => {
    return apiClient.patch<UserProfile>(ENDPOINTS.PROFILE.UPDATE_PERSONAL_INFO, data);
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File): Promise<{ profilePictureUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post<{ profilePictureUrl: string }>(
      ENDPOINTS.PROFILE.UPLOAD_PICTURE,
      formData,
      { isFormData: true }
    );
  },
};
```

**Note:** `apiClient` needs to support FormData for file uploads. Add an `isFormData` option to skip `Content-Type: application/json` header.

#### 2.2 Experience Service

**`app/src/userProfile/components/userProfileService/experience-service.ts`**

```typescript
import { apiClient } from '@/src/shared/lib/api/client';
import { ENDPOINTS } from '@/src/shared/lib/api/endpoints';
import { Experience, UpdateExperiencePayload } from '../../types/experience.types';

export const experienceService = {
  // Get experience data
  getExperience: async (): Promise<Experience> => {
    return apiClient.get<Experience>(ENDPOINTS.EXPERIENCE.ME);
  },

  // Replace entire experience record
  updateExperience: async (data: UpdateExperiencePayload): Promise<Experience> => {
    return apiClient.put<Experience>(ENDPOINTS.EXPERIENCE.UPDATE, data);
  },

  // Partially update experience
  patchExperience: async (data: Partial<UpdateExperiencePayload>): Promise<Experience> => {
    return apiClient.patch<Experience>(ENDPOINTS.EXPERIENCE.PATCH, data);
  },
};
```

#### 2.3 Wallet Service

**`app/src/userProfile/components/userProfileService/wallet-service.ts`**

```typescript
import { apiClient } from '@/src/shared/lib/api/client';
import { ENDPOINTS } from '@/src/shared/lib/api/endpoints';
import {
  Wallet,
  AddWalletPayload,
  VerifyWalletPayload,
  UpdateWalletPayload,
  WalletChallenge,
} from '../../types/wallet.types';

export const walletService = {
  // Get all wallets
  getWallets: async (): Promise<Wallet[]> => {
    return apiClient.get<Wallet[]>(ENDPOINTS.WALLETS.LIST);
  },

  // Add new wallet
  addWallet: async (data: AddWalletPayload): Promise<{ wallet: Wallet; challenge: string }> => {
    return apiClient.post<{ wallet: Wallet; challenge: string }>(
      ENDPOINTS.WALLETS.CREATE,
      data
    );
  },

  // Update wallet nickname
  updateWallet: async (walletId: string, data: UpdateWalletPayload): Promise<Wallet> => {
    return apiClient.patch<Wallet>(ENDPOINTS.WALLETS.UPDATE(walletId), data);
  },

  // Delete wallet
  deleteWallet: async (walletId: string): Promise<void> => {
    return apiClient.delete<void>(ENDPOINTS.WALLETS.DELETE(walletId));
  },

  // Verify wallet ownership
  verifyWallet: async (walletId: string, data: VerifyWalletPayload): Promise<Wallet> => {
    return apiClient.post<Wallet>(ENDPOINTS.WALLETS.VERIFY(walletId), data);
  },

  // Set wallet as primary
  setPrimaryWallet: async (walletId: string): Promise<Wallet> => {
    return apiClient.post<Wallet>(ENDPOINTS.WALLETS.SET_PRIMARY(walletId), {});
  },
};
```

#### 2.4 Freighter Integration Service

**`app/src/userProfile/components/userProfileService/freighter-service.ts`**

```typescript
import { isConnected, getPublicKey, signMessage } from '@stellar/freighter-api';

export interface FreighterError {
  code: string;
  message: string;
}

export const freighterService = {
  // Check if Freighter is installed and connected
  checkConnection: async (): Promise<boolean> => {
    try {
      return await isConnected();
    } catch (error) {
      return false;
    }
  },

  // Get connected wallet address
  getAddress: async (): Promise<string> => {
    try {
      const publicKey = await getPublicKey();
      return publicKey;
    } catch (error) {
      throw new Error('Failed to get wallet address. Please connect Freighter.');
    }
  },

  // Sign a challenge message
  signChallenge: async (challenge: string): Promise<string> => {
    try {
      const signed = await signMessage(challenge);
      return signed;
    } catch (error) {
      throw new Error('Failed to sign message. Please approve in Freighter.');
    }
  },

  // Validate Stellar address format
  isValidStellarAddress: (address: string): boolean => {
    return /^G[A-Z0-9]{55}$/.test(address);
  },
};
```

---

### Phase 3: React Hooks (Business Logic)

#### 3.1 Profile Hook

**`app/src/userProfile/components/userProfileService/useProfile.ts`**

Extend existing hook:

```typescript
import { useState, useEffect } from 'react';
import { profileService } from './profile-service';
import { UserProfile, UpdatePersonalInfoPayload } from '../../types/profile.types';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await profileService.getProfile();
      setProfile(data.profile);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePersonalInfo = async (data: UpdatePersonalInfoPayload) => {
    try {
      setIsUpdating(true);
      setError(null);
      const updated = await profileService.updatePersonalInfo(data);
      setProfile(updated);
      return { success: true };
    } catch (err) {
      setError('Failed to update profile');
      return { success: false, error: err };
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      setIsUpdating(true);
      setError(null);
      const { profilePictureUrl } = await profileService.uploadProfilePicture(file);
      setProfile((prev) => prev ? { ...prev, profilePictureUrl } : null);
      return { success: true, url: profilePictureUrl };
    } catch (err) {
      setError('Failed to upload image');
      return { success: false, error: err };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    isUpdating,
    loadProfile,
    updatePersonalInfo,
    uploadProfilePicture,
  };
};
```

#### 3.2 Experience Hook

**`app/src/userProfile/components/userProfileService/useExperience.ts`**

```typescript
import { useState, useEffect } from 'react';
import { experienceService } from './experience-service';
import { Experience, UpdateExperiencePayload } from '../../types/experience.types';

export const useExperience = () => {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadExperience();
  }, []);

  const loadExperience = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await experienceService.getExperience();
      setExperience(data);
    } catch (err) {
      setError('Failed to load experience');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateExperience = async (data: UpdateExperiencePayload) => {
    try {
      setIsSaving(true);
      setError(null);
      const updated = await experienceService.updateExperience(data);
      setExperience(updated);
      return { success: true };
    } catch (err) {
      setError('Failed to update experience');
      return { success: false, error: err };
    } finally {
      setIsSaving(false);
    }
  };

  // Helper methods for tag management
  const addRole = async (role: string) => {
    if (!experience) return;
    const updatedRoles = [...new Set([...experience.roles, role])];
    return updateExperience({ roles: updatedRoles });
  };

  const removeRole = async (role: string) => {
    if (!experience) return;
    const updatedRoles = experience.roles.filter((r) => r !== role);
    return updateExperience({ roles: updatedRoles });
  };

  const addLanguage = async (language: string) => {
    if (!experience) return;
    const updated = [...new Set([...experience.programmingLanguages, language])];
    return updateExperience({ programmingLanguages: updated });
  };

  const removeLanguage = async (language: string) => {
    if (!experience) return;
    const updated = experience.programmingLanguages.filter((l) => l !== language);
    return updateExperience({ programmingLanguages: updated });
  };

  const addTool = async (tool: string) => {
    if (!experience) return;
    const updated = [...new Set([...experience.developerTools, tool])];
    return updateExperience({ developerTools: updated });
  };

  const removeTool = async (tool: string) => {
    if (!experience) return;
    const updated = experience.developerTools.filter((t) => t !== tool);
    return updateExperience({ developerTools: updated });
  };

  return {
    experience,
    isLoading,
    error,
    isSaving,
    loadExperience,
    updateExperience,
    addRole,
    removeRole,
    addLanguage,
    removeLanguage,
    addTool,
    removeTool,
  };
};
```

#### 3.3 Wallets Hook

**`app/src/userProfile/components/userProfileService/useWallets.ts`**

```typescript
import { useState, useEffect } from 'react';
import { walletService } from './wallet-service';
import { freighterService } from './freighter-service';
import { Wallet, AddWalletPayload } from '../../types/wallet.types';

export const useWallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await walletService.getWallets();
      setWallets(data);
    } catch (err) {
      setError('Failed to load wallets');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addWallet = async (nickname?: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Step 1: Check Freighter connection
      const isConnected = await freighterService.checkConnection();
      if (!isConnected) {
        throw new Error('Freighter wallet not found. Please install and connect Freighter.');
      }

      // Step 2: Get address from Freighter
      const address = await freighterService.getAddress();

      // Step 3: Validate address
      if (!freighterService.isValidStellarAddress(address)) {
        throw new Error('Invalid Stellar address format');
      }

      // Step 4: Send to backend
      const payload: AddWalletPayload = { address, nickname };
      const { wallet, challenge } = await walletService.addWallet(payload);

      // Step 5: Sign challenge with Freighter
      const signature = await freighterService.signChallenge(challenge);

      // Step 6: Verify signature with backend
      const verifiedWallet = await walletService.verifyWallet(wallet._id, {
        signature,
        challenge,
      });

      // Step 7: Update local state
      setWallets((prev) => [...prev, verifiedWallet]);

      return { success: true, wallet: verifiedWallet };
    } catch (err: any) {
      setError(err.message || 'Failed to add wallet');
      return { success: false, error: err };
    } finally {
      setIsProcessing(false);
    }
  };

  const updateWalletNickname = async (walletId: string, nickname: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      const updated = await walletService.updateWallet(walletId, { nickname });
      setWallets((prev) =>
        prev.map((w) => (w._id === walletId ? updated : w))
      );
      return { success: true };
    } catch (err) {
      setError('Failed to update wallet');
      return { success: false, error: err };
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteWallet = async (walletId: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      await walletService.deleteWallet(walletId);
      setWallets((prev) => prev.filter((w) => w._id !== walletId));
      return { success: true };
    } catch (err) {
      setError('Failed to delete wallet');
      return { success: false, error: err };
    } finally {
      setIsProcessing(false);
    }
  };

  const setPrimaryWallet = async (walletId: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      const updated = await walletService.setPrimaryWallet(walletId);
      setWallets((prev) =>
        prev.map((w) => ({
          ...w,
          isPrimary: w._id === walletId,
        }))
      );
      return { success: true };
    } catch (err) {
      setError('Failed to set primary wallet');
      return { success: false, error: err };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    wallets,
    isLoading,
    error,
    isProcessing,
    loadWallets,
    addWallet,
    updateWalletNickname,
    deleteWallet,
    setPrimaryWallet,
  };
};
```

---

### Phase 4: UI Components

#### 4.1 Update Personal Info Form

**`app/src/userProfile/components/userProfileUI/PersonalInfoForm.tsx`**

Integrate with `useProfile` hook:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '../userProfileService/useProfile';
import { Button } from '@/src/shared/components/factories/Button';
import { Toast } from '@/src/shared/components/factories/Toast';
import Image from 'next/image';

export const PersonalInfoForm = () => {
  const { profile, isLoading, isUpdating, updatePersonalInfo, uploadProfilePicture } = useProfile();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    city: '',
    country: '',
    website: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        gender: profile.gender || '',
        city: profile.city || '',
        country: profile.country || '',
        website: profile.website || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updatePersonalInfo(formData);
    if (result.success) {
      setToastMessage('Profile updated successfully!');
      setShowToast(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setToastMessage('File too large (max 5 MB)');
      setShowToast(true);
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setToastMessage('Invalid file type (allowed: JPEG, PNG, WebP)');
      setShowToast(true);
      return;
    }

    const result = await uploadProfilePicture(file);
    if (result.success) {
      setToastMessage('Profile picture updated!');
      setShowToast(true);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8">
      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center md:items-start gap-4">
        <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-200">
          {profile?.profilePictureUrl ? (
            <Image
              src={profile.profilePictureUrl}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button type="button" variant="outline">
            Upload Picture
          </Button>
        </label>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium mb-2">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select...</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="NON_BINARY">Non-binary</option>
          <option value="OTHER">Other</option>
          <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
        </select>
      </div>

      {/* City & Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium mb-2">Website</label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="https://"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isUpdating} className="w-full md:w-auto">
        {isUpdating ? 'Saving...' : 'Save Changes'}
      </Button>

      {/* Toast */}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </form>
  );
};
```

#### 4.2 Experience Form

**`app/src/userProfile/components/userProfileUI/ExperienceForm.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useExperience } from '../userProfileService/useExperience';
import { PREDEFINED_ROLES, PREDEFINED_LANGUAGES, PREDEFINED_TOOLS } from '../../types/experience.types';
import { ChipInput } from '@/src/shared/components/factories/ChipInput';
import { Button } from '@/src/shared/components/factories/Button';

export const ExperienceForm = () => {
  const {
    experience,
    isLoading,
    isSaving,
    addRole,
    removeRole,
    addLanguage,
    removeLanguage,
    addTool,
    removeTool,
    updateExperience,
  } = useExperience();

  const [yearsOfExperience, setYearsOfExperience] = useState(experience?.yearsOfExperience || 0);
  const [web3SkillLevel, setWeb3SkillLevel] = useState(experience?.web3SkillLevel || '');

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const handleSaveBasicInfo = async () => {
    await updateExperience({
      yearsOfExperience,
      web3SkillLevel: web3SkillLevel as any,
    });
  };

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Roles */}
      <div>
        <label className="block text-sm font-medium mb-2">Roles</label>
        <ChipInput
          chips={experience?.roles || []}
          suggestions={PREDEFINED_ROLES}
          onAdd={addRole}
          onRemove={removeRole}
          placeholder="Add role..."
          maxChips={10}
        />
      </div>

      {/* Years of Experience */}
      <div>
        <label className="block text-sm font-medium mb-2">Years of Experience</label>
        <input
          type="number"
          min="0"
          max="60"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Web3 Skill Level */}
      <div>
        <label className="block text-sm font-medium mb-2">Web3/Stellar Skill Level</label>
        <select
          value={web3SkillLevel}
          onChange={(e) => setWeb3SkillLevel(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select...</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
          <option value="EXPERT">Expert</option>
        </select>
      </div>

      <Button onClick={handleSaveBasicInfo} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </Button>

      {/* Programming Languages */}
      <div>
        <label className="block text-sm font-medium mb-2">Programming Languages</label>
        <ChipInput
          chips={experience?.programmingLanguages || []}
          suggestions={PREDEFINED_LANGUAGES}
          onAdd={addLanguage}
          onRemove={removeLanguage}
          placeholder="Add language..."
          maxChips={20}
        />
      </div>

      {/* Developer Tools */}
      <div>
        <label className="block text-sm font-medium mb-2">Developer Tools</label>
        <ChipInput
          chips={experience?.developerTools || []}
          suggestions={PREDEFINED_TOOLS}
          onAdd={addTool}
          onRemove={removeTool}
          placeholder="Add tool..."
          maxChips={30}
        />
      </div>
    </div>
  );
};
```

#### 4.3 Wallets Manager

**`app/src/userProfile/components/userProfileUI/WalletsManager.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useWallets } from '../userProfileService/useWallets';
import { WalletCard } from './WalletCard';
import { Button } from '@/src/shared/components/factories/Button';
import { PlusCircle } from 'lucide-react';

export const WalletsManager = () => {
  const { wallets, isLoading, isProcessing, addWallet, deleteWallet, setPrimaryWallet, updateWalletNickname } = useWallets();
  const [showAddModal, setShowAddModal] = useState(false);
  const [nickname, setNickname] = useState('');

  const handleAddWallet = async () => {
    const result = await addWallet(nickname || undefined);
    if (result.success) {
      setShowAddModal(false);
      setNickname('');
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading wallets...</div>;
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Wallets</h2>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Add Wallet
        </Button>
      </div>

      {/* Wallet List */}
      <div className="space-y-4">
        {wallets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No wallets connected. Add your first Freighter wallet to get started.
          </div>
        ) : (
          wallets.map((wallet) => (
            <WalletCard
              key={wallet._id}
              wallet={wallet}
              onSetPrimary={() => setPrimaryWallet(wallet._id)}
              onDelete={() => deleteWallet(wallet._id)}
              onUpdateNickname={(newNickname) => updateWalletNickname(wallet._id, newNickname)}
            />
          ))
        )}
      </div>

      {/* Add Wallet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Add Freighter Wallet</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will connect your Freighter wallet and request a signature to verify ownership.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nickname (optional)</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g., Main Wallet"
                  maxLength={50}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleAddWallet} disabled={isProcessing} className="flex-1">
                  {isProcessing ? 'Connecting...' : 'Connect Wallet'}
                </Button>
                <Button onClick={() => setShowAddModal(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

#### 4.4 Wallet Card Component

**`app/src/userProfile/components/userProfileUI/WalletCard.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { Wallet } from '../../types/wallet.types';
import { MoreVertical, CheckCircle, Star } from 'lucide-react';

interface WalletCardProps {
  wallet: Wallet;
  onSetPrimary: () => void;
  onDelete: () => void;
  onUpdateNickname: (nickname: string) => void;
}

export const WalletCard = ({ wallet, onSetPrimary, onDelete, onUpdateNickname }: WalletCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(wallet.nickname || '');

  const handleSaveNickname = () => {
    onUpdateNickname(nickname);
    setIsEditing(false);
  };

  return (
    <div className="border rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        {/* Left: Address & Nickname */}
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={handleSaveNickname}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveNickname()}
              maxLength={50}
              className="border rounded px-2 py-1 mb-2"
              autoFocus
            />
          ) : (
            <h3 className="font-medium text-lg mb-1">
              {wallet.nickname || 'Unnamed Wallet'}
            </h3>
          )}
          <p className="text-sm text-gray-500 font-mono break-all">
            {wallet.address}
          </p>
          <div className="flex gap-2 mt-2">
            {wallet.isVerified && (
              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
            {wallet.isPrimary && (
              <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 fill-current" />
                Primary
              </span>
            )}
          </div>
        </div>

        {/* Right: Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg py-1 w-48 z-10">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Edit Nickname
              </button>
              {!wallet.isPrimary && (
                <button
                  onClick={() => {
                    onSetPrimary();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Set as Primary
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to remove this wallet?')) {
                    onDelete();
                  }
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Remove Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

### Phase 5: Shared Components (Factories)

#### 5.1 ChipInput Component

**`app/src/shared/components/factories/ChipInput.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ChipInputProps {
  chips: string[];
  suggestions?: readonly string[];
  onAdd: (chip: string) => void;
  onRemove: (chip: string) => void;
  placeholder?: string;
  maxChips?: number;
}

export const ChipInput = ({
  chips,
  suggestions = [],
  onAdd,
  onRemove,
  placeholder = 'Add...',
  maxChips = 50,
}: ChipInputProps) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !chips.includes(s)
  );

  const handleAdd = (value: string) => {
    if (value.trim() && !chips.includes(value.trim()) && chips.length < maxChips) {
      onAdd(value.trim());
      setInput('');
    }
  };

  return (
    <div className="space-y-2">
      {/* Chips Display */}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full text-sm"
          >
            {chip}
            <button
              onClick={() => onRemove(chip)}
              className="hover:bg-gray-300 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd(input);
            }
          }}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-lg"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleAdd(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

---

### Phase 6: Page Integration

#### 6.1 Personal Info Page

**`app/dashboard/settings/personal-info/page.tsx`**

```typescript
import { PersonalInfoForm } from '@/src/userProfile/components/userProfileUI/PersonalInfoForm';

export default function PersonalInfoPage() {
  return <PersonalInfoForm />;
}
```

#### 6.2 Experience Page

**`app/dashboard/settings/experience/page.tsx`**

```typescript
import { ExperienceForm } from '@/src/userProfile/components/userProfileUI/ExperienceForm';

export default function ExperiencePage() {
  return <ExperienceForm />;
}
```

#### 6.3 Wallets Page

**`app/dashboard/settings/wallets/page.tsx`**

```typescript
import { WalletsManager } from '@/src/userProfile/components/userProfileUI/WalletsManager';

export default function WalletsPage() {
  return <WalletsManager />;
}
```

---

## Critical Files (Implementation Order)

1. **`app/src/shared/lib/api/endpoints.ts`** - Add profile, experience, wallet endpoints
2. **`app/src/userProfile/types/profile.types.ts`** - Profile interfaces
3. **`app/src/userProfile/types/experience.types.ts`** - Experience interfaces + predefined lists
4. **`app/src/userProfile/types/wallet.types.ts`** - Wallet interfaces
5. **`app/src/shared/lib/api/client.ts`** - Update to support FormData uploads
6. **`app/src/userProfile/components/userProfileService/profile-service.ts`** - Profile API methods
7. **`app/src/userProfile/components/userProfileService/experience-service.ts`** - Experience API methods
8. **`app/src/userProfile/components/userProfileService/wallet-service.ts`** - Wallet API methods
9. **`app/src/userProfile/components/userProfileService/freighter-service.ts`** - Freighter integration
10. **`app/src/userProfile/components/userProfileService/useProfile.ts`** - Profile hook
11. **`app/src/userProfile/components/userProfileService/useExperience.ts`** - Experience hook
12. **`app/src/userProfile/components/userProfileService/useWallets.ts`** - Wallets hook
13. **`app/src/shared/components/factories/ChipInput.tsx`** - Reusable chip input
14. **`app/src/userProfile/components/userProfileUI/PersonalInfoForm.tsx`** - Update with API integration
15. **`app/src/userProfile/components/userProfileUI/ExperienceForm.tsx`** - Experience form
16. **`app/src/userProfile/components/userProfileUI/WalletCard.tsx`** - Wallet card component
17. **`app/src/userProfile/components/userProfileUI/WalletsManager.tsx`** - Wallets manager
18. **`app/dashboard/settings/personal-info/page.tsx`** - Personal info page
19. **`app/dashboard/settings/experience/page.tsx`** - Experience page
20. **`app/dashboard/settings/wallets/page.tsx`** - Wallets page
21. **`app/src/userProfile/context.md`** - Update documentation

---

## Verification Steps

### Personal Info
- ✓ Navigate to `/dashboard/settings/personal-info`
- ✓ Form loads with existing profile data
- ✓ Upload profile picture (max 5 MB, JPEG/PNG/WebP)
- ✓ Edit name, gender, city, country, website
- ✓ Submit → success message + data persists
- ✓ Refresh page → changes persist

### Experience
- ✓ Navigate to `/dashboard/settings/experience`
- ✓ Add roles from suggestions or custom
- ✓ Remove role chips
- ✓ Update years of experience and skill level
- ✓ Add/remove programming languages
- ✓ Add/remove developer tools
- ✓ Changes save automatically or on button click

### Wallets
- ✓ Navigate to `/dashboard/settings/wallets`
- ✓ Click "Add Wallet" → Freighter extension opens
- ✓ Select wallet → signature request appears
- ✓ Sign challenge → wallet added with "Verified" badge
- ✓ Add nickname via edit menu
- ✓ Set wallet as primary → yellow star badge appears
- ✓ Delete wallet (non-primary only)
- ✓ Multiple wallets can coexist, only one primary

### Error Handling
- ✓ Upload 10MB image → "File too large" error
- ✓ Disconnect internet → network error message
- ✓ Invalid wallet address → validation error
- ✓ Freighter not installed → helpful error message
- ✓ Reject signature → "Failed to sign" message

---

## Out of Scope (Future Enhancements)

- GitHub OAuth integration
- Twitter OAuth integration
- LinkedIn profile linking
- Auto-save on blur with debounce
- Profile picture cropping tool
- Drag-and-drop image upload
- Multi-wallet transaction signing
- Wallet transaction history
- Email change with verification
- Password change from settings
- Profile completeness indicator
- Public profile pages (`/users/:id`)
- Profile export (JSON/PDF)

---

## Dependencies

### Required
- `@stellar/freighter-api` (Freighter wallet integration)
- `lucide-react` (Icons)

### Optional (for future)
- `react-dropzone` (Drag-and-drop image upload)
- `react-image-crop` (Profile picture cropping)
- `date-fns` (Date formatting for wallet timestamps)

---

## Security Notes

1. **File Upload Security:**
   - Validate MIME type AND magic bytes (not just extension)
   - Store files outside web root with controlled access
   - Limit upload rate (max 5 uploads per user per hour)
   - Generate UUIDs for filenames to prevent enumeration

2. **Wallet Verification:**
   - Always verify signature on backend using Stellar SDK
   - Challenge messages must include nonce + timestamp
   - Challenges expire after 5 minutes
   - Only allow verified wallets for transactions

3. **Data Validation:**
   - Validate URL formats (website, social links)
   - Sanitize user input (names, nicknames, bio)
   - Enforce max lengths on all text fields
   - Validate Stellar address format (56 chars, starts with 'G')

4. **API Security:**
   - All endpoints require Bearer token authentication
   - Rate limit sensitive operations (file upload, wallet operations)
   - Validate ownership before updates (userId match)
   - Use parameterized queries to prevent injection

---

## Responsive Design Checklist

- ✓ Mobile-first approach (design for 375px width first)
- ✓ Touch targets minimum 44×44px (2.75rem)
- ✓ Fluid typography using `clamp()` or responsive classes
- ✓ Flexible spacing using rem (not px)
- ✓ Responsive grids: `grid-cols-1 md:grid-cols-2`
- ✓ Image optimization with `next/image`
- ✓ Wallet addresses truncate or wrap on mobile
- ✓ Dropdown menus accessible on touch devices
- ✓ Forms stack vertically on mobile, side-by-side on desktop

---

## Update context.md

After implementation, update `/app/src/userProfile/context.md`:

```markdown
## Recent Changes
**2026-02-06**
- Integrated profile backend API with `/profile/me` and `/profile/personal-info`
- Added profile picture upload with validation (5MB, JPEG/PNG/WebP)
- Integrated experience backend with tag management (roles, languages, tools)
- Implemented Freighter wallet connection with signature verification
- Added wallet management (add, verify, set primary, delete, edit nickname)
- Created `useProfile`, `useExperience`, and `useWallets` hooks
- Built reusable `ChipInput` factory component
- Added `freighter-service.ts` for Stellar wallet integration
- Implemented mobile-responsive design across all settings pages
```

---

## Notes

- **Freighter API:** Requires user interaction (cannot auto-connect silently)
- **Challenge-Response:** Backend generates challenge, frontend signs with Freighter, backend verifies signature
- **Primary Wallet:** Automatically unset other wallets when setting a new primary
- **Profile Pictures:** Stored locally in MVP, easily migrated to cloud storage later
- **Social Accounts:** OAuth flow requires backend endpoints (out of scope for this phase)
- **Context vs Props:** Use hooks for business logic, pass data via props to UI components

---

## Environment Variables

No additional environment variables needed. Profile integration uses existing:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Backend handles file storage paths and Stellar network configuration.

---

## Testing Checklist

### Unit Tests (Future)
- [ ] `freighter-service.ts` address validation
- [ ] `ChipInput` add/remove logic
- [ ] Form validation helpers

### Integration Tests (Future)
- [ ] Profile update flow
- [ ] Wallet verification flow
- [ ] Experience auto-save

### E2E Tests (Future)
- [ ] Complete settings flow (all tabs)
- [ ] Wallet add/verify/set primary flow
- [ ] Profile picture upload

---

**End of Plan**
