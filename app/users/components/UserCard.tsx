'use client';

import Link from 'next/link';
import { User } from '../types';
import { MapPin, Github, Twitter, Linkedin } from 'lucide-react';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const displayName = user.name || `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || 'Anonymous';
  const location = user.profile?.city && user.profile?.country 
    ? `${user.profile.city}, ${user.profile.country}`
    : user.profile?.country || '';
  
  const bioPreview = user.profile?.bio 
    ? user.profile.bio.length > 100 
      ? user.profile.bio.substring(0, 100) + '...'
      : user.profile.bio
    : '';

  const roleBadge = user.role === 'ORGANIZER' ? 'Organizer' : 'Builder';
  const roleColor = user.role === 'ORGANIZER' ? 'bg-[#1A1A1A] text-white' : 'bg-[#F5F5F5] text-[#4D4D4D]';

  const profilePicture = user.profile?.profilePictureUrl || user.avatar || '/default-avatar.png';

  const languages = user.experience?.programmingLanguages?.slice(0, 3) || [];
  const remainingCount = (user.experience?.programmingLanguages?.length || 0) - 3;

  return (
    <Link
      href={`/user/${user.uuid}`}
      className="block rounded-xl border border-[#E5E5E5] bg-white p-6 transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
    >
      {/* Header */}
      <div className="relative mb-4">
        <div className="flex items-start justify-between">
          <div className="relative">
            <img
              src={profilePicture}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#E5E5E5]"
            />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColor}`}>
            {roleBadge}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[#1A1A1A] truncate">
          {displayName}
        </h3>
        
        {location && (
          <div className="flex items-center gap-1 text-sm text-[#999]">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{location}</span>
          </div>
        )}

        {bioPreview && (
          <p className="text-sm text-[#4D4D4D] line-clamp-2 min-h-[2.5rem]">
            {bioPreview}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
        <div className="flex items-center justify-between">
          {/* Social Links */}
          <div className="flex items-center gap-2">
            {user.profile?.socialLinks?.github && (
              <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <Github className="w-4 h-4 text-[#4D4D4D]" />
              </div>
            )}
            {user.profile?.socialLinks?.twitter && (
              <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <Twitter className="w-4 h-4 text-[#4D4D4D]" />
              </div>
            )}
            {user.profile?.socialLinks?.linkedin && (
              <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <Linkedin className="w-4 h-4 text-[#4D4D4D]" />
              </div>
            )}
          </div>

          {/* Skills Preview */}
          {languages.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap justify-end">
              {languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-full bg-[#F5F5F5] text-xs text-[#4D4D4D]"
                >
                  {lang}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="px-2 py-1 rounded-full bg-[#F5F5F5] text-xs text-[#4D4D4D]">
                  +{remainingCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
