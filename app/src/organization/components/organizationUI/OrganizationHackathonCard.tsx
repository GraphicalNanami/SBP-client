'use client';

import Link from 'next/link';
import { Calendar, Trophy, MapPin, ArrowRight } from 'lucide-react';
import type { Hackathon } from '@/src/hackathon/types/hackathon.types';

interface OrganizationHackathonCardProps {
  hackathon: Hackathon;
}

/* ── Status badge styling ── */
const statusStyles: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-600 border-gray-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Ended: 'bg-gray-100 text-gray-500 border-gray-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
  Rejected: 'bg-red-50 text-red-600 border-red-200',
};

/* ── Format date helper ── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ── Format prize helper ── */
function formatPrize(amount: number) {
  if (amount >= 1000) return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  return amount.toString();
}

export function OrganizationHackathonCard({ hackathon }: OrganizationHackathonCardProps) {
  return (
    <Link
      href={`/hackathon/manage/${hackathon.id}`}
      className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition-all duration-200 hover:shadow-md hover:border-[var(--border-hover)]"
    >
      <div className="p-5">
        {/* Header with status */}
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
              statusStyles[hackathon.status] || statusStyles.Draft
            }`}
          >
            {hackathon.status}
          </span>
          <ArrowRight className="h-4 w-4 text-[var(--text-muted)] transition-transform group-hover:translate-x-1" />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-[var(--text)] line-clamp-1">
          {hackathon.general.name}
        </h3>

        {/* Category */}
        <span className="mb-3 inline-block rounded-full bg-[var(--bg-muted)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--text-secondary)]">
          {hackathon.general.category}
        </span>

        {/* Meta information */}
        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
          {/* Prize pool */}
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[var(--text-muted)]" />
            <span>
              {formatPrize(hackathon.general.prizePool)} {hackathon.general.prizeAsset}
            </span>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[var(--text-muted)]" />
            <span>
              {formatDate(hackathon.general.startTime)} - {formatDate(hackathon.general.submissionDeadline)}
            </span>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--text-muted)]" />
            <span>{hackathon.general.venue || 'Online'}</span>
          </div>
        </div>

        {/* Stats footer */}
        {(hackathon.builders?.length > 0 || hackathon.projects?.length > 0) && (
          <div className="mt-4 flex items-center gap-4 border-t border-[var(--border)] pt-3 text-xs text-[var(--text-muted)]">
            {hackathon.builders?.length > 0 && (
              <span>{hackathon.builders.length} Builders</span>
            )}
            {hackathon.projects?.length > 0 && (
              <span>{hackathon.projects.length} Projects</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
