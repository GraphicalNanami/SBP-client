/**
 * WalletCard Component
 * Display and manage individual wallet
 */

'use client';

import { useState } from 'react';
import { MoreVertical, CheckCircle, Star, Edit2, Trash2 } from 'lucide-react';
import type { Wallet } from '@/src/userProfile/types/wallet.types';

interface WalletCardProps {
  wallet: Wallet;
  onSetPrimary: () => void;
  onDelete: () => void;
  onUpdateNickname: (nickname: string) => void;
}

export const WalletCard = ({ wallet, onSetPrimary, onDelete, onUpdateNickname }: WalletCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState(wallet.nickname || '');

  const handleSaveNickname = () => {
    onUpdateNickname(nickname);
    setIsEditingNickname(false);
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="p-4 md:p-6 border border-[#E5E5E5] rounded-2xl hover:border-[#1A1A1A] transition-all duration-200 relative">
      {/* Primary Badge */}
      {wallet.isPrimary && (
        <div className="absolute top-4 right-4">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isEditingNickname ? (
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={handleSaveNickname}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveNickname()}
              autoFocus
              maxLength={50}
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] text-sm"
              placeholder="Wallet nickname"
            />
          ) : (
            <h3 className="text-lg font-semibold text-[#1A1A1A]">
              {wallet.nickname || 'Unnamed Wallet'}
            </h3>
          )}
          <p className="text-sm text-[#4D4D4D] font-mono mt-1">
            {truncateAddress(wallet.address)}
          </p>
        </div>

        {/* More Options */}
        {!wallet.isPrimary && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4 text-[#4D4D4D]" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 w-48 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-10">
                <button
                  onClick={() => {
                    setIsEditingNickname(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm hover:bg-[#F5F5F5] transition-colors first:rounded-t-xl"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Nickname
                </button>
                <button
                  onClick={() => {
                    onSetPrimary();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm hover:bg-[#F5F5F5] transition-colors"
                >
                  <Star className="w-4 h-4" />
                  Set as Primary
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors last:rounded-b-xl"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Wallet
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-2">
        {wallet.isVerified && (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs text-green-700 font-medium">
            <CheckCircle className="w-3 h-3" />
            Verified
          </div>
        )}
        {wallet.isPrimary && (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full text-xs text-yellow-700 font-medium">
            <Star className="w-3 h-3" />
            Primary
          </div>
        )}
      </div>

      {/* Added Date */}
      <p className="text-xs text-[#4D4D4D] mt-4">
        Added {new Date(wallet.addedAt).toLocaleDateString()}
      </p>
    </div>
  );
};
