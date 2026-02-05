'use client';

import { useState } from 'react';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Login:', { email, password });
    setIsLoading(false);
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl md:text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--font-onest)' }}>
        Let's build something amazing
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Enter your email below.
        <br />
        We recommend using a personal email for continuity.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="example@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
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
