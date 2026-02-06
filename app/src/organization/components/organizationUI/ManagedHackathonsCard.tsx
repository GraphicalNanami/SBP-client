'use client';

import Link from 'next/link';
import { Rocket, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { OrganizationHackathonCard } from './OrganizationHackathonCard';
import type { Hackathon } from '@/src/hackathon/types/hackathon.types';

interface ManagedHackathonsCardProps {
  hackathons: Hackathon[];
  isLoading: boolean;
  error: string | null;
  organizationId: string;
  onRefresh?: () => void;
}

/* ── Card wrapper (matching OrganizationDashboard pattern) ── */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[#E5E5E5] bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}

/* ── Section title (matching OrganizationDashboard pattern) ── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-5 text-[15px] font-semibold text-[#1A1A1A]">{children}</h2>;
}

export function ManagedHackathonsCard({
  hackathons,
  isLoading,
  error,
  organizationId,
  onRefresh,
}: ManagedHackathonsCardProps) {
  return (
    <Card>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SectionTitle>Managed Hackathons</SectionTitle>
          {hackathons.length > 0 && !isLoading && (
            <span className="inline-flex items-center rounded-full bg-[#F5F5F5] px-2.5 py-0.5 text-xs font-medium text-[#4D4D4D]">
              {hackathons.length}
            </span>
          )}
        </div>
        {onRefresh && !isLoading && (
          <button
            onClick={onRefresh}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] text-[#4D4D4D] transition-all hover:border-[#E5E5E5] hover:text-[#1A1A1A]"
            title="Refresh hackathons"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#4D4D4D]" />
          <p className="text-sm text-[#4D4D4D]">Loading hackathons...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Failed to load hackathons</p>
              <p className="mt-1 text-xs text-red-700">{error}</p>
            </div>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-3 flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
            >
              <RefreshCw className="h-3 w-3" />
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && hackathons.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F5F5]">
            <Rocket className="h-8 w-8 text-[#4D4D4D]" />
          </div>
          <h3 className="mb-1 text-base font-semibold text-[#1A1A1A]">No hackathons yet</h3>
          <p className="mb-4 text-center text-sm text-[#4D4D4D]">
            Create your first hackathon to get started
          </p>
          <Link
            href={`/hackathon/manage/new?orgId=${organizationId}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] transition-all hover:border-[#E5E5E5] hover:bg-[#F5F5F5]"
          >
            <Rocket className="h-4 w-4" />
            Create Hackathon
          </Link>
        </div>
      )}

      {/* Populated State - List of Hackathons */}
      {!isLoading && !error && hackathons.length > 0 && (
        <div className="space-y-4">
          {hackathons.map((hackathon) => (
            <OrganizationHackathonCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      )}
    </Card>
  );
}
