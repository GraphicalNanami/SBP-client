'use client';

import { useAuth } from '@/src/auth/hooks/useAuth';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SubmissionDashboard from '../../components/buildService/SubmissionDashboard';
import { useBuildEdit } from '../../components/buildService/useBuildEdit';
import { Loader2 } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#4D4D4D]" />
        <p className="text-[#4D4D4D]">Loading...</p>
      </div>
    </div>
  );
}

export default function BuildEditPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const params = useParams();
  const buildId = params.id as string;
  const editHook = useBuildEdit(buildId);

  // Show loading while determining auth status
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    redirect(`/src/auth?redirect=/builds/edit/${buildId}`);
  }

  // Render the submission dashboard
  return <SubmissionDashboard {...editHook} />;
}
