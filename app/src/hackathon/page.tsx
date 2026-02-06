'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Rocket,
  X,
  BookOpen,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import HackathonCard from './components/HackathonCard';
import {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  SORT_OPTIONS,
  type HackathonCardData,
} from './components/mockData';
import { hackathonApi, transformHackathonToCard } from '@/src/shared/lib/api/hackathonApi';
import { UnderlineHighlight, CircleHighlight } from '@/src/shared/components/ui/highlightText';
import Footer from '@/src/landingPage/components/Footer';

export default function HackathonListingsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState<string>('All');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // API state
  const [hackathons, setHackathons] = useState<HackathonCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── Fetch hackathons from API ── */
  useEffect(() => {
    async function fetchHackathons() {
      try {
        setIsLoading(true);
        setError(null);

        // Map frontend status filter to backend filter
        let filter: 'all' | 'upcoming' | 'ongoing' | 'past' = 'all';
        if (status === 'Upcoming') filter = 'upcoming';
        else if (status === 'Ongoing') filter = 'ongoing';
        else if (status === 'Ended') filter = 'past';

        const response = await hackathonApi.listPublicHackathons({
          filter,
          limit: 100,
        });

        const transformed = response.hackathons.map(transformHackathonToCard);
        setHackathons(transformed);
      } catch (err) {
        console.error('Failed to fetch hackathons:', err);
        setError(err instanceof Error ? err.message : 'Failed to load hackathons');
      } finally {
        setIsLoading(false);
      }
    }

    fetchHackathons();
  }, [status]);

  /* ── Filtered & sorted data ── */
  const filtered = useMemo(() => {
    let list = [...hackathons];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.organizationName.toLowerCase().includes(q) ||
          h.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Category
    if (category !== 'All') {
      list = list.filter((h) => h.category === category);
    }

    // Status
    if (status !== 'All') {
      list = list.filter((h) => h.status === status);
    }

    // Sort
    switch (sort) {
      case 'prize-desc':
        list.sort((a, b) => b.prizePool - a.prizePool);
        break;
      case 'start-soonest':
        list.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        break;
      case 'deadline-soonest':
        list.sort(
          (a, b) =>
            new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime(),
        );
        break;
      default: // newest
        list.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    }

    return list;
  }, [search, category, status, sort, hackathons]);

  const activeFilterCount = [category !== 'All', status !== 'All'].filter(Boolean).length;

  /* ── Bento grid split ── */
  const [featuredHackathon, secondHackathon, thirdHackathon, ...remainingHackathons] = filtered;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Hero with wavy background text ── */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        {/* Wavy Background Text */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] select-none">
          <div className="absolute top-20 left-10 text-9xl font-bold text-foreground transform -rotate-12">Hack</div>
          <div className="absolute top-60 right-20 text-8xl font-bold text-foreground transform rotate-6">Build</div>
          <div className="absolute bottom-40 left-1/4 text-7xl font-bold text-foreground transform -rotate-6">Ship</div>
        </div>

        <div className="container-main relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-8">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
            <span className="text-sm font-medium text-accent-foreground">
              Hackathons &bull; Build on Stellar &bull; Win prizes
            </span>
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground"
            style={{ fontFamily: 'var(--font-onest)' }}
          >
            Discover <UnderlineHighlight>Amazing</UnderlineHighlight>
            <br />
            <CircleHighlight>Hackathons</CircleHighlight>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover hackathons, build on Soroban &amp; Stellar, and compete for prizes with builders
            worldwide.
          </p>
        </div>
      </section>

      {/* ── Search & Filters (sticky) ── */}
      <div className="sticky top-[72px] z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container-main py-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hackathons..."
                className="h-11 w-full rounded-full border border-border bg-white pl-11 pr-5 text-sm text-foreground transition-all placeholder:text-muted-foreground hover:border-border-hover focus:border-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all ${
                showFilters || activeFilterCount > 0
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-border-hover'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-[10px] font-bold text-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative hidden sm:block">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 appearance-none rounded-full border border-border bg-white px-4 pr-9 text-sm text-muted-foreground transition-all hover:border-border-hover focus:border-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Host / Guide toggle */}
            <div className="hidden lg:flex items-center gap-0.5 rounded-full border border-border bg-white p-1">
              <Link
                href="/organization"
                className="flex h-9 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-all hover:bg-foreground/90 hover:ring-2 hover:ring-[hsl(var(--accent))]"
              >
                <Rocket className="h-3.5 w-3.5" />
                <span>Host a Hackathon</span>
              </Link>
              <a
                href="#"
                className="flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>View Guide</span>
              </a>
            </div>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Category</span>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                        category === cat
                          ? 'border-foreground bg-[hsl(var(--accent))] text-foreground'
                          : 'border-border text-muted-foreground hover:border-border-hover hover:bg-secondary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Status</span>
                <div className="flex gap-1.5">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                        status === s
                          ? 'border-foreground bg-[hsl(var(--accent))] text-foreground'
                          : 'border-border text-muted-foreground hover:border-border-hover hover:bg-secondary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setCategory('All');
                    setStatus('All');
                  }}
                  className="ml-auto text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-grow">
        <div className="container-main py-12">
          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">Loading hackathons...</p>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/50 bg-destructive/5 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <p className="text-base font-medium text-foreground">Failed to load hackathons</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-all"
              >
                Try again
              </button>
            </div>
          )}

          {/* Success state — Bento Grid */}
          {!isLoading && !error && (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                {filtered.length} hackathon{filtered.length !== 1 ? 's' : ''} found
              </p>

              {filtered.length > 0 ? (
                <div className="space-y-12">
                  {/* Main 2-Column Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Left: Large Featured Card */}
                    {featuredHackathon && (
                      <HackathonCard hackathon={featuredHackathon} featured />
                    )}

                    {/* Right: 2 Stacked Cards */}
                    <div className="grid grid-rows-2 gap-5">
                      {secondHackathon && (
                        <HackathonCard hackathon={secondHackathon} />
                      )}
                      {thirdHackathon && (
                        <HackathonCard hackathon={thirdHackathon} />
                      )}
                    </div>
                  </div>

                  {/* Remaining Events in Regular Grid */}
                  {remainingHackathons.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-6">More Hackathons</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {remainingHackathons.map((h) => (
                          <HackathonCard key={h.id} hackathon={h} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-32 text-center">
                  <div className="w-20 h-20 rounded-full bg-secondary border border-border flex items-center justify-center mb-6">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">No hackathons found</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Try adjusting your search or filters to find what you&apos;re looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setCategory('All');
                      setStatus('All');
                    }}
                    className="mt-8 px-6 py-2.5 rounded-xl border border-border text-foreground hover:bg-secondary transition-all"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
