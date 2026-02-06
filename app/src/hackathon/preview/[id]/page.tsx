'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  Globe,
  ExternalLink,
  BookOpen,
  Code,
  Wallet,
  Flag,
  X,
} from 'lucide-react';
import type { Hackathon } from '../../types/hackathon.types';

/**
 * Preview Page for Hackathon
 * Route: /hackathon/preview/[id]
 *
 * Shows a read-only preview of how the hackathon will appear to public users.
 * Mirrors the layout of /hackathon/[id] exactly.
 */

/* ── Status badge colors ── */
const statusStyles: Record<string, { bg: string; dot: string; text: string }> = {
  Draft: { bg: 'bg-gray-100 border-gray-200', dot: 'bg-gray-400', text: 'text-gray-500' },
  'Under Review': { bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500', text: 'text-amber-700' },
  Active: { bg: 'bg-green-50 border-green-200', dot: 'bg-green-500', text: 'text-green-700' },
  Ongoing: { bg: 'bg-green-50 border-green-200', dot: 'bg-green-500', text: 'text-green-700' },
  Upcoming: { bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500', text: 'text-blue-700' },
  Ended: { bg: 'bg-gray-100 border-gray-200', dot: 'bg-gray-400', text: 'text-gray-500' },
  Cancelled: { bg: 'bg-red-50 border-red-200', dot: 'bg-red-500', text: 'text-red-600' },
  Rejected: { bg: 'bg-red-50 border-red-200', dot: 'bg-red-500', text: 'text-red-600' },
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

/* ── Poster gradient palettes ── */
const posterGradients = [
  'from-violet-600 to-indigo-700',
  'from-sky-600 to-cyan-700',
  'from-emerald-600 to-teal-700',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-fuchsia-600 to-purple-700',
];

function formatDate(iso: string) {
  if (!iso) return 'TBD';
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

export default function HackathonPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const hackathonId = params.id as string;

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`hackathon-preview-${hackathonId}`);
      if (stored) {
        setHackathon(JSON.parse(stored));
      } else {
        setHackathon(getEmptyHackathonData(hackathonId));
      }
    }
  }, [hackathonId]);

  const handleClose = () => {
    router.push(`/hackathon/manage/${hackathonId}`);
  };

  if (!hackathon) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FCFCFC]">
        <p className="text-[#4D4D4D]">Loading preview...</p>
      </div>
    );
  }

  const g = hackathon.general;
  const gradient = posterGradients[(g.name || 'Default').charCodeAt(0) % posterGradients.length];
  const statusConfig = statusStyles[hackathon.status] || statusStyles.Draft;
  const isActive = hackathon.status !== 'Ended' && hackathon.status !== 'Cancelled';

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Preview Banner */}
      <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <span className="text-sm">👁</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">Preview Mode</p>
              <p className="text-xs text-amber-700">This is how your hackathon will appear to the public</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex h-9 items-center gap-2 rounded-full border border-amber-200 bg-white px-4 text-sm font-medium text-amber-900 transition-all hover:bg-amber-50"
          >
            <X className="h-4 w-4" />
            Close Preview
          </button>
        </div>
      </div>

      {/* Header with back button */}
      <header className="sticky top-[57px] z-40 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-white bg-black px-3 py-1 rounded-xl cursor-pointer hover:bg-black/80 transition-colors text-sm"
          >
            Back to Editor
          </button>
        </div>
      </header>

      {/* Main Content — 5/7 Column Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ── Left Column — Banner, Organizer, Builders, Tags ── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Hackathon Banner */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
              {g.poster ? (
                <img
                  src={g.poster}
                  alt={g.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient}`}>
                  <span className="text-4xl font-bold text-white/20">{g.name || 'Preview'}</span>
                </div>
              )}
            </div>

            {/* Organized By */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <h3 className="text-sm font-semibold text-[#4D4D4D] mb-4">Organized By</h3>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#4D4D4D]">O</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1A1A1A]">Your Organization</p>
                  <p className="text-xs text-[#4D4D4D]">Verified Organization</p>
                </div>
              </div>
              {g.adminContact && (
                <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
                  <p className="text-xs text-[#4D4D4D] mb-1">Contact</p>
                  <p className="text-sm text-[#4D4D4D]">{g.adminContact}</p>
                </div>
              )}
            </div>

            {/* Builders Section */}
            {hackathon.builders.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">
                  {hackathon.builders.length} Builders
                </h3>
                <div className="flex -space-x-2 mb-4">
                  {hackathon.builders.slice(0, 8).map((_, i) => (
                    <div
                      key={i}
                      className="relative w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center"
                    >
                      <span className="text-[10px] font-semibold text-[#4D4D4D]">
                        {String.fromCharCode(65 + i)}
                      </span>
                    </div>
                  ))}
                  {hackathon.builders.length > 8 && (
                    <div className="relative w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-semibold text-[#4D4D4D]">
                        +{hackathon.builders.length - 8}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags & Actions */}
            <div className="space-y-4">
              {g.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {g.tags.map((tag) => (
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
                {g.name || 'Untitled Hackathon'}
              </h1>

              <div className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg ${statusConfig.bg}`}>
                <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                <span className={`text-sm font-semibold ${statusConfig.text}`}>
                  {hackathon.status}
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
                    {g.prizePool > 0 ? `${formatPrize(g.prizePool)} ${g.prizeAsset}` : '—'}
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
                    {formatDate(g.startTime)}
                  </p>
                  <p className="text-sm text-[#4D4D4D]">
                    Deadline: {formatDate(g.submissionDeadline)}
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
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                    {g.venue === 'Online' ? 'Online' : g.venueLocation || 'In-Person'}
                  </p>
                  <p className="text-sm text-[#4D4D4D]">
                    {g.venue === 'Online' ? 'Virtual event — join from anywhere' : g.venueLocation || g.venue}
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
                {hackathon.description ? (
                  <p className="whitespace-pre-wrap">{hackathon.description}</p>
                ) : (
                  <p className="italic">No description provided yet.</p>
                )}

                {g.category && (
                  <p>
                    This hackathon focuses on the <strong>{g.category}</strong> space within the
                    Stellar ecosystem.
                  </p>
                )}

                {/* Prizes */}
                {g.prizePool > 0 && (
                  <>
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
                            {formatPrize(Math.round(g.prizePool * (p.pct / 100)))} {g.prizeAsset}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Tracks */}
                {hackathon.tracks.length > 0 && (
                  <>
                    <h3 className="text-[#1A1A1A] text-base font-semibold mt-6">Tracks</h3>
                    <div className="space-y-2 not-prose">
                      {hackathon.tracks.map((track) => (
                        <div
                          key={track.id}
                          className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-5 py-3.5"
                        >
                          <p className="text-sm font-medium text-[#1A1A1A]">{track.name || 'Untitled Track'}</p>
                          {track.description && (
                            <p className="mt-1 text-xs text-[#4D4D4D]">{track.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Submission Requirements */}
                {g.submissionRequirements && (
                  <>
                    <h3 className="text-[#1A1A1A] text-base font-semibold mt-6">Submission Requirements</h3>
                    <p className="whitespace-pre-wrap">{g.submissionRequirements}</p>
                  </>
                )}

                {/* Schedule */}
                <h3 className="text-[#1A1A1A] text-base font-semibold mt-6">Schedule</h3>
                <ul>
                  <li><strong>Kickoff:</strong> {formatDate(g.startTime)}</li>
                  <li><strong>Submission Deadline:</strong> {formatDate(g.submissionDeadline)}</li>
                  {g.preRegEndTime && (
                    <li><strong>Pre-registration Ends:</strong> {formatDate(g.preRegEndTime)}</li>
                  )}
                  <li><strong>Judging Period:</strong> 2 weeks after deadline</li>
                  <li><strong>Winners Announced:</strong> 3 weeks after deadline</li>
                </ul>

                {/* Build Resources */}
                <h3 className="text-[#1A1A1A] text-base font-semibold mt-6">Build Resources</h3>
                <div className="not-prose space-y-2">
                  {[
                    { label: 'Soroban Documentation', icon: <BookOpen className="h-4 w-4" />, href: 'https://soroban.stellar.org' },
                    { label: 'Stellar Laboratory', icon: <Code className="h-4 w-4" />, href: 'https://laboratory.stellar.org' },
                    { label: 'Horizon API Reference', icon: <Globe className="h-4 w-4" />, href: 'https://horizon.stellar.org' },
                    { label: 'Freighter Wallet', icon: <Wallet className="h-4 w-4" />, href: 'https://freighter.app' },
                  ].map((res) => (
                    <a
                      key={res.label}
                      href={res.href}
                      target="_blank"
                      rel="noopener noreferrer"
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

// Helper function to get empty hackathon data structure
function getEmptyHackathonData(id: string): Hackathon {
  const now = new Date().toISOString();
  return {
    id,
    organizationId: 'org-placeholder',
    status: 'Draft',
    general: {
      name: '',
      category: '',
      visibility: 'Public',
      poster: '',
      prizePool: 0,
      prizeAsset: 'USDC',
      tags: [],
      startTime: '',
      preRegEndTime: '',
      submissionDeadline: '',
      venue: 'Online',
      venueLocation: '',
      submissionRequirements: '',
      adminContact: '',
      customQuestions: [],
    },
    tracks: [],
    description: '',
    admins: [],
    prizes: [],
    judges: [],
    builders: [],
    projects: [],
    createdAt: now,
    updatedAt: now,
  };
}
