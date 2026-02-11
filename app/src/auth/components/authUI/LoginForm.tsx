'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, Loader2 } from 'lucide-react';
import { useAuth } from '@/src/auth/hooks/useAuth';
import { FreighterService } from '@/src/shared/lib/freighter/freighter-service';
import { walletAuthService } from '@/src/shared/lib/auth/wallet-auth-service';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState('');
  const { login, walletLogin, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/'); // Redirect to home page on success
    } catch {
      // Error handled in context
    }
  };

  // Clear error when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) clearError();
  };

  // Handle wallet connect and authentication
  const handleWalletConnect = async () => {
    try {
      setWalletLoading(true);
      setWalletError('');
      clearError();

      console.log('[LoginForm] Starting wallet connection flow...');

      // Step 1: Check Freighter installed
      const isInstalled = await FreighterService.isInstalled();
      console.log('[LoginForm] Freighter installed check:', isInstalled);
      
      if (!isInstalled) {
        setWalletError('Freighter wallet not found. Please install the Freighter extension.');
        return;
      }

      // Step 2: Get wallet address
      console.log('[LoginForm] Requesting wallet address...');
      const walletAddress = await FreighterService.getPublicKey();
      console.log('[LoginForm] Retrieved wallet address from Freighter:', walletAddress);
      // Step 3: Check if wallet exists
      const { exists } = await walletAuthService.checkWalletExistence(walletAddress);
     console.log('Wallet existence check:', { walletAddress, exists });
      if (!exists) {
        // Wallet not registered - redirect to signup
        setWalletError('No account found with this wallet. please do register your wallet .');
        setTimeout(() => {
          router.push(`/src/auth?mode=signup&wallet=${encodeURIComponent(walletAddress)}`);
        }, 1500);
        return;
      }

      // Step 4: Request challenge
      const { challenge } = await walletAuthService.requestChallenge(walletAddress);

      // Step 5: Sign challenge
      const signature = await FreighterService.signMessage(challenge);

      // Step 6: Login with wallet
      await walletLogin(walletAddress, signature, challenge);

      // Success - redirect
      router.push('/');
    } catch (err: any) {
      const errorMsg = FreighterService.getErrorMessage(err);
      setWalletError(errorMsg);
    } finally {
      setWalletLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl md:text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--font-onest)' }}>
               Build On Stellar

      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Enter your email below.
        <br />
        We recommend using a personal email for continuity.
      </p>

      {error && (
        <div className="text-sm text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      {walletError && (
        <div className="text-sm text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          {walletError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="example@domain.com"
          value={email}
          onChange={handleEmailChange}
          required
          className="w-full px-4 py-3 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
          className="w-full px-4 py-3 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 text-base font-medium bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Continue'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-muted-foreground">OR</span>
        </div>
      </div>

      {/* Wallet Connect Button */}
      <button
        onClick={handleWalletConnect}
        disabled={walletLoading || isLoading}
        className="w-full px-6 py-3 text-base font-medium bg-white text-foreground border-2 border-border rounded-xl hover:border-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {walletLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-5 h-5" />
            Connect Freighter Wallet
          </>
        )}
      </button>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-foreground font-medium hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-foreground">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
