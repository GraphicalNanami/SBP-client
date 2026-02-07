'use client';

import { User } from '../../users/types';
import { Github, Twitter, Linkedin, Globe } from 'lucide-react';

interface ProfileSocialProps {
  user: User;
}

export default function ProfileSocial({ user }: ProfileSocialProps) {
  const socialLinks = user.profile?.socialLinks || {};
  const website = user.profile?.website;
  
  const hasSocialLinks = socialLinks.github || socialLinks.twitter || socialLinks.linkedin || website;

  if (!hasSocialLinks) {
    return (
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Social Links</h2>
        <p className="text-[#999] italic">No social links added</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
      <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Social Links</h2>
      <div className="flex flex-wrap gap-3">
        {socialLinks.github && (
          <a
            href={`https://github.com/${socialLinks.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] transition-all duration-200"
          >
            <Github className="w-5 h-5 text-[#1A1A1A]" />
            <span className="text-sm text-[#4D4D4D]">GitHub</span>
          </a>
        )}
        
        {socialLinks.twitter && (
          <a
            href={`https://twitter.com/${socialLinks.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] transition-all duration-200"
          >
            <Twitter className="w-5 h-5 text-[#1A1A1A]" />
            <span className="text-sm text-[#4D4D4D]">Twitter</span>
          </a>
        )}
        
        {socialLinks.linkedin && (
          <a
            href={`https://linkedin.com/in/${socialLinks.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] transition-all duration-200"
          >
            <Linkedin className="w-5 h-5 text-[#1A1A1A]" />
            <span className="text-sm text-[#4D4D4D]">LinkedIn</span>
          </a>
        )}
        
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] transition-all duration-200"
          >
            <Globe className="w-5 h-5 text-[#1A1A1A]" />
            <span className="text-sm text-[#4D4D4D]">Website</span>
          </a>
        )}
      </div>
    </div>
  );
}
