'use client';

import Link from 'next/link';
import {
  Calendar,
  Eye,
  Users,
  ArrowRight,
  Globe,
  Play
} from 'lucide-react';
import type { BuildCategory, BuildStatus } from '@/src/builds/types/build.types';
import { getProxiedImageUrl } from '@/src/shared/utils/image-proxy';

/* ── Category colors (matching HackathonCard pattern) ── */
const getCategoryColor = (category: BuildCategory) => {
  switch (category) {
    case 'DeFi': return 'bg-[#E5FFE5]';
    case 'NFT & Gaming': return 'bg-[#FFE5E5]';
    case 'Payments': return 'bg-[#E5F0FF]';
    case 'Infrastructure': return 'bg-[#F0E5FF]';
    case 'Developer Tools': return 'bg-[#FFE8EA]';
    case 'Social Impact': return 'bg-[#E5F9F7]';
    case 'Other': return 'bg-[#F5F5F5]';
    default: return 'bg-[#F5F5F5]';
  }
};

/* ── Gradient palettes for featured builds ── */
const logoGradients = [
  'from-violet-600 to-indigo-700',
  'from-sky-600 to-cyan-700',
  'from-emerald-600 to-teal-700',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-fuchsia-600 to-purple-700',
];

/* ── Status badge colors ── */
const statusStyles: Record<BuildStatus, string> = {
  Draft: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Archived: 'bg-gray-100 text-gray-500 border-gray-200',
};

/* ── Build card data interface ── */
export interface BuildCardData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: BuildCategory;
  status: BuildStatus;
  logo: string;
  techStack: string[];
  website: string;
  liveDemo: string;
  publishedAt: string;
  viewCount: number;
  teamSize: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatViews(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k`;
  return count.toString();
}

/* ═══════════════════════════════════════════════════════
   Default Export — switches between Featured and Regular
   ═══════════════════════════════════════════════════════ */
interface BuildCardProps {
  build: BuildCardData;
  featured?: boolean;
  editable?: boolean; // If true, links to edit page instead of view page
}

export default function BuildCard({ build, featured = false, editable = false }: BuildCardProps) {
  if (featured) {
    return <FeaturedBuildCard build={build} editable={editable} />;
  }
  return <RegularBuildCard build={build} editable={editable} />;
}

/* ═══════════════════════════════════════════════════════
   Featured Card — large hero card for bento grid
   ═══════════════════════════════════════════════════════ */
function FeaturedBuildCard({ build, editable = false }: { build: BuildCardData; editable?: boolean }) {
  const gradient = logoGradients[build.name.charCodeAt(0) % logoGradients.length];
  const href = editable ? `/builds/edit/${build.id}` : `/builds/${build.slug}`;

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-3xl min-h-[400px] lg:min-h-[520px] cursor-pointer flex"
    >
      {/* Background: logo image if available, otherwise gradient */}
      {build.logo ? (
        <>
          <div className="absolute inset-0 flex items-center justify-center bg-[#F5F5F5]">
            <img
              src={getProxiedImageUrl(build.logo)}
              alt={`${build.name} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.className = `absolute inset-0 bg-gradient-to-br ${gradient}`;
                }
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        </>
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
        </>
      )}

      <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white flex-1">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusStyles[build.status]}`}>
              {build.status}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm backdrop-blur-sm">
              {build.category}
            </span>
          </div>
          <h3 className="text-3xl lg:text-4xl font-semibold leading-tight mb-4">
            {build.name}
          </h3>
          <p className="text-white/70 text-lg max-w-md">
            {build.tagline}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap gap-6 mb-6 text-white/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Published {formatDate(build.publishedAt)}</span>
            </div>
            {build.viewCount > 0 && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{formatViews(build.viewCount)} views</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{build.teamSize} {build.teamSize === 1 ? 'member' : 'members'}</span>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {build.techStack.slice(0, 4).map((tech, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-white/20 text-white text-xs rounded-md backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
            {build.techStack.length > 4 && (
              <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-md backdrop-blur-sm">
                +{build.techStack.length - 4} more
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-medium group-hover:gap-3 transition-all duration-200">
            View Build
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════
   Regular Card — compact card with logo thumbnail
   ═══════════════════════════════════════════════════════ */
function RegularBuildCard({ build, editable = false }: { build: BuildCardData; editable?: boolean }) {
  const href = editable ? `/builds/edit/${build.id}` : `/builds/${build.slug}`;

  return (
    <Link
      href={href}
      className="group rounded-3xl overflow-hidden bg-white border border-[#E5E5E5] hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Logo/header section */}
      <div className={`relative h-32 ${getCategoryColor(build.category)} flex items-center justify-center`}>
        {build.logo ? (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-[#E5E5E5] flex items-center justify-center">
            <img
              src={getProxiedImageUrl(build.logo)}
              alt={`${build.name} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center text-gray-400">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9l-5 4.87 1.18 6.88L12 17.27l-6.18 3.48L7 14.87 2 10l6.91-.74L12 2z"/>
                      </svg>
                    </div>
                  `;
                }
              }}
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-center text-gray-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9l-5 4.87 1.18 6.88L12 17.27l-6.18 3.48L7 14.87 2 10l6.91-.74L12 2z"/>
            </svg>
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[build.status]}`}>
            {build.status}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block px-2 py-0.5 rounded-full bg-foreground/10 text-foreground text-xs font-medium">
              {build.category}
            </span>
            <div className="flex items-center gap-2 text-xs text-foreground/60">
              {build.viewCount > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatViews(build.viewCount)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {build.teamSize}
              </span>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-foreground leading-snug line-clamp-2">
            {build.name}
          </h4>
          <p className="mt-1 text-sm text-foreground/60 line-clamp-2">
            {build.tagline}
          </p>
        </div>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {build.techStack.slice(0, 3).map((tech, index) => (
            <span 
              key={index}
              className="px-2 py-0.5 bg-foreground/5 text-foreground/70 text-xs rounded"
            >
              {tech}
            </span>
          ))}
          {build.techStack.length > 3 && (
            <span className="px-2 py-0.5 bg-foreground/5 text-foreground/70 text-xs rounded">
              +{build.techStack.length - 3}
            </span>
          )}
        </div>

        {/* Links and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {build.liveDemo && (
              <span className="inline-flex items-center gap-1 text-xs text-foreground/60">
                <Play className="w-3 h-3" />
                Demo
              </span>
            )}
            {build.website && (
              <span className="inline-flex items-center gap-1 text-xs text-foreground/60">
                <Globe className="w-3 h-3" />
                Site
              </span>
            )}
          </div>
          <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}