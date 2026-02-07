'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import UserCard from './components/UserCard';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import Pagination from './components/Pagination';
import EmptyState from './components/EmptyState';
import { getUsersList } from './api';
import { User } from './types';

function UsersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [role, setRole] = useState(searchParams.get('role') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (search) params.set('search', search);
    if (role) params.set('role', role);
    if (sortBy !== 'createdAt') params.set('sortBy', sortBy);
    
    const newUrl = `/users${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl, { scroll: false });
  }, [page, search, role, sortBy, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getUsersList({
          page,
          limit: 20,
          search: search || undefined,
          role: role || undefined,
          sortBy: sortBy as any,
          sortOrder: 'desc'
        });
        
        setUsers(response.users);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, search, role, sortBy]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setRole('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-2">
                Community Builders
              </h1>
              <p className="text-lg text-[#4D4D4D]">
                Discover developers and creators in the Stellar ecosystem
              </p>
            </div>
            {!loading && (
              <div className="px-4 py-2 rounded-full bg-[#F5F5F5] text-[#4D4D4D] font-medium">
                {total}+ members
              </div>
            )}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <SearchBar
            value={search}
            onChange={handleSearchChange}
          />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <FilterBar
              activeRole={role}
              onRoleChange={handleRoleChange}
            />
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-full border border-[#E5E5E5] bg-white text-[#4D4D4D] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
            >
              <option value="createdAt">Newest Members</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        {!loading && users.length > 0 && (
          <div className="mb-6 text-sm text-[#4D4D4D]">
            Showing {((page - 1) * 20) + 1}-{Math.min(page * 20, total)} of {total} members
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-[#E5E5E5] bg-white p-6 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-[#F5F5F5] mb-4" />
                <div className="h-6 bg-[#F5F5F5] rounded mb-2" />
                <div className="h-4 bg-[#F5F5F5] rounded w-2/3 mb-4" />
                <div className="h-4 bg-[#F5F5F5] rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-8 text-center">
            <p className="text-[#4D4D4D] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-full bg-[#1A1A1A] text-white hover:bg-[#333] transition-all duration-200"
            >
              Try again
            </button>
          </div>
        )}

        {/* Users Grid */}
        {!loading && !error && users.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {users.map((user) => (
                <UserCard key={user.uuid} user={user} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && users.length === 0 && (
          <EmptyState onClearFilters={handleClearFilters} />
        )}
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function UsersPageLoading() {
  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="h-10 w-64 bg-[#F5F5F5] rounded animate-pulse mb-2" />
          <div className="h-6 w-96 bg-[#F5F5F5] rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border border-[#E5E5E5] bg-white p-6 animate-pulse">
              <div className="w-20 h-20 rounded-full bg-[#F5F5F5] mb-4" />
              <div className="h-6 bg-[#F5F5F5] rounded mb-2" />
              <div className="h-4 bg-[#F5F5F5] rounded w-2/3 mb-4" />
              <div className="h-4 bg-[#F5F5F5] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function UsersPage() {
  return (
    <Suspense fallback={<UsersPageLoading />}>
      <UsersPageContent />
    </Suspense>
  );
}
