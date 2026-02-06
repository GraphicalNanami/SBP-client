'use client';

import { Clock } from 'lucide-react';
import SettingsLayout from '@/src/userProfile/components/userProfileUI/SettingsLayout';

const SocialAccountsSettings = () => {
  return (
    <SettingsLayout>
      <div className="flex flex-col items-center justify-center py-16 md:py-24">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center mb-6">
          <Clock className="w-8 h-8 md:w-10 md:h-10 text-[#4D4D4D]" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mb-3 tracking-tight text-center">
          Coming Soon
        </h1>
        
        <p className="text-[#4D4D4D] text-base md:text-lg text-center max-w-md mb-8">
          Social account connections are currently under development. Connect your GitHub and Twitter accounts soon!
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="px-4 py-2 bg-[#F5F5F5] border border-[#E5E5E5] rounded-full text-sm text-[#4D4D4D]">
            GitHub Integration
          </div>
          <div className="px-4 py-2 bg-[#F5F5F5] border border-[#E5E5E5] rounded-full text-sm text-[#4D4D4D]">
            Twitter Integration
          </div>
          <div className="px-4 py-2 bg-[#F5F5F5] border border-[#E5E5E5] rounded-full text-sm text-[#4D4D4D]">
            LinkedIn Integration
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default SocialAccountsSettings;

