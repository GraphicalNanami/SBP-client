'use client';

import { X } from 'lucide-react';

interface FilterBarProps {
  activeRole: string;
  onRoleChange: (role: string) => void;
}

const roles = [
  { value: '', label: 'All Users' },
  { value: 'ORGANIZER', label: 'Organizers' },
  { value: 'USER', label: 'Builders' },
];

export default function FilterBar({ activeRole, onRoleChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {roles.map((role) => (
        <button
          key={role.value}
          onClick={() => onRoleChange(role.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeRole === role.value
              ? 'bg-[#1A1A1A] text-white'
              : 'bg-white border border-[#E5E5E5] text-[#4D4D4D] hover:bg-[#F5F5F5]'
          }`}
        >
          {role.label}
        </button>
      ))}
      
      {activeRole && (
        <button
          onClick={() => onRoleChange('')}
          className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-[#E5E5E5] text-[#4D4D4D] hover:bg-[#F5F5F5] transition-all duration-200 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear filters
        </button>
      )}
    </div>
  );
}
