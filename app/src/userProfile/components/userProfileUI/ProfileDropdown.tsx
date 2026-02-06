'use client';

import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Calendar, Briefcase, Settings } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/src/auth/hooks/useAuth';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-secondary transition-all duration-200"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
          {user?.name ? getInitials(user.name) : <User className="w-5 h-5" />}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-2xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {user?.name ? getInitials(user.name) : <User className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              disabled
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed opacity-60 relative"
            >
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1">My Hackathons</span>
              <span className="px-2 py-1 text-xs bg-orange-50 text-orange-600 rounded-full border border-orange-200 whitespace-nowrap">
                Coming Soon
              </span>
            </button>

            <button
              disabled
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed opacity-60 relative"
            >
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1">My Events</span>
              <span className="px-2 py-1 text-xs bg-orange-50 text-orange-600 rounded-full border border-orange-200 whitespace-nowrap">
                Coming Soon
              </span>
            </button>

            <Link href="/src/dashboard/settings">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Settings</span>
              </button>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-border p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
