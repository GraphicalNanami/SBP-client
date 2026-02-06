/**
 * WalletsManager Component
 * Manage Stellar wallets (add, verify, set primary, delete)
 */

'use client';

import { useState } from 'react';
import { PlusCircle, Loader2, Wallet as WalletIcon } from 'lucide-react';
import { useWallets } from '../userProfileService/useWallets';
import { WalletCard } from './WalletCard';

export default function WalletsManager() {
  const {
    wallets,
    isLoading,
    isProcessing,
    error,
    addWallet,
    updateWalletNickname,
    deleteWallet,
    setPrimaryWallet,
  } = useWallets();

  const [showNicknameInput, setShowNicknameInput] = useState(false);
  const [tempNickname, setTempNickname] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleAddWallet = async () => {
    const nickname = tempNickname.trim() || undefined;
    const success = await addWallet(nickname);

    if (success) {
      setToastMessage('Wallet added and verified successfully!');
      setToastType('success');
      setTempNickname('');
      setShowNicknameInput(false);
    } else {
      setToastMessage(error || 'Failed to add wallet');
      setToastType('error');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleUpdateNickname = async (walletId: string, nickname: string) => {
    const success = await updateWalletNickname(walletId, nickname);

    if (success) {
      setToastMessage('Nickname updated!');
      setToastType('success');
    } else {
      setToastMessage(error || 'Failed to update nickname');
      setToastType('error');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteWallet = async (walletId: string) => {
    if (!confirm('Are you sure you want to delete this wallet?')) return;

    const success = await deleteWallet(walletId);

    if (success) {
      setToastMessage('Wallet deleted successfully!');
      setToastType('success');
    } else {
      setToastMessage(error || 'Failed to delete wallet');
      setToastType('error');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSetPrimary = async (walletId: string) => {
    const success = await setPrimaryWallet(walletId);

    if (success) {
      setToastMessage('Primary wallet updated!');
      setToastType('success');
    } else {
      setToastMessage(error || 'Failed to set primary wallet');
      setToastType('error');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
      </div>
    );
  }

  return (
    <div>
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 ${
            toastType === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {toastMessage}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mb-2 tracking-tight">
            Stellar Wallets
          </h1>
          <p className="text-[#4D4D4D] text-base md:text-lg">
            Manage your Freighter wallets
          </p>
        </div>
        <button
          onClick={() => setShowNicknameInput(true)}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
          Add Wallet
        </button>
      </div>

      {/* Add Wallet Modal */}
      {showNicknameInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-4">
              Add Wallet
            </h2>
            <p className="text-[#4D4D4D] mb-6 text-sm md:text-base">
              Connect your Freighter wallet and optionally give it a nickname.
            </p>

            <input
              type="text"
              value={tempNickname}
              onChange={(e) => setTempNickname(e.target.value)}
              placeholder="Wallet nickname (optional)"
              maxLength={50}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all duration-200 mb-6 text-sm md:text-base"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNicknameInput(false);
                  setTempNickname('');
                }}
                disabled={isProcessing}
                className="flex-1 px-4 py-3 border border-[#E5E5E5] text-[#1A1A1A] rounded-xl hover:border-[#1A1A1A] transition-all duration-200 font-medium disabled:opacity-50 text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWallet}
                disabled={isProcessing}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <WalletIcon className="w-4 h-4" />
                    Connect
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallets Grid */}
      {wallets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <WalletIcon className="w-16 h-16 text-[#E5E5E5] mb-4" />
          <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
            No wallets yet
          </h3>
          <p className="text-[#4D4D4D] mb-6 max-w-md">
            Connect your Freighter wallet to get started. You can add multiple wallets and set one as primary.
          </p>
          <button
            onClick={() => setShowNicknameInput(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-all duration-200 font-medium"
          >
            <PlusCircle className="w-5 h-5" />
            Add Your First Wallet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet._id}
              wallet={wallet}
              onSetPrimary={() => handleSetPrimary(wallet._id)}
              onDelete={() => handleDeleteWallet(wallet._id)}
              onUpdateNickname={(nickname) => handleUpdateNickname(wallet._id, nickname)}
            />
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && !showToast && (
        <div className="mt-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-4 md:p-6 bg-blue-50 border border-blue-200 rounded-2xl">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
          About Wallet Verification
        </h3>
        <ul className="text-sm text-[#4D4D4D] space-y-2">
          <li>• Wallets are automatically verified when you sign the challenge message</li>
          <li>• You can set one wallet as your primary wallet for transactions</li>
          <li>• Only verified wallets can be used for hackathon submissions</li>
          <li>• You need Freighter wallet extension installed to connect wallets</li>
        </ul>
      </div>
    </div>
  );
}
