'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Rocket,
  X,
  BookOpen,
} from 'lucide-react';
import HackathonCard from './components/HackathonCard';
import {
  MOCK_HACKATHONS,
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  SORT_OPTIONS,
} from './components/mockData';

export default function HackathonListingsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState<string>('All');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  /* ── Filtered & sorted data ── */
  const filtered = useMemo(() => {
    let list = [...MOCK_HACKATHONS];

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
  }, [search, category, status, sort]);

  const activeFilterCount = [category !== 'All', status !== 'All'].filter(Boolean).length;

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="border-b border-border bg-white">
        <div className="container-main py-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl tracking-tight">
            Stellar Hackathons
          </h1>
          <p className="mx-auto max-w-lg text-base text-muted-foreground md:text-lg leading-relaxed">
            Discover hackathons, build on Soroban & Stellar, and compete for prizes with builders worldwide.
          </p>
        </div>
      </section>

      {/* ── Search & Filters ── */}
      <div className="sticky top-16 z-40 border-b border-border bg-white/90 backdrop-blur-md">
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

            {/* Host/Guide Toggle */}
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

      {/* ── Grid ── */}
      <main className="container-main py-10">
        {/* Result count */}
        <p className="mb-6 text-sm text-muted-foreground">
          {filtered.length} hackathon{filtered.length !== 1 ? 's' : ''} found
        </p>

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-base font-medium text-foreground">No hackathons found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-white">
        <div className="container-main flex items-center justify-between py-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Stellar Builder Platform</span>
          <span>Terms · Privacy</span>
        </div>
      </footer>
    </div>
  );
}
