'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Plus,
  X,
  Loader2,
  AlertCircle,
  Sparkles,
  Rocket,
  BookOpen,
} from 'lucide-react';
import BuildCard from './components/buildUI/BuildCard';
import type { BuildCardData } from './components/buildUI/BuildCard';
import * as buildsApi from './components/buildService/buildsApi';
import { useAuth } from '@/src/auth/hooks/useAuth';
import { UnderlineHighlight, CircleHighlight } from '@/src/shared/components/ui/highlightText';
import Footer from '@/src/landingPage/components/Footer';
import type { BuildCategory } from '@/src/builds/types/build.types';

// Filter options
const CATEGORY_OPTIONS: (BuildCategory | 'All')[] = [
  'All', 'DeFi', 'NFT & Gaming', 'Payments', 'Infrastructure', 'Developer Tools', 'Social Impact', 'Other'
];

const STATUS_OPTIONS = ['All', 'Published', 'Draft', 'Archived'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most-viewed', label: 'Most Viewed' },
  { value: 'alphabetical', label: 'A-Z' },
];

export default function BuildsListingPage() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<BuildCategory | 'All'>('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // API state
  const [builds, setBuilds] = useState<BuildCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── Fetch builds from API ── */
  useEffect(() => {
    async function fetchBuilds() {
      try {
        setIsLoading(true);
        setError(null);

        // Always fetch public builds for now
        const response = await buildsApi.listPublicBuilds({
          search: search || undefined,
          category: category === 'All' ? undefined : category,
          limit: 50,
          offset: 0,
          sortBy: sort === 'newest' ? 'publishedAt' : 
                 sort === 'oldest' ? 'createdAt' : 
                 sort === 'most-viewed' ? 'viewCount' : 'createdAt'
        });

        setBuilds(response.builds);
      } catch (err) {
        console.error('Failed to fetch builds:', err);
        setError('Failed to load builds. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBuilds();
  }, [search, category, sort]);

  /* ── Client-side filtering and sorting ── */
  const filtered = useMemo(() => {
    let list = [...builds];

    // Filter by search
    if (search) {
      list = list.filter((build) => 
        build.name.toLowerCase().includes(search.toLowerCase()) ||
        build.tagline.toLowerCase().includes(search.toLowerCase()) ||
        build.techStack.some(tech => tech.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Filter by category
    if (category !== 'All') {
      list = list.filter((build) => build.category === category);
    }

    // Filter by status (only show published for now unless user owns the build)
    if (status !== 'All') {
      list = list.filter((build) => build.status === status);
    } else {
      // Default: only show published builds
      list = list.filter((build) => build.status === 'Published');
    }

    // Sort
    switch (sort) {
      case 'oldest':
        list.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case 'most-viewed':
        list.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'alphabetical':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // newest
        list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    return list;
  }, [search, category, status, sort, builds]);

  const activeFilterCount = [category !== 'All', status !== 'All'].filter(Boolean).length;

  /* ── Bento grid split ── */
  const [featuredBuild, secondBuild, thirdBuild, ...remainingBuilds] = filtered;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Hero with wavy background text ── */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        {/* Wavy Background Text */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] select-none">
          <div className="absolute top-20 left-10 text-9xl font-bold text-foreground transform -rotate-12">Build</div>
          <div className="absolute top-60 right-20 text-8xl font-bold text-foreground transform rotate-6">Ship</div>
          <div className="absolute bottom-40 left-1/4 text-7xl font-bold text-foreground transform -rotate-6">Stellar</div>
        </div>

        <div className="container-main relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-8">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
            <span className="text-sm font-medium text-accent-foreground">
              Builds &bull; Discover &bull; Inspire
            </span>
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground"
            style={{ fontFamily: 'var(--font-onest)' }}
          >
            Discover <UnderlineHighlight>Amazing</UnderlineHighlight>
            <br />
            <CircleHighlight>Stellar Builds</CircleHighlight>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore innovative projects built on the Stellar network. From DeFi protocols to payment solutions,
            discover what&apos;s being built in the ecosystem.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Desktop Dual Button */}
            <div className="hidden lg:flex items-center gap-0.5 rounded-full border border-border bg-white p-1">
              <Link
                href="/builds/submit"
                className="flex h-9 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-all hover:bg-foreground/90 hover:ring-2 hover:ring-accent"
              >
                <Rocket className="h-3.5 w-3.5" />
                <span>Submit a Build</span>
              </Link>
              <Link
                href="#"
                className="flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>View Guide</span>
              </Link>
            </div>

            {/* Mobile Single Button */}
            <div className="lg:hidden">
              {isAuthenticated ? (
                <Link
                  href="/builds/submit"
                  className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Submit Build
                </Link>
              ) : (
                <Link
                  href="/src/auth?redirect=/builds/submit"
                  className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Sign in to Submit Build
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Search & Filters Section ── */}
      <section className="container-main pb-12">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-8">
          {/* Left: Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search builds..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all"
            />
          </div>

          {/* Right: Filters & Submit Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl hover:bg-accent/5 transition-colors text-foreground"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-foreground text-background text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {isAuthenticated && (
              <Link
                href="/builds/submit"
                className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl hover:bg-accent/5 transition-colors text-foreground font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:block">Submit Build</span>
                <span className="sm:hidden">Submit</span>
              </Link>
            )}
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BuildCategory | 'All')}
                    className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((stat) => (
                      <option key={stat} value={stat}>{stat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sort By</label>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground cursor-pointer"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setCategory('All');
                  setStatus('All');
                  setSort('newest');
                }}
                className="flex items-center gap-2 mt-4 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── Builds Grid/List ── */}
      <section className="container-main pb-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading builds...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <p className="text-destructive font-medium mb-2">Error loading builds</p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-muted-foreground">
              {search ? (
                <>
                  <p className="text-lg font-medium mb-2">No builds found for &quot;{search}&quot;</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">No builds to display</p>
                  <p className="text-sm">Be the first to submit a build!</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filtered.length} {filtered.length === 1 ? 'build' : 'builds'}
              </p>
            </div>

            {/* Featured Builds Grid (Bento Layout) */}
            {featuredBuild && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                {/* Large featured card */}
                <div className="lg:col-span-2">
                  <BuildCard build={featuredBuild} featured />
                </div>
                
                {/* Two smaller featured cards */}
                <div className="flex flex-col gap-6">
                  {secondBuild && <BuildCard build={secondBuild} />}
                  {thirdBuild && <BuildCard build={thirdBuild} />}
                </div>
              </div>
            )}

            {/* Regular builds grid */}
            {remainingBuilds.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {remainingBuilds.map((build) => (
                  <BuildCard key={build.id} build={build} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
