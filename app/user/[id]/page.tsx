'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProfileHeader from '../components/ProfileHeader';
import ProfileAbout from '../components/ProfileAbout';
import ProfileExperience from '../components/ProfileExperience';
import ProfileSocial from '../components/ProfileSocial';
import { getPublicProfile } from '../../users/api';
import { User } from '../../users/types';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'contributions' | 'achievements'>('overview');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const profile = await getPublicProfile(userId);
        setUser(profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFCFC]">
        <div className="animate-pulse">
          <div className="h-[280px] bg-gradient-to-r from-[#1A1A1A] to-[#4D4D4D]" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative -mt-20 mb-8">
              <div className="rounded-xl border border-[#E5E5E5] bg-white p-8">
                <div className="w-32 h-32 rounded-full bg-[#F5F5F5] mb-4" />
                <div className="h-8 bg-[#F5F5F5] rounded w-1/3 mb-2" />
                <div className="h-4 bg-[#F5F5F5] rounded w-1/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
            {error === 'User not found' ? 'User Not Found' : 'Error Loading Profile'}
          </h1>
          <p className="text-[#4D4D4D] mb-8">
            {error || 'Something went wrong while loading the profile'}
          </p>
          <a
            href="/users"
            className="px-6 py-2 rounded-full bg-[#1A1A1A] text-white hover:bg-[#333] transition-all duration-200 inline-block"
          >
            Browse all users
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Tabs Navigation */}
      <div className="border-b border-[#E5E5E5] bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4">
            {(['overview', 'activity', 'contributions', 'achievements'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                  activeTab === tab
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-[#4D4D4D] hover:bg-[#F5F5F5]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              <ProfileAbout user={user} />
              <ProfileSocial user={user} />
              <ProfileExperience user={user} />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Contact & Links Card */}
              <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">
                  Contact & Links
                </h3>
                <div className="space-y-3">
                  {user.profile?.website && (
                    <a
                      href={user.profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#4D4D4D] hover:text-[#1A1A1A] transition-colors"
                    >
                      <span className="text-sm">🌐</span>
                      <span className="text-sm truncate">{user.profile.website}</span>
                    </a>
                  )}
                  {(!user.profile?.website && !user.profile?.socialLinks?.github && 
                    !user.profile?.socialLinks?.twitter && !user.profile?.socialLinks?.linkedin) && (
                    <p className="text-sm text-[#999]">No links added yet</p>
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">
                  Member Since
                </h3>
                <p className="text-[#4D4D4D]">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-12 text-center">
            <p className="text-[#999]">Activity timeline coming soon</p>
          </div>
        )}

        {activeTab === 'contributions' && (
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-12 text-center">
            <p className="text-[#999]">Contributions graph coming soon</p>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-12 text-center">
            <p className="text-[#999]">Achievements and badges coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
