'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-full border border-[#E5E5E5] text-[#4D4D4D] hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="hidden md:flex items-center gap-1">
        {getPageNumbers().map((page, idx) => (
          typeof page === 'number' ? (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] h-[40px] rounded-full transition-all duration-200 ${
                currentPage === page
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#4D4D4D] hover:bg-[#F5F5F5]'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="px-2 text-[#999]">
              {page}
            </span>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-full border border-[#E5E5E5] text-[#4D4D4D] hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
