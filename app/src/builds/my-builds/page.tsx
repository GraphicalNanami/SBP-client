'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
} from 'lucide-react';
import BuildCard from '../components/buildUI/BuildCard';
import type { BuildCardData } from '../components/buildUI/BuildCard';
import * as buildsApi from '../components/buildService/buildsApi';
import { useAuth } from '@/src/auth/hooks/useAuth';
import Footer from '@/src/landingPage/components/Footer';
import type { BuildStatus } from '@/src/builds/types/build.types';

const STATUS_FILTER_OPTIONS: (BuildStatus | 'All')[] = ['All', 'Draft', 'Published', 'Archived'];

export default function MyBuildsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [builds, setBuilds] = useState<BuildCardData[]>([]);
  const [filteredBuilds, setFilteredBuilds] = useState<BuildCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BuildStatus | 'All'>('All');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/src/auth?redirect=/builds/my-builds');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch user's builds
  useEffect(() => {
    async function fetchMyBuilds() {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        setError(null);
        const myBuilds = await buildsApi.getMyBuilds();
        setBuilds(myBuilds);
        setFilteredBuilds(myBuilds);
      } catch (err) {
        console.error('Failed to fetch my builds:', err);
        setError('Failed to load your builds. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyBuilds();
  }, [isAuthenticated]);

  // Filter builds based on search and status
  useEffect(() => {
    let filtered = [...builds];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((build) =>
        build.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        build.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((build) => build.status === statusFilter);
    }

    setFilteredBuilds(filtered);
  }, [searchQuery, statusFilter, builds]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <section className="border-b border-border bg-card">
        <div className="container-main py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/builds"
              className="p-2 hover:bg-secondary rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Builds</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track your Stellar builds
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search your builds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[160px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as BuildStatus | 'All')}
                className="w-full appearance-none pl-10 pr-10 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground cursor-pointer"
              >
                {STATUS_FILTER_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Create New Build */}
            <Link
              href="/builds/submit"
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-colors font-medium whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>New Build</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Builds Grid */}
      <section className="container-main py-12 flex-grow">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading your builds...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <p className="text-destructive font-medium mb-2">Failed to load builds</p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          </div>
        ) : filteredBuilds.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              {builds.length === 0 ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No builds yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start showcasing your Stellar projects by creating your first build.
                  </p>
                  <Link
                    href="/builds/submit"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Create Your First Build
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium text-foreground mb-2">
                    No builds found
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your search or filter criteria
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredBuilds.length} {filteredBuilds.length === 1 ? 'build' : 'builds'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuilds.map((build) => (
                <BuildCard key={build.id} build={build} />
              ))}
            </div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
