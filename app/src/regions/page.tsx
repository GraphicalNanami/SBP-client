'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { REGIONAL_CHAPTERS, RegionName } from '../events/types/region.types';
import { Twitter, MessageCircle, Send, Instagram, Linkedin, Youtube, ExternalLink } from 'lucide-react';

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
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'discord': return <MessageCircle className="w-5 h-5" />;
      case 'telegram': return <Send className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      default: return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-24 overflow-hidden border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1A1A1A] mb-6 -tracking-tight leading-tight">
              Regional Chapters
            </h1>
            <p className="text-lg md:text-xl text-[#4D4D4D] leading-relaxed">
              Connect with Stellar ambassadors and communities around the world. Each chapter hosts local events, workshops, and initiatives to grow the ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            {continents.map((continent) => (
              <button
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedContinent === continent
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-transparent text-[#4D4D4D] hover:bg-gray-100 border border-[#E5E5E5]'
                }`}
              >
                {continent}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Chapters Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleChapterClick(chapter.name)}
              >
                {/* Header with Region Name */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 border-b border-[#E5E5E5]">
                  <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#8B4513] transition-colors">
                    {chapter.name}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-medium text-[#4D4D4D] border border-[#E5E5E5]">
                    {chapter.continent}
                  </span>
                </div>

                {/* President Info */}
                <div className="p-6 border-b border-[#E5E5E5]">
                  <p className="text-xs font-semibold text-[#4D4D4D] uppercase tracking-wide mb-3">President</p>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      {chapter.president.avatar ? (
                        <Image
                          src={chapter.president.avatar}
                          alt={chapter.president.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[#4D4D4D]">
                          {chapter.president.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">{chapter.president.name}</p>
                      <p className="text-sm text-[#4D4D4D]">@{chapter.president.discord}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-6 border-b border-[#E5E5E5]">
                  <p className="text-sm text-[#4D4D4D] leading-relaxed line-clamp-3">
                    {chapter.description}
                  </p>
                </div>

                {/* Social Links */}
                <div className="p-6">
                  <p className="text-xs font-semibold text-[#4D4D4D] uppercase tracking-wide mb-3">Connect</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(chapter.socials).map(([platform, url]) => url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-[#4D4D4D] hover:text-[#1A1A1A] transition-colors border border-[#E5E5E5]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {getSocialIcon(platform)}
                        <span className="capitalize">{platform}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* View Details Button */}
                <div className="p-6 pt-0">
                  <button 
                    onClick={() => handleChapterClick(chapter.name)}
                    className="w-full py-3 bg-[#1A1A1A] text-white rounded-xl font-medium hover:bg-[#333] transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
