'use client';

import { useParams, useRouter } from 'next/navigation';
import { REGIONAL_CHAPTERS, RegionalChapter } from '../../events/types/region.types';
import { MOCK_EVENTS } from '../../events/components/eventsService/mockData';
import { Calendar, MapPin, Users, ExternalLink, Twitter, MessageCircle, Send, Instagram, Linkedin, Youtube, ArrowLeft, Sparkles, BookOpen, Rocket } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { getAvatarUrl, isDataUri } from '@/src/shared/utils/avatar';

export default function RegionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const regionId = params.regionId as string;

  // Find the region from REGIONAL_CHAPTERS
  const region = Object.values(REGIONAL_CHAPTERS).find(
    r => r.id === regionId
  ) as RegionalChapter | undefined;

  // Get events for this region
  const regionEvents = MOCK_EVENTS.filter(e => e.region === region?.name);

  if (!region) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Region Not Found</h1>
          <button
            onClick={() => router.push('/src/regions')}
            className="text-[#1A1A1A] underline"
          >
            Back to Regions
          </button>
        </div>
      </div>
    );
  }

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
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-[#E6FF80]/20 via-white to-[#E6FF80]/10 pt-24 pb-16 px-6">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#E6FF80]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Back Button */}
          <button
            onClick={() => router.push('/src/regions')}
            className="flex items-center gap-2 text-[#4D4D4D] hover:text-[#1A1A1A] mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Regions</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Region Info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E6FF80] px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold text-[#1A1A1A]">{region.continent}</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6 tracking-tight">
                Stellar {region.name}
              </h1>
              
              <p className="text-lg text-[#4D4D4D] leading-relaxed mb-8">
                {region.description}
              </p>

              {/* Stats Row */}
              <div className="flex gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#E6FF80]" />
                  <span className="text-[#1A1A1A] font-semibold">{regionEvents.length}</span>
                  <span className="text-[#4D4D4D]">Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#E6FF80]" />
                  <span className="text-[#1A1A1A] font-semibold">
                    {regionEvents.reduce((sum, e) => {
                      const count = Array.isArray(e.attendees) ? e.attendees.length : e.attendees;
                      return sum + (typeof count === 'number' ? count : 0);
                    }, 0)}+
                  </span>
                  <span className="text-[#4D4D4D]">Community Members</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {Object.entries(region.socials).map(([platform, url]) => (
                  url && (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] rounded-xl hover:border-[#1A1A1A] transition-colors"
                    >
                      {getSocialIcon(platform)}
                      <span className="text-sm font-medium capitalize">{platform}</span>
                    </a>
                  )
                ))}
                {region.notionPage && (
                  <a
                    href={region.notionPage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm font-medium">Full Handbook</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right: President Card */}
            <div className="bg-white rounded-3xl p-8 border border-[#E5E5E5] shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 text-[#4D4D4D] mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wide">Chapter President</span>
              </div>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#E6FF80]">
                  <Image
                    src={getAvatarUrl(region.president.avatar, `${region.name}-${region.president.name}`)}
                    alt={region.president.name}
                    fill
                    className="object-cover"
                    unoptimized={isDataUri(getAvatarUrl(region.president.avatar, `${region.name}-${region.president.name}`))}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                    {region.president.name}
                  </h2>
                  <p className="text-[#4D4D4D] flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {region.president.discord}
                  </p>
                </div>
              </div>

              {region.meetingSchedule && (
                <div className="bg-[#FCFCFC] rounded-2xl p-6 border border-[#E5E5E5]">
                  <h3 className="font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#E6FF80]" />
                    Weekly Community Meeting
                  </h3>
                  <p className="text-[#4D4D4D]">
                    Every {region.meetingSchedule.day} at {region.meetingSchedule.time} ({region.meetingSchedule.timezone})
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
                <p className="text-sm text-[#4D4D4D] leading-relaxed">
                  Leading the {region.name} chapter to empower communities with blockchain technology and drive Stellar adoption across the region.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">What We Offer</h2>
          <p className="text-lg text-[#4D4D4D] max-w-2xl mx-auto">
            Join our community and get access to exclusive resources, events, and opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] hover:border-[#E6FF80] transition-all hover:shadow-lg group">
            <div className="w-12 h-12 bg-[#E6FF80] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Education & Training</h3>
            <p className="text-[#4D4D4D] leading-relaxed">
              Expert training on Stellar blockchain, smart contracts, Soroban, and technical aspects through workshops and webinars.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] hover:border-[#E6FF80] transition-all hover:shadow-lg group">
            <div className="w-12 h-12 bg-[#E6FF80] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Community Engagement</h3>
            <p className="text-[#4D4D4D] leading-relaxed">
              Connect with local and global Stellar communities, leverage networking opportunities, and collaborate on projects.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] hover:border-[#E6FF80] transition-all hover:shadow-lg group">
            <div className="w-12 h-12 bg-[#E6FF80] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Build & Launch</h3>
            <p className="text-[#4D4D4D] leading-relaxed">
              Practical sessions, hackathons, and opportunities to lead or contribute to impactful blockchain initiatives.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      {regionEvents.length > 0 && (
        <div className="bg-gradient-to-br from-white via-[#E6FF80]/5 to-white py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-[#1A1A1A] mb-2">Upcoming Events</h2>
                <p className="text-lg text-[#4D4D4D]">
                  Join us at these amazing community events in {region.name}
                </p>
              </div>
              <button
                onClick={() => router.push(`/src/events?region=${region.name}`)}
                className="px-6 py-3 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-colors flex items-center gap-2"
              >
                View All Events
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionEvents.slice(0, 6).map((event) => (
                <div
                  key={event.id}
                  onClick={() => router.push(`/src/events/${event.id}`)}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E5E5E5] hover:border-[#1A1A1A] hover:shadow-xl transition-all cursor-pointer group"
                >
                  {/* Event Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[#E6FF80]/20 to-blue-500/20">
                    {event.coverImage && (
                      <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {event.featured && (
                      <div className="absolute top-4 right-4 bg-[#E6FF80] px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold text-[#1A1A1A]">Featured</span>
                      </div>
                    )}
                    {event.status === 'Sold Out' && (
                      <div className="absolute top-4 right-4 bg-red-500 px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold text-white">Sold Out</span>
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-[#4D4D4D] mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {(() => {
                          try {
                            const date = new Date(event.startDate);
                            if (isNaN(date.getTime())) {
                              return event.startDate;
                            }
                            return format(date, 'MMM dd, yyyy');
                          } catch {
                            return event.startDate;
                          }
                        })()}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#333] transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-[#4D4D4D] mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}, {event.country}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#4D4D4D]" />
                        <span className="text-sm text-[#4D4D4D]">
                          {Array.isArray(event.attendees) ? event.attendees.length : event.attendees} attendees
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[#1A1A1A] uppercase">{event.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Join CTA Section */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#333] rounded-3xl p-12 text-center relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-[#E6FF80] rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Join the Movement?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Be part of a community that&apos;s transforming the world of finance. Together, we can build a stronger and more prosperous future for everyone in {region.name}.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {region.socials.discord && (
                <a
                  href={region.socials.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-[#E6FF80] text-[#1A1A1A] rounded-xl font-semibold hover:bg-[#d4ed6e] transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Join Discord
                </a>
              )}
              <button
                onClick={() => router.push(`/src/events?region=${region.name}`)}
                className="px-8 py-4 bg-white/10 text-white border-2 border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                View All Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
