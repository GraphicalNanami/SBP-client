'use client';

import SettingsLayout from '@/src/userProfile/components/userProfileUI/SettingsLayout';
import WalletsManager from '@/src/userProfile/components/userProfileUI/WalletsManager';

const WalletsSettings = () => {
  return (
    <SettingsLayout>
      <WalletsManager />
    </SettingsLayout>
  );
};

export default WalletsSettings;
