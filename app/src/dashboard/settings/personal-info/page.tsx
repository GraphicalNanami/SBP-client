'use client';

import { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import SettingsLayout from '@/src/userProfile/components/userProfileUI/SettingsLayout';

const PersonalInfoSettings = () => {
  const [formData, setFormData] = useState({
    firstName: 'Kaushal',
    lastName: 'Chaudhari',
    email: 'chaudharikaushal02@gmail.com',
    gender: 'Male',
    city: 'Guwahati',
    country: 'India',
    website: 'https://x.com/Kaushaly4s5s7',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving personal info:', formData);
    // TODO: Implement save functionality
  };

  return (
    <SettingsLayout>
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2" style={{ fontFamily: 'var(--font-onest)' }}>
          Edit your Profile
        </h1>
        <p className="text-muted-foreground mb-8">
          Change your profile and account settings
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info Section */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Personal Info</h2>

            {/* Profile Picture */}
            <div className="flex items-start gap-6 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-semibold">
                  KC
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:bg-foreground/90 transition-all"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
            </div>

            {/* Gender and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all appearance-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  City / Country
                </label>
                <input
                  type="text"
                  name="city"
                  value={`${formData.city}, ${formData.country}`}
                  onChange={handleChange}
                  placeholder="Guwahati, India"
                  className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Personal Website / Portfolio
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                This can be a link to a website, a portfolio, or anything you think represents you and your work online.
              </p>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://x.com/Kaushaly4s5s7"
                className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-border">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 font-medium"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </SettingsLayout>
  );
};

export default PersonalInfoSettings;
