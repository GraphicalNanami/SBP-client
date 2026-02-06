'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
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
  X,
} from 'lucide-react';
import type { Hackathon } from '../../types/hackathon.types';

/**
 * Preview Page for Hackathon
 * Route: /hackathon/preview/[id]
 * 
 * Shows a read-only preview of how the hackathon will appear to public users.
 * Used by organizers to review their draft before publishing.
 */

/* ── Status badge colors ── */
const statusStyles: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-600 border-gray-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Ongoing: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Ended: 'bg-gray-100 text-gray-500 border-gray-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
  Rejected: 'bg-red-50 text-red-600 border-red-200',
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
    // Load hackathon data from sessionStorage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`hackathon-preview-${hackathonId}`);
      if (stored) {
        setHackathon(JSON.parse(stored));
      } else {
        // Fallback to empty data if not found
        setHackathon(getEmptyHackathonData(hackathonId));
      }
    }
  }, [hackathonId]);

  const handleClose = () => {
    router.push(`/hackathon/manage/${hackathonId}`);
  };

  if (!hackathon) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <p className="text-[var(--text-muted)]">Loading preview...</p>
      </div>
    );
  }

  const g = hackathon.general;
  const gradient = posterGradients[(g.name || 'Default').charCodeAt(0) % posterGradients.length];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Preview Banner */}
      <div className="sticky top-0 z-50 border-b border-[var(--border)] bg-amber-50 px-6 py-3">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <span className="text-sm">👁️</span>
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

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Editor
          </button>
          {hackathon.status !== 'Ended' && (
            <button
              disabled
              className="flex h-10 items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-medium text-[var(--brand-fg)] opacity-50 cursor-not-allowed"
            >
              <Rocket className="h-4 w-4" />
              Join Hackathon
            </button>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className={`bg-gradient-to-br ${gradient}`}>
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-sm font-bold text-white backdrop-blur-sm">
              O
            </div>
            <span className="text-sm font-medium text-white/80">Your Organization</span>
          </div>

          <h1
            className="mb-4 text-3xl font-bold text-white md:text-5xl"
            style={{ letterSpacing: '-0.04em', lineHeight: '1.1', fontFamily: 'var(--font-onest)' }}
          >
            {g.name || 'Untitled Hackathon'}
          </h1>
          <p className="mb-6 max-w-xl text-base text-white/70 md:text-lg">
            {g.category || 'No category selected yet'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                statusStyles[hackathon.status] || statusStyles.Draft
              }`}
            >
              {hackathon.status}
            </span>
            {g.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Key Info Bar ── */}
      <div className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 px-6 py-6 sm:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Trophy className="h-3.5 w-3.5" />
              Prize Pool
            </div>
            <p className="mt-1 text-lg font-semibold text-[var(--text)]">
              {g.prizePool > 0 ? `${formatPrize(g.prizePool)} ${g.prizeAsset}` : '—'}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Calendar className="h-3.5 w-3.5" />
              Timeline
            </div>
            <p className="mt-1 text-sm font-medium text-[var(--text)]">
              {formatDate(g.startTime)}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Deadline: {formatDate(g.submissionDeadline)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <MapPin className="h-3.5 w-3.5" />
              Venue
            </div>
            <p className="mt-1 text-sm font-medium text-[var(--text)]">
              {g.venue === 'Online' ? 'Online' : g.venueLocation || 'In-Person'}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Users className="h-3.5 w-3.5" />
              Builders
            </div>
            <p className="mt-1 text-lg font-semibold text-[var(--text)]">
              {hackathon.builders.length > 0 ? hackathon.builders.length : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Description */}
            <section className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
                About this Hackathon
              </h2>
              <div className="prose prose-sm max-w-none text-[var(--text-secondary)] leading-relaxed">
                {hackathon.description ? (
                  <p className="whitespace-pre-wrap">{hackathon.description}</p>
                ) : (
                  <p className="italic text-[var(--text-muted)]">No description provided yet. Add one in the Description tab.</p>
                )}
              </div>
            </section>

            {/* Prizes */}
            <section className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
                Prizes
              </h2>
              {g.prizePool > 0 ? (
                <div className="space-y-3">
                  {[
                    { place: '1st Place', pct: 50 },
                    { place: '2nd Place', pct: 30 },
                    { place: '3rd Place', pct: 20 },
                  ].map((p) => (
                    <div
                      key={p.place}
                      className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-5 py-3.5"
                    >
                      <span className="text-sm font-medium text-[var(--text)]">{p.place}</span>
                      <span className="text-sm font-semibold text-[var(--text)]">
                        {formatPrize(Math.round(g.prizePool * (p.pct / 100)))} {g.prizeAsset}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-[var(--text-muted)]">
                  Prize pool not set yet. Add prize information in the General tab.
                </p>
              )}
            </section>

            {/* Tracks */}
            {hackathon.tracks.length > 0 ? (
              <section className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
                  Tracks
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {hackathon.tracks.map((track) => (
                    <div
                      key={track.id}
                      className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-4"
                    >
                      <h3 className="mb-1 text-sm font-semibold text-[var(--text)]">
                        {track.name || 'Untitled Track'}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        {track.description || 'No description provided'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
                  Tracks
                </h2>
                <p className="text-sm italic text-[var(--text-muted)]">
                  No tracks added yet. Add tracks in the Tracks tab.
                </p>
              </section>
            )}

            {/* Submission Requirements */}
            {g.submissionRequirements && (
              <section className="rounded-2xl border border-[var(--border)] bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
                  Submission Requirements
                </h2>
                <div className="prose prose-sm max-w-none text-[var(--text-secondary)] leading-relaxed">
                  <p className="whitespace-pre-wrap">{g.submissionRequirements}</p>
                </div>
              </section>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Organizer */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--text)]">Organizer</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-muted)] text-sm font-bold text-[var(--text-secondary)]">
                  O
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">Your Organization</p>
                  <p className="text-xs text-[var(--text-muted)]">Verified Organization</p>
                </div>
              </div>
              {g.adminContact && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--text-muted)] mb-1">Contact</p>
                  <p className="text-sm text-[var(--text-secondary)]">{g.adminContact}</p>
                </div>
              )}
            </div>

            {/* Build Resources */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--text)]">Build Resources</h3>
              <div className="space-y-2">
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
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
                  >
                    <span className="text-[var(--text-muted)]">{res.icon}</span>
                    {res.label}
                    <ExternalLink className="ml-auto h-3 w-3 text-[var(--text-muted)]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Category */}
            {(g.category || g.tags.length > 0) && (
              <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
                {g.category && (
                  <>
                    <h3 className="mb-3 text-sm font-semibold text-[var(--text)]">Category</h3>
                    <span className="inline-block rounded-full bg-[var(--bg-muted)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                      {g.category}
                    </span>
                  </>
                )}

                {g.tags.length > 0 && (
                  <>
                    <h3 className="mb-3 mt-5 text-sm font-semibold text-[var(--text)]">Tags</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {g.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--text-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 text-xs text-[var(--text-muted)]">
          <span>© {new Date().getFullYear()} Stellar Builder Platform</span>
          <span>Terms · Privacy</span>
        </div>
      </footer>
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
