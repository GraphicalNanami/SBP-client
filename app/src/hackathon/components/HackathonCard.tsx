'use client';

import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  ArrowRight,
} from 'lucide-react';
import type { HackathonCardData } from './mockData';

/* ── Pastel backgrounds for categories (matching EventCard pattern) ── */
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Soroban Smart Contracts': return 'bg-[#FFE5E5]';
    case 'Payments & Remittances': return 'bg-[#E5F0FF]';
    case 'Anchors & On/Off Ramps': return 'bg-[#F0E5FF]';
    case 'DeFi on Stellar': return 'bg-[#E5FFE5]';
    case 'Real World Assets': return 'bg-[#FFF5E5]';
    case 'Cross-border Payments': return 'bg-[#E5F9F7]';
    case 'Developer Tooling': return 'bg-[#FFE8EA]';
    case 'Wallets & Identity': return 'bg-[#F0F0FF]';
    default: return 'bg-[#F5F5F5]';
  }
};

/* ── Poster gradient palettes (for featured card) ── */
const posterGradients = [
  'from-violet-600 to-indigo-700',
  'from-sky-600 to-cyan-700',
  'from-emerald-600 to-teal-700',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-fuchsia-600 to-purple-700',
];

/* ── Status badge colors ── */
const statusStyles: Record<HackathonCardData['status'], string> = {
  Upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  Ongoing: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Ended: 'bg-gray-100 text-gray-500 border-gray-200',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatPrize(amount: number) {
  if (amount >= 1000) return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  return amount.toString();
}

/* ═══════════════════════════════════════════════════════
   Default Export — switches between Featured and Regular
   ═══════════════════════════════════════════════════════ */
interface HackathonCardProps {
  hackathon: HackathonCardData;
  featured?: boolean;
}

export default function HackathonCard({ hackathon, featured = false }: HackathonCardProps) {
  if (featured) {
    return <FeaturedHackathonCard hackathon={hackathon} />;
  }
  return <RegularHackathonCard hackathon={hackathon} />;
}

/* ═══════════════════════════════════════════════════════
   Featured Card — large gradient hero card for bento grid
   ═══════════════════════════════════════════════════════ */
function FeaturedHackathonCard({ hackathon }: { hackathon: HackathonCardData }) {
  const gradient = posterGradients[hackathon.name.charCodeAt(0) % posterGradients.length];

  return (
    <Link
      href={`/src/hackathon/${hackathon.id}`}
      className="group relative overflow-hidden rounded-3xl min-h-[400px] lg:min-h-[520px] cursor-pointer flex"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

      <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white flex-1">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusStyles[hackathon.status]}`}>
              {hackathon.status}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm backdrop-blur-sm">
              {hackathon.category}
            </span>
          </div>
          <h3 className="text-3xl lg:text-4xl font-semibold leading-tight mb-4">
            {hackathon.name}
          </h3>
          <p className="text-white/70 text-lg max-w-md">
            {hackathon.tagline}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap gap-6 mb-6 text-white/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formatDate(hackathon.startTime)} — {formatDate(hackathon.submissionDeadline)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{hackathon.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">{formatPrize(hackathon.prizePool)} {hackathon.prizeAsset}</span>
            </div>
            {hackathon.builderCount > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{hackathon.builderCount} builders</span>
              </div>
            )}
          </div>

          <span className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-medium group-hover:gap-3 transition-all duration-200">
            View Details
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════
   Regular Card — pastel compact card for stacked / grid
   ═══════════════════════════════════════════════════════ */
function RegularHackathonCard({ hackathon }: { hackathon: HackathonCardData }) {
  return (
    <Link
      href={`/src/hackathon/${hackathon.id}`}
      className={`group rounded-3xl ${getCategoryColor(hackathon.category)} p-6 flex flex-col justify-between min-h-[240px] hover:shadow-lg transition-all duration-300 cursor-pointer`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-2 py-0.5 rounded-full bg-foreground/10 text-foreground text-xs font-medium">
            {hackathon.category}
          </span>
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyles[hackathon.status]}`}>
            {hackathon.status}
          </span>
        </div>
        <h4 className="text-lg font-semibold text-foreground leading-snug line-clamp-2">
          {hackathon.name}
        </h4>
        <p className="mt-1 text-sm text-foreground/60 line-clamp-1">
          {hackathon.tagline}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-foreground/70">
          <span>{formatDate(hackathon.startTime)}</span>
          <span className="mx-2">·</span>
          <span>{formatPrize(hackathon.prizePool)} {hackathon.prizeAsset}</span>
        </div>
        <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
