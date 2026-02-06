'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/src/shared/lib/api/client';
import { ENDPOINTS } from '@/src/shared/lib/api/endpoints';
import {
  Save,
  Check,
  Loader2,
  Building2,
  ImagePlus,
  Twitter,
  Github,
  Linkedin,
  Globe,
  MessageCircle,
  Hash,
  Users,
  Rocket,
  ArrowRight,
  UserPlus,
  Trash2,
  ChevronDown,
  Shield,
  Pencil,
  Eye,
  X,
  Mail,
  AlertCircle,
} from 'lucide-react';
import type { OrganizationProfile, SocialLinks, TeamMember } from '../types/organization.types';
import type { Hackathon } from '@/src/hackathon/types/hackathon.types';
import { ManagedHackathonsCard } from './organizationUI/ManagedHackathonsCard';

interface OrganizationDashboardProps {
  profile: OrganizationProfile;
  organizations: OrganizationProfile[];
  activeOrgId: string | null;
  isSaving: boolean;
  saveSuccess: boolean;
  isLoading?: boolean;
  error?: string | null;
  organizationHackathons: Hackathon[];
  isLoadingHackathons: boolean;
  hackathonsError: string | null;
  onProfileChange: (field: keyof OrganizationProfile, value: string) => void;
  onSocialChange: (field: keyof SocialLinks, value: string) => void;
  onAddMember: (email: string, role: TeamMember['role']) => void;
  onRemoveMember: (memberId: string) => void;
  onUpdateMemberRole: (memberId: string, role: TeamMember['role']) => void;
  onSwitchOrg: (orgId: string) => void;
  onCreateNew: () => void;
  onSave: () => void;
  onClearError?: () => void;
  onRefreshHackathons?: () => void;
}

const validateSocialLink = (key: keyof SocialLinks, value: string): string | null => {
  if (!value) return null;

  const patterns: Record<string, { regex: RegExp; error: string }> = {
    x: {
      regex: /^https?:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+\/?$/,
      error: 'Enter a valid X/Twitter profile URL',
    },
    telegram: {
      regex: /^https?:\/\/t\.me\/[a-zA-Z0-9_]+\/?$/,
      error: 'Enter a valid Telegram URL (e.g., https://t.me/username)',
    },
    github: {
      regex: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,
      error: 'Enter a valid GitHub profile URL',
    },
    discord: {
      regex: /^https?:\/\/(www\.)?discord\.(gg|com)\/(invite\/)?[a-zA-Z0-9_-]+\/?$/,
      error: 'Enter a valid Discord invite URL',
    },
    linkedin: {
      regex: /^https?:\/\/(www\.)?linkedin\.com\/(company|in)\/[a-zA-Z0-9_-]+\/?$/,
      error: 'Enter a valid LinkedIn URL',
    },
  };

  const pattern = patterns[key];
  if (pattern && !pattern.regex.test(value)) {
    return pattern.error;
  }

  try {
    new URL(value);
    return null;
  } catch {
    return 'Enter a valid URL';
  }
};

const SOCIAL_FIELDS: {
  key: keyof SocialLinks;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
}[] = [
  { key: 'x', label: 'X (Twitter)', icon: <Twitter className="h-4 w-4" />, placeholder: 'https://x.com/your-org' },
  { key: 'telegram', label: 'Telegram', icon: <MessageCircle className="h-4 w-4" />, placeholder: 'https://t.me/your-org' },
  { key: 'github', label: 'GitHub', icon: <Github className="h-4 w-4" />, placeholder: 'https://github.com/your-org' },
  { key: 'discord', label: 'Discord', icon: <Hash className="h-4 w-4" />, placeholder: 'https://discord.gg/invite-code' },
  { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" />, placeholder: 'https://linkedin.com/company/your-org' },
];

const ROLE_OPTIONS: { value: TeamMember['role']; label: string; icon: React.ReactNode }[] = [
  { value: 'Admin', label: 'Admin', icon: <Shield className="h-3.5 w-3.5" /> },
  { value: 'Editor', label: 'Editor', icon: <Pencil className="h-3.5 w-3.5" /> },
  { value: 'Viewer', label: 'Viewer', icon: <Eye className="h-3.5 w-3.5" /> },
];

/* ── Shared UI ── */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-xl border border-[#E5E5E5] bg-white p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 text-[15px] font-semibold text-[#1A1A1A] tracking-tight" style={{ fontFamily: 'var(--font-onest)' }}>
      {children}
    </h2>
  );
}

const inputClass =
  'h-[46px] w-full rounded-full border border-[#E5E5E5] bg-white px-5 text-sm text-[#1A1A1A] transition-all duration-200 placeholder:text-[#4D4D4D] hover:border-[#E5E5E5] focus:border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/10';

/* ── Role Badge ── */
function RoleBadge({ role }: { role: TeamMember['role'] }) {
  const styles: Record<TeamMember['role'], string> = {
    Admin: 'bg-purple-100 text-purple-700',
    Editor: 'bg-blue-100 text-blue-700',
    Viewer: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[role]}`}>
      {role === 'Admin' && <Shield className="h-3 w-3" />}
      {role === 'Editor' && <Pencil className="h-3 w-3" />}
      {role === 'Viewer' && <Eye className="h-3 w-3" />}
      {role}
    </span>
  );
}

/* ── Role Dropdown ── */
function RoleSelect({
  value,
  onChange,
  disabled = false,
}: {
  value: TeamMember['role'];
  onChange: (role: TeamMember['role']) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs font-medium text-[#1A1A1A] transition-all hover:border-[#E5E5E5] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {value}
        <ChevronDown className="h-3 w-3 text-[#4D4D4D]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full z-40 mt-1 w-36 rounded-xl border border-[#E5E5E5] bg-white py-1"
            
          >
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-[#F5F5F5] ${
                  value === opt.value ? 'font-semibold text-[#1A1A1A]' : 'text-[#4D4D4D]'
                }`}
              >
                <span className="text-[#4D4D4D]">{opt.icon}</span>
                {opt.label}
                {value === opt.value && <Check className="ml-auto h-3 w-3 text-[#1A1A1A]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Invite Modal ── */
interface UserSearchResult {
  uuid: string;
  email: string;
  name: string;
  avatar: string | null;
  role: string;
}

function InviteModal({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (email: string, role: TeamMember['role']) => void;
}) {
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('Viewer');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search users with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await apiClient.get<UserSearchResult[]>(
          `${ENDPOINTS.USERS.SEARCH}?query=${encodeURIComponent(query)}&limit=5`
        );
        setSearchResults(results);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Failed to search users:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleSelectUser = (user: UserSearchResult) => {
    setSelectedUser(user);
    setEmail(user.email);
    setQuery(user.email);
    setShowSuggestions(false);
    if (error) setError('');
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedUser(null);
    if (error) setError('');
  };

  const handleInvite = () => {
    const emailToInvite = email || query.trim();
    
    if (!emailToInvite) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToInvite)) {
      setError('Enter a valid email address');
      return;
    }
    onInvite(emailToInvite, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-lg"
        
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[#4D4D4D] transition-colors hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F5F5]">
            <UserPlus className="h-5 w-5 text-[#4D4D4D]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] tracking-tight" style={{ fontFamily: 'var(--font-onest)' }}>
            Invite Team Member
          </h3>
          <p className="mt-1 text-sm text-[#4D4D4D]">
            They&apos;ll receive an invitation email to join your organization.
          </p>
        </div>

        {/* Email with Search */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-[#4D4D4D]">
            {selectedUser ? 'Selected User' : 'Search by email or name'}
          </label>
          
          {selectedUser ? (
            <div className="flex items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-[#F5F5F5] p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1A1A1A]">
                {selectedUser.avatar ? (
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-white">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#1A1A1A]">{selectedUser.name}</p>
                <p className="truncate text-xs text-[#4D4D4D]">{selectedUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setQuery('');
                  setEmail('');
                }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#4D4D4D] transition-colors hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4D4D4D]" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => query && setShowSuggestions(true)}
                placeholder="member@example.com or John Doe"
                className="h-[46px] w-full rounded-full border border-[#E5E5E5] bg-white pl-11 pr-5 text-sm text-[#1A1A1A] transition-all placeholder:text-[#4D4D4D] hover:border-[#E5E5E5] focus:border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/10"
                autoFocus
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && query.length >= 2 && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowSuggestions(false)} />
                  <div
                    className="absolute left-0 right-0 top-full z-40 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-[#E5E5E5] bg-white py-2"
                    
                  >
                    {isSearching ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-[#4D4D4D]" />
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((user) => (
                        <button
                          key={user.uuid}
                          type="button"
                          onClick={() => handleSelectUser(user)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F5F5F5]"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1A1A1A]">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-semibold text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[#1A1A1A]">{user.name}</p>
                            <p className="truncate text-xs text-[#4D4D4D]">{user.email}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5]">
                          <AlertCircle className="h-6 w-6 text-[#4D4D4D]" />
                        </div>
                        <p className="text-sm font-medium text-[#1A1A1A]">User not found</p>
                        <p className="mt-1 text-xs text-[#4D4D4D]">No users match &quot;{query}&quot;</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          {error && <p className="mt-1.5 pl-5 text-xs text-red-500">{error}</p>}
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-[#4D4D4D]">Role</label>
          <div className="flex gap-2">
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border text-xs font-medium transition-all ${
                  role === opt.value
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#4D4D4D] hover:border-[#E5E5E5]'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex h-10 flex-1 items-center justify-center rounded-full border border-[#E5E5E5] text-sm font-medium text-[#4D4D4D] transition-all hover:bg-[#F5F5F5]"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#1A1A1A] text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Avatar placeholder ── */
function Avatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  const colors = [
    'bg-purple-100 text-purple-600',
    'bg-blue-100 text-blue-600',
    'bg-emerald-100 text-emerald-600',
    'bg-amber-100 text-amber-600',
    'bg-rose-100 text-rose-600',
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${color}`}>
      {initial}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Dashboard Component
   ═══════════════════════════════════════════════════════ */
export function OrganizationDashboard({
  profile,
  organizations,
  activeOrgId,
  isSaving,
  saveSuccess,
  isLoading = false,
  error = null,
  organizationHackathons,
  isLoadingHackathons,
  hackathonsError,
  onProfileChange,
  onSocialChange,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
  onSwitchOrg,
  onCreateNew,
  onSave,
  onClearError,
  onRefreshHackathons,
}: OrganizationDashboardProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showInvite, setShowInvite] = useState(false);
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveClick = () => {
    const newErrors: Record<string, string> = {};
    SOCIAL_FIELDS.forEach(({ key }) => {
      const value = profile.socialLinks[key] || '';
      const error = validateSocialLink(key, value);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      // Optional: scroll to first error or show a global error message
      return;
    }

    setFieldErrors({});
    onSave();
  };

  const handleSocialChange = (key: keyof SocialLinks, value: string) => {
    onSocialChange(key, value);
    // Real-time validation
    const error = validateSocialLink(key, value);
    setFieldErrors((prev) => ({ ...prev, [key]: error || '' }));
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Convert to base64 or data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onProfileChange('logo', result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-[#E5E5E5] bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6">
          {/* Left: Org switcher */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOrgSwitcher(!showOrgSwitcher)}
                className="flex items-center gap-3 rounded-xl border border-transparent px-1 py-1 transition-colors hover:bg-[#F5F5F5]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A1A1A]">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="hidden text-left sm:block">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-semibold text-[#1A1A1A] tracking-tight" style={{ fontFamily: 'var(--font-onest)' }}>
                      {profile.name || 'Organization'}
                    </h1>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#4D4D4D]">{profile.website || 'Organization Dashboard'}</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-[#4D4D4D] sm:block" />
              </button>

              {/* Org switcher dropdown */}
              {showOrgSwitcher && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowOrgSwitcher(false)} />
                  <div
                    className="absolute left-0 top-full z-40 mt-2 w-72 rounded-2xl border border-[#E5E5E5] bg-white py-2"
                    
                  >
                    <div className="px-3 pb-2 pt-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-[#4D4D4D]">
                        Your Organizations
                      </p>
                    </div>

                    <div className="max-h-[240px] overflow-y-auto">
                      {organizations.map((org) => (
                        <button
                          key={org.id}
                          type="button"
                          onClick={() => {
                            onSwitchOrg(org.id);
                            setShowOrgSwitcher(false);
                          }}
                          className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#F5F5F5] ${
                            org.id === activeOrgId ? 'bg-[#F5F5F5]' : ''
                          }`}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5] text-xs font-semibold text-[#4D4D4D]">
                            {org.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[#1A1A1A]">{org.name}</p>
                            <p className="truncate text-xs text-[#4D4D4D]">{org.website}</p>
                          </div>
                          {org.id === activeOrgId && (
                            <Check className="h-4 w-4 shrink-0 text-[#1A1A1A]" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="mt-1 border-t border-[#E5E5E5] pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          onCreateNew();
                          setShowOrgSwitcher(false);
                        }}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#F5F5F5]"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dashed border-[#E5E5E5]">
                          <Building2 className="h-3.5 w-3.5 text-[#4D4D4D]" />
                        </div>
                        <p className="text-sm font-medium text-[#4D4D4D]">Create New Organization</p>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            {/* Member count pill */}
            <div className="hidden items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-[#F5F5F5] px-3 py-1.5 sm:flex">
              <Users className="h-3.5 w-3.5 text-[#4D4D4D]" />
              <span className="text-xs font-medium text-[#4D4D4D]">
                {profile.teamMembers.length} member{profile.teamMembers.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Org count pill */}
            {organizations.length > 1 && (
              <div className="hidden items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-[#F5F5F5] px-3 py-1.5 sm:flex">
                <Building2 className="h-3.5 w-3.5 text-[#4D4D4D]" />
                <span className="text-xs font-medium text-[#4D4D4D]">
                  {organizations.length} org{organizations.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Save */}
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className={`flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1A1A1A] text-white hover:opacity-90'
              }`}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-50 px-4 py-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-500">Error</p>
              <p className="mt-0.5 text-sm text-red-500/90">{error}</p>
            </div>
            {onClearError && (
              <button
                onClick={onClearError}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-8">
            <Loader2 className="h-5 w-5 animate-spin text-[#1A1A1A]" />
            <p className="text-sm text-[#4D4D4D]">Loading organization data...</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Left Column ── */}
          <div className="space-y-6 lg:col-span-2">
            {/* Profile */}
            <Card>
              <SectionTitle>Organization Profile</SectionTitle>

              {/* Logo upload */}
              <div className="mb-6 flex items-center gap-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  aria-label="Upload organization logo"
                />
                <div
                  onClick={triggerFileInput}
                  className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-[#E5E5E5] bg-[#F5F5F5] transition-colors hover:border-[#E5E5E5]"
                >
                  {profile.logo ? (
                    <img src={profile.logo} alt="Logo" className="h-full w-full rounded-2xl object-cover" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-[#4D4D4D]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Organization Logo</p>
                  <p className="mt-0.5 text-xs text-[#4D4D4D]">Recommended: 256×256px, PNG or SVG</p>
                </div>
              </div>

              {/* Fields */}
              <div className="mb-5">
                <label htmlFor="dash-name" className="mb-2 block text-sm font-medium text-[#4D4D4D]">
                  Organization Name
                </label>
                <input
                  id="dash-name"
                  type="text"
                  value={profile.name}
                  onChange={(e) => onProfileChange('name', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="dash-tagline" className="mb-2 block text-sm font-medium text-[#4D4D4D]">
                  Tagline
                </label>
                <input
                  id="dash-tagline"
                  type="text"
                  value={profile.tagline}
                  onChange={(e) => onProfileChange('tagline', e.target.value)}
                  placeholder="A short line that defines your organization"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="dash-about" className="mb-2 block text-sm font-medium text-[#4D4D4D]">
                  About
                </label>
                <textarea
                  id="dash-about"
                  value={profile.about}
                  onChange={(e) => onProfileChange('about', e.target.value)}
                  placeholder="Tell the community about your organization..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-[#E5E5E5] bg-white px-5 py-3.5 text-sm text-[#1A1A1A] transition-all duration-200 placeholder:text-[#4D4D4D] hover:border-[#E5E5E5] focus:border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/10"
                />
              </div>
            </Card>

            {/* Social Links */}
            <Card>
              <SectionTitle>Social Links</SectionTitle>
              <div className="grid gap-5 sm:grid-cols-2">
                {SOCIAL_FIELDS.map(({ key, label, icon, placeholder }) => (
                  <div key={key}>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#4D4D4D]">
                      <span className="text-[#4D4D4D]">{icon}</span>
                      {label}
                    </label>
                    <input
                      type="url"
                      value={profile.socialLinks[key] || ''}
                      onChange={(e) => handleSocialChange(key, e.target.value)}
                      placeholder={placeholder}
                      className={`${inputClass} ${fieldErrors[key] ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                    />
                    {fieldErrors[key] && (
                      <p className="mt-1.5 px-1 text-[11px] font-medium text-red-500">
                        {fieldErrors[key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* ── Team Management (full implementation) ── */}
            <Card>
              <div className="mb-5 flex items-center justify-between">
                <SectionTitle>Team Members</SectionTitle>
                <button
                  onClick={() => setShowInvite(true)}
                  className="flex h-9 items-center gap-2 rounded-full bg-[#1A1A1A] px-4 text-xs font-medium text-white transition-all hover:opacity-90 active:scale-[0.97]"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Invite Member
                </button>
              </div>

              {profile.teamMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E5E5] py-12 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5]">
                    <Users className="h-5 w-5 text-[#4D4D4D]" />
                  </div>
                  <p className="text-sm font-medium text-[#1A1A1A]">No team members yet</p>
                  <p className="mt-1 text-xs text-[#4D4D4D]">Invite people to collaborate on your organization.</p>
                  <button
                    onClick={() => setShowInvite(true)}
                    className="mt-4 flex h-9 items-center gap-2 rounded-full border border-[#E5E5E5] px-4 text-xs font-medium text-[#4D4D4D] transition-all hover:bg-[#F5F5F5]"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Invite your first member
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-[#E5E5E5]">
                  {/* Table header */}
                  <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[#E5E5E5] bg-[#F5F5F5] px-4 py-2.5 text-xs font-medium text-[#4D4D4D] sm:grid-cols-[1fr_120px_100px_48px]">
                    <span>Member</span>
                    <span className="hidden sm:block">Role</span>
                    <span className="hidden sm:block">Joined</span>
                    <span />
                  </div>

                  {/* Members list */}
                  {profile.teamMembers.map((member, idx) => {
                    const isOwner = idx === 0;
                    return (
                      <div
                        key={member.id}
                        className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3 sm:grid-cols-[1fr_120px_100px_48px] ${
                          idx < profile.teamMembers.length - 1 ? 'border-b border-[#E5E5E5]' : ''
                        }`}
                      >
                        {/* Info */}
                        <div className="flex items-center gap-3">
                          <Avatar name={member.name} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#1A1A1A]">
                              {member.name}
                              {isOwner && (
                                <span className="ml-2 text-[10px] font-normal text-[#4D4D4D]">(you)</span>
                              )}
                            </p>
                            <p className="truncate text-xs text-[#4D4D4D]">{member.email}</p>
                          </div>
                        </div>

                        {/* Role */}
                        <div className="hidden sm:block">
                          {isOwner ? (
                            <RoleBadge role={member.role} />
                          ) : (
                            <RoleSelect
                              value={member.role}
                              onChange={(role) => onUpdateMemberRole(member.id, role)}
                            />
                          )}
                        </div>

                        {/* Joined — mobile shows badge, desktop shows date */}
                        <div className="hidden text-xs text-[#4D4D4D] sm:block">
                          {new Date(member.joinedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>

                        {/* Mobile: badge */}
                        <div className="sm:hidden">
                          <RoleBadge role={member.role} />
                        </div>

                        {/* Remove */}
                        <div className="flex justify-end">
                          {isOwner ? (
                            <div className="h-8 w-8" />
                          ) : (
                            <button
                              onClick={() => onRemoveMember(member.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#4D4D4D] transition-colors hover:bg-red-50 hover:text-red-500"
                              title="Remove member"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* ── Managed Hackathons ── */}
            <ManagedHackathonsCard
              hackathons={organizationHackathons}
              isLoading={isLoadingHackathons}
              error={hackathonsError}
              organizationId={activeOrgId || ''}
              onRefresh={onRefreshHackathons}
            />
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <SectionTitle>Quick Info</SectionTitle>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[#4D4D4D]">Organization Name</p>
                  <p className="mt-0.5 font-medium text-[#1A1A1A]">{profile.name || '—'}</p>
                </div>
                <div className="border-t border-[#E5E5E5] pt-4">
                  <p className="text-[#4D4D4D]">Website</p>
                  <p className="mt-0.5 font-medium text-[#1A1A1A]">{profile.website || '—'}</p>
                </div>
                <div className="border-t border-[#E5E5E5] pt-4">
                  <p className="text-[#4D4D4D]">Tagline</p>
                  <p className="mt-0.5 font-medium text-[#1A1A1A]">{profile.tagline || '—'}</p>
                </div>
                <div className="border-t border-[#E5E5E5] pt-4">
                  <p className="text-[#4D4D4D]">Team Size</p>
                  <p className="mt-0.5 font-medium text-[#1A1A1A]">{profile.teamMembers.length} member{profile.teamMembers.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </Card>

            {/* Create Hackathon CTA */}
            <div className="rounded-xl border border-[#E5E5E5] bg-[#1A1A1A] p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white">Host a Hackathon</h3>
              <p className="mt-1.5 text-sm text-white/60">
                Launch a hackathon and bring builders together on Stellar.
              </p>
              <Link
                href={`/src/hackathon/manage/new?orgId=${activeOrgId}`}
                className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-[#1A1A1A] transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                Create Hackathon
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── Invite Modal ── */}
      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onInvite={onAddMember}
        />
      )}
    </div>
  );
}
