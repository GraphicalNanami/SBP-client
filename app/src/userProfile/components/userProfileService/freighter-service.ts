/**
 * Freighter Service
 * Stellar Freighter wallet integration
 */

import { isConnected, getPublicKey, signBlob } from '@stellar/freighter-api';

export interface FreighterError {
  code: string;
  message: string;
}

class FreighterService {
  /**
   * Check if Freighter is installed and connected
   */
  async checkConnection(): Promise<boolean> {
    try {
      return await isConnected();
    } catch {
      return false;
    }
  }

  /**
   * Get connected wallet address
   */
  async getAddress(): Promise<string> {
    try {
      const publicKey = await getPublicKey();
      return publicKey;
    } catch (error) {
      throw new Error('Failed to get wallet address. Please connect Freighter wallet.');
    }
  }

  /**
   * Sign a challenge message using signBlob
   */
  async signChallenge(challenge: string): Promise<string> {
    try {
      const signature = await signBlob(challenge);
      return signature;
    } catch (error) {
      throw new Error('Failed to sign message. Please approve the signature request in Freighter.');
    }
  }

  /**
   * Validate Stellar address format
   */
  isValidStellarAddress(address: string): boolean {
    return /^G[A-Z0-9]{55}$/.test(address);
  }
}

export const freighterService = new FreighterService();
