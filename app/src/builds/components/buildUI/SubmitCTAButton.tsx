'use client';

import Link from 'next/link';
import { Button } from '@/src/shared/components/ui/button';

interface SubmitCTAButtonProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export default function SubmitCTAButton({ isAuthenticated, isLoading }: SubmitCTAButtonProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="h-12 bg-muted/30 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Link href="/builds/submit">
          <Button 
            size="lg" 
            className="w-full bg-[#1A1A1A] text-white hover:bg-[#333] transition-all duration-200 rounded-xl font-medium text-sm md:text-base px-6 py-3 md:px-8 md:py-4"
          >
            Submit Your Build
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Link href="/src/auth?redirect=/builds/submit">
        <Button 
          variant="outline"
          size="lg" 
          className="w-full border-[#E5E5E5] hover:border-[#1A1A1A] transition-all duration-200 rounded-xl font-medium text-sm md:text-base px-6 py-3 md:px-8 md:py-4"
        >
          Sign in to Submit Your Build
        </Button>
      </Link>
    </div>
  );
}