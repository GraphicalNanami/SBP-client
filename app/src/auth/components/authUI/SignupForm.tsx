'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/auth/hooks/useAuth';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { signup, isLoading, error, clearError } = useAuth();
  const router = useRouter();

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

  const displayError = error || localError;

  return (
    <div className="text-center">
      <h1 className="text-2xl md:text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--font-onest)' }}>
        Join Stellar Global
      </h1>
      <p className="text-sm text-muted-foreground mb-5">
        Create your account to access hackathons, grants, and connect with the community.
      </p>

      {displayError && (
        <div className="text-sm text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          {displayError}
        </div>
      )}

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
      </form>

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
