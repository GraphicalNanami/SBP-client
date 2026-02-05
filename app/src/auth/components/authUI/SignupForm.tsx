'use client';

import { useState } from 'react';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Signup:', { fullName, email, password });
    setIsLoading(false);
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-semibold mb-3" style={{ fontFamily: 'var(--font-onest)' }}>
        Join Stellar Global
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Create your account to access hackathons, grants, and connect with the community.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-4 py-3.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
        />

        <input
          type="email"
          placeholder="example@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-4 py-3.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-4 py-3.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3.5 text-base font-medium bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6">
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

      <div className="mt-8 pt-6 border-t border-border">
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
