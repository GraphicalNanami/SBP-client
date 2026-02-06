/**
 * useWallets Hook
 * Business logic for Stellar wallet management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { walletService } from './wallet-service';
import { freighterService } from './freighter-service';
import { handleApiError } from '@/src/shared/utils/error-handler';
import type { Wallet, AddWalletPayload } from '@/src/userProfile/types/wallet.types';

interface UseWalletsReturn {
  wallets: Wallet[];
  isLoading: boolean;
  error: string | null;
  isProcessing: boolean;
  addWallet: (nickname?: string) => Promise<boolean>;
  updateWalletNickname: (walletId: string, nickname: string) => Promise<boolean>;
  deleteWallet: (walletId: string) => Promise<boolean>;
  setPrimaryWallet: (walletId: string) => Promise<boolean>;
  refreshWallets: () => Promise<void>;
}

export function useWallets(): UseWalletsReturn {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await walletService.getWallets();
      setWallets(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addWallet = useCallback(async (nickname?: string): Promise<boolean> => {
    try {
      setIsProcessing(true);
      setError(null);

      // Check Freighter connection
      const isConnected = await freighterService.checkConnection();
      if (!isConnected) {
        setError('Freighter wallet is not connected. Please install and connect Freighter.');
        return false;
      }

      // Get wallet address from Freighter
      const address = await freighterService.getAddress();

      // Validate address
      if (!freighterService.isValidStellarAddress(address)) {
        setError('Invalid Stellar address format');
        return false;
      }

      // Add wallet to backend (returns challenge)
      const payload: AddWalletPayload = { address, nickname };
      const { wallet, challenge } = await walletService.addWallet(payload);

      // Sign challenge with Freighter
      const signature = await freighterService.signChallenge(challenge);

      // Verify signature with backend
      const verifiedWallet = await walletService.verifyWallet(wallet._id, {
        signature,
        challenge,
      });

      // Update local state
      setWallets((prev) => [...prev, verifiedWallet]);
      return true;
    } catch (err) {
      setError(handleApiError(err));
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateWalletNickname = useCallback(async (walletId: string, nickname: string): Promise<boolean> => {
    try {
      setIsProcessing(true);
      setError(null);
      const updated = await walletService.updateWallet(walletId, { nickname });
      
      // Update local state
      setWallets((prev) =>
        prev.map((wallet) => (wallet._id === walletId ? updated : wallet))
      );
      return true;
    } catch (err) {
      setError(handleApiError(err));
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const deleteWallet = useCallback(async (walletId: string): Promise<boolean> => {
    try {
      setIsProcessing(true);
      setError(null);
      await walletService.deleteWallet(walletId);
      
      // Update local state
      setWallets((prev) => prev.filter((wallet) => wallet._id !== walletId));
      return true;
    } catch (err) {
      setError(handleApiError(err));
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const setPrimaryWallet = useCallback(async (walletId: string): Promise<boolean> => {
    try {
      setIsProcessing(true);
      setError(null);
      const updated = await walletService.setPrimaryWallet(walletId);
      
      // Update local state
      setWallets((prev) =>
        prev.map((wallet) =>
          wallet._id === walletId
            ? { ...wallet, isPrimary: true }
            : { ...wallet, isPrimary: false }
        )
      );
      return true;
    } catch (err) {
      setError(handleApiError(err));
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return {
    wallets,
    isLoading,
    error,
    isProcessing,
    addWallet,
    updateWalletNickname,
    deleteWallet,
    setPrimaryWallet,
    refreshWallets: fetchWallets,
  };
}
