'use client';

import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  FolderOpen,
  ArrowUpRight,
} from 'lucide-react';
import type { HackathonCardData } from './mockData';

/* ── Status badge color map ── */
const statusStyles: Record<HackathonCardData['status'], string> = {
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
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatPrize(amount: number) {
  if (amount >= 1000) return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  return amount.toString();
}

export default function HackathonCard({ hackathon }: { hackathon: HackathonCardData }) {
  const gradient = posterGradients[hackathon.name.charCodeAt(0) % posterGradients.length];

  return (
    <Link
      href={`/hackathon/${hackathon.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
    >
      {/* ── Poster area ── */}
      <div className={`relative h-[160px] bg-gradient-to-br ${gradient} p-5`}>
        {/* Status badge */}
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[hackathon.status]}`}
        >
          {hackathon.status}
        </span>

        {/* Org name overlay */}
        <div className="absolute bottom-4 left-5 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-[11px] font-bold text-white backdrop-blur-sm">
            {hackathon.organizationName.charAt(0)}
          </div>
          <span className="text-xs font-medium text-white/90">{hackathon.organizationName}</span>
        </div>

        {/* Arrow on hover */}
        <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/0 text-white/0 transition-all duration-300 group-hover:bg-white/20 group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category */}
        <span className="mb-2 w-fit rounded-full bg-[var(--bg-muted)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--text-secondary)]">
          {hackathon.category}
        </span>

        {/* Title */}
        <h3
          className="mb-1 text-[17px] font-semibold text-[var(--text)] leading-snug"
          style={{ letterSpacing: '-0.02em' }}
        >
          {hackathon.name}
        </h3>
        <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-[var(--text-muted)]">
          {hackathon.tagline}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
          {hackathon.tags.length > 3 && (
            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
              +{hackathon.tags.length - 3}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Divider */}
        <div className="border-t border-[var(--border)] pt-4" />

        {/* Meta row */}
        <div className="grid grid-cols-2 gap-y-2.5 text-[12px] text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span className="font-semibold text-[var(--text)]">
              {formatPrize(hackathon.prizePool)} {hackathon.prizeAsset}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span>
              {formatDate(hackathon.startTime)} – {formatDate(hackathon.submissionDeadline)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span>{hackathon.venue}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {hackathon.builderCount > 0 ? (
              <>
                <Users className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                <span>{hackathon.builderCount} builders</span>
              </>
            ) : hackathon.projectCount > 0 ? (
              <>
                <FolderOpen className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                <span>{hackathon.projectCount} projects</span>
              </>
            ) : (
              <>
                <Users className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                <span>Registration open</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
