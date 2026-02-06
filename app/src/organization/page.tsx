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
    handleCreate,
    handleSwitchOrg,
    handleStartCreateNew,
    handleProfileChange,
    handleSocialChange,
    handleAddMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleSave,
  } = useOrganization();

  if (step === 'create') {
    return <OrganizationForm onSubmit={handleCreate} />;
  }

  return (
    <OrganizationDashboard
      profile={profile}
      organizations={organizations}
      activeOrgId={activeOrgId}
      isSaving={isSaving}
      saveSuccess={saveSuccess}
      onProfileChange={handleProfileChange}
      onSocialChange={handleSocialChange}
      onAddMember={handleAddMember}
      onRemoveMember={handleRemoveMember}
      onUpdateMemberRole={handleUpdateMemberRole}
      onSwitchOrg={handleSwitchOrg}
      onCreateNew={handleStartCreateNew}
      onSave={handleSave}
    />
  );
}
