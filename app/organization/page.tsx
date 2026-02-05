'use client';

import { OrganizationForm } from '@/src/features/organization/components/organizationUI/OrganizationForm';
import { OrganizationDashboard } from '@/src/features/organization/components/organizationUI/OrganizationDashboard';
import { useOrganization } from '@/src/features/organization/components/organizationService/useOrganization';

export default function OrganizationPage() {
  const {
    step,
    profile,
    isSaving,
    saveSuccess,
    handleCreate,
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
      isSaving={isSaving}
      saveSuccess={saveSuccess}
      onProfileChange={handleProfileChange}
      onSocialChange={handleSocialChange}
      onAddMember={handleAddMember}
      onRemoveMember={handleRemoveMember}
      onUpdateMemberRole={handleUpdateMemberRole}
      onSave={handleSave}
    />
  );
}
