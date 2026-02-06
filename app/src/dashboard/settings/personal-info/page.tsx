'use client';

import SettingsLayout from '@/src/userProfile/components/userProfileUI/SettingsLayout';
import PersonalInfoForm from '@/src/userProfile/components/userProfileUI/PersonalInfoForm';
import { useProfile } from '@/src/userProfile/components/userProfileService/useProfile';
import { Loader2 } from 'lucide-react';

const PersonalInfoSettings = () => {
  const { data, isLoading, error, updateProfile } = useProfile();

  return (
    <SettingsLayout>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all font-medium"
          >
            Retry
          </button>
        </div>
      ) : data ? (
        <PersonalInfoForm
          user={data.user}
          profile={data.profile}
          onSave={updateProfile}
        />
      ) : null}
    </SettingsLayout>
  );
};

export default PersonalInfoSettings;
