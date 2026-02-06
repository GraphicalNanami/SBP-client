'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Rocket,
  X,
  User,
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
    <div className="min-h-screen bg-[var(--bg)]">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--text)]">
              <span className="text-xs font-bold text-white">S</span>
            </div>
            <span className="text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.03em' }}>
              Stellar
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/hackathon" className="text-sm font-medium text-[var(--text)]">
              Hackathons
            </Link>
            <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              Ecosystem
            </a>
            <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              Developers
            </a>
          </div>

          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)]">
            <User className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 text-center">
          <h1
            className="mb-4 text-4xl font-bold text-[var(--text)] md:text-5xl"
            style={{ letterSpacing: '-0.04em', lineHeight: '1.1', fontFamily: 'var(--font-onest)' }}
          >
            Stellar Hackathons
          </h1>
          <p className="mx-auto max-w-lg text-base text-[var(--text-muted)] md:text-lg" style={{ lineHeight: '1.6' }}>
            Discover hackathons, build on Soroban & Stellar, and compete for prizes with builders worldwide.
          </p>
        </div>
      </section>

      {/* ── Search & Filters ── */}
      <div className="sticky top-16 z-40 border-b border-[var(--border)] bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hackathons..."
                className="h-11 w-full rounded-full border border-[var(--border)] bg-white pl-11 pr-5 text-sm text-[var(--text)] transition-all placeholder:text-[var(--text-muted)] hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/10"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
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
                  ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[var(--brand)]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative hidden sm:block">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 appearance-none rounded-full border border-[var(--border)] bg-white px-4 pr-9 text-sm text-[var(--text-secondary)] transition-all hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>

            {/* Host/Guide Toggle */}
            <div className="hidden lg:flex items-center gap-0.5 rounded-full border border-[var(--border)] bg-white p-1">
              <Link
                href="/organization"
                className="flex h-9 items-center gap-2 rounded-full bg-[var(--text)] px-4 text-sm font-medium text-white transition-all hover:opacity-90"
              >
                <Rocket className="h-3.5 w-3.5" />
                <span>Host a Hackathon</span>
              </Link>
              <a
                href="#"
                className="flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)]"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>View Guide</span>
              </a>
            </div>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-4">
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--text-muted)]">Category</span>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                        category === cat
                          ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                          : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--text-muted)]">Status</span>
                <div className="flex gap-1.5">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                        status === s
                          ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                          : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
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
                  className="ml-auto text-xs font-medium text-[var(--text-muted)] underline underline-offset-2 hover:text-[var(--text)]"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      <main className="mx-auto max-w-[1200px] px-6 py-10">
        {/* Result count */}
        <p className="mb-6 text-sm text-[var(--text-muted)]">
          {filtered.length} hackathon{filtered.length !== 1 ? 's' : ''} found
        </p>

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-muted)]">
              <Search className="h-6 w-6 text-[var(--text-muted)]" />
            </div>
            <p className="text-base font-medium text-[var(--text)]">No hackathons found</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
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
