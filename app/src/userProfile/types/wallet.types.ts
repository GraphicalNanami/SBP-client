/**
 * Wallet Types
 * Stellar wallet management data structures
 */

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
