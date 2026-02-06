'use client';

import { useState } from 'react';
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

interface OrganizationDashboardProps {
  profile: OrganizationProfile;
  organizations: OrganizationProfile[];
  activeOrgId: string | null;
  isSaving: boolean;
  saveSuccess: boolean;
  isLoading?: boolean;
  error?: string | null;
  onProfileChange: (field: keyof OrganizationProfile, value: string) => void;
  onSocialChange: (field: keyof SocialLinks, value: string) => void;
  onAddMember: (email: string, role: TeamMember['role']) => void;
  onRemoveMember: (memberId: string) => void;
  onUpdateMemberRole: (memberId: string, role: TeamMember['role']) => void;
  onSwitchOrg: (orgId: string) => void;
  onCreateNew: () => void;
  onSave: () => void;
  onClearError?: () => void;
}

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
      className={`rounded-2xl border border-border bg-bg-card p-6 ${className}`}
      style={{ boxShadow: 'var(--shadow)' }}
    >
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 text-[15px] font-semibold text-text" style={{ letterSpacing: '-0.02em' }}>
      {children}
    </h2>
  );
}

const inputClass =
  'h-[46px] w-full rounded-full border border-border bg-bg-input px-5 text-sm text-text transition-all duration-200 placeholder:text-text-muted hover:border-border-hover focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10';

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
        className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-bg-input px-3 text-xs font-medium text-text transition-all hover:border-border-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {value}
        <ChevronDown className="h-3 w-3 text-text-muted" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full z-40 mt-1 w-36 rounded-xl border border-border bg-bg-card py-1"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-bg-hover ${
                  value === opt.value ? 'font-semibold text-text' : 'text-text-secondary'
                }`}
              >
                <span className="text-text-muted">{opt.icon}</span>
                {opt.label}
                {value === opt.value && <Check className="ml-auto h-3 w-3 text-text" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Invite Modal ── */
function InviteModal({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (email: string, role: TeamMember['role']) => void;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('Viewer');
  const [error, setError] = useState('');

  const handleInvite = () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address');
      return;
    }
    onInvite(email.trim(), role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-bg-card p-6"
        style={{ boxShadow: 'var(--shadow-lg)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-hover hover:text-text"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-bg-muted">
            <UserPlus className="h-5 w-5 text-text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-text" style={{ letterSpacing: '-0.02em' }}>
            Invite Team Member
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            They&apos;ll receive an invitation email to join your organization.
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-text-secondary">Email address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="member@example.com"
              className="h-[46px] w-full rounded-full border border-border bg-bg-input pl-11 pr-5 text-sm text-text transition-all placeholder:text-text-muted hover:border-border-hover focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
              autoFocus
            />
          </div>
          {error && <p className="mt-1.5 pl-5 text-xs text-error">{error}</p>}
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-text-secondary">Role</label>
          <div className="flex gap-2">
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border text-xs font-medium transition-all ${
                  role === opt.value
                    ? 'border-brand bg-brand text-brand-fg'
                    : 'border-border bg-bg-input text-text-secondary hover:border-border-hover'
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
            className="flex h-10 flex-1 items-center justify-center rounded-full border border-border text-sm font-medium text-text-secondary transition-all hover:bg-bg-hover"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-sm font-medium text-brand-fg transition-all hover:opacity-90 active:scale-[0.98]"
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
  onProfileChange,
  onSocialChange,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
  onSwitchOrg,
  onCreateNew,
  onSave,
  onClearError,
}: OrganizationDashboardProps) {
  const [showInvite, setShowInvite] = useState(false);
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-border bg-bg-card">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6">
          {/* Left: Org switcher */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOrgSwitcher(!showOrgSwitcher)}
                className="flex items-center gap-3 rounded-xl border border-transparent px-1 py-1 transition-colors hover:bg-bg-hover"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
                  <Building2 className="h-5 w-5 text-brand-fg" />
                </div>
                <div className="hidden text-left sm:block">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-semibold text-text" style={{ letterSpacing: '-0.02em' }}>
                      {profile.name || 'Organization'}
                    </h1>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">{profile.website || 'Organization Dashboard'}</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-text-muted sm:block" />
              </button>

              {/* Org switcher dropdown */}
              {showOrgSwitcher && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowOrgSwitcher(false)} />
                  <div
                    className="absolute left-0 top-full z-40 mt-2 w-72 rounded-2xl border border-border bg-bg-card py-2"
                    style={{ boxShadow: 'var(--shadow-lg)' }}
                  >
                    <div className="px-3 pb-2 pt-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
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
                          className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-bg-hover ${
                            org.id === activeOrgId ? 'bg-bg-muted' : ''
                          }`}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-muted text-xs font-semibold text-text-secondary">
                            {org.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-text">{org.name}</p>
                            <p className="truncate text-xs text-text-muted">{org.website}</p>
                          </div>
                          {org.id === activeOrgId && (
                            <Check className="h-4 w-4 shrink-0 text-text" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="mt-1 border-t border-border pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          onCreateNew();
                          setShowOrgSwitcher(false);
                        }}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-bg-hover"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dashed border-border">
                          <Building2 className="h-3.5 w-3.5 text-text-muted" />
                        </div>
                        <p className="text-sm font-medium text-text-secondary">Create New Organization</p>
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
            <div className="hidden items-center gap-1.5 rounded-full border border-border bg-bg-muted px-3 py-1.5 sm:flex">
              <Users className="h-3.5 w-3.5 text-text-muted" />
              <span className="text-xs font-medium text-text-secondary">
                {profile.teamMembers.length} member{profile.teamMembers.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Org count pill */}
            {organizations.length > 1 && (
              <div className="hidden items-center gap-1.5 rounded-full border border-border bg-bg-muted px-3 py-1.5 sm:flex">
                <Building2 className="h-3.5 w-3.5 text-text-muted" />
                <span className="text-xs font-medium text-text-secondary">
                  {organizations.length} org{organizations.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Save */}
            <button
              onClick={onSave}
              disabled={isSaving}
              className={`flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand text-brand-fg hover:opacity-90'
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
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-error/20 bg-error/5 px-4 py-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
            <div className="flex-1">
              <p className="text-sm font-medium text-error">Error</p>
              <p className="mt-0.5 text-sm text-error/90">{error}</p>
            </div>
            {onClearError && (
              <button
                onClick={onClearError}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-error transition-colors hover:bg-error/10"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl border border-border bg-bg-card px-4 py-8">
            <Loader2 className="h-5 w-5 animate-spin text-brand" />
            <p className="text-sm text-text-secondary">Loading organization data...</p>
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
                <div className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-border bg-bg-muted transition-colors hover:border-border-hover">
                  {profile.logo ? (
                    <img src={profile.logo} alt="Logo" className="h-full w-full rounded-2xl object-cover" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-text-muted" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Organization Logo</p>
                  <p className="mt-0.5 text-xs text-text-muted">Recommended: 256×256px, PNG or SVG</p>
                </div>
              </div>

              {/* Fields */}
              <div className="mb-5">
                <label htmlFor="dash-name" className="mb-2 block text-sm font-medium text-text-secondary">
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
                <label htmlFor="dash-tagline" className="mb-2 block text-sm font-medium text-text-secondary">
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
                <label htmlFor="dash-about" className="mb-2 block text-sm font-medium text-text-secondary">
                  About
                </label>
                <textarea
                  id="dash-about"
                  value={profile.about}
                  onChange={(e) => onProfileChange('about', e.target.value)}
                  placeholder="Tell the community about your organization..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-border bg-bg-input px-5 py-3.5 text-sm text-text transition-all duration-200 placeholder:text-text-muted hover:border-border-hover focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
                />
              </div>
            </Card>

            {/* Social Links */}
            <Card>
              <SectionTitle>Social Links</SectionTitle>
              <div className="grid gap-5 sm:grid-cols-2">
                {SOCIAL_FIELDS.map(({ key, label, icon, placeholder }) => (
                  <div key={key}>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary">
                      <span className="text-text-muted">{icon}</span>
                      {label}
                    </label>
                    <input
                      type="url"
                      value={profile.socialLinks[key]}
                      onChange={(e) => onSocialChange(key, e.target.value)}
                      placeholder={placeholder}
                      className={inputClass}
                    />
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
                  className="flex h-9 items-center gap-2 rounded-full bg-brand px-4 text-xs font-medium text-brand-fg transition-all hover:opacity-90 active:scale-[0.97]"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Invite Member
                </button>
              </div>

              {profile.teamMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-bg-muted">
                    <Users className="h-5 w-5 text-text-muted" />
                  </div>
                  <p className="text-sm font-medium text-text">No team members yet</p>
                  <p className="mt-1 text-xs text-text-muted">Invite people to collaborate on your organization.</p>
                  <button
                    onClick={() => setShowInvite(true)}
                    className="mt-4 flex h-9 items-center gap-2 rounded-full border border-border px-4 text-xs font-medium text-text-secondary transition-all hover:bg-bg-hover"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Invite your first member
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-border">
                  {/* Table header */}
                  <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border bg-bg-muted px-4 py-2.5 text-xs font-medium text-text-muted sm:grid-cols-[1fr_120px_100px_48px]">
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
                          idx < profile.teamMembers.length - 1 ? 'border-b border-border' : ''
                        }`}
                      >
                        {/* Info */}
                        <div className="flex items-center gap-3">
                          <Avatar name={member.name} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-text">
                              {member.name}
                              {isOwner && (
                                <span className="ml-2 text-[10px] font-normal text-text-muted">(you)</span>
                              )}
                            </p>
                            <p className="truncate text-xs text-text-muted">{member.email}</p>
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
                        <div className="hidden text-xs text-text-muted sm:block">
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
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-red-50 hover:text-red-500"
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
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <SectionTitle>Quick Info</SectionTitle>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-text-muted">Organization Name</p>
                  <p className="mt-0.5 font-medium text-text">{profile.name || '—'}</p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-text-muted">Website</p>
                  <p className="mt-0.5 font-medium text-text">{profile.website || '—'}</p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-text-muted">Tagline</p>
                  <p className="mt-0.5 font-medium text-text">{profile.tagline || '—'}</p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-text-muted">Team Size</p>
                  <p className="mt-0.5 font-medium text-text">{profile.teamMembers.length} member{profile.teamMembers.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </Card>

            {/* Create Hackathon CTA */}
            <div className="rounded-2xl border border-border bg-brand p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-brand-fg/20 bg-brand-fg/10">
                <Rocket className="h-5 w-5 text-brand-fg" />
              </div>
              <h3 className="text-base font-semibold text-brand-fg">Create Hackathon</h3>
              <p className="mt-1.5 text-sm text-brand-fg/60">
                Launch a hackathon and bring builders together on Stellar.
              </p>
              <button
                disabled
                className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-brand-fg text-sm font-semibold text-brand transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-80"
              >
                Coming Soon
                <ArrowRight className="h-4 w-4" />
              </button>
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
