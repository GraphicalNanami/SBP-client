'use client';

import { Users } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  onClearFilters?: () => void;
}

export default function EmptyState({ 
  message = 'No users found matching your filters',
  onClearFilters 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
        <Users className="w-12 h-12 text-[#999]" />
      </div>
      <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
        {message}
      </h3>
      <p className="text-[#4D4D4D] mb-6 text-center max-w-md">
        Try adjusting your search or filters to find what you're looking for
      </p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="px-6 py-2 rounded-full bg-[#1A1A1A] text-white hover:bg-[#333] transition-all duration-200"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
