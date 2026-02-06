'use client';

import { OrganizationForm } from './components/OrganizationForm';
import { OrganizationDashboard } from './components/OrganizationDashboard';
import { useOrganization } from './components/useOrganization';

export default function OrganizationPage() {
  const {
    step,
    organizations,
    activeOrgId,
    profile,
    isSaving,
    saveSuccess,
    isLoading,
    error,
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
  } = useOrganization();

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
      onProfileChange={handleProfileChange}
      onSocialChange={handleSocialChange}
      onAddMember={handleAddMember}
      onRemoveMember={handleRemoveMember}
      onUpdateMemberRole={handleUpdateMemberRole}
      onSwitchOrg={handleSwitchOrg}
      onCreateNew={handleStartCreateNew}
      onSave={handleSave}
      onClearError={clearError}
    />
  );
}
