/**
 * ExperienceForm Component
 * Professional experience and skills management
 */

'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useExperience } from '../userProfileService/useExperience';
import { ChipInput } from '@/src/shared/components/factories/ChipInput';
import {
  PREDEFINED_ROLES,
  PREDEFINED_LANGUAGES,
  PREDEFINED_TOOLS,
  type Web3SkillLevel,
} from '@/src/userProfile/types/experience.types';

export default function ExperienceForm() {
  const {
    experience,
    isLoading,
    isSaving,
    error,
    updateExperience,
  } = useExperience();

  const [formData, setFormData] = useState({
    roles: [] as string[],
    yearsOfExperience: 0,
    web3SkillLevel: '' as Web3SkillLevel | '',
    programmingLanguages: [] as string[],
    developerTools: [] as string[],
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (experience) {
      setFormData({
        roles: experience.roles || [],
        yearsOfExperience: experience.yearsOfExperience || 0,
        web3SkillLevel: experience.web3SkillLevel || '',
        programmingLanguages: experience.programmingLanguages || [],
        developerTools: experience.developerTools || [],
      });
    }
  }, [experience]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await updateExperience({
      roles: formData.roles.length > 0 ? formData.roles : undefined,
      yearsOfExperience: formData.yearsOfExperience || undefined,
      web3SkillLevel: formData.web3SkillLevel || undefined,
      programmingLanguages: formData.programmingLanguages.length > 0 ? formData.programmingLanguages : undefined,
      developerTools: formData.developerTools.length > 0 ? formData.developerTools : undefined,
    });

    if (success) {
      setToastMessage('Experience updated successfully!');
      setToastType('success');
    } else {
      setToastMessage(error || 'Failed to update experience');
      setToastType('error');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

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
        Professional Experience
      </h1>
      <p className="text-[#4D4D4D] mb-8 text-base md:text-lg">
        Share your skills and experience with the community
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Roles */}
        <div>
          <ChipInput
            chips={formData.roles}
            onAdd={(role) => setFormData((prev) => ({ ...prev, roles: [...prev.roles, role] }))}
            onRemove={(role) =>
              setFormData((prev) => ({ ...prev, roles: prev.roles.filter((r) => r !== role) }))
            }
            suggestions={PREDEFINED_ROLES}
            placeholder="Add a role (e.g., Full Stack Engineer)"
            maxChips={10}
            label="Roles"
          />
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            min="0"
            max="60"
            value={formData.yearsOfExperience}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))
            }
            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all duration-200 text-sm md:text-base"
          />
        </div>

        {/* Web3 Skill Level */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
            Web3 Skill Level
          </label>
          <select
            value={formData.web3SkillLevel}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, web3SkillLevel: e.target.value as Web3SkillLevel }))
            }
            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all duration-200 text-sm md:text-base"
          >
            <option value="">Select skill level</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>

        {/* Programming Languages */}
        <div>
          <ChipInput
            chips={formData.programmingLanguages}
            onAdd={(lang) =>
              setFormData((prev) => ({ ...prev, programmingLanguages: [...prev.programmingLanguages, lang] }))
            }
            onRemove={(lang) =>
              setFormData((prev) => ({
                ...prev,
                programmingLanguages: prev.programmingLanguages.filter((l) => l !== lang),
              }))
            }
            suggestions={PREDEFINED_LANGUAGES}
            placeholder="Add a programming language"
            maxChips={20}
            label="Programming Languages"
          />
        </div>

        {/* Developer Tools */}
        <div>
          <ChipInput
            chips={formData.developerTools}
            onAdd={(tool) =>
              setFormData((prev) => ({ ...prev, developerTools: [...prev.developerTools, tool] }))
            }
            onRemove={(tool) =>
              setFormData((prev) => ({ ...prev, developerTools: prev.developerTools.filter((t) => t !== tool) }))
            }
            suggestions={PREDEFINED_TOOLS}
            placeholder="Add a developer tool"
            maxChips={30}
            label="Developer Tools"
          />
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
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
            ) : (
              <Save className="w-4 h-4 md:w-5 md:h-5" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
