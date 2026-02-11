'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Wallet, Loader2 } from 'lucide-react';
import { useAuth } from '@/src/auth/hooks/useAuth';
import { FreighterService } from '@/src/shared/lib/freighter/freighter-service';
import { walletAuthService } from '@/src/shared/lib/auth/wallet-auth-service';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  // Wallet signup states
  const [isWalletMode, setIsWalletMode] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState('');
  
  const { signup, walletSignup, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for pre-filled wallet address from URL
  useEffect(() => {
    const walletParam = searchParams?.get('wallet');
    if (walletParam) {
      setIsWalletMode(true);
      setWalletAddress(walletParam);
    }
  }, [searchParams]);

  // Handle email/password signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear local error
    setLocalError('');
    
    // Client-side validation
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await signup(email, password, fullName);
      router.push('/'); // Redirect to home page on success
    } catch {
      // Error handled in context
    }
  };

  // Clear errors when user starts typing
  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (error) clearError();
    if (localError) setLocalError('');
  };


  const handlewalletmode = () => {
    setIsWalletMode(true);
    setLocalError('');
    setWalletError('');
  };



  // Handle wallet signup
  const handleWalletSignup = async () => {
    try {
      if (!fullName.trim()) {
        setWalletError('Please enter your name');
        return;
      }

      setWalletLoading(true);
      setWalletError('');
      clearError();

      // If no wallet address yet, connect wallet
      let address = walletAddress;
      if (!address) {
        const isInstalled = await FreighterService.isInstalled();
        if (!isInstalled) {
          setWalletError('Freighter wallet not found. Please install the Freighter extension.');
          return;
        }

        address = await FreighterService.getPublicKey();
        setWalletAddress(address);
      }

      // Request challenge
      const { challenge } = await walletAuthService.requestChallenge(address);

      // Sign challenge
      const signature = await FreighterService.signMessage(challenge);

      // Register with wallet
      await walletSignup(address, signature, challenge, fullName, email || undefined);

      // Success - redirect
      router.push('/');
    } catch (err: any) {
      const errorMsg = FreighterService.getErrorMessage(err);
      setWalletError(errorMsg);
    } finally {
      setWalletLoading(false);
    }
  };

  const displayError = error || localError || walletError;

  return (
    <div className="text-center">
      <h1 className="text-2xl md:text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--font-onest)' }}>
        Join Stellar Global
      </h1>
      <p className="text-sm text-muted-foreground mb-5">
        Create your account to access hackathons, grants, and connect with the community.
      </p>

      {/* Wallet pre-fill notification */}
      {isWalletMode && walletAddress && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-4 text-left">
          <p className="text-sm text-blue-900 font-medium mb-1">Complete your registration with wallet:</p>
          <p className="text-xs font-mono text-blue-700 break-all">
            {FreighterService.truncateAddress(walletAddress, 8, 8)}
          </p>
        </div>
      )}

      {displayError && (
        <div className="text-sm text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          {displayError}
        </div>
      )}

      {isWalletMode ? (
        /* Wallet Signup Form */
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name (Required)"
            value={fullName}
            onChange={handleInputChange(setFullName)}
            required
            className="w-full px-4 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
          />

          <input
            type="email"
            placeholder="Email (Optional)"
            value={email}
            onChange={handleInputChange(setEmail)}
            className="w-full px-4 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
          />

          <button
            onClick={handleWalletSignup}
            disabled={walletLoading || isLoading}
            className="w-full px-6 py-3 text-base font-medium bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {walletLoading || isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Complete Registration
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsWalletMode(false);
              setWalletAddress('');
              router.push('/src/auth');
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Use email/password instead
          </button>
        </div>
      ) : (
        /* Email/Password Signup Form */
        <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={handleInputChange(setFullName)}
          required
          className="w-full px-4 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
        />

        <input
          type="email"
          placeholder="example@domain.com"
          value={email}
          onChange={handleInputChange(setEmail)}
          required
          className="w-full px-4 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handleInputChange(setPassword)}
          required
          minLength={8}
          className="w-full px-4 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={handleInputChange(setConfirmPassword)}
          required
          minLength={8}
          className="w-full px-4 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 text-base font-medium bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>

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
        onClick={handlewalletmode}
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

      </form>
      )}


      

      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-foreground font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>


      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{' '}
          <a href="#" className="underline hover:text-foreground">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
