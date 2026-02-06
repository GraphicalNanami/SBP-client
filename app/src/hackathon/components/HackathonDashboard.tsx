'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Check,
  Loader2,
  Send,
  Settings,
  Layers,
  FileText,
  Users,
  BarChart3,
  UserCheck,
  Trophy,
  FolderOpen,
  Plus,
  Trash2,
  X,
  GripVertical,
  Mail,
  Shield,
  Eye,
  ChevronDown,
  Calendar,
  MapPin,
  Tag,
  Image as ImageIcon,
  Globe,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import type {
  Hackathon,
  HackathonGeneral,
  HackathonTrack,
  HackathonDashboardTab,
  HackathonCategory,
  HackathonAdmin,
} from '../types/hackathon.types';

/* ═══════════════════════════════════════════════════════
   Props
   ═══════════════════════════════════════════════════════ */
interface HackathonDashboardProps {
  hackathon: Hackathon;
  activeTab: HackathonDashboardTab;
  setActiveTab: (tab: HackathonDashboardTab) => void;
  isSaving: boolean;
  saveSuccess: boolean;
  isLoading?: boolean;
  error?: string | null;
  isNew: boolean;
  canPublish: boolean;
  updateGeneral: <K extends keyof HackathonGeneral>(field: K, value: HackathonGeneral[K]) => void;
  updateDescription: (value: string) => void;
  addTrack: () => void;
  updateTrack: (trackId: string, field: keyof HackathonTrack, value: string | number) => void;
  removeTrack: (trackId: string) => void;
  addAdmin: (email: string, permission: HackathonAdmin['permission']) => void;
  removeAdmin: (adminId: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  handleSave: () => void;
}

/* ═══════════════════════════════════════════════════════
   Shared UI
   ═══════════════════════════════════════════════════════ */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-white p-6 ${className}`}
      style={{ boxShadow: 'var(--shadow)' }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 text-[15px] font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
      {children}
    </h2>
  );
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
      {children}
    </label>
  );
}

const inputClass =
  'h-[46px] w-full rounded-full border border-[var(--border)] bg-white px-5 text-sm text-[var(--text)] transition-all placeholder:text-[var(--text-muted)] hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/10';

const textareaClass =
  'w-full resize-none rounded-2xl border border-[var(--border)] bg-white px-5 py-3.5 text-sm text-[var(--text)] transition-all placeholder:text-[var(--text-muted)] hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/10';

const selectClass =
  'h-[46px] w-full appearance-none rounded-full border border-[var(--border)] bg-white px-5 pr-10 text-sm text-[var(--text)] transition-all hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/10';

/* ── Status badge ── */
const statusStyles: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-600',
  'Under Review': 'bg-amber-50 text-amber-700',
  Active: 'bg-emerald-50 text-emerald-700',
  Ended: 'bg-gray-100 text-gray-500',
  Cancelled: 'bg-red-50 text-red-600',
  Rejected: 'bg-red-50 text-red-600',
};

/* ── Tabs config ── */
const TABS: { key: HackathonDashboardTab; label: string; icon: React.ReactNode }[] = [
  { key: 'general', label: 'General', icon: <Settings className="h-4 w-4" /> },
  { key: 'tracks', label: 'Tracks', icon: <Layers className="h-4 w-4" /> },
  { key: 'description', label: 'Description', icon: <FileText className="h-4 w-4" /> },
  { key: 'team', label: 'Team & Access', icon: <Users className="h-4 w-4" /> },
  { key: 'insights', label: 'Insights', icon: <BarChart3 className="h-4 w-4" /> },
  { key: 'participants', label: 'Participants', icon: <UserCheck className="h-4 w-4" /> },
  { key: 'winners', label: 'Winners & Prizes', icon: <Trophy className="h-4 w-4" /> },
];

/* ── Category options ── */
const CATEGORIES: HackathonCategory[] = [
  'Soroban Smart Contracts',
  'Payments & Remittances',
  'Anchors & On/Off Ramps',
  'DeFi on Stellar',
  'Real World Assets',
  'Cross-border Payments',
  'Developer Tooling',
  'Wallets & Identity',
  'Other',
];

/* ═══════════════════════════════════════════════════════
   Dashboard Component
   ═══════════════════════════════════════════════════════ */
export default function HackathonDashboard({
  hackathon,
  activeTab,
  setActiveTab,
  isSaving,
  saveSuccess,
  isLoading = false,
  error = null,
  isNew,
  canPublish,
  updateGeneral,
  updateDescription,
  addTrack,
  updateTrack,
  removeTrack,
  addAdmin,
  removeAdmin,
  addTag,
  removeTag,
  handleSave,
}: HackathonDashboardProps) {
  const posterInputRef = useRef<HTMLInputElement>(null);

  // Handle poster upload
  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      updateGeneral('poster', result);
    };
    reader.readAsDataURL(file);
  };

  const triggerPosterInput = () => {
    posterInputRef.current?.click();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="aurora-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[var(--brand)]" />
          <p className="text-sm text-[var(--text-muted)]">Loading hackathon...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="aurora-bg min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mx-auto">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--text)] mb-2">Failed to Load Hackathon</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">{error}</p>
          <Link
            href="/organization"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-[var(--brand-fg)] transition-all hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Organization
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="aurora-bg min-h-screen">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            <Link
              href="/organization"
              className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Organization</span>
            </Link>
            <div className="h-5 w-px bg-[var(--border)]" />
            <div>
              <h1
                className="text-sm font-semibold text-[var(--text)]"
                style={{ letterSpacing: '-0.02em' }}
              >
                {hackathon.general.name || (isNew ? 'New Hackathon' : 'Untitled')}
              </h1>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                statusStyles[hackathon.status] || statusStyles.Draft
              }`}
            >
              {hackathon.status}
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Preview Button */}
            <Link
              href={`/hackathon/preview/${hackathon.id}`}
              target="_blank"
              className="flex h-9 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)] active:scale-[0.97]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </Link>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all active:scale-[0.97] disabled:opacity-50 ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : saveSuccess ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}
            </button>

            <button
              disabled={!canPublish}
              className="flex h-9 items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-medium text-[var(--brand-fg)] transition-all hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Review
            </button>
          </div>
        </div>
      </header>

      {/* ── Tabs ── */}
      <div className="border-b border-[var(--border)] bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex gap-1 overflow-x-auto py-1 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-[var(--brand)] text-[var(--brand-fg)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        {activeTab === 'general' && (
          <GeneralTab
            hackathon={hackathon}
            updateGeneral={updateGeneral}
            addTag={addTag}
            removeTag={removeTag}
            posterInputRef={posterInputRef}
            handlePosterUpload={handlePosterUpload}
            triggerPosterInput={triggerPosterInput}
          />
        )}
        {activeTab === 'tracks' && (
          <TracksTab tracks={hackathon.tracks} addTrack={addTrack} updateTrack={updateTrack} removeTrack={removeTrack} />
        )}
        {activeTab === 'description' && (
          <DescriptionTab description={hackathon.description} updateDescription={updateDescription} />
        )}
        {activeTab === 'team' && (
          <TeamTab admins={hackathon.admins} addAdmin={addAdmin} removeAdmin={removeAdmin} />
        )}
        {activeTab === 'insights' && <InsightsTab status={hackathon.status} />}
        {activeTab === 'participants' && <ParticipantsTab hackathon={hackathon} />}
        {activeTab === 'winners' && <WinnersTab hackathon={hackathon} />}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: General
   ═══════════════════════════════════════════════════════ */
function GeneralTab({
  hackathon,
  updateGeneral,
  addTag,
  removeTag,
  posterInputRef,
  handlePosterUpload,
  triggerPosterInput,
}: {
  hackathon: Hackathon;
  updateGeneral: <K extends keyof HackathonGeneral>(field: K, value: HackathonGeneral[K]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  posterInputRef: React.RefObject<HTMLInputElement>;
  handlePosterUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerPosterInput: () => void;
}) {
  const g = hackathon.general;
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim()) {
      addTag(tagInput.trim());
      setTagInput('');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Basic info */}
        <Card>
          <SectionTitle>Basic Details</SectionTitle>

          <div className="mb-5">
            <Label htmlFor="h-name">Hackathon Name</Label>
            <input
              id="h-name"
              type="text"
              value={g.name}
              onChange={(e) => updateGeneral('name', e.target.value)}
              placeholder="e.g. Soroban Buildathon 2026"
              className={inputClass}
            />
          </div>

          <div className="mb-5 grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Category</Label>
              <div className="relative">
                <select
                  value={g.category}
                  onChange={(e) => updateGeneral('category', e.target.value as HackathonCategory)}
                  className={selectClass}
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              </div>
            </div>
            <div>
              <Label>Visibility</Label>
              <div className="flex gap-2">
                {(['Public', 'Private'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updateGeneral('visibility', v)}
                    className={`flex h-[46px] flex-1 items-center justify-center gap-2 rounded-full border text-sm font-medium transition-all ${
                      g.visibility === v
                        ? 'border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-fg)]'
                        : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    {v === 'Public' ? <Globe className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Poster */}
          <div className="mb-5">
            <Label>Poster Image</Label>
            <input
              ref={posterInputRef}
              type="file"
              accept="image/*"
              onChange={handlePosterUpload}
              className="hidden"
              aria-label="Upload hackathon poster"
            />
            <div
              onClick={triggerPosterInput}
              className="flex h-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-muted)] transition-colors hover:border-[var(--border-hover)]"
            >
              {g.poster ? (
                <img src={g.poster} alt="Poster" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-2 h-6 w-6 text-[var(--text-muted)]" />
                  <p className="text-xs text-[var(--text-muted)]">Click to upload poster (recommended 1200×630)</p>
                </div>
              )}
            </div>
          </div>

          {/* Prize pool */}
          <div className="mb-5 grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="h-prize">Prize Pool</Label>
              <input
                id="h-prize"
                type="number"
                value={g.prizePool || ''}
                onChange={(e) => updateGeneral('prizePool', Number(e.target.value))}
                placeholder="50000"
                className={inputClass}
              />
            </div>
            <div>
              <Label>Prize Asset</Label>
              <div className="relative">
                <select
                  value={g.prizeAsset}
                  onChange={(e) => updateGeneral('prizeAsset', e.target.value)}
                  className={selectClass}
                >
                  <option value="USDC">USDC on Stellar</option>
                  <option value="XLM">XLM</option>
                  <option value="Custom">Custom Stellar Asset</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag and press Enter"
                className={inputClass}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="flex h-[46px] shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] px-4 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)]"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            {g.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {g.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 text-[var(--text-muted)] hover:text-[var(--error)]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Dates & Venue */}
        <Card>
          <SectionTitle>Schedule & Venue</SectionTitle>

          <div className="mb-5 grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="h-start">Start Time</Label>
              <input
                id="h-start"
                type="datetime-local"
                value={g.startTime ? g.startTime.slice(0, 16) : ''}
                onChange={(e) => updateGeneral('startTime', new Date(e.target.value).toISOString())}
                className={inputClass}
              />
              <p className="mt-1.5 pl-5 text-xs text-[var(--text-muted)]">Time will be stored in UTC</p>
            </div>
            <div>
              <Label htmlFor="h-deadline">Submission Deadline</Label>
              <input
                id="h-deadline"
                type="datetime-local"
                value={g.submissionDeadline ? g.submissionDeadline.slice(0, 16) : ''}
                onChange={(e) =>
                  updateGeneral('submissionDeadline', new Date(e.target.value).toISOString())
                }
                className={inputClass}
              />
              <p className="mt-1.5 pl-5 text-xs text-[var(--text-muted)]">Time will be stored in UTC</p>
            </div>
          </div>

          <div className="mb-5">
            <Label htmlFor="h-prereg">Pre-registration End Time (optional)</Label>
            <input
              id="h-prereg"
              type="datetime-local"
              value={g.preRegEndTime ? g.preRegEndTime.slice(0, 16) : ''}
              onChange={(e) =>
                updateGeneral('preRegEndTime', e.target.value ? new Date(e.target.value).toISOString() : '')
              }
              className={inputClass}
            />
            <p className="mt-1.5 pl-5 text-xs text-[var(--text-muted)]">Time will be stored in UTC</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Venue</Label>
              <div className="flex gap-2">
                {(['Online', 'In-Person'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updateGeneral('venue', v === 'In-Person' ? 'In-Person' : 'Online')}
                    className={`flex h-[46px] flex-1 items-center justify-center gap-2 rounded-full border text-sm font-medium transition-all ${
                      g.venue === v
                        ? 'border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-fg)]'
                        : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    {v === 'Online' ? <Globe className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                    {v}
                  </button>
                ))}
              </div>
            </div>
            {g.venue === 'In-Person' && (
              <div>
                <Label htmlFor="h-loc">Location</Label>
                <input
                  id="h-loc"
                  type="text"
                  value={g.venueLocation}
                  onChange={(e) => updateGeneral('venueLocation', e.target.value)}
                  placeholder="City, Country"
                  className={inputClass}
                />
              </div>
            )}
          </div>
        </Card>

        {/* Submission & Contact */}
        <Card>
          <SectionTitle>Submission & Contact</SectionTitle>

          <div className="mb-5">
            <Label htmlFor="h-reqs">Submission Requirements</Label>
            <textarea
              id="h-reqs"
              value={g.submissionRequirements}
              onChange={(e) => updateGeneral('submissionRequirements', e.target.value)}
              placeholder="What builders must include: repo link, demo video, write-up, Soroban contract ID, etc."
              rows={4}
              className={textareaClass}
            />
          </div>

          <div>
            <Label htmlFor="h-contact">Administrator Contact</Label>
            <input
              id="h-contact"
              type="text"
              value={g.adminContact}
              onChange={(e) => updateGeneral('adminContact', e.target.value)}
              placeholder="Email or URL for participant support"
              className={inputClass}
            />
          </div>
        </Card>
      </div>

      {/* Right column — summary */}
      <div className="space-y-6">
        <Card>
          <SectionTitle>Summary</SectionTitle>
          <div className="space-y-4 text-sm">
            {[
              { label: 'Name', value: g.name },
              { label: 'Category', value: g.category },
              { label: 'Visibility', value: g.visibility },
              { label: 'Prize', value: g.prizePool ? `${g.prizePool.toLocaleString()} ${g.prizeAsset}` : '' },
              { label: 'Venue', value: g.venue === 'In-Person' ? g.venueLocation || 'In-Person' : 'Online' },
              { label: 'Tracks', value: `${hackathon.tracks.length}` },
              { label: 'Admins', value: `${hackathon.admins.length}` },
            ].map((item, idx) => (
              <div key={item.label} className={idx > 0 ? 'border-t border-[var(--border)] pt-4' : ''}>
                <p className="text-[var(--text-muted)]">{item.label}</p>
                <p className="mt-0.5 font-medium text-[var(--text)]">{item.value || '—'}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-[var(--brand)]/20 bg-[var(--bg-muted)]">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">Publish Checklist</h3>
          <div className="space-y-2 text-xs">
            {[
              { ok: !!g.name.trim(), text: 'Hackathon name' },
              { ok: !!g.category, text: 'Category selected' },
              { ok: g.prizePool > 0, text: 'Prize pool set' },
              { ok: !!g.startTime, text: 'Start time' },
              { ok: !!g.submissionDeadline, text: 'Submission deadline' },
              { ok: !!g.adminContact.trim(), text: 'Admin contact' },
              { ok: hackathon.tracks.length > 0, text: 'At least one track' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    item.ok ? 'bg-emerald-500' : 'border border-[var(--border)] bg-white'
                  }`}
                >
                  {item.ok && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <span className={item.ok ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}>{item.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Tracks
   ═══════════════════════════════════════════════════════ */
function TracksTab({
  tracks,
  addTrack,
  updateTrack,
  removeTrack,
}: {
  tracks: HackathonTrack[];
  addTrack: () => void;
  updateTrack: (trackId: string, field: keyof HackathonTrack, value: string | number) => void;
  removeTrack: (trackId: string) => void;
}) {
  return (
    <div className="mx-auto max-w-[800px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
            Tracks
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Define thematic categories for the hackathon. Builders choose a track when submitting.
          </p>
        </div>
        <button
          onClick={addTrack}
          className="flex h-9 items-center gap-2 rounded-full bg-[var(--brand)] px-4 text-sm font-medium text-[var(--brand-fg)] transition-all hover:opacity-90 active:scale-[0.97]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Track
        </button>
      </div>

      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-white py-16 text-center">
          <Layers className="mb-3 h-8 w-8 text-[var(--text-muted)]" />
          <p className="text-sm font-medium text-[var(--text)]">No tracks yet</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Add at least one track before publishing.</p>
          <button
            onClick={addTrack}
            className="mt-4 flex h-9 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-xs font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add your first track
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tracks.map((track, idx) => (
            <Card key={track.id}>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-muted)] text-xs font-semibold text-[var(--text-muted)]">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={track.name}
                    onChange={(e) => updateTrack(track.id, 'name', e.target.value)}
                    placeholder="Track name (e.g. Best Soroban dApp)"
                    className={inputClass}
                  />
                  <textarea
                    value={track.description}
                    onChange={(e) => updateTrack(track.id, 'description', e.target.value)}
                    placeholder="Describe this track, judging criteria hints..."
                    rows={3}
                    className={textareaClass}
                  />
                </div>
                <button
                  onClick={() => removeTrack(track.id)}
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Description
   ═══════════════════════════════════════════════════════ */
function DescriptionTab({
  description,
  updateDescription,
}: {
  description: string;
  updateDescription: (value: string) => void;
}) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="mx-auto max-w-[800px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
            Description
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Write the full hackathon description visible on the public detail page.
          </p>
        </div>
        <div className="flex gap-1.5 rounded-full border border-[var(--border)] p-0.5">
          <button
            onClick={() => setPreview(false)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              !preview ? 'bg-[var(--brand)] text-[var(--brand-fg)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setPreview(true)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              preview ? 'bg-[var(--brand)] text-[var(--brand-fg)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      <Card>
        {preview ? (
          <div className="prose prose-sm max-w-none text-[var(--text-secondary)]">
            {description ? (
              description.split('\n').map((line, i) => (
                <p key={i}>{line || <br />}</p>
              ))
            ) : (
              <p className="text-[var(--text-muted)] italic">No description yet. Switch to Edit to start writing.</p>
            )}
          </div>
        ) : (
          <>
            <textarea
              value={description}
              onChange={(e) => updateDescription(e.target.value)}
              placeholder={`## About\nDescribe your hackathon...\n\n## Rules & Eligibility\n\n## Resources\n- Soroban Docs\n- Stellar Laboratory\n\n## Schedule\n\n## Prizes\n\n## FAQs`}
              rows={20}
              className={`${textareaClass} font-mono text-[13px]`}
            />
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Markdown formatting supported. Rich text editor coming soon.
            </p>
          </>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Team & Access
   ═══════════════════════════════════════════════════════ */
function TeamTab({
  admins,
  addAdmin,
  removeAdmin,
}: {
  admins: HackathonAdmin[];
  addAdmin: (email: string, permission: HackathonAdmin['permission']) => void;
  removeAdmin: (adminId: string) => void;
}) {
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<HackathonAdmin['permission']>('Full Access');
  const [error, setError] = useState('');

  const handleInvite = () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email');
      return;
    }
    addAdmin(email.trim(), permission);
    setEmail('');
    setShowInvite(false);
  };

  return (
    <div className="mx-auto max-w-[800px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
            Team & Access
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Manage who can edit and manage this hackathon.
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex h-9 items-center gap-2 rounded-full bg-[var(--brand)] px-4 text-sm font-medium text-[var(--brand-fg)] transition-all hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          Invite Admin
        </button>
      </div>

      {/* Invite inline form */}
      {showInvite && (
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Label>Email</Label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="admin@example.com"
                className={inputClass}
                autoFocus
              />
              {error && <p className="mt-1 pl-5 text-xs text-[var(--error)]">{error}</p>}
            </div>
            <div className="w-48">
              <Label>Permission</Label>
              <div className="relative">
                <select
                  value={permission}
                  onChange={(e) => setPermission(e.target.value as HackathonAdmin['permission'])}
                  className={selectClass}
                >
                  <option value="Full Access">Full Access</option>
                  <option value="Limited Access">Limited Access</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowInvite(false)}
                className="flex h-[46px] items-center rounded-full border border-[var(--border)] px-4 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)]"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="flex h-[46px] items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-medium text-[var(--brand-fg)] transition-all hover:opacity-90"
              >
                <Mail className="h-3.5 w-3.5" />
                Send
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Admin list */}
      <Card>
        {admins.map((admin, idx) => {
          const isCreator = idx === 0;
          return (
            <div
              key={admin.id}
              className={`flex items-center justify-between py-3 ${
                idx < admins.length - 1 ? 'border-b border-[var(--border)]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-muted)] text-xs font-semibold text-[var(--text-secondary)]">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    {admin.name}
                    {isCreator && <span className="ml-2 text-[10px] text-[var(--text-muted)]">(creator)</span>}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{admin.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[var(--bg-muted)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
                  {admin.permission}
                </span>
                {!isCreator && (
                  <button
                    onClick={() => removeAdmin(admin.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Insights (placeholder)
   ═══════════════════════════════════════════════════════ */
function InsightsTab({ status }: { status: string }) {
  const metrics = [
    { label: 'Total Registrations', value: '0' },
    { label: 'Total Submissions', value: '0' },
    { label: 'Page Views', value: '0' },
    { label: 'Unique Visitors', value: '0' },
    { label: 'Registration Conversion', value: '0%' },
    { label: 'Submission Rate', value: '0%' },
  ];

  return (
    <div className="mx-auto max-w-[800px] space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
          Insights
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Engagement and participation metrics for your hackathon.
        </p>
      </div>

      {status === 'Draft' && (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white px-6 py-10 text-center">
          <BarChart3 className="mx-auto mb-3 h-8 w-8 text-[var(--text-muted)]" />
          <p className="text-sm font-medium text-[var(--text)]">Analytics available after publishing</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Data will start accumulating once the hackathon is live.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <p className="text-xs text-[var(--text-muted)]">{m.label}</p>
            <p className="mt-2 text-2xl font-bold text-[var(--text)]">{m.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Participants (placeholder)
   ═══════════════════════════════════════════════════════ */
function ParticipantsTab({ hackathon }: { hackathon: Hackathon }) {
  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      {/* Builders */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
          Builders
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Registered participants for this hackathon.</p>
      </div>
      <Card>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <UserCheck className="mb-3 h-8 w-8 text-[var(--text-muted)]" />
          <p className="text-sm font-medium text-[var(--text)]">No registrations yet</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Builders will appear here once they register for the hackathon.
          </p>
        </div>
      </Card>

      {/* Projects */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
          Projects
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Submitted work from participating teams.</p>
      </div>
      <Card>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <FolderOpen className="mb-3 h-8 w-8 text-[var(--text-muted)]" />
          <p className="text-sm font-medium text-[var(--text)]">No submissions yet</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Projects will appear here after the submission deadline opens.
          </p>
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Winners & Prizes (placeholder)
   ═══════════════════════════════════════════════════════ */
function WinnersTab({ hackathon }: { hackathon: Hackathon }) {
  const [showAddPrize, setShowAddPrize] = useState(false);
  const [prizeName, setPrizeName] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [prizeDescription, setPrizeDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showInviteJudge, setShowInviteJudge] = useState(false);
  const [judgeName, setJudgeName] = useState('');
  const [judgeEmail, setJudgeEmail] = useState('');
  const [judgeTracks, setJudgeTracks] = useState<string[]>([]);
  const [judgeErrors, setJudgeErrors] = useState<Record<string, string>>({});

  const handleTrackToggle = (trackId: string) => {
    setSelectedTracks((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const handleAddPrize = () => {
    const newErrors: Record<string, string> = {};
    if (!prizeName.trim()) newErrors.prizeName = 'Prize name is required';
    if (!prizeDescription.trim()) newErrors.prizeDescription = 'Prize description is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // TODO: Add prize logic here
      console.log('Adding prize:', { prizeName, selectedTracks, prizeDescription });
      // Reset form
      setPrizeName('');
      setSelectedTracks([]);
      setPrizeDescription('');
      setShowAddPrize(false);
    }
  };

  const handleJudgeTrackToggle = (trackId: string) => {
    setJudgeTracks((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const handleInviteJudge = () => {
    const newErrors: Record<string, string> = {};
    if (!judgeName.trim()) newErrors.judgeName = 'Judge name is required';
    if (!judgeEmail.trim()) {
      newErrors.judgeEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(judgeEmail.trim())) {
      newErrors.judgeEmail = 'Enter a valid email';
    }
    
    setJudgeErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // TODO: Add judge invite logic here
      console.log('Inviting judge:', { judgeName, judgeEmail, judgeTracks });
      // Reset form
      setJudgeName('');
      setJudgeEmail('');
      setJudgeTracks([]);
      setShowInviteJudge(false);
    }
  };

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      {/* Prize Setting */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
          Prize Settings
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Define prizes, assign them to tracks, and set placements.
        </p>
      </div>

      {/* Add Prize Form */}
      {showAddPrize && (
        <Card>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text)]">Add New Prize</h3>
              <button
                onClick={() => {
                  setShowAddPrize(false);
                  setPrizeName('');
                  setSelectedTracks([]);
                  setPrizeDescription('');
                  setErrors({});
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Prize Name */}
            <div>
              <Label htmlFor="prize-name">
                Prize Name <span className="text-red-500">*</span>
              </Label>
              <input
                id="prize-name"
                type="text"
                value={prizeName}
                onChange={(e) => {
                  setPrizeName(e.target.value);
                  if (errors.prizeName) setErrors((prev) => ({ ...prev, prizeName: '' }));
                }}
                placeholder="Enter the prize name"
                className={inputClass}
              />
              {errors.prizeName && <p className="mt-1.5 pl-5 text-xs text-red-500">{errors.prizeName}</p>}
            </div>

            {/* Track Selection */}
            <div>
              <Label>Track Selection</Label>
              <p className="mb-3 text-xs text-[var(--text-muted)]">
                Choose one or more tracks eligible for this prize
              </p>
              <div className="space-y-2">
                {hackathon.tracks.length > 0 ? (
                  <>
                    {hackathon.tracks.map((track) => (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => handleTrackToggle(track.id)}
                        className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-left transition-all hover:bg-[var(--bg-hover)]"
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                            selectedTracks.includes(track.id)
                              ? 'border-[var(--brand)] bg-[var(--brand)]'
                              : 'border-[var(--border)]'
                          }`}
                        >
                          {selectedTracks.includes(track.id) && <Check className="h-3.5 w-3.5 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[var(--text)]">{track.name || 'Untitled Track'}</p>
                          {track.description && (
                            <p className="mt-0.5 text-xs text-[var(--text-muted)] line-clamp-1">{track.description}</p>
                          )}
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedTracks.length === hackathon.tracks.length) {
                          setSelectedTracks([]);
                        } else {
                          setSelectedTracks(hackathon.tracks.map((t) => t.id));
                        }
                      }}
                      className="text-xs text-[var(--brand)] hover:underline"
                    >
                      {selectedTracks.length === hackathon.tracks.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] px-4 py-6 text-center">
                    <Layers className="mx-auto mb-2 h-6 w-6 text-[var(--text-muted)]" />
                    <p className="text-xs text-[var(--text-muted)]">No tracks available. Add tracks first in the Tracks tab.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Prize Description */}
            <div>
              <Label htmlFor="prize-desc">
                Prize Description <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="prize-desc"
                value={prizeDescription}
                onChange={(e) => {
                  setPrizeDescription(e.target.value);
                  if (errors.prizeDescription) setErrors((prev) => ({ ...prev, prizeDescription: '' }));
                }}
                placeholder="Describe the prize details, criteria, and any special conditions..."
                rows={4}
                className={textareaClass}
              />
              {errors.prizeDescription && <p className="mt-1.5 pl-5 text-xs text-red-500">{errors.prizeDescription}</p>}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowAddPrize(false);
                  setPrizeName('');
                  setSelectedTracks([]);
                  setPrizeDescription('');
                  setErrors({});
                }}
                className="flex h-10 items-center rounded-full border border-[var(--border)] px-5 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPrize}
                className="flex h-10 items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-medium text-[var(--brand-fg)] transition-all hover:opacity-90 active:scale-[0.97]"
              >
                <Plus className="h-4 w-4" />
                Add Prize
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State or Prize List */}
      {!showAddPrize && (
        <Card>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Trophy className="mb-3 h-8 w-8 text-[var(--text-muted)]" />
            <p className="text-sm font-medium text-[var(--text)]">No prizes configured</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Add prize categories and placement tiers for this hackathon.
            </p>
            <button
              onClick={() => setShowAddPrize(true)}
              className="mt-4 flex h-9 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-xs font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Prize
            </button>
          </div>
        </Card>
      )}

      {/* Judges */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
          Judges
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Invite judges and assign them to tracks.
        </p>
      </div>

      {/* Invite Judge Form */}
      {showInviteJudge && (
        <Card>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text)]">Invite Judge</h3>
              <button
                onClick={() => {
                  setShowInviteJudge(false);
                  setJudgeEmail('');
                  setJudgeName('');
                  setJudgeTracks([]);
                  setJudgeErrors({});
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Judge Name */}
            <div>
              <Label htmlFor="judge-name">
                Judge Name <span className="text-red-500">*</span>
              </Label>
              <input
                id="judge-name"
                type="text"
                value={judgeName}
                onChange={(e) => {
                  setJudgeName(e.target.value);
                  if (judgeErrors.judgeName) setJudgeErrors((prev) => ({ ...prev, judgeName: '' }));
                }}
                placeholder="Enter judge's full name"
                className={inputClass}
              />
              {judgeErrors.judgeName && <p className="mt-1.5 pl-5 text-xs text-red-500">{judgeErrors.judgeName}</p>}
            </div>

            {/* Judge Email */}
            <div>
              <Label htmlFor="judge-email">
                Email <span className="text-red-500">*</span>
              </Label>
              <input
                id="judge-email"
                type="email"
                value={judgeEmail}
                onChange={(e) => {
                  setJudgeEmail(e.target.value);
                  if (judgeErrors.judgeEmail) setJudgeErrors((prev) => ({ ...prev, judgeEmail: '' }));
                }}
                placeholder="judge@example.com"
                className={inputClass}
              />
              {judgeErrors.judgeEmail && <p className="mt-1.5 pl-5 text-xs text-red-500">{judgeErrors.judgeEmail}</p>}
            </div>

            {/* Track Assignment */}
            <div>
              <Label>Assign to Tracks</Label>
              <p className="mb-3 text-xs text-[var(--text-muted)]">
                Choose which tracks this judge will evaluate
              </p>
              <div className="space-y-2">
                {hackathon.tracks.length > 0 ? (
                  <>
                    {hackathon.tracks.map((track) => (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => handleJudgeTrackToggle(track.id)}
                        className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-left transition-all hover:bg-[var(--bg-hover)]"
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                            judgeTracks.includes(track.id)
                              ? 'border-[var(--brand)] bg-[var(--brand)]'
                              : 'border-[var(--border)]'
                          }`}
                        >
                          {judgeTracks.includes(track.id) && <Check className="h-3.5 w-3.5 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[var(--text)]">{track.name || 'Untitled Track'}</p>
                          {track.description && (
                            <p className="mt-0.5 text-xs text-[var(--text-muted)] line-clamp-1">{track.description}</p>
                          )}
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        if (judgeTracks.length === hackathon.tracks.length) {
                          setJudgeTracks([]);
                        } else {
                          setJudgeTracks(hackathon.tracks.map((t) => t.id));
                        }
                      }}
                      className="text-xs text-[var(--brand)] hover:underline"
                    >
                      {judgeTracks.length === hackathon.tracks.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-muted)] px-4 py-6 text-center">
                    <Layers className="mx-auto mb-2 h-6 w-6 text-[var(--text-muted)]" />
                    <p className="text-xs text-[var(--text-muted)]">No tracks available. Add tracks first in the Tracks tab.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowInviteJudge(false);
                  setJudgeEmail('');
                  setJudgeName('');
                  setJudgeTracks([]);
                  setJudgeErrors({});
                }}
                className="flex h-10 items-center rounded-full border border-[var(--border)] px-5 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)]"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteJudge}
                className="flex h-10 items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-medium text-[var(--brand-fg)] transition-all hover:opacity-90 active:scale-[0.97]"
              >
                <Mail className="h-4 w-4" />
                Send Invite
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State or Judge List */}
      {!showInviteJudge && (
        <Card>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Users className="mb-3 h-8 w-8 text-[var(--text-muted)]" />
            <p className="text-sm font-medium text-[var(--text)]">No judges invited</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Add judges to evaluate submissions.
            </p>
            <button
              onClick={() => setShowInviteJudge(true)}
              className="mt-4 flex h-9 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-xs font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)]"
            >
              <Plus className="h-3.5 w-3.5" />
              Invite Judge
            </button>
          </div>
        </Card>
      )}

      {/* Winner Assignment */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
          Winner Assignment & Distribution
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Assign winners after judging and manage prize distribution.
        </p>
      </div>
      <Card>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <HelpCircle className="mb-3 h-8 w-8 text-[var(--text-muted)]" />
          <p className="text-sm font-medium text-[var(--text)]">Available after judging</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Winner assignment and prize distribution will be unlocked once the hackathon ends and judging begins.
          </p>
        </div>
      </Card>
    </div>
  );
}
