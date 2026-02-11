'use client';

import { User } from '../../users/types';
import { Briefcase, Award, Code, Wrench } from 'lucide-react';

interface ProfileExperienceProps {
  user: User;
}

export default function ProfileExperience({ user }: ProfileExperienceProps) {
  const experience = user.experience;

  if (!experience || (!experience.roles?.length && !experience.programmingLanguages?.length && !experience.developerTools?.length)) {
    return (
      <div className="rounded-3xl border border-[#E5E5E5] bg-white p-6 hover:border-[#E6FF80] hover:shadow-2xl transition-all">
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Professional Experience</h2>
        <p className="text-[#999] italic">No experience added yet</p>
      </div>
    );
  }

  const skillLevelColor = 'bg-[#E6FF80]/30 text-[#1A1A1A]';

  return (
    <div className="rounded-3xl border border-[#E5E5E5] bg-white p-6 hover:border-[#E6FF80] hover:shadow-2xl transition-all">
      <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Professional Experience</h2>
      
      <div className="space-y-6">
        {/* Roles */}
        {experience.roles && experience.roles.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-5 h-5 text-[#4D4D4D]" />
              <h3 className="font-semibold text-[#1A1A1A]">Roles</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {experience.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-[#FCFCFC] text-[#4D4D4D] text-sm border border-[#E5E5E5]"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience Level */}
        {(experience.yearsOfExperience !== undefined || experience.web3SkillLevel) && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-[#4D4D4D]" />
              <h3 className="font-semibold text-[#1A1A1A]">Experience Level</h3>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              {experience.yearsOfExperience !== undefined && (
                <div className="text-sm text-[#4D4D4D] px-3 py-1 rounded-lg bg-[#FCFCFC] border border-[#E5E5E5]">
                  <span className="font-medium">{experience.yearsOfExperience}</span> years of experience
                </div>
              )}
              {experience.web3SkillLevel && (
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${skillLevelColor}`}>
                  {experience.web3SkillLevel.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Programming Languages */}
        {experience.programmingLanguages && experience.programmingLanguages.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-5 h-5 text-[#4D4D4D]" />
              <h3 className="font-semibold text-[#1A1A1A]">Programming Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {experience.programmingLanguages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-[#FCFCFC] text-[#4D4D4D] text-sm border border-[#E5E5E5]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Developer Tools */}
        {experience.developerTools && experience.developerTools.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-5 h-5 text-[#4D4D4D]" />
              <h3 className="font-semibold text-[#1A1A1A]">Developer Tools</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {experience.developerTools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-[#FCFCFC] text-[#4D4D4D] text-sm border border-[#E5E5E5]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
      );
      }
