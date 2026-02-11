'use client';

import { getAvatarUrl } from '@/src/shared/utils/avatar';
import { User } from '../../users/types';
import { MapPin, Share2, Flag } from 'lucide-react';

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const displayName = user.name || `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || 'Anonymous';
  const location = user.profile?.city && user.profile?.country 
    ? `${user.profile.city}, ${user.profile.country}`
    : user.profile?.country || '';
  
  const profilePicture = getAvatarUrl(user.profile?.profilePictureUrl || user.avatar, user.uuid);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${displayName}'s Profile`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  return (
    <div className="relative">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-[#E6FF80]/20 via-white to-[#E6FF80]/10 pt-24 pb-16 px-6 h-[200px] md:h-[280px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#E6FF80]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Profile Card Overlay */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 md:-mt-24 mb-8">
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Picture */}
              <div className="relative flex-shrink-0">
                <img
                  src={profilePicture}
                  alt={displayName}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
                  {displayName}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                  {user.role && (
                    <span className="px-3 py-1 rounded-full bg-[#E6FF80] text-[#1A1A1A] text-sm font-semibold">
                      {user.role === 'ORGANIZER' ? 'Organizer' : 'Builder'}
                    </span>
                  )}
                  
                  {location && (
                    <div className="flex items-center gap-1 text-[#4D4D4D]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{location}</span>
                    </div>
                  )}

                  <div className="text-sm text-[#999]">
                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="px-4 py-2 rounded-full border border-[#E5E5E5] text-[#4D4D4D] hover:bg-gray-50 hover:border-[#1A1A1A] transition-all duration-200 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden md:inline">Share</span>
                </button>
                
                <button
                  className="px-4 py-2 rounded-full border border-[#E5E5E5] text-[#4D4D4D] hover:bg-gray-50 hover:border-[#1A1A1A] transition-all duration-200 flex items-center gap-2"

                  title="Report"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
