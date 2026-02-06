'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  Users,
  FolderOpen,
  Globe,
  ExternalLink,
  Rocket,
  BookOpen,
  Code,
  Wallet,
} from 'lucide-react';
import { MOCK_HACKATHONS } from '../components/mockData';

/* ── Status badge colors ── */
const statusStyles: Record<string, string> = {
  Upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  Ongoing: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Ended: 'bg-gray-100 text-gray-500 border-gray-200',
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
  return new Date(iso).toLocaleDateString('en-US', {
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
  const id = params.id as string;
  const hackathon = MOCK_HACKATHONS.find((h) => h.id === id);

  if (!hackathon) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-lg font-semibold text-[var(--text)]">Hackathon not found</p>
          <Link href="/hackathon" className="text-sm text-[var(--text-muted)] underline">
            ← Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const gradient = posterGradients[hackathon.name.charCodeAt(0) % posterGradients.length];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link
            href="/hackathon"
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hackathons
          </Link>
          {hackathon.status !== 'Ended' && (
            <button className="flex h-10 items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-medium text-[var(--brand-fg)] transition-all hover:opacity-90 active:scale-[0.97]">
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
              {hackathon.organizationName.charAt(0)}
            </div>
            <span className="text-sm font-medium text-white/80">{hackathon.organizationName}</span>
          </div>

          <h1
            className="mb-4 text-3xl font-bold text-white md:text-5xl"
            style={{ letterSpacing: '-0.04em', lineHeight: '1.1', fontFamily: 'var(--font-onest)' }}
          >
            {hackathon.name}
          </h1>
          <p className="mb-6 max-w-xl text-base text-white/70 md:text-lg">{hackathon.tagline}</p>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[hackathon.status]}`}
            >
              {hackathon.status}
            </span>
            {hackathon.tags.map((tag) => (
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
              {formatPrize(hackathon.prizePool)} {hackathon.prizeAsset}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Calendar className="h-3.5 w-3.5" />
              Timeline
            </div>
            <p className="mt-1 text-sm font-medium text-[var(--text)]">
              {formatDate(hackathon.startTime)}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Deadline: {formatDate(hackathon.submissionDeadline)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <MapPin className="h-3.5 w-3.5" />
              Venue
            </div>
            <p className="mt-1 text-sm font-medium text-[var(--text)]">{hackathon.venue}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Users className="h-3.5 w-3.5" />
              Builders
            </div>
            <p className="mt-1 text-lg font-semibold text-[var(--text)]">
              {hackathon.builderCount > 0 ? hackathon.builderCount : '—'}
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
                <p>{hackathon.tagline}</p>
                <p>
                  This hackathon brings together builders from across the Stellar ecosystem to create
                  innovative solutions in the <strong>{hackathon.category}</strong> space. Whether
                  you&apos;re a seasoned Stellar developer or just getting started with Soroban, this
                  is your chance to build something impactful.
                </p>
                <h3 className="text-[var(--text)]">Rules & Eligibility</h3>
                <ul>
                  <li>Open to all developers worldwide</li>
                  <li>Projects must be built on Stellar or Soroban</li>
                  <li>Teams of 1–5 members</li>
                  <li>All code must be original work created during the hackathon period</li>
                </ul>
                <h3 className="text-[var(--text)]">Schedule</h3>
                <ul>
                  <li>
                    <strong>Kickoff:</strong> {formatDate(hackathon.startTime)}
                  </li>
                  <li>
                    <strong>Submission Deadline:</strong> {formatDate(hackathon.submissionDeadline)}
                  </li>
                  <li>
                    <strong>Judging Period:</strong> 2 weeks after deadline
                  </li>
                  <li>
                    <strong>Winners Announced:</strong> 3 weeks after deadline
                  </li>
                </ul>
              </div>
            </section>

            {/* Prizes */}
            <section className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
                Prizes
              </h2>
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
                      {formatPrize(Math.round(hackathon.prizePool * (p.pct / 100)))} {hackathon.prizeAsset}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Tracks */}
            <section className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
                Tracks
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {['Best Soroban dApp', 'Innovation Track', 'Community Impact'].map((track, i) => (
                  <div
                    key={track}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-4"
                  >
                    <h3 className="mb-1 text-sm font-semibold text-[var(--text)]">{track}</h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Build innovative {hackathon.category.toLowerCase()} solutions that push the
                      boundaries of what&apos;s possible on Stellar.
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Organizer */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--text)]">Organizer</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-muted)] text-sm font-bold text-[var(--text-secondary)]">
                  {hackathon.organizationName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{hackathon.organizationName}</p>
                  <p className="text-xs text-[var(--text-muted)]">Verified Organization</p>
                </div>
              </div>
            </div>

            {/* Build Resources */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--text)]">Build Resources</h3>
              <div className="space-y-2">
                {[
                  { label: 'Soroban Documentation', icon: <BookOpen className="h-4 w-4" />, href: '#' },
                  { label: 'Stellar Laboratory', icon: <Code className="h-4 w-4" />, href: '#' },
                  { label: 'Horizon API Reference', icon: <Globe className="h-4 w-4" />, href: '#' },
                  { label: 'Freighter Wallet', icon: <Wallet className="h-4 w-4" />, href: '#' },
                ].map((res) => (
                  <a
                    key={res.label}
                    href={res.href}
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
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h3 className="mb-3 text-sm font-semibold text-[var(--text)]">Category</h3>
              <span className="inline-block rounded-full bg-[var(--bg-muted)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                {hackathon.category}
              </span>

              <h3 className="mb-3 mt-5 text-sm font-semibold text-[var(--text)]">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {hackathon.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
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
