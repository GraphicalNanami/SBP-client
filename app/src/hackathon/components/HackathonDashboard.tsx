'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/src/shared/lib/api/client';
import { ENDPOINTS } from '@/src/shared/lib/api/endpoints';
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
  AlertCircle,
  Search,
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
  validationError?: string | null;
  fieldErrors?: Record<string, string>;
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
  handleSubmitForReview: () => void;
}

/* ═══════════════════════════════════════════════════════
   Shared UI
   ═══════════════════════════════════════════════════════ */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-[#E5E5E5] bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 text-[15px] font-semibold text-[#1A1A1A] tracking-tight" style={{ fontFamily: 'var(--font-onest)' }}>
      {children}
    </h2>
  );
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-[#4D4D4D]">
      {children}
    </label>
  );
}

const inputClass =
  'h-[46px] w-full rounded-full border border-[#E5E5E5] bg-white px-5 text-sm text-[#1A1A1A] transition-all placeholder:text-[#4D4D4D] hover:border-[#E5E5E5] focus:border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/10';

const textareaClass =
  'w-full resize-none rounded-2xl border border-[#E5E5E5] bg-white px-5 py-3.5 text-sm text-[#1A1A1A] transition-all placeholder:text-[#4D4D4D] hover:border-[#E5E5E5] focus:border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/10';

const selectClass =
  'h-[46px] w-full appearance-none rounded-full border border-[#E5E5E5] bg-white px-5 pr-10 text-sm text-[#1A1A1A] transition-all hover:border-[#E5E5E5] focus:border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/10';

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
  validationError = null,
  fieldErrors = {},
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
  handleSubmitForReview,
}: HackathonDashboardProps) {
  const posterInputRef = useRef<HTMLInputElement>(null);
  const [posterError, setPosterError] = useState<string | null>(null);

  // Auto-clear poster error after 5 seconds
  useEffect(() => {
    if (posterError) {
      const timer = setTimeout(() => {
        setPosterError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [posterError]);

  // Handle poster upload
  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear any previous error
    setPosterError(null);

    // Validate file type
    if (!file.type || !file.type.startsWith('image/')) {
      setPosterError('Please select an image file');
      return;
    }

    // Validate file size (max 2MB to account for base64 inflation and leave buffer)
    if (file.size > 2 * 1024 * 1024) {
      setPosterError('Image size should be less than 2MB');
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
      <div className="bg-[#FCFCFC] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#1A1A1A]" />
          <p className="text-sm text-[#4D4D4D]">Loading hackathon...</p>
        </div>
      </div>
    );
  }

  // Show error state (only for fatal errors, not validation errors)
  if (error && !validationError) {
    return (
      <div className="bg-[#FCFCFC] min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mx-auto">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">Failed to Load Hackathon</h2>
          <p className="text-sm text-[#4D4D4D] mb-6">{error}</p>
          <Link
            href="/organization"
            className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Organization
          </Link>
        </div>
      </div>
    );
  }

  // Safety check: ensure hackathon.general exists
  if (!hackathon.general) {
    return (
      <div className="bg-[#FCFCFC] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#1A1A1A]" />
          <p className="text-sm text-[#4D4D4D]">Initializing hackathon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFCFC] min-h-screen">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-[#E5E5E5] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            <Link
              href="/organization"
              className="flex items-center gap-1.5 text-sm text-[#4D4D4D] transition-colors hover:text-[#1A1A1A]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Organization</span>
            </Link>
            <div className="h-5 w-px bg-[#E5E5E5]" />
            <div>
              <h1
                className="text-sm font-semibold text-[#1A1A1A] tracking-tight"
                style={{ fontFamily: 'var(--font-onest)' }}
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
              className="flex h-9 items-center gap-2 rounded-full border border-[#E5E5E5] px-4 text-sm font-medium text-[#4D4D4D] transition-all hover:bg-[#F5F5F5] active:scale-[0.97]"
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
                  : 'border border-[#E5E5E5] text-[#4D4D4D] hover:bg-[#F5F5F5]'
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
              onClick={handleSubmitForReview}
              disabled={!canPublish || isSaving}
              className="flex h-9 items-center gap-2 rounded-full bg-[#1A1A1A] px-5 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Review
            </button>
          </div>
        </div>
      </header>

      {/* ── Validation Error Banner ── */}
      {validationError && (
        <div className="border-b border-red-200 bg-red-50">
          <div className="mx-auto max-w-[1200px] px-6 py-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-900">Validation Error</p>
                <p className="text-sm text-red-700 mt-0.5">{validationError}</p>
              </div>
              <button
                onClick={() => {
                  // This will be handled by the auto-clear timeout
                }}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="border-b border-[#E5E5E5] bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex gap-1 overflow-x-auto py-1 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-[#4D4D4D] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]'
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
            fieldErrors={fieldErrors}
            posterError={posterError}
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
  fieldErrors = {},
  posterError,
}: {
  hackathon: Hackathon;
  updateGeneral: <K extends keyof HackathonGeneral>(field: K, value: HackathonGeneral[K]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  posterInputRef: React.RefObject<HTMLInputElement | null>;
  handlePosterUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerPosterInput: () => void;
  fieldErrors?: Record<string, string>;
  posterError: string | null;
}) {
  const g = hackathon.general;
  const [tagInput, setTagInput] = useState('');

  // Guard: ensure general is defined
  if (!g) {
    return null;
  }

  const handleAddTag = () => {
    if (tagInput.trim()) {
      addTag(tagInput.trim());
      setTagInput('');
    }
  };

  // Helper to get error styling for inputs
  const getInputClass = (fieldName: string) => {
    const hasError = fieldErrors[fieldName];
    return `h-[46px] w-full rounded-full border px-5 text-sm transition-all placeholder:text-[#4D4D4D] focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-500 bg-red-50 text-red-900 focus:border-red-600 focus:ring-red-500/10'
        : 'border-[#E5E5E5] bg-white text-[#1A1A1A] hover:border-[#E5E5E5] focus:border-[#1A1A1A] focus:ring-[#1A1A1A]/10'
    }`;
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
              className={getInputClass('name')}
            />
            {fieldErrors.name && (
              <p className="mt-1.5 pl-5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.name}
              </p>
            )}
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
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4D4D4D]" />
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
                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                        : 'border-[#E5E5E5] text-[#4D4D4D] hover:border-[#E5E5E5]'
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
              className={`flex h-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed transition-colors ${
                posterError || fieldErrors.poster
                  ? 'border-red-500 bg-red-50 hover:border-red-600'
                  : 'border-[#E5E5E5] bg-[#F5F5F5] hover:border-[#E5E5E5]'
              }`}
            >
              {g.poster ? (
                <img src={g.poster} alt="Poster" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <div className="text-center">
                  <ImageIcon className={`mx-auto mb-2 h-6 w-6 ${posterError || fieldErrors.poster ? 'text-red-500' : 'text-[#4D4D4D]'}`} />
                  <p className={`text-xs ${posterError || fieldErrors.poster ? 'text-red-600' : 'text-[#4D4D4D]'}`}>
                    Click to upload poster (recommended 1200×630, max 2MB)
                  </p>
                </div>
              )}
            </div>
            {(posterError || fieldErrors.poster) && (
              <p className="mt-1.5 pl-2 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {posterError || fieldErrors.poster}
              </p>
            )}
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
                className={getInputClass('prizePool')}
              />
              {fieldErrors.prizePool && (
                <p className="mt-1.5 pl-5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.prizePool}
                </p>
              )}
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
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4D4D4D]" />
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
                className="flex h-[46px] shrink-0 items-center gap-1.5 rounded-full border border-[#E5E5E5] px-4 text-sm font-medium text-[#4D4D4D] transition-all hover:bg-[#F5F5F5]"
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
                    className="flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-[#F5F5F5] px-3 py-1 text-xs font-medium text-[#4D4D4D]"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 text-[#4D4D4D] hover:text-red-500"
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
                className={getInputClass('startTime')}
              />
              {fieldErrors.startTime ? (
                <p className="mt-1.5 pl-5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.startTime}
                </p>
              ) : (
                <p className="mt-1.5 pl-5 text-xs text-[#4D4D4D]">Time will be stored in UTC</p>
              )}
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
                className={getInputClass('submissionDeadline')}
              />
              {fieldErrors.submissionDeadline ? (
                <p className="mt-1.5 pl-5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.submissionDeadline}
                </p>
              ) : (
                <p className="mt-1.5 pl-5 text-xs text-[#4D4D4D]">Time will be stored in UTC</p>
              )}
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
              className={getInputClass('preRegEndTime')}
            />
            {fieldErrors.preRegEndTime ? (
              <p className="mt-1.5 pl-5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.preRegEndTime}
              </p>
            ) : (
              <p className="mt-1.5 pl-5 text-xs text-[#4D4D4D]">Time will be stored in UTC</p>
            )}
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
                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                        : 'border-[#E5E5E5] text-[#4D4D4D] hover:border-[#E5E5E5]'
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
              className={getInputClass('adminContact')}
            />
            {fieldErrors.adminContact && (
              <p className="mt-1.5 pl-5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.adminContact}
              </p>
            )}
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
              <div key={item.label} className={idx > 0 ? 'border-t border-[#E5E5E5] pt-4' : ''}>
                <p className="text-[#4D4D4D]">{item.label}</p>
                <p className="mt-0.5 font-medium text-[#1A1A1A]">{item.value || '—'}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-[#E5E5E5] bg-[#F5F5F5]">
          <h3 className="mb-2 text-sm font-semibold text-[#1A1A1A]">Publish Checklist</h3>
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
                    item.ok ? 'bg-emerald-500' : 'border border-[#E5E5E5] bg-white'
                  }`}
                >
                  {item.ok && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <span className={item.ok ? 'text-[#1A1A1A]' : 'text-[#4D4D4D]'}>{item.text}</span>
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
          <h2 className="text-lg font-semibold text-[#1A1A1A]" style={{ letterSpacing: '-0.02em' }}>
            Tracks
          </h2>
          <p className="mt-1 text-sm text-[#4D4D4D]">
            Define thematic categories for the hackathon. Builders choose a track when submitting.
          </p>
        </div>
        <button
          onClick={addTrack}
          className="flex h-9 items-center gap-2 rounded-full bg-[#1A1A1A] px-4 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.97]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Track
        </button>
      </div>

      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E5E5] bg-white py-16 text-center">
          <Layers className="mb-3 h-8 w-8 text-[#4D4D4D]" />
          <p className="text-sm font-medium text-[#1A1A1A]">No tracks yet</p>
          <p className="mt-1 text-xs text-[#4D4D4D]">Add at least one track before publishing.</p>
          <button
            onClick={addTrack}
            className="mt-4 flex h-9 items-center gap-2 rounded-full border border-[#E5E5E5] px-4 text-xs font-medium text-[#4D4D4D] transition-all hover:bg-[#F5F5F5]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add your first track
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tracks.map((track, idx) => (
            <Card key={track.id || `track-${idx}`}>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5] text-xs font-semibold text-[#4D4D4D]">
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
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#4D4D4D] transition-colors hover:bg-red-50 hover:text-red-500"
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
          <h2 className="text-lg font-semibold text-[#1A1A1A]" style={{ letterSpacing: '-0.02em' }}>
            Description
          </h2>
          <p className="mt-1 text-sm text-[#4D4D4D]">
            Write the full hackathon description visible on the public detail page.
          </p>
        </div>
        <div className="flex gap-1.5 rounded-full border border-[#E5E5E5] p-0.5">
          <button
            onClick={() => setPreview(false)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              !preview ? 'bg-[#1A1A1A] text-white' : 'text-[#4D4D4D]'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setPreview(true)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              preview ? 'bg-[#1A1A1A] text-white' : 'text-[#4D4D4D]'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      <Card>
        {preview ? (
          <div className="prose prose-sm max-w-none text-[#4D4D4D]">
            {description ? (
              description.split('\n').map((line, i) => (
                <p key={i}>{line || <br />}</p>
              ))
            ) : (
              <p className="text-[#4D4D4D] italic">No description yet. Switch to Edit to start writing.</p>
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
            <p className="mt-2 text-xs text-[#4D4D4D]">
              Markdown formatting supported. Rich text editor coming soon.
            </p>
          </>
        )}
      </Card>
    </div>
  );
}

/* ── User Search Result Type ── */
interface UserSearchResult {
  uuid: string;
  email: string;
  name: string;
  avatar: string | null;
  role: string;
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
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<HackathonAdmin['permission']>('Full Access');
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
      setError('Enter a valid email');
      return;
    }
    addAdmin(emailToInvite, permission);
    setEmail('');
    setQuery('');
    setSelectedUser(null);
    setShowInvite(false);
  };

  return (
    <div className="mx-auto max-w-[800px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1A1A1A]" style={{ letterSpacing: '-0.02em' }}>
            Team & Access
          </h2>
          <p className="mt-1 text-sm text-[#4D4D4D]">
            Manage who can edit and manage this hackathon.
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex h-9 items-center gap-2 rounded-full bg-[#1A1A1A] px-4 text-sm font-medium text-white transition-all hover:opacity-90"
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
              <Label>{selectedUser ? 'Selected User' : 'Search by email or name'}</Label>
              
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
                    placeholder="admin@example.com or John Doe"
                    className="h-[46px] w-full rounded-full border border-[#E5E5E5] bg-white pl-11 pr-5 text-sm text-[#1A1A1A] transition-all placeholder:text-[#4D4D4D] hover:border-[#E5E5E5] focus:border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/10"
                    autoFocus
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && query.length >= 2 && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)} />
                      <div
                        className="absolute left-0 right-0 top-full z-20 mt-2 max-h-[240px] overflow-y-auto rounded-2xl border border-[#E5E5E5] bg-white py-2"
                        
                      >
                        {isSearching ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-[#4D4D4D]" />
                          </div>
                        ) : searchResults.length > 0 ? (
                          searchResults.map((user) => (
                            <button
                              key={user.uuid}
                              type="button"
                              onClick={() => handleSelectUser(user)}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#F5F5F5]"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1A1A1A]">
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-xs font-semibold text-white">
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
                          <div className="px-4 py-6 text-center">
                            <p className="text-sm text-[#4D4D4D]">No users found</p>
                            <p className="mt-1 text-xs text-[#4D4D4D]">
                              You can still invite by email
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
              {error && <p className="mt-1 pl-5 text-xs text-red-500">{error}</p>}
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
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4D4D4D]" />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowInvite(false)}
                className="flex h-[46px] items-center rounded-full border border-[#E5E5E5] px-4 text-sm font-medium text-[#4D4D4D] transition-all hover:bg-[#F5F5F5]"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="flex h-[46px] items-center gap-2 rounded-full bg-[#1A1A1A] px-5 text-sm font-medium text-white transition-all hover:opacity-90"
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
                idx < admins.length - 1 ? 'border-b border-[#E5E5E5]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5F5] text-xs font-semibold text-[#4D4D4D]">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {admin.name}
                    {isCreator && <span className="ml-2 text-[10px] text-[#4D4D4D]">(creator)</span>}
                  </p>
                  <p className="text-xs text-[#4D4D4D]">{admin.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#F5F5F5] px-2.5 py-0.5 text-xs font-medium text-[#4D4D4D]">
                  {admin.permission}
                </span>
                {!isCreator && (
                  <button
                    onClick={() => removeAdmin(admin.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#4D4D4D] transition-colors hover:bg-red-50 hover:text-red-500"
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
        <h2 className="text-lg font-semibold text-[#1A1A1A]" style={{ letterSpacing: '-0.02em' }}>
          Insights
        </h2>
        <p className="mt-1 text-sm text-[#4D4D4D]">
          Engagement and participation metrics for your hackathon.
        </p>
      </div>

      {status === 'Draft' && (
        <div className="rounded-2xl border border-dashed border-[#E5E5E5] bg-white px-6 py-10 text-center">
          <BarChart3 className="mx-auto mb-3 h-8 w-8 text-[#4D4D4D]" />
          <p className="text-sm font-medium text-[#1A1A1A]">Analytics available after publishing</p>
          <p className="mt-1 text-xs text-[#4D4D4D]">
            Data will start accumulating once the hackathon is live.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <p className="text-xs text-[#4D4D4D]">{m.label}</p>
            <p className="mt-2 text-2xl font-bold text-[#1A1A1A]">{m.value}</p>
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
        <h2 className="text-lg font-semibold text-[#1A1A1A]" style={{ letterSpacing: '-0.02em' }}>
          Builders
        </h2>
        <p className="mt-1 text-sm text-[#4D4D4D]">Registered participants for this hackathon.</p>
      </div>
      <Card>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <UserCheck className="mb-3 h-8 w-8 text-[#4D4D4D]" />
          <p className="text-sm font-medium text-[#1A1A1A]">No registrations yet</p>
          <p className="mt-1 text-xs text-[#4D4D4D]">
            Builders will appear here once they register for the hackathon.
          </p>
        </div>
      </Card>

      {/* Projects */}
      <div>
        <h2 className="text-lg font-semibold text-[#1A1A1A]" style={{ letterSpacing: '-0.02em' }}>
          Projects
        </h2>
        <p className="mt-1 text-sm text-[#4D4D4D]">Submitted work from participating teams.</p>
      </div>
      <Card>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <FolderOpen className="mb-3 h-8 w-8 text-[#4D4D4D]" />
          <p className="text-sm font-medium text-[#1A1A1A]">No submissions yet</p>
          <p className="mt-1 text-xs text-[#4D4D4D]">
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
        <h2 className="text-lg font-semibold text-[#1A1A1A]" style={{ letterSpacing: '-0.02em' }}>
          Prize Settings
        </h2>
        <p className="mt-1 text-sm text-[#4D4D4D]">
          Define prizes, assign them to tracks, and set placements.
        </p>
      </div>

      {/* Add Prize Form */}
      {showAddPrize && (
        <Card>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1A1A1A]">Add New Prize</h3>
              <button
                onClick={() => {
                  setShowAddPrize(false);
                  setPrizeName('');
                  setSelectedTracks([]);
                  setPrizeDescription('');
                  setErrors({});
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#4D4D4D] transition-colors hover:bg-[#F5F5F5]"
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
              <p className="mb-3 text-xs text-[#4D4D4D]">
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
                        className="flex w-full items-center gap-3 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-left transition-all hover:bg-[#F5F5F5]"
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                            selectedTracks.includes(track.id)
                              ? 'border-foreground bg-[#1A1A1A]'
                              : 'border-[#E5E5E5]'
                          }`}
                        >
                          {selectedTracks.includes(track.id) && <Check className="h-3.5 w-3.5 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1A1A1A]">{track.name || 'Untitled Track'}</p>
                          {track.description && (
                            <p className="mt-0.5 text-xs text-[#4D4D4D] line-clamp-1">{track.description}</p>
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
                      className="text-xs text-[#1A1A1A] hover:underline"
                    >
                      {selectedTracks.length === hackathon.tracks.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#E5E5E5] bg-[#F5F5F5] px-4 py-6 text-center">
                    <Layers className="mx-auto mb-2 h-6 w-6 text-[#4D4D4D]" />
                    <p className="text-xs text-[#4D4D4D]">No tracks available. Add tracks first in the Tracks tab.</p>
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
                className="flex h-10 items-center rounded-full border border-[#E5E5E5] px-5 text-sm font-medium text-[#4D4D4D] transition-all hover:bg-[#F5F5F5]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPrize}
                className="flex h-10 items-center gap-2 rounded-full bg-[#1A1A1A] px-5 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.97]"
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
            <Trophy className="mb-3 h-8 w-8 text-[#4D4D4D]" />
            <p className="text-sm font-medium text-[#1A1A1A]">No prizes configured</p>
            <p className="mt-1 text-xs text-[#4D4D4D]">
              Add prize categories and placement tiers for this hackathon.
            </p>
            <button
              onClick={() => setShowAddPrize(true)}
              className="mt-4 flex h-9 items-center gap-2 rounded-full border border-[#E5E5E5] px-4 text-xs font-medium text-[#4D4D4D] transition-all hover:bg-[#F5F5F5]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Prize
            </button>
          </div>
        </Card>
      )}

      {/* Judges */}
      <div>
        <h2 className="text-lg font-semibold text-[#1A1A1A]" style={{ letterSpacing: '-0.02em' }}>
          Judges
        </h2>
        <p className="mt-1 text-sm text-[#4D4D4D]">
          Invite judges and assign them to tracks.
        </p>
      </div>

      {/* Invite Judge Form */}
      {showInviteJudge && (
        <Card>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1A1A1A]">Invite Judge</h3>
              <button
                onClick={() => {
                  setShowInviteJudge(false);
                  setJudgeEmail('');
                  setJudgeName('');
                  setJudgeTracks([]);
                  setJudgeErrors({});
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#4D4D4D] transition-colors hover:bg-[#F5F5F5]"
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
              <p className="mb-3 text-xs text-[#4D4D4D]">
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
                        className="flex w-full items-center gap-3 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-left transition-all hover:bg-[#F5F5F5]"
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                            judgeTracks.includes(track.id)
                              ? 'border-foreground bg-[#1A1A1A]'
                              : 'border-[#E5E5E5]'
                          }`}
                        >
                          {judgeTracks.includes(track.id) && <Check className="h-3.5 w-3.5 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1A1A1A]">{track.name || 'Untitled Track'}</p>
                          {track.description && (
                            <p className="mt-0.5 text-xs text-[#4D4D4D] line-clamp-1">{track.description}</p>
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
                      className="text-xs text-[#1A1A1A] hover:underline"
                    >
                      {judgeTracks.length === hackathon.tracks.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#E5E5E5] bg-[#F5F5F5] px-4 py-6 text-center">
                    <Layers className="mx-auto mb-2 h-6 w-6 text-[#4D4D4D]" />
                    <p className="text-xs text-[#4D4D4D]">No tracks available. Add tracks first in the Tracks tab.</p>
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
                className="flex h-10 items-center rounded-full border border-[#E5E5E5] px-5 text-sm font-medium text-[#4D4D4D] transition-all hover:bg-[#F5F5F5]"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteJudge}
                className="flex h-10 items-center gap-2 rounded-full bg-[#1A1A1A] px-5 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.97]"
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
            <Users className="mb-3 h-8 w-8 text-[#4D4D4D]" />
            <p className="text-sm font-medium text-[#1A1A1A]">No judges invited</p>
            <p className="mt-1 text-xs text-[#4D4D4D]">
              Add judges to evaluate submissions.
            </p>
            <button
              onClick={() => setShowInviteJudge(true)}
              className="mt-4 flex h-9 items-center gap-2 rounded-full border border-[#E5E5E5] px-4 text-xs font-medium text-[#4D4D4D] transition-all hover:bg-[#F5F5F5]"
            >
              <Plus className="h-3.5 w-3.5" />
              Invite Judge
            </button>
          </div>
        </Card>
      )}

      {/* Winner Assignment */}
      <div>
        <h2 className="text-lg font-semibold text-[#1A1A1A]" style={{ letterSpacing: '-0.02em' }}>
          Winner Assignment & Distribution
        </h2>
        <p className="mt-1 text-sm text-[#4D4D4D]">
          Assign winners after judging and manage prize distribution.
        </p>
      </div>
      <Card>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <HelpCircle className="mb-3 h-8 w-8 text-[#4D4D4D]" />
          <p className="text-sm font-medium text-[#1A1A1A]">Available after judging</p>
          <p className="mt-1 text-xs text-[#4D4D4D]">
            Winner assignment and prize distribution will be unlocked once the hackathon ends and judging begins.
          </p>
        </div>
      </Card>
    </div>
  );
}
