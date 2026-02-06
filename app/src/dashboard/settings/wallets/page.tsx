'use client';

import { useState } from 'react';
import { Plus, Check, MoreVertical, Save } from 'lucide-react';
import SettingsLayout from '@/src/userProfile/components/userProfileUI/SettingsLayout';

interface Wallet {
  id: string;
  address: string;
  nickname: string;
  isPrimary: boolean;
  isVerified: boolean;
}

const WalletsSettings = () => {
  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: '1',
      address: 'GDJK...7X2Q',
      nickname: 'My Main Wallet',
      isPrimary: true,
      isVerified: true,
    },
  ]);

  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [newWalletNickname, setNewWalletNickname] = useState('');

  const handleAddWallet = async () => {
    try {
      // Check if Freighter is installed
      if (!(window as any).freighter) {
        alert('Please install Freighter wallet extension');
        return;
      }

      // Request public key from Freighter
      const publicKey = await (window as any).freighter.getPublicKey();
      
      if (publicKey) {
        const truncatedAddress = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
        const newWallet: Wallet = {
          id: Date.now().toString(),
          address: truncatedAddress,
          nickname: newWalletNickname || 'My Wallet',
          isPrimary: wallets.length === 0,
          isVerified: false,
        };
        
        setWallets([...wallets, newWallet]);
        setIsAddingWallet(false);
        setNewWalletNickname('');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const handleSetPrimary = (id: string) => {
    setWallets(
      wallets.map((wallet) => ({
        ...wallet,
        isPrimary: wallet.id === id,
      }))
    );
  };

  const handleRemoveWallet = (id: string) => {
    setWallets(wallets.filter((wallet) => wallet.id !== id));
  };

  return (
    <SettingsLayout>
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2" style={{ fontFamily: 'var(--font-onest)' }}>
          Wallets
        </h1>
        <p className="text-muted-foreground mb-8">
          Connect your Stellar wallets to participate in events and receive rewards
        </p>

        <div className="space-y-6">
          {/* Existing Wallets */}
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="p-6 bg-[#F5F3EE] border border-border rounded-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {wallet.nickname}
                    </h3>
                    {wallet.isVerified && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        <Check className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {wallet.isPrimary && (
                      <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    {wallet.address}
                  </p>
                </div>
                <button
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  onClick={() => {
                    const action = confirm('Remove this wallet?');
                    if (action) handleRemoveWallet(wallet.id);
                  }}
                >
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex gap-3">
                {!wallet.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(wallet.id)}
                    className="px-4 py-2 text-sm font-medium text-foreground border border-border rounded-xl hover:bg-white transition-colors"
                  >
                    Set as Primary
                  </button>
                )}
                {!wallet.isVerified && (
                  <button
                    onClick={() => {
                      // TODO: Implement verification flow
                      console.log('Verifying wallet...');
                    }}
                    className="px-4 py-2 text-sm font-medium text-foreground border border-border rounded-xl hover:bg-white transition-colors"
                  >
                    Verify Wallet
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add Wallet Section */}
          {isAddingWallet ? (
            <div className="p-6 bg-[#F5F3EE] border border-border rounded-2xl">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Connect Freighter Wallet
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Wallet Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    value={newWalletNickname}
                    onChange={(e) => setNewWalletNickname(e.target.value)}
                    placeholder="e.g., My Main Wallet"
                    className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddWallet}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 font-medium"
                  >
                    <Check className="w-4 h-4" />
                    Connect Wallet
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingWallet(false);
                      setNewWalletNickname('');
                    }}
                    className="px-6 py-3 text-foreground border border-border rounded-xl hover:bg-white transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingWallet(true)}
              className="w-full p-6 border-2 border-dashed border-border rounded-2xl hover:border-foreground/30 hover:bg-[#F5F3EE] transition-all duration-200 flex items-center justify-center gap-2 text-foreground font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Wallet
            </button>
          )}

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Make sure you have the Freighter wallet extension installed. 
              Your primary wallet will be used for all transactions and event participation.
            </p>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default WalletsSettings;
