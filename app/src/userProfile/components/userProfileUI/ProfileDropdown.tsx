'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { User, LogOut, Calendar, Briefcase, Settings, Hammer } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/src/auth/hooks/useAuth';
import { getAvatarUrl, isDataUri } from '@/src/shared/utils/avatar';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const { user, logout } = useAuth();

  // Calculate position of dropdown relative to the button
  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8, // mt-2 equivalent
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  // Update position when opening
  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-xl hover:bg-secondary transition-all duration-200"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 relative overflow-hidden">
          <Image
            src={getAvatarUrl(user?.avatar, user?.name || 'User')}
            alt={user?.name || 'User'}
            fill
            className="object-cover"
            unoptimized={isDataUri(getAvatarUrl(user?.avatar, user?.name || 'User'))}
          />
        </div>
      </button>

      {/* Dropdown Menu - rendered via portal so backdrop-blur works independently */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={{ top: dropdownPos.top, right: dropdownPos.right }}
          className="fixed w-80 rounded-2xl backdrop-blur-xl bg-white/10 border border-transparent shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5001] animate-in fade-in  overflow-hidden"
        >
          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 relative overflow-hidden">
                <Image
                  src={getAvatarUrl(user?.avatar, user?.name || 'User')}
                  alt={user?.name || 'User'}
                  fill
                  className="object-cover"
                  unoptimized={isDataUri(getAvatarUrl(user?.avatar, user?.name || 'User'))}
                />
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

            <Link href="/builds/my-builds" onClick={() => setIsOpen(false)}>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-white/10 cursor-pointer transition-colors">
                <Hammer className="w-4 h-4 text-muted-foreground" />
                <span>My Builds</span>
              </button>
            </Link>

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

            <Link href="/src/dashboard/settings" onClick={() => setIsOpen(false)}>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-white/10 cursor-pointer transition-colors">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Settings</span>
              </button>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-white/10 p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProfileDropdown;
