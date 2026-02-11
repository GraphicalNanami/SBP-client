'use client';

import { useState } from 'react';
import { User } from '../../users/types';

interface ProfileAboutProps {
  user: User;
}

export default function ProfileAbout({ user }: ProfileAboutProps) {
  const [showFullBio, setShowFullBio] = useState(false);
  const bio = user.profile?.bio || '';
  const shouldTruncate = bio.length > 500;
  const displayBio = showFullBio ? bio : bio.substring(0, 500);

  if (!bio) {
    return (
      <div className="rounded-3xl border border-[#E5E5E5] bg-white p-6 hover:border-[#E6FF80] hover:shadow-2xl transition-all">
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">About</h2>
        <p className="text-[#999] italic">This user hasn't written a bio yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#E5E5E5] bg-white p-6 hover:border-[#E6FF80] hover:shadow-2xl transition-all">
      <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">About</h2>
      <div className="text-[#4D4D4D] whitespace-pre-wrap">
        {displayBio}
        {shouldTruncate && !showFullBio && '...'}
      </div>
      {shouldTruncate && (
        <button
          onClick={() => setShowFullBio(!showFullBio)}
          className="mt-4 text-[#1A1A1A] font-medium hover:underline"
        >
          {showFullBio ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
