'use client';

import { useState, useEffect } from 'react';
import { Camera, Save, Loader2 } from 'lucide-react';
import type { User } from '@/src/shared/types/auth.types';
import type { UserProfile, UpdateProfilePayload } from '@/src/userProfile/types/profile.types';

interface PersonalInfoFormProps {
  user: User;
  profile: UserProfile;
  onSave: (payload: UpdateProfilePayload) => Promise<boolean>;
  isSaving?: boolean;
}

export default function PersonalInfoForm({ user, profile, onSave }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    stellarAddress: '',
    twitter: '',
    linkedin: '',
    github: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      name: user.name || '',
      bio: profile.bio || '',
      stellarAddress: profile.stellarAddress || '',
      twitter: profile.socialLinks?.twitter || '',
      linkedin: profile.socialLinks?.linkedin || '',
      github: profile.socialLinks?.github || '',
    });
  }, [user, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload: UpdateProfilePayload = {
      name: formData.name,
      bio: formData.bio,
      stellarAddress: formData.stellarAddress,
      socialLinks: {
        twitter: formData.twitter || undefined,
        linkedin: formData.linkedin || undefined,
        github: formData.github || undefined,
      },
    };

    await onSave(payload);
    setIsSaving(false);
  };

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div>
      <h1
        className="text-3xl font-semibold text-foreground mb-2"
        style={{ fontFamily: 'var(--font-onest)' }}
      >
        Edit your Profile
      </h1>
      <p className="text-muted-foreground mb-8">
        Change your profile and account settings
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Personal Info</h2>

          {/* Profile Picture */}
          <div className="flex items-start gap-6 mb-6">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-semibold">
                  {initials}
                </div>
              )}
              <button
                type="button"
                className="absolute bottom-0 right-0 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:bg-foreground/90 transition-all"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
            />
          </div>

          {/* Email (read-only) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 bg-[#F5F3EE]/60 border border-border rounded-xl text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all resize-none"
            />
          </div>

          {/* Stellar Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Stellar Address
            </label>
            <input
              type="text"
              name="stellarAddress"
              value={formData.stellarAddress}
              onChange={handleChange}
              placeholder="G..."
              className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all font-mono text-sm"
            />
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Twitter
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="username"
                  className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  LinkedIn
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="username"
                  className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                GitHub
              </label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="username"
                className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-border">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
