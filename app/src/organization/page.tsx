'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OrganizationForm } from './components/OrganizationForm';
import { OrganizationDashboard } from './components/OrganizationDashboard';
import { useOrganization } from './components/useOrganization';
import { useAuth } from '@/src/auth/hooks/useAuth';

export default function OrganizationPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    step,
    organizations,
    activeOrgId,
    profile,
    isSaving,
    saveSuccess,
    isLoading,
    error,
    organizationHackathons,
    isLoadingHackathons,
    hackathonsError,
    handleCreate,
    handleSwitchOrg,
    handleStartCreateNew,
    handleProfileChange,
    handleSocialChange,
    handleAddMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleSave,
    clearError,
    refreshHackathons,
  } = useOrganization();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/src/auth');
    }
  }, [authLoading, isAuthenticated, router]);

  // Show loader while checking auth or loading organizations
  if (authLoading || (isAuthenticated && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFCFC]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A1A1A] mb-4"></div>
          <p className="text-[#4D4D4D] text-lg">Loading organization...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (step === 'create') {
    return (
      <OrganizationForm
        onSubmit={handleCreate}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <OrganizationDashboard
      profile={profile}
      organizations={organizations}
      activeOrgId={activeOrgId}
      isSaving={isSaving}
      saveSuccess={saveSuccess}
      isLoading={isLoading}
      error={error}
      organizationHackathons={organizationHackathons}
      isLoadingHackathons={isLoadingHackathons}
      hackathonsError={hackathonsError}
      onProfileChange={handleProfileChange}
      onSocialChange={handleSocialChange}
      onAddMember={handleAddMember}
      onRemoveMember={handleRemoveMember}
      onUpdateMemberRole={handleUpdateMemberRole}
      onSwitchOrg={handleSwitchOrg}
      onCreateNew={handleStartCreateNew}
      onSave={handleSave}
      onClearError={clearError}
      onRefreshHackathons={refreshHackathons}
    />
  );
}
