/**
 * Freighter Wallet Service
 * 
 * Handles all interactions with the Freighter browser extension for Stellar wallet management.
 * Provides methods for detecting Freighter, connecting wallets, and signing messages.
 * 
 * @module FreighterService
 */

import { isConnected, getPublicKey, signBlob, requestAccess } from '@stellar/freighter-api';

export interface FreighterError {
  code: string;
  message: string;
}

/**
 * FreighterService - Manages Freighter wallet interactions
 */
export class FreighterService {
  /**
   * Check if Freighter extension is installed and available
   * @returns Promise<boolean> - True if Freighter is installed
   */
  static async isInstalled(): Promise<boolean> {
    try {
      const connected = await isConnected();
      console.log('[FreighterService] isConnected check:', connected);
      return connected;
    } catch (error) {
      console.error('[FreighterService] Freighter detection error:', error);
      return false;
    }
  }

  /**
   * Request user's public key (wallet address) from Freighter
   * This will prompt the user to connect their wallet if not already connected
   * 
   * @returns Promise<string> - Stellar public key (starts with 'G')
   * @throws Error if user rejects connection or Freighter not installed
   */
  static async getPublicKey(): Promise<string> {
    try {
      console.log('[FreighterService] Requesting access permission from Freighter...');
      
      // Step 1: Request access permission (this triggers the Freighter popup)
      const accessGranted = await requestAccess();
      console.log('[FreighterService] Access permission result:', accessGranted);
      
      if (!accessGranted) {
        console.error('[FreighterService] User denied access permission');
        throw new Error('USER_REJECTED_CONNECTION');
      }
      
      // Step 2: Get the public key
      console.log('[FreighterService] Requesting public key from Freighter...');
      const publicKey = await getPublicKey();
      
      console.log('[FreighterService] Received response:', {
        publicKey,
        type: typeof publicKey,
        length: publicKey?.length,
        firstChar: publicKey?.[0]
      });
      
      // Check for empty string, null, or undefined
      if (!publicKey || publicKey.trim() === '') {
        console.error('[FreighterService] No public key returned from Freighter (empty or null)');
        throw new Error('Failed to retrieve public key from Freighter. Please ensure you have granted permission.');
      }

      // Validate format (Stellar public keys are 56 characters starting with 'G')
      if (!this.isValidStellarAddress(publicKey)) {
        console.error('[FreighterService] Invalid address format:', publicKey);
        throw new Error('Invalid Stellar address format received from Freighter');
      }

      console.log('[FreighterService] Successfully retrieved and validated public key');
      return publicKey;
    } catch (error: any) {
      console.error('[FreighterService] Error in getPublicKey:', {
        error,
        message: error?.message,
        code: error?.code,
        name: error?.name
      });
      
      // Handle specific Freighter errors
      if (error?.message?.includes('User declined') || error?.message?.includes('rejected') || error?.message?.includes('USER_REJECTED')) {
        throw new Error('USER_REJECTED_CONNECTION');
      }
      
      if (error?.message?.includes('Freighter is not installed') || error?.message?.includes('not available')) {
        throw new Error('FREIGHTER_NOT_INSTALLED');
      }

      // Re-throw if it's already our custom error
      if (error?.message?.includes('Failed to retrieve') || error?.message?.includes('Invalid Stellar')) {
        throw error;
      }

      throw new Error(error?.message || 'Failed to connect to Freighter wallet');
    }
  }

  /**
   * Sign a message using the user's Freighter wallet
   * This will prompt the user to approve the signature
   * 
   * @param message - The message to sign (challenge string)
   * @returns Promise<string> - Base64 encoded signature string
   * @throws Error if user rejects signature or signing fails
   */
  static async signMessage(message: string): Promise<string> {
    try {
      if (!message || typeof message !== 'string') {
        throw new Error('Invalid message: must be a non-empty string');
      }

      // Use signBlob for signing arbitrary messages
      // Freighter expects the message as a string
      const signature: any = await signBlob(message);

      if (!signature) {
        throw new Error('Failed to sign message');
      }

      // Convert signature to base64 string if it's a Buffer
      if (typeof signature === 'object' && signature !== null) {
        // Handle Buffer-like objects
        if ('data' in signature && Array.isArray(signature.data)) {
          // Convert Buffer data array to base64 string
          const uint8Array = new Uint8Array(signature.data);
          return btoa(String.fromCharCode(...uint8Array));
        }
        // If it's already a Buffer object with toString
        if (typeof (signature as any).toString === 'function') {
          return (signature as any).toString('base64');
        }
      }

      // If it's already a string, return as-is
      if (typeof signature === 'string') {
        return signature;
      }

      throw new Error('Unexpected signature format received from Freighter');
    } catch (error: any) {
      // Handle specific Freighter errors
      if (error?.message?.includes('User declined') || error?.message?.includes('rejected')) {
        throw new Error('USER_REJECTED_SIGNATURE');
      }

      if (error?.message?.includes('Freighter is not installed')) {
        throw new Error('FREIGHTER_NOT_INSTALLED');
      }

      throw new Error(error?.message || 'Failed to sign message with Freighter');
    }
  }

  /**
   * Validate Stellar address format
   * @param address - The address to validate
   * @returns boolean - True if valid Stellar address
   */
  static isValidStellarAddress(address: string): boolean {
    // Stellar public keys:
    // - Are 56 characters long
    // - Start with 'G'
    // - Use base32 encoding (A-Z, 2-7)
    const stellarAddressRegex = /^G[A-Z2-7]{55}$/;
    return stellarAddressRegex.test(address);
  }

  /**
   * Truncate wallet address for display
   * Example: GABCD...XYZ123
   * 
   * @param address - Full wallet address
   * @param startChars - Number of characters to show at start (default: 5)
   * @param endChars - Number of characters to show at end (default: 5)
   * @returns string - Truncated address
   */
  static truncateAddress(address: string, startChars: number = 5, endChars: number = 5): string {
    if (!address || address.length <= startChars + endChars) {
      return address;
    }
    
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  }

  /**
   * Get user-friendly error message from Freighter error
   * @param error - Error object
   * @returns string - User-friendly error message
   */
  static getErrorMessage(error: any): string {
    const message = error?.message || '';

    if (message.includes('USER_REJECTED_CONNECTION') || message.includes('User declined')) {
      return 'Wallet connection was cancelled. Please approve the connection to continue.';
    }

    if (message.includes('USER_REJECTED_SIGNATURE') || message.includes('declined')) {
      return 'Signature request was rejected. You must sign the message to authenticate.';
    }

    if (message.includes('FREIGHTER_NOT_INSTALLED') || message.includes('not installed')) {
      return 'Freighter wallet not found. Please install the Freighter extension to continue.';
    }

    if (message.includes('Invalid')) {
      return 'Invalid wallet address format. Please try again.';
    }

    // Generic error
    return error?.message || 'An error occurred while interacting with the Freighter wallet. Please try again.';
  }
}
