'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { REGIONAL_CHAPTERS, RegionName } from '../events/types/region.types';
import { Twitter, MessageCircle, Send, Instagram, Linkedin, Youtube, ExternalLink, Sparkles, Users, Globe } from 'lucide-react';
import { getAvatarUrl } from '@/src/shared/utils/avatar';

export default function RegionsPage() {
  const router = useRouter();
  const [selectedContinent, setSelectedContinent] = useState<'All' | 'Asia' | 'LATAM' | 'Africa'>('All');

  const continents = ['All', 'Asia', 'LATAM', 'Africa'] as const;

  const filteredChapters = Object.values(REGIONAL_CHAPTERS).filter(
    chapter => selectedContinent === 'All' || chapter.continent === selectedContinent
  );

  const handleChapterClick = (regionName: RegionName) => {
    const regionId = regionName.toLowerCase().replace(/ /g, '-');
    router.push(`/src/regions/${regionId}`);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'discord': return <MessageCircle className="w-4 h-4" />;
      case 'telegram': return <Send className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-[#E6FF80]/20 via-white to-[#E6FF80]/10 pt-24 pb-16 px-6">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#E6FF80]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#E6FF80] px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold text-[#1A1A1A]">Global Community</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1A1A1A] mb-6 tracking-tight leading-tight">
              Regional Chapters
            </h1>
            
            <p className="text-lg md:text-xl text-[#4D4D4D] leading-relaxed max-w-3xl mx-auto">
              Connect with Stellar ambassadors and communities around the world. Each chapter hosts local events, workshops, and initiatives to grow the ecosystem.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#E6FF80] rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-[#1A1A1A]" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-[#1A1A1A]">{Object.keys(REGIONAL_CHAPTERS).length}</div>
                  <div className="text-sm text-[#4D4D4D]">Chapters</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#E6FF80] rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#1A1A1A]" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-[#1A1A1A]">5,000+</div>
                  <div className="text-sm text-[#4D4D4D]">Members</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 py-6 overflow-x-auto">
            {continents.map((continent) => (
              <button
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedContinent === continent
                    ? 'bg-[#1A1A1A] text-white shadow-lg'
                    : 'bg-white text-[#4D4D4D] hover:bg-gray-50 border border-[#E5E5E5] hover:border-[#1A1A1A]'
                }`}
              >
                {continent}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Chapters Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredChapters.map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => handleChapterClick(chapter.name)}
                className="bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden hover:border-[#E6FF80] hover:shadow-2xl transition-all cursor-pointer group"
              >
                {/* Header with Region Name and Gradient */}
                <div className="relative bg-gradient-to-br from-[#E6FF80]/30 via-white to-blue-500/10 p-8 border-b border-[#E5E5E5]">
                  <div className="absolute top-4 right-4">
                    <span className="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-[#1A1A1A] border border-[#E5E5E5]">
                      {chapter.continent}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#333] transition-colors">
                    Stellar {chapter.name}
                  </h3>
                  <p className="text-sm text-[#4D4D4D] line-clamp-2">
                    {chapter.description}
                  </p>
                </div>

                {/* President Info */}
                <div className="p-6 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-2 text-[#4D4D4D] mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Chapter President</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-[#E6FF80] to-blue-500/20 border-2 border-[#E5E5E5]">
                      <Image
                        src={getAvatarUrl(chapter.president.avatar, chapter.president.name)}
                        alt={chapter.president.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">{chapter.president.name}</p>
                      <p className="text-sm text-[#4D4D4D] flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {chapter.president.discord}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="p-6">
                  <p className="text-xs font-semibold text-[#4D4D4D] uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Connect with us
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(chapter.socials).slice(0, 4).map(([platform, url]) => url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#FCFCFC] hover:bg-[#E6FF80]/30 rounded-lg text-xs font-medium text-[#1A1A1A] transition-all border border-[#E5E5E5] hover:border-[#E6FF80]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {getSocialIcon(platform)}
                        <span className="capitalize">{platform}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="p-6 pt-0">
                  <button 
                    className="w-full py-3 bg-[#1A1A1A] text-white rounded-xl font-semibold hover:bg-[#333] transition-all flex items-center justify-center gap-2 group-hover:gap-3"
                  >
                    Explore Chapter
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA Section */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#333] rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-[#E6FF80] rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Join a Chapter?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Be part of a global community that's transforming the world of finance. Connect with passionate builders, learn from experts, and contribute to the Stellar ecosystem.
              </p>
              
              <button
                onClick={() => router.push('/src/events')}
                className="px-8 py-4 bg-[#E6FF80] text-[#1A1A1A] rounded-xl font-semibold hover:bg-[#d4ed6e] transition-colors inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Explore Upcoming Events
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
