'use client';

import { useAuth } from '@/src/auth/hooks/useAuth';
import { redirect } from 'next/navigation';
import SubmissionDashboard from '../components/buildService/SubmissionDashboard';
import { useBuildSubmission } from '../components/buildService/useBuildSubmission';

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#1A1A1A] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#4D4D4D]">Loading...</p>
      </div>
    </div>
  );
}

export default function BuildSubmitPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const submissionHook = useBuildSubmission();

  // Show loading while determining auth status
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    redirect('/src/auth?redirect=/builds/submit');
  }

  // Render the submission dashboard
  return <SubmissionDashboard {...submissionHook} />;
}