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
} from 'lucide-react';
import type { OrganizationCreatePayload, OrganizationProfile, SocialLinks, TeamMember } from '../../types/organization.types';

interface OrganizationDashboardProps {
  profile: OrganizationProfile;
  organizations: OrganizationProfile[];
  activeOrgId: string | null;
  isSaving: boolean;
  saveSuccess: boolean;
  onProfileChange: (field: keyof OrganizationProfile, value: string) => void;
  onSocialChange: (field: keyof SocialLinks, value: string) => void;
  onAddMember: (email: string, role: TeamMember['role']) => void;
  onRemoveMember: (memberId: string) => void;
  onUpdateMemberRole: (memberId: string, role: TeamMember['role']) => void;
  onSwitchOrg: (orgId: string) => void;
  onCreate: (payload: OrganizationCreatePayload) => void;
  onSave: () => void;
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
  { key: 'website', label: 'Website', icon: <Globe className="h-4 w-4" />, placeholder: 'https://yourorganization.com' },
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
    Admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    Editor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    Viewer: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
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

/* ── Create Organization Modal ── */
function CreateOrgModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (payload: OrganizationCreatePayload) => void;
}) {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Organization name is required';
    if (!website.trim()) {
      newErrors.website = 'Website URL is required';
    } else if (!/^https?:\/\/.+\..+/.test(website.trim())) {
      newErrors.website = 'Enter a valid URL (e.g. https://example.com)';
    }
    if (!termsAccepted) newErrors.terms = 'You must agree to the Terms & Conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onCreate({ name: name.trim(), website: website.trim(), termsAccepted });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-[420px] rounded-2xl border border-border bg-bg-card p-6"
        style={{ boxShadow: 'var(--shadow-lg)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-hover hover:text-text"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Heading */}
        <h3
          className="mb-2 text-center text-xl font-bold text-text"
          style={{ letterSpacing: '-0.04em', lineHeight: '1.15' }}
        >
          Create your Organization
        </h3>
        <p className="mb-6 text-center text-sm leading-relaxed text-text-secondary">
          Set up your organization profile to start creating hackathons on the Stellar platform.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Organization Name */}
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="Organization Name"
              className="h-[48px] w-full rounded-full border border-border bg-bg px-5 text-sm text-text transition-all duration-200 placeholder:text-text-muted hover:border-border-hover focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
              autoFocus
            />
            {errors.name && <p className="mt-1.5 pl-5 text-xs text-error">{errors.name}</p>}
          </div>

          {/* Website URL */}
          <div>
            <input
              type="url"
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value);
                if (errors.website) setErrors((prev) => ({ ...prev, website: '' }));
              }}
              placeholder="Website URL"
              className="h-[48px] w-full rounded-full border border-border bg-bg px-5 text-sm text-text transition-all duration-200 placeholder:text-text-muted hover:border-border-hover focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
            />
            {errors.website && <p className="mt-1.5 pl-5 text-xs text-error">{errors.website}</p>}
          </div>

          {/* Terms & Conditions */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                setTermsAccepted(!termsAccepted);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
              }}
              className="group flex items-start gap-3 text-left"
            >
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 ${
                  termsAccepted
                    ? 'border-brand bg-brand'
                    : 'border-border group-hover:border-border-hover'
                }`}
              >
                {termsAccepted && <Check className="h-3.5 w-3.5 text-brand-fg" />}
              </div>
              <span className="text-sm leading-snug text-text-secondary">
                I agree to Stellar&apos;s{' '}
                <span className="font-medium text-text underline underline-offset-2">Terms &amp; Conditions</span>
              </span>
            </button>
            {errors.terms && <p className="mt-1.5 ml-8 text-xs text-error">{errors.terms}</p>}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="flex h-[48px] w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-brand-fg transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs leading-relaxed text-text-muted">
          By continuing, you agree to our{' '}
          <a href="#" className="font-medium text-text-secondary underline underline-offset-2 hover:text-text">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="font-medium text-text-secondary underline underline-offset-2 hover:text-text">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

/* ── Avatar placeholder ── */
function Avatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  const colors = [
    'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300',
    'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
    'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300',
    'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300',
    'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300',
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
  onProfileChange,
  onSocialChange,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
  onSwitchOrg,
  onCreate,
  onSave,
}: OrganizationDashboardProps) {
  const [showInvite, setShowInvite] = useState(false);
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);
  const [showCreateOrg, setShowCreateOrg] = useState(false);

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
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
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
                          setShowCreateOrg(true);
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
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
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

      {/* ── Create Organization Modal ── */}
      {showCreateOrg && (
        <CreateOrgModal
          onClose={() => setShowCreateOrg(false)}
          onCreate={onCreate}
        />
      )}
    </div>
  );
}
