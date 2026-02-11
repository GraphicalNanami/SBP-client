/**
 * Wallet Authentication Service
 * 
 * Handles wallet-based authentication API calls including challenge generation,
 * wallet existence checks, and wallet registration/login.
 * 
 * @module WalletAuthService
 */

import { apiClient } from '@/src/shared/lib/api/client';
import { ENDPOINTS } from '@/src/shared/lib/api/endpoints';
import { tokenManager } from '@/src/shared/lib/auth/token-manager';
import type {
  User,
  AuthResponse,
  WalletChallenge,
  WalletCheckResponse,
  WalletLoginCredentials,
  WalletRegisterCredentials,
} from '@/src/shared/types/auth.types';

class WalletAuthService {
  /**
   * Check if a wallet address is registered in the system
   * This is a lightweight check that doesn't require signature
   * 
   * @param walletAddress - Stellar public key to check
   * @returns Promise<WalletCheckResponse> - Existence status and message
   */
  async checkWalletExistence(walletAddress: string): Promise<WalletCheckResponse> {
    try {
      const response = await apiClient.post<WalletCheckResponse>(
        ENDPOINTS.AUTH.WALLET.CHECK_EXISTENCE,
        { walletAddress }
      );
      return response;
    } catch (error: any) {
      // If endpoint doesn't exist yet, fallback to try-catch login pattern
      if (error?.status === 404) {
        console.warn('Wallet check-existence endpoint not available. Using fallback pattern.');
        // Return a default "exists" to proceed with login attempt
        return {
          exists: true,
          userExists: true,
          message: 'Proceeding with authentication',
        };
      }
      throw error;
    }
  }

  /**
   * Request a challenge from the backend for wallet authentication
   * Challenge is a nonce that must be signed by the wallet
   * 
   * @param walletAddress - Stellar public key
   * @returns Promise<WalletChallenge> - Challenge string and expiration time
   */
  async requestChallenge(walletAddress: string): Promise<WalletChallenge> {
    const response = await apiClient.post<WalletChallenge>(
      ENDPOINTS.AUTH.WALLET.CHALLENGE,
      { walletAddress }
    );
    return response;
  }

  /**
   * Register a new user with wallet authentication
   * 
   * @param credentials - Wallet registration credentials including signature
   * @returns Promise<User> - Authenticated user object
   */
  async registerWithWallet(credentials: WalletRegisterCredentials): Promise<User> {
    const response = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.WALLET.REGISTER,
      credentials
    );

    // Store tokens
    tokenManager.setAccessToken(response.accessToken);
    tokenManager.setRefreshToken(response.refreshToken);

    return response.user;
  }

  /**
   * Login user with wallet authentication
   * 
   * @param credentials - Wallet login credentials including signature
   * @returns Promise<User> - Authenticated user object
   */
  async loginWithWallet(credentials: WalletLoginCredentials): Promise<User> {
    const response = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.WALLET.LOGIN,
      credentials
    );

    // Store tokens
    tokenManager.setAccessToken(response.accessToken);
    tokenManager.setRefreshToken(response.refreshToken);

    return response.user;
  }

  /**
   * Complete wallet authentication flow (check, challenge, sign, login)
   * This is a helper method that combines multiple steps
   * 
   * @param walletAddress - Stellar public key
   * @param signMessageFn - Function to sign the challenge message
   * @returns Promise<{ success: boolean; user?: User; reason?: string }>
   */
  async authenticateWithWallet(
    walletAddress: string,
    signMessageFn: (message: string) => Promise<string>
  ): Promise<{ success: boolean; user?: User; reason?: string }> {
    try {
      // Step 1: Check if wallet exists
      const checkResult = await this.checkWalletExistence(walletAddress);
      
      if (!checkResult.exists) {
        return {
          success: false,
          reason: 'WALLET_NOT_REGISTERED',
        };
      }

      // Step 2: Request challenge
      const { challenge } = await this.requestChallenge(walletAddress);

      // Step 3: Sign challenge
      const signature = await signMessageFn(challenge);

      // Step 4: Login with signature
      const user = await this.loginWithWallet({
        walletAddress,
        signature,
        challenge,
      });

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      // Check if error indicates wallet not found
      if (
        error?.message?.includes('not found') ||
        error?.message?.includes('not registered') ||
        error?.status === 404
      ) {
        return {
          success: false,
          reason: 'WALLET_NOT_REGISTERED',
        };
      }

      // Other errors
      throw error;
    }
  }
}

export const walletAuthService = new WalletAuthService();
