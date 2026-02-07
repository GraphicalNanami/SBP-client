'use client';

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
  
  const profilePicture = user.profile?.profilePictureUrl || user.avatar || '/default-avatar.png';
  
  // Generate deterministic gradient color from user ID
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };
  
  const gradientColors = [
    'from-purple-600 to-blue-600',
    'from-blue-600 to-cyan-600',
    'from-cyan-600 to-teal-600',
    'from-teal-600 to-green-600',
    'from-green-600 to-lime-600',
    'from-orange-600 to-red-600',
    'from-pink-600 to-rose-600',
    'from-indigo-600 to-purple-600',
  ];
  
  const gradientIndex = Math.abs(hashCode(user.uuid)) % gradientColors.length;
  const gradient = gradientColors[gradientIndex];

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
    <div>
      {/* Hero Banner */}
      <div className={`h-[200px] md:h-[280px] bg-gradient-to-r ${gradient}`} />

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
                    <span className="px-3 py-1 rounded-full bg-[#F5F5F5] text-[#4D4D4D] text-sm font-medium">
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
                  className="px-4 py-2 rounded-full border border-[#E5E5E5] text-[#4D4D4D] hover:bg-[#F5F5F5] transition-all duration-200 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden md:inline">Share</span>
                </button>
                
                <button
                  className="px-4 py-2 rounded-full border border-[#E5E5E5] text-[#4D4D4D] hover:bg-[#F5F5F5] transition-all duration-200 flex items-center gap-2"
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
