/**
 * Wallet Service
 * API integration for Stellar wallet management
 */

import { apiClient } from '@/src/shared/lib/api/client';
import { ENDPOINTS } from '@/src/shared/lib/api/endpoints';
import type {
  Wallet,
  AddWalletPayload,
  VerifyWalletPayload,
  UpdateWalletPayload,
} from '@/src/userProfile/types/wallet.types';

class WalletService {
  /**
   * Get all wallets for current user
   */
  async getWallets(): Promise<Wallet[]> {
    return apiClient.get<Wallet[]>(ENDPOINTS.WALLETS.LIST);
  }

  /**
   * Add a new wallet
   * Returns wallet and challenge for verification
   */
  async addWallet(payload: AddWalletPayload): Promise<{ wallet: Wallet; challenge: string }> {
    return apiClient.post<{ wallet: Wallet; challenge: string }>(
      ENDPOINTS.WALLETS.CREATE,
      payload
    );
  }

  /**
   * Update wallet nickname
   */
  async updateWallet(walletId: string, payload: UpdateWalletPayload): Promise<Wallet> {
    return apiClient.patch<Wallet>(ENDPOINTS.WALLETS.UPDATE(walletId), payload);
  }

  /**
   * Delete wallet from user's account
   */
  async deleteWallet(walletId: string): Promise<void> {
    return apiClient.delete<void>(ENDPOINTS.WALLETS.DELETE(walletId));
  }

  /**
   * Verify wallet ownership via signature
   */
  async verifyWallet(walletId: string, payload: VerifyWalletPayload): Promise<Wallet> {
    return apiClient.post<Wallet>(ENDPOINTS.WALLETS.VERIFY(walletId), payload);
  }

  /**
   * Set wallet as primary (unsets other wallets)
   */
  async setPrimaryWallet(walletId: string): Promise<Wallet> {
    return apiClient.post<Wallet>(ENDPOINTS.WALLETS.SET_PRIMARY(walletId), {});
  }
}

export const walletService = new WalletService();
