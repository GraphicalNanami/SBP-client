'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  Globe,
  ExternalLink,
  Rocket,
  BookOpen,
  Code,
  Wallet,
  Flag,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { hackathonApi } from '@/src/shared/lib/api/hackathonApi';
import type { HackathonCardData } from '../components/mockData';

/* ── Status badge colors ── */
const statusStyles: Record<string, { bg: string; dot: string; text: string }> = {
  Upcoming: { bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500', text: 'text-blue-700' },
  Ongoing: { bg: 'bg-green-50 border-green-200', dot: 'bg-green-500', text: 'text-green-700' },
  Ended: { bg: 'bg-gray-100 border-gray-200', dot: 'bg-gray-400', text: 'text-gray-500' },
};

/* ── Tag colors ── */
const getTagColor = (tag: string) => {
  const colors = [
    'bg-red-100 text-red-700 border-red-200',
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-green-100 text-green-700 border-green-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-orange-100 text-orange-700 border-orange-200',
    'bg-indigo-100 text-indigo-700 border-indigo-200',
  ];
  return colors[tag.charCodeAt(0) % colors.length];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatPrize(amount: number) {
  return amount.toLocaleString('en-US');
}

export default function HackathonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [hackathon, setHackathon] = useState<HackathonCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHackathon() {
      // Safety check: ensure we have a valid ID
      if (!id || id === '[id]' || id.includes('[') || id.includes(']')) {
        console.error('Invalid hackathon ID:', id);
        setError('Invalid hackathon ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching hackathon with ID:', id);

        // Fetch hackathon by ID/slug from backend
        const response = await hackathonApi.getPublicHackathon(id);

        // Determine status based on dates
        const now = new Date();
        const startTime = new Date(response.general.startTime);
        const submissionDeadline = new Date(response.general.submissionDeadline);

        let status: 'Upcoming' | 'Ongoing' | 'Ended';
        if (response.status === 'Ended' || response.status === 'Cancelled' || submissionDeadline < now) {
          status = 'Ended';
        } else if (startTime > now) {
          status = 'Upcoming';
        } else {
          status = 'Ongoing';
        }

        // Transform to card data format
        const cardData: HackathonCardData = {
          id: response.id,
          name: response.general.name,
          tagline: response.description,
          category: response.general.category,
          status,
          poster: response.general.poster,
          prizePool: response.general.prizePool,
          prizeAsset: response.general.prizeAsset,
          startTime: response.general.startTime,
          submissionDeadline: response.general.submissionDeadline,
          tags: response.general.tags,
          venue: response.general.venue === 'Online' ? 'Online' : response.general.venueLocation,
          organizationName: '', // Will need to fetch separately or include in response
          organizationLogo: '',
          builderCount: response.builders?.length || 0,
          projectCount: response.projects?.length || 0,
        };

        setHackathon(cardData);
      } catch (err) {
        console.error('Failed to fetch hackathon:', err);
        setError(err instanceof Error ? err.message : 'Failed to load hackathon');
      } finally {
        setIsLoading(false);
      }
    }

    fetchHackathon();
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#4D4D4D] mx-auto mb-4" />
          <p className="text-sm text-[#4D4D4D]">Loading hackathon...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !hackathon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mx-auto">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {error || 'Hackathon Not Found'}
          </h1>
          <button
            onClick={() => router.push('/hackathon')}
            className="text-[#1A1A1A] hover:underline"
          >
            Back to Hackathons
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = statusStyles[hackathon.status] || statusStyles.Upcoming;
  const isActive = hackathon.status !== 'Ended';

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Header with back button */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/hackathon')}
            className="flex items-center gap-2 text-white bg-black px-3 py-1 rounded-xl cursor-pointer hover:bg-black/80 transition-colors text-sm"
          >
            Back
          </button>
        </div>
      </header>

      {/* Main Content — 5/7 Column Layout matching events detail */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ── Left Column — Banner, Organizer, Builders, Tags ── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Hackathon Banner */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
              {hackathon.poster ? (
                <img
                  src={hackathon.poster}
                  alt={hackathon.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700">
                  <span className="text-4xl font-bold text-white/20">{hackathon.name}</span>
                </div>
              )}
            </div>

            {/* Organized By */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <h3 className="text-sm font-semibold text-[#4D4D4D] mb-4">Organized By</h3>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {hackathon.organizationLogo ? (
                    <img
                      src={hackathon.organizationLogo}
                      alt={hackathon.organizationName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-[#4D4D4D]">
                      {hackathon.organizationName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1A1A1A]">{hackathon.organizationName}</p>
                  <p className="text-xs text-[#4D4D4D]">Verified Organization</p>
                </div>
              </div>
            </div>

            {/* Builders Section */}
            {hackathon.builderCount > 0 && (
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">
                  {hackathon.builderCount} Builders
                </h3>
                <div className="flex -space-x-2 mb-4">
                  {Array.from({ length: Math.min(hackathon.builderCount, 8) }).map((_, i) => (
                    <div
                      key={i}
                      className="relative w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center"
                    >
                      <span className="text-[10px] font-semibold text-[#4D4D4D]">
                        {String.fromCharCode(65 + i)}
                      </span>
                    </div>
                  ))}
                  {hackathon.builderCount > 8 && (
                    <div className="relative w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-semibold text-[#4D4D4D]">
                        +{hackathon.builderCount - 8}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags & Actions */}
            <div className="space-y-4">
              {hackathon.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hackathon.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
                    >
                      #{tag.replace(/\s+/g, '')}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-[#4D4D4D]">
                <button className="hover:text-[#1A1A1A] transition-colors">
                  Contact the Host
                </button>
                <button className="hover:text-[#1A1A1A] transition-colors flex items-center gap-1">
                  <Flag className="w-3 h-3" />
                  Report Hackathon
                </button>
              </div>
            </div>
          </div>

          {/* ── Right Column — Title, Status, Prize, Timeline, Venue, CTA, About ── */}
          <div className="lg:col-span-7 space-y-8">
            {/* Title and Status */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1A1A1A] mb-4 -tracking-tight leading-tight">
                {hackathon.name}
              </h1>

              <div className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg ${statusConfig.bg}`}>
                <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                <span className={`text-sm font-semibold ${statusConfig.text}`}>
                  {hackathon.status === 'Upcoming' ? 'Registration Open' : hackathon.status === 'Ongoing' ? 'Ongoing' : 'Ended'}
                </span>
              </div>
            </div>

            {/* Prize Pool */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Trophy className="w-6 h-6 text-[#4D4D4D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-1">Prize Pool</p>
                  <p className="text-2xl font-bold text-[#1A1A1A]">
                    {formatPrize(hackathon.prizePool)} {hackathon.prizeAsset}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Calendar className="w-6 h-6 text-[#4D4D4D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                    {formatDate(hackathon.startTime)}
                  </p>
                  <p className="text-sm text-[#4D4D4D]">
                    Deadline: {formatDate(hackathon.submissionDeadline)}
                  </p>
                </div>
              </div>
            </div>

            {/* Venue */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#4D4D4D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{hackathon.venue}</p>
                  <p className="text-sm text-[#4D4D4D]">
                    {hackathon.venue === 'Online' ? 'Virtual event — join from anywhere' : hackathon.venue}
                  </p>
                </div>
              </div>
            </div>

            {/* Join Button */}
            <button
              disabled={!isActive}
              className={`w-full py-4 px-6 rounded-xl text-base font-semibold transition-all ${
                !isActive
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#8B4513] text-white hover:bg-[#6F3410] shadow-sm hover:shadow-md'
              }`}
            >
              {!isActive ? 'Hackathon Ended' : 'Join Hackathon'}
            </button>

            {/* About */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">About this Hackathon</h2>
              <div className="prose prose-sm max-w-none text-[#4D4D4D] leading-relaxed space-y-4">
                <p>{hackathon.tagline}</p>
                <p>
                  This hackathon brings together builders from across the Stellar ecosystem to create
                  innovative solutions in the <strong>{hackathon.category}</strong> space. Whether
                  you&apos;re a seasoned Stellar developer or just getting started with Soroban, this
                  is your chance to build something impactful.
                </p>

                <h3 className="text-[#1A1A1A] text-base font-semibold mt-6">Prizes</h3>
                <div className="space-y-2 not-prose">
                  {[
                    { place: '1st Place', pct: 50 },
                    { place: '2nd Place', pct: 30 },
                    { place: '3rd Place', pct: 20 },
                  ].map((p) => (
                    <div
                      key={p.place}
                      className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-5 py-3.5"
                    >
                      <span className="text-sm font-medium text-[#1A1A1A]">{p.place}</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        {formatPrize(Math.round(hackathon.prizePool * (p.pct / 100)))} {hackathon.prizeAsset}
                      </span>
                    </div>
                  ))}
                </div>

                <h3 className="text-[#1A1A1A] text-base font-semibold mt-6">Rules &amp; Eligibility</h3>
                <ul>
                  <li>Open to all developers worldwide</li>
                  <li>Projects must be built on Stellar or Soroban</li>
                  <li>Teams of 1–5 members</li>
                  <li>All code must be original work created during the hackathon period</li>
                </ul>

                <h3 className="text-[#1A1A1A] text-base font-semibold mt-6">Schedule</h3>
                <ul>
                  <li><strong>Kickoff:</strong> {formatDate(hackathon.startTime)}</li>
                  <li><strong>Submission Deadline:</strong> {formatDate(hackathon.submissionDeadline)}</li>
                  <li><strong>Judging Period:</strong> 2 weeks after deadline</li>
                  <li><strong>Winners Announced:</strong> 3 weeks after deadline</li>
                </ul>

                <h3 className="text-[#1A1A1A] text-base font-semibold mt-6">Build Resources</h3>
                <div className="not-prose space-y-2">
                  {[
                    { label: 'Soroban Documentation', icon: <BookOpen className="h-4 w-4" />, href: '#' },
                    { label: 'Stellar Laboratory', icon: <Code className="h-4 w-4" />, href: '#' },
                    { label: 'Horizon API Reference', icon: <Globe className="h-4 w-4" />, href: '#' },
                    { label: 'Freighter Wallet', icon: <Wallet className="h-4 w-4" />, href: '#' },
                  ].map((res) => (
                    <a
                      key={res.label}
                      href={res.href}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#4D4D4D] transition-colors hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
                    >
                      <span className="text-[#999]">{res.icon}</span>
                      {res.label}
                      <ExternalLink className="ml-auto h-3 w-3 text-[#999]" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
