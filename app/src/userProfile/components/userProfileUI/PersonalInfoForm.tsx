/**
 * PersonalInfoForm Component
 * Edit personal information and profile picture
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, Save, Loader2, Upload } from 'lucide-react';
import { useProfile } from '../userProfileService/useProfile';
import type { UpdatePersonalInfoPayload } from '@/src/userProfile/types/profile.types';

export default function PersonalInfoForm() {
  const { profile, data, isLoading, isUpdating, updatePersonalInfo, uploadProfilePicture, error } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    city: '',
    country: '',
    website: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        gender: profile.gender || '',
        city: profile.city || '',
        country: profile.country || '',
        website: profile.website || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UpdatePersonalInfoPayload = {
      firstName: formData.firstName || undefined,
      lastName: formData.lastName || undefined,
      gender: formData.gender || undefined,
      city: formData.city || undefined,
      country: formData.country || undefined,
      website: formData.website || undefined,
    };

    const success = await updatePersonalInfo(payload);
    if (success) {
      setToastMessage('Profile updated successfully!');
      setToastType('success');
    } else {
      setToastMessage(error || 'Failed to update profile');
      setToastType('error');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const success = await uploadProfilePicture(file);
    if (success) {
      setToastMessage('Profile picture updated!');
      setToastType('success');
    } else {
      setToastMessage(error || 'Failed to upload picture');
      setToastType('error');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayName = data?.user?.name || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
      </div>
    );
  }

  return (
    <div>
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 ${
            toastType === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {toastMessage}
        </div>
      )}

      <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mb-2 tracking-tight">
        Edit your Profile
      </h1>
      <p className="text-[#4D4D4D] mb-8 text-base md:text-lg">
        Change your profile and account settings
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-[#1A1A1A] mb-6">Personal Info</h2>

          {/* Profile Picture */}
          <div className="flex items-start gap-6 mb-8">
            <div className="relative">
              {profile?.profilePictureUrl ? (
                <img
                  src={profile.profilePictureUrl}
                  alt={displayName}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-[#E5E5E5]"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl md:text-3xl font-semibold">
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center hover:bg-[#333] transition-all duration-200"
                aria-label="Upload profile picture"
              >
                <Camera className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#4D4D4D] mb-2">
                Upload a new profile picture (max 5MB)
              </p>
              <p className="text-xs text-[#4D4D4D]">
                Supported formats: JPEG, PNG, WebP
              </p>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all duration-200 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all duration-200 text-sm md:text-base"
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Email
            </label>
            <input
              type="email"
              value={data?.user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border border-[#E5E5E5] rounded-xl text-[#4D4D4D] cursor-not-allowed text-sm md:text-base"
            />
            <p className="text-xs text-[#4D4D4D] mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Gender */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all duration-200 text-sm md:text-base"
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="NON_BINARY">Non-binary</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="San Francisco"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all duration-200 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="United States"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all duration-200 text-sm md:text-base"
              />
            </div>
          </div>

          {/* Website */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all duration-200 text-sm md:text-base"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-[#E5E5E5]">
          <button
            type="submit"
            disabled={isUpdating}
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
            ) : (
              <Save className="w-4 h-4 md:w-5 md:h-5" />
            )}
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
