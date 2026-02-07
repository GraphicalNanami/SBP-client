app/src/project/components/useSubmission.ts

```
use client';

import { useState, useCallback, useMemo } from 'react';
import type {
  ProjectSubmission,
  ProjectDetails,
  ProjectLinks,
  ProjectTeam,
  ProjectStellar,
  ProjectTeamMember,
  ProjectSocialLink,
  SubmissionDashboardTab,
} from '../types/project.types';
import type { HackathonTrack } from '../../hackathon/types/hackathon.types';
import { MOCK_HACKATHON_TRACKS } from './mockData';

/* ── Empty defaults ── */
const emptyDetails: ProjectDetails = {
  name: '',
  logo: '',
  tagline: '',
  vision: '',
  category: '',
};

const emptyLinks: ProjectLinks = {
  github: '',
  website: '',
  demoVideo: '',
  socialLinks: [],
};

const emptyTeam: ProjectTeam = {
  description: '',
  teamSocials: [],
  telegramLead: '',
  contactEmail: '',
};

const emptyStellar: ProjectStellar = {
  selectedTrackIds: [],
  contractAddress: '',
  stellarAddress: '',
};

function createEmptySubmission(hackathonId: string): ProjectSubmission {
  const now = new Date().toISOString();
  return {
    id: `proj-${Date.now()}`,
    hackathonId,
    hackathonName: 'Soroban Buildathon 2026',
    status: 'Draft',
    details: { ...emptyDetails },
    links: { ...emptyLinks },
    description: '',
    team: { ...emptyTeam },
    members: [
      {
        id: `member-${Date.now()}`,
        name: 'You',
        email: 'you@example.com',
        role: 'Team Lead',
        status: 'Accepted',
        invitedAt: now,
      },
    ],
    stellar: { ...emptyStellar },
    availableTracks: MOCK_HACKATHON_TRACKS,
    submittedAt: '',
    createdAt: now,
    updatedAt: now,
  };
}

/* ═══════════════════════════════════════════════════════
   useSubmission hook
   ═══════════════════════════════════════════════════════ */
export function useSubmission(hackathonId: string) {
  const [submission, setSubmission] = useState<ProjectSubmission>(() =>
    createEmptySubmission(hackathonId),
  );
  const [activeTab, setActiveTab] = useState<SubmissionDashboardTab>('details');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  /* ── Details ── */
  const updateDetails = useCallback(
    <K extends keyof ProjectDetails>(field: K, value: ProjectDetails[K]) => {
      setSubmission((prev) => ({
        ...prev,
        details: { ...prev.details, [field]: value },
        updatedAt: new Date().toISOString(),
      }));
    },
    [],
  );

  /* ── Links ── */
  const updateLinks = useCallback(
    <K extends keyof ProjectLinks>(field: K, value: ProjectLinks[K]) => {
      setSubmission((prev) => ({
        ...prev,
        links: { ...prev.links, [field]: value },
        updatedAt: new Date().toISOString(),
      }));
    },
    [],
  );

  const addSocialLink = useCallback((link: ProjectSocialLink) => {
    setSubmission((prev) => ({
      ...prev,
      links: { ...prev.links, socialLinks: [...prev.links.socialLinks, link] },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeSocialLink = useCallback((idx: number) => {
    setSubmission((prev) => ({
      ...prev,
      links: {
        ...prev.links,
        socialLinks: prev.links.socialLinks.filter((_, i) => i !== idx),
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /* ── Description ── */
  const updateDescription = useCallback((value: string) => {
    setSubmission((prev) => ({
      ...prev,
      description: value,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /* ── Team ── */
  const updateTeam = useCallback(
    <K extends keyof ProjectTeam>(field: K, value: ProjectTeam[K]) => {
      setSubmission((prev) => ({
        ...prev,
        team: { ...prev.team, [field]: value },
        updatedAt: new Date().toISOString(),
      }));
    },
    [],
  );

  const addTeamMember = useCallback((email: string) => {
    const member: ProjectTeamMember = {
      id: `member-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'Member',
      status: 'Invited',
      invitedAt: new Date().toISOString(),
    };
    setSubmission((prev) => ({
      ...prev,
      members: [...prev.members, member],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeTeamMember = useCallback((memberId: string) => {
    setSubmission((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addTeamSocial = useCallback((link: ProjectSocialLink) => {
    setSubmission((prev) => ({
      ...prev,
      team: { ...prev.team, teamSocials: [...prev.team.teamSocials, link] },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeTeamSocial = useCallback((idx: number) => {
    setSubmission((prev) => ({
      ...prev,
      team: {
        ...prev.team,
        teamSocials: prev.team.teamSocials.filter((_, i) => i !== idx),
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /* ── Stellar / Tracks ── */
  const updateStellar = useCallback(
    <K extends keyof ProjectStellar>(field: K, value: ProjectStellar[K]) => {
      setSubmission((prev) => ({
        ...prev,
        stellar: { ...prev.stellar, [field]: value },
        updatedAt: new Date().toISOString(),
      }));
    },
    [],
  );

  const toggleTrack = useCallback((trackId: string) => {
    setSubmission((prev) => {
      const current = prev.stellar.selectedTrackIds;
      const updated = current.includes(trackId)
        ? current.filter((id) => id !== trackId)
        : [...current, trackId];
      return {
        ...prev,
        stellar: { ...prev.stellar, selectedTrackIds: updated },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  /* ── Save (mock) ── */
  const handleSave = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  }, []);

  /* ── Submit ── */
  const handleSubmit = useCallback(() => {
    setSubmission((prev) => ({
      ...prev,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    handleSave();
  }, [handleSave]);

  /* ── Submit validation ── */
  const canSubmit = useMemo(() => {
    const d = submission.details;
    const t = submission.team;
    const s = submission.stellar;
    return (
      d.name.trim() !== '' &&
      d.tagline.trim() !== '' &&
      d.vision.trim() !== '' &&
      d.category !== '' &&
      submission.description.trim() !== '' &&
      t.description.trim() !== '' &&
      t.telegramLead.trim() !== '' &&
      t.contactEmail.trim() !== '' &&
      s.selectedTrackIds.length > 0 &&
      s.contractAddress.trim() !== '' &&
      s.stellarAddress.trim() !== ''
    );
  }, [submission]);

  /* ── Prefill from existing project ── */
  const prefillFromExisting = useCallback((projectId: string) => {
    // TODO: Load from API or mock — for now just set a placeholder name
    setSubmission((prev) => ({
      ...prev,
      details: { ...prev.details, name: `Imported Project (${projectId})` },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  return {
    submission,
    activeTab,
    setActiveTab,
    isSaving,
    saveSuccess,
    canSubmit,
    updateDetails,
    updateLinks,
    addSocialLink,
    removeSocialLink,
    updateDescription,
    updateTeam,
    addTeamMember,
    removeTeamMember,
    addTeamSocial,
    removeTeamSocial,
    updateStellar,
    toggleTrack,
    handleSave,
    handleSubmit,
    prefillFromExisting,
  };
}

```


app/src/project/components/SubmissionDashboard.tsx

```
use client';

import { useState } from 'react';
import {
  Save,
  Check,
  Loader2,
  Send,
  FileText,
  Users,
  Layers,
  Link2,
  Star,
  Plus,
  Trash2,
  X,
  ChevronDown,
  Mail,
  Image as ImageIcon,
  Globe,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import type {
  ProjectSubmission,
  ProjectDetails,
  ProjectLinks,
  ProjectTeam,
  ProjectStellar,
  ProjectSocialLink,
  SubmissionDashboardTab,
} from '../types/project.types';
import type { HackathonCategory } from '../../hackathon/types/hackathon.types';

/* ═══════════════════════════════════════════════════════
   Props
   ═══════════════════════════════════════════════════════ */
interface SubmissionDashboardProps {
  submission: ProjectSubmission;
  activeTab: SubmissionDashboardTab;
  setActiveTab: (tab: SubmissionDashboardTab) => void;
  isSaving: boolean;
  saveSuccess: boolean;
  canSubmit: boolean;
  updateDetails: <K extends keyof ProjectDetails>(field: K, value: ProjectDetails[K]) => void;
  updateLinks: <K extends keyof ProjectLinks>(field: K, value: ProjectLinks[K]) => void;
  addSocialLink: (link: ProjectSocialLink) => void;
  removeSocialLink: (idx: number) => void;
  updateDescription: (value: string) => void;
  updateTeam: <K extends keyof ProjectTeam>(field: K, value: ProjectTeam[K]) => void;
  addTeamMember: (email: string) => void;
  removeTeamMember: (memberId: string) => void;
  addTeamSocial: (link: ProjectSocialLink) => void;
  removeTeamSocial: (idx: number) => void;
  updateStellar: <K extends keyof ProjectStellar>(field: K, value: ProjectStellar[K]) => void;
  toggleTrack: (trackId: string) => void;
  handleSave: () => void;
  handleSubmit: () => void;
}

/* ═══════════════════════════════════════════════════════
   Shared UI (matching hackathon dashboard)
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
  Submitted: 'bg-emerald-50 text-emerald-700',
  'Under Review': 'bg-amber-50 text-amber-700',
  Judged: 'bg-blue-50 text-blue-700',
};

/* ── Tabs config ── */
const TABS: { key: SubmissionDashboardTab; label: string; icon: React.ReactNode }[] = [
  { key: 'details', label: 'Project Details', icon: <FileText className="h-4 w-4" /> },
  { key: 'links', label: 'Links & Media', icon: <Link2 className="h-4 w-4" /> },
  { key: 'description', label: 'Description', icon: <Layers className="h-4 w-4" /> },
  { key: 'team', label: 'Team', icon: <Users className="h-4 w-4" /> },
  { key: 'stellar', label: 'Tracks & Stellar', icon: <Star className="h-4 w-4" /> },
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

/* ── Social platforms ── */
const SOCIAL_PLATFORMS = ['Twitter', 'Telegram', 'Discord', 'LinkedIn', 'GitHub', 'Other'] as const;

/* ═══════════════════════════════════════════════════════
   Dashboard Component
   ═══════════════════════════════════════════════════════ */
export default function SubmissionDashboard({
  submission,
  activeTab,
  setActiveTab,
  isSaving,
  saveSuccess,
  canSubmit,
  updateDetails,
  updateLinks,
  addSocialLink,
  removeSocialLink,
  updateDescription,
  updateTeam,
  addTeamMember,
  removeTeamMember,
  addTeamSocial,
  removeTeamSocial,
  updateStellar,
  toggleTrack,
  handleSave,
  handleSubmit,
}: SubmissionDashboardProps) {
  return (
    <div className="aurora-bg min-h-screen">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            <div>
              <h1
                className="text-sm font-semibold text-[var(--text)]"
                style={{ letterSpacing: '-0.02em' }}
              >
                {submission.details.name || 'New Project'}
              </h1>
              <p className="text-xs text-[var(--text-muted)]">{submission.hackathonName}</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                statusStyles[submission.status] || statusStyles.Draft
              }`}
            >
              {submission.status}
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
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
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Draft'}
            </button>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submission.status === 'Submitted'}
              className="flex h-9 items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-medium text-[var(--brand-fg)] transition-all hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              {submission.status === 'Submitted' ? 'Submitted' : 'Submit Project'}
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
        {activeTab === 'details' && (
          <DetailsTab submission={submission} updateDetails={updateDetails} />
        )}
        {activeTab === 'links' && (
          <LinksTab
            links={submission.links}
            updateLinks={updateLinks}
            addSocialLink={addSocialLink}
            removeSocialLink={removeSocialLink}
          />
        )}
        {activeTab === 'description' && (
          <DescriptionTab description={submission.description} updateDescription={updateDescription} />
        )}
        {activeTab === 'team' && (
          <TeamTab
            team={submission.team}
            members={submission.members}
            updateTeam={updateTeam}
            addTeamMember={addTeamMember}
            removeTeamMember={removeTeamMember}
            addTeamSocial={addTeamSocial}
            removeTeamSocial={removeTeamSocial}
          />
        )}
        {activeTab === 'stellar' && (
          <StellarTab
            stellar={submission.stellar}
            tracks={submission.availableTracks}
            updateStellar={updateStellar}
            toggleTrack={toggleTrack}
          />
        )}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Project Details
   ═══════════════════════════════════════════════════════ */
function DetailsTab({
  submission,
  updateDetails,
}: {
  submission: ProjectSubmission;
  updateDetails: <K extends keyof ProjectDetails>(field: K, value: ProjectDetails[K]) => void;
}) {
  const d = submission.details;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <SectionTitle>Project Information</SectionTitle>

          <div className="mb-5">
            <Label htmlFor="p-name">Project Name *</Label>
            <input
              id="p-name"
              type="text"
              value={d.name}
              onChange={(e) => updateDetails('name', e.target.value)}
              placeholder="e.g. StellarSwap"
              className={inputClass}
            />
          </div>

          <div className="mb-5">
            <Label>Project Logo</Label>
            <div className="flex h-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-muted)] transition-colors hover:border-[var(--border-hover)]">
              <div className="text-center">
                <ImageIcon className="mx-auto mb-2 h-6 w-6 text-[var(--text-muted)]" />
                <p className="text-xs text-[var(--text-muted)]">Click to upload logo (recommended 400×400)</p>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <Label htmlFor="p-tagline">Tagline *</Label>
            <input
              id="p-tagline"
              type="text"
              value={d.tagline}
              onChange={(e) => updateDetails('tagline', e.target.value.slice(0, 120))}
              placeholder="One-line summary of your project (max 120 characters)"
              className={inputClass}
            />
            <p className="mt-1.5 pl-5 text-xs text-[var(--text-muted)]">
              {d.tagline.length}/120 characters
            </p>
          </div>

          <div className="mb-5">
            <Label htmlFor="p-vision">Vision *</Label>
            <textarea
              id="p-vision"
              value={d.vision}
              onChange={(e) => updateDetails('vision', e.target.value)}
              placeholder="What problem does this project solve? How does it leverage Stellar/Soroban? What is the long-term goal?"
              rows={5}
              className={textareaClass}
            />
          </div>

          <div>
            <Label>Category *</Label>
            <div className="relative">
              <select
                value={d.category}
                onChange={(e) => updateDetails('category', e.target.value as HackathonCategory)}
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
        </Card>
      </div>

      {/* Right column — summary */}
      <div className="space-y-6">
        <Card>
          <SectionTitle>Submission Summary</SectionTitle>
          <div className="space-y-4 text-sm">
            {[
              { label: 'Project', value: d.name },
              { label: 'Category', value: d.category },
              { label: 'Hackathon', value: submission.hackathonName },
              { label: 'Status', value: submission.status },
              { label: 'Tracks', value: `${submission.stellar.selectedTrackIds.length} selected` },
              { label: 'Team', value: `${submission.members.length} member${submission.members.length !== 1 ? 's' : ''}` },
            ].map((item, idx) => (
              <div key={item.label} className={idx > 0 ? 'border-t border-[var(--border)] pt-4' : ''}>
                <p className="text-[var(--text-muted)]">{item.label}</p>
                <p className="mt-0.5 font-medium text-[var(--text)]">{item.value || '—'}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-[var(--brand)]/20 bg-[var(--bg-muted)]">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">Submit Checklist</h3>
          <div className="space-y-2 text-xs">
            {[
              { ok: !!d.name.trim(), text: 'Project name' },
              { ok: !!d.tagline.trim(), text: 'Tagline' },
              { ok: !!d.vision.trim(), text: 'Vision' },
              { ok: !!d.category, text: 'Category selected' },
              { ok: !!submission.description.trim(), text: 'Description' },
              { ok: !!submission.team.description.trim(), text: 'Team description' },
              { ok: !!submission.team.telegramLead.trim(), text: 'Team lead Telegram' },
              { ok: !!submission.team.contactEmail.trim(), text: 'Contact email' },
              { ok: submission.stellar.selectedTrackIds.length > 0, text: 'At least one track' },
              { ok: !!submission.stellar.contractAddress.trim(), text: 'Contract address' },
              { ok: !!submission.stellar.stellarAddress.trim(), text: 'Stellar address' },
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
   TAB: Links & Media
   ═══════════════════════════════════════════════════════ */
function LinksTab({
  links,
  updateLinks,
  addSocialLink,
  removeSocialLink,
}: {
  links: ProjectLinks;
  updateLinks: <K extends keyof ProjectLinks>(field: K, value: ProjectLinks[K]) => void;
  addSocialLink: (link: ProjectSocialLink) => void;
  removeSocialLink: (idx: number) => void;
}) {
  const [socialPlatform, setSocialPlatform] = useState<ProjectSocialLink['platform']>('Twitter');
  const [socialUrl, setSocialUrl] = useState('');

  const handleAddSocial = () => {
    if (socialUrl.trim()) {
      addSocialLink({ platform: socialPlatform, url: socialUrl.trim() });
      setSocialUrl('');
    }
  };

  return (
    <div className="mx-auto max-w-[800px] space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
          Links & Media
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          External resources and demo materials for your project.
        </p>
      </div>

      <Card>
        <SectionTitle>Repository & Deployment</SectionTitle>

        <div className="mb-5">
          <Label htmlFor="p-github">GitHub Repository</Label>
          <input
            id="p-github"
            type="url"
            value={links.github}
            onChange={(e) => updateLinks('github', e.target.value)}
            placeholder="https://github.com/your-org/your-project"
            className={inputClass}
          />
          <p className="mt-1.5 pl-5 text-xs text-[var(--text-muted)]">Optional — recommended for judging</p>
        </div>

        <div className="mb-5">
          <Label htmlFor="p-website">Website</Label>
          <input
            id="p-website"
            type="url"
            value={links.website}
            onChange={(e) => updateLinks('website', e.target.value)}
            placeholder="https://your-project.xyz"
            className={inputClass}
          />
          <p className="mt-1.5 pl-5 text-xs text-[var(--text-muted)]">Optional — live deployment or landing page</p>
        </div>

        <div>
          <Label htmlFor="p-demo">Demo Video</Label>
          <input
            id="p-demo"
            type="url"
            value={links.demoVideo}
            onChange={(e) => updateLinks('demoVideo', e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://loom.com/share/..."
            className={inputClass}
          />
          <p className="mt-1.5 pl-5 text-xs text-[var(--text-muted)]">Optional — strongly encouraged for judging</p>
        </div>
      </Card>

      <Card>
        <SectionTitle>Social Links</SectionTitle>

        {links.socialLinks.length > 0 && (
          <div className="mb-5 space-y-2">
            {links.socialLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3">
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
                  {link.platform}
                </span>
                <span className="flex-1 truncate text-sm text-[var(--text)]">{link.url}</span>
                <button
                  onClick={() => removeSocialLink(idx)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <div className="relative w-36 shrink-0">
            <select
              value={socialPlatform}
              onChange={(e) => setSocialPlatform(e.target.value as ProjectSocialLink['platform'])}
              className={selectClass}
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          </div>
          <input
            type="url"
            value={socialUrl}
            onChange={(e) => setSocialUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSocial())}
            placeholder="https://..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); handleAddSocial(); }}
            className="flex h-[46px] shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] px-4 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)]"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </Card>
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
            Write the full project description. Explain what you built and how it uses Stellar/Soroban.
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
              placeholder={`## Overview\nWhat does your project do?\n\n## How It Works\nExplain the core functionality...\n\n## Stellar/Soroban Integration\nHow does your project use Stellar or Soroban?\n\n## Technical Architecture\nTech stack, smart contract design...\n\n## Challenges & Learnings\nWhat was hard? What did you learn?\n\n## What's Next\nFuture plans and roadmap...`}
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
   TAB: Team
   ═══════════════════════════════════════════════════════ */
function TeamTab({
  team,
  members,
  updateTeam,
  addTeamMember,
  removeTeamMember,
  addTeamSocial,
  removeTeamSocial,
}: {
  team: ProjectTeam;
  members: ProjectSubmission['members'];
  updateTeam: <K extends keyof ProjectTeam>(field: K, value: ProjectTeam[K]) => void;
  addTeamMember: (email: string) => void;
  removeTeamMember: (memberId: string) => void;
  addTeamSocial: (link: ProjectSocialLink) => void;
  removeTeamSocial: (idx: number) => void;
}) {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [socialPlatform, setSocialPlatform] = useState<ProjectSocialLink['platform']>('Twitter');
  const [socialUrl, setSocialUrl] = useState('');

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      setEmailError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim())) {
      setEmailError('Enter a valid email');
      return;
    }
    addTeamMember(inviteEmail.trim());
    setInviteEmail('');
    setShowInvite(false);
  };

  const handleAddTeamSocial = () => {
    if (socialUrl.trim()) {
      addTeamSocial({ platform: socialPlatform, url: socialUrl.trim() });
      setSocialUrl('');
    }
  };

  return (
    <div className="mx-auto max-w-[800px] space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
          Team
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Team composition and contact information.
        </p>
      </div>

      {/* Team Description */}
      <Card>
        <SectionTitle>Team Description *</SectionTitle>
        <textarea
          value={team.description}
          onChange={(e) => updateTeam('description', e.target.value)}
          placeholder="Who is your team? What's your background? Why are you building this on Stellar?"
          rows={4}
          className={textareaClass}
        />
      </Card>

      {/* Contact Info */}
      <Card>
        <SectionTitle>Contact Information</SectionTitle>

        <div className="mb-5">
          <Label htmlFor="p-telegram">Telegram of Team Lead *</Label>
          <input
            id="p-telegram"
            type="text"
            value={team.telegramLead}
            onChange={(e) => updateTeam('telegramLead', e.target.value)}
            placeholder="@your_telegram_handle"
            className={inputClass}
          />
          <p className="mt-1.5 pl-5 text-xs text-[var(--text-muted)]">Used by organizers for direct communication</p>
        </div>

        <div>
          <Label htmlFor="p-contact">Contact Email *</Label>
          <input
            id="p-contact"
            type="email"
            value={team.contactEmail}
            onChange={(e) => updateTeam('contactEmail', e.target.value)}
            placeholder="team@example.com"
            className={inputClass}
          />
          <p className="mt-1.5 pl-5 text-xs text-[var(--text-muted)]">For organizer and judge correspondence</p>
        </div>
      </Card>

      {/* Team Members */}
      <Card>
        <div className="mb-5 flex items-center justify-between">
          <SectionTitle>Team Members</SectionTitle>
          <button
            onClick={() => setShowInvite(true)}
            className="flex h-9 items-center gap-2 rounded-full bg-[var(--brand)] px-4 text-sm font-medium text-[var(--brand-fg)] transition-all hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            Invite Member
          </button>
        </div>

        {showInvite && (
          <div className="mb-5 flex gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-4">
            <div className="flex-1">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                placeholder="teammate@example.com"
                className={inputClass}
                autoFocus
              />
              {emailError && <p className="mt-1 pl-5 text-xs text-red-500">{emailError}</p>}
            </div>
            <button
              onClick={() => { setShowInvite(false); setInviteEmail(''); }}
              className="flex h-[46px] items-center rounded-full border border-[var(--border)] px-4 text-sm font-medium text-[var(--text-secondary)] hover:bg-white"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              className="flex h-[46px] items-center gap-2 rounded-full bg-[var(--brand)] px-5 text-sm font-medium text-[var(--brand-fg)] hover:opacity-90"
            >
              <Mail className="h-3.5 w-3.5" />
              Send
            </button>
          </div>
        )}

        {members.map((member, idx) => {
          const isLead = member.role === 'Team Lead';
          return (
            <div
              key={member.id}
              className={`flex items-center justify-between py-3 ${
                idx < members.length - 1 ? 'border-b border-[var(--border)]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-muted)] text-xs font-semibold text-[var(--text-secondary)]">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    {member.name}
                    {isLead && <span className="ml-2 text-[10px] text-[var(--text-muted)]">(Team Lead)</span>}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  member.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' :
                  member.status === 'Invited' ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-600'
                }`}>
                  {member.status}
                </span>
                {!isLead && (
                  <button
                    onClick={() => removeTeamMember(member.id)}
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

      {/* Team Socials */}
      <Card>
        <SectionTitle>Team Socials (Optional)</SectionTitle>

        {team.teamSocials.length > 0 && (
          <div className="mb-5 space-y-2">
            {team.teamSocials.map((link, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-3">
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">
                  {link.platform}
                </span>
                <span className="flex-1 truncate text-sm text-[var(--text)]">{link.url}</span>
                <button
                  onClick={() => removeTeamSocial(idx)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <div className="relative w-36 shrink-0">
            <select
              value={socialPlatform}
              onChange={(e) => setSocialPlatform(e.target.value as ProjectSocialLink['platform'])}
              className={selectClass}
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          </div>
          <input
            type="url"
            value={socialUrl}
            onChange={(e) => setSocialUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTeamSocial())}
            placeholder="https://..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); handleAddTeamSocial(); }}
            className="flex h-[46px] shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] px-4 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)]"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TAB: Tracks & Stellar
   ═══════════════════════════════════════════════════════ */
function StellarTab({
  stellar,
  tracks,
  updateStellar,
  toggleTrack,
}: {
  stellar: ProjectStellar;
  tracks: ProjectSubmission['availableTracks'];
  updateStellar: <K extends keyof ProjectStellar>(field: K, value: ProjectStellar[K]) => void;
  toggleTrack: (trackId: string) => void;
}) {
  return (
    <div className="mx-auto max-w-[800px] space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
          Tracks & Stellar
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Select tracks and provide your Stellar/Soroban details.
        </p>
      </div>

      {/* Track Selection */}
      <Card>
        <SectionTitle>Track Selection *</SectionTitle>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          Choose one or more tracks your project is competing in.
        </p>

        <div className="space-y-2">
          {tracks.map((track) => (
            <button
              key={track.id}
              type="button"
              onClick={() => toggleTrack(track.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-white px-4 py-3.5 text-left transition-all hover:bg-[var(--bg-hover)]"
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                  stellar.selectedTrackIds.includes(track.id)
                    ? 'border-[var(--brand)] bg-[var(--brand)]'
                    : 'border-[var(--border)]'
                }`}
              >
                {stellar.selectedTrackIds.includes(track.id) && (
                  <Check className="h-3.5 w-3.5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--text)]">{track.name}</p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">{track.description}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Contract Address */}
      <Card>
        <SectionTitle>Soroban Contract Details</SectionTitle>

        <div className="mb-5">
          <Label htmlFor="p-contract">Contract Address *</Label>
          <input
            id="p-contract"
            type="text"
            value={stellar.contractAddress}
            onChange={(e) => updateStellar('contractAddress', e.target.value)}
            placeholder="C... (Soroban contract ID)"
            className={`${inputClass} font-mono text-[13px]`}
          />
          <p className="mt-1.5 pl-5 text-xs text-[var(--text-muted)]">
            Deployed Soroban smart contract address (testnet or mainnet). Judges will verify on-chain activity.
          </p>
        </div>

        <div>
          <Label htmlFor="p-stellar">Your Stellar Address *</Label>
          <input
            id="p-stellar"
            type="text"
            value={stellar.stellarAddress}
            onChange={(e) => updateStellar('stellarAddress', e.target.value)}
            placeholder="G... (Stellar public key)"
            className={`${inputClass} font-mono text-[13px]`}
          />
          <p className="mt-1.5 pl-5 text-xs text-[var(--text-muted)]">
            Your team&apos;s Stellar public key to receive prize money. Must be a funded account.
          </p>
        </div>
      </Card>
    </div>
  );
}

```

app/src/project/submission/[hackathonId]/page.tsx


```

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Rocket,
  FolderOpen,
  Search,
  Calendar,
  Layers,
} from 'lucide-react';
import SubmissionDashboard from '../../components/SubmissionDashboard';
import { useSubmission } from '../../components/useSubmission';
import { MOCK_EXISTING_PROJECTS } from '../../components/mockData';

type Step = 'choose' | 'select-existing' | 'dashboard';

export default function SubmissionPage() {
  const params = useParams();
  const hackathonId = params.hackathonId as string;
  const [step, setStep] = useState<Step>('choose');
  const hook = useSubmission(hackathonId);

  /* ── Dashboard ── */
  if (step === 'dashboard') {
    return <SubmissionDashboard {...hook} />;
  }

  /* ── Existing project selector ── */
  if (step === 'select-existing') {
    return (
      <ExistingProjectSelector
        hackathonId={hackathonId}
        onSelect={(projectId) => {
          hook.prefillFromExisting(projectId);
          setStep('dashboard');
        }}
        onBack={() => setStep('choose')}
      />
    );
  }

  /* ── Choice screen ── */
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center px-6">
          <h1
            className="text-sm font-semibold text-[var(--text)]"
            style={{ letterSpacing: '-0.02em' }}
          >
            Submit Your Project
          </h1>
        </div>
      </nav>

      {/* Choice */}
      <main className="mx-auto max-w-[700px] px-6 py-16 md:py-24">
        <div className="mb-10 text-center">
          <h1
            className="mb-3 text-3xl font-bold text-[var(--text)] md:text-4xl"
            style={{ letterSpacing: '-0.04em', fontFamily: 'var(--font-onest)' }}
          >
            Submit Your Project
          </h1>
          <p className="text-base text-[var(--text-muted)]">
            How would you like to start your submission?
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* New Project */}
          <button
            onClick={() => setStep('dashboard')}
            className="group flex flex-col items-center rounded-2xl border border-[var(--border)] bg-white p-8 text-center transition-all hover:border-[var(--brand)] hover:shadow-lg"
            style={{ boxShadow: 'var(--shadow)' }}
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-muted)] transition-colors group-hover:bg-[var(--brand)]/10">
              <Rocket className="h-6 w-6 text-[var(--text-muted)] transition-colors group-hover:text-[var(--brand)]" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
              Create New Project
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Start fresh — build something new for this hackathon
            </p>
          </button>

          {/* Existing Project */}
          <button
            onClick={() => setStep('select-existing')}
            className="group flex flex-col items-center rounded-2xl border border-[var(--border)] bg-white p-8 text-center transition-all hover:border-[var(--brand)] hover:shadow-lg"
            style={{ boxShadow: 'var(--shadow)' }}
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-muted)] transition-colors group-hover:bg-[var(--brand)]/10">
              <FolderOpen className="h-6 w-6 text-[var(--text-muted)] transition-colors group-hover:text-[var(--brand)]" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
              Add Existing Project
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Continue building on a project you&apos;ve already started
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Existing Project Selector
   ═══════════════════════════════════════════════════════ */
function ExistingProjectSelector({
  hackathonId,
  onSelect,
  onBack,
}: {
  hackathonId: string;
  onSelect: (projectId: string) => void;
  onBack: () => void;
}) {
  const [search, setSearch] = useState('');

  const filtered = MOCK_EXISTING_PROJECTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center px-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-[700px] px-6 py-12">
        <div className="mb-8">
          <h1
            className="mb-2 text-2xl font-bold text-[var(--text)]"
            style={{ letterSpacing: '-0.03em', fontFamily: 'var(--font-onest)' }}
          >
            Select Existing Project
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Choose a previously submitted project to use as a starting point.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your projects..."
            className="h-11 w-full rounded-full border border-[var(--border)] bg-white pl-11 pr-5 text-sm text-[var(--text)] transition-all placeholder:text-[var(--text-muted)] hover:border-[var(--border-hover)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/10"
          />
        </div>

        {/* List */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((project) => (
              <button
                key={project.id}
                onClick={() => onSelect(project.id)}
                className="flex w-full items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 text-left transition-all hover:border-[var(--brand)] hover:shadow-md"
                style={{ boxShadow: 'var(--shadow)' }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-muted)] text-sm font-bold text-[var(--text-secondary)]">
                  {project.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--text)]">{project.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      {project.hackathonName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(project.submittedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-[var(--bg-muted)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                  {project.track}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] py-16 text-center">
            <FolderOpen className="mb-3 h-8 w-8 text-[var(--text-muted)]" />
            <p className="text-sm font-medium text-[var(--text)]">No projects found</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {search ? 'Try a different search term.' : 'You haven\'t submitted any projects yet.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

```

app/src/project/types/project.types.ts

```

// ============================================
// Project Submission — Shared TypeScript Types
// ============================================

import type { HackathonCategory, HackathonTrack } from '../../hackathon/types/hackathon.types';

// --- Enums & Literals ---

export type ProjectSubmissionStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Judged';

export type TeamMemberRole = 'Team Lead' | 'Member';

export type TeamMemberStatus = 'Invited' | 'Accepted' | 'Declined';

// --- Core Models ---

export interface ProjectTeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  invitedAt: string;
}

export interface ProjectSocialLink {
  platform: 'Twitter' | 'Telegram' | 'Discord' | 'LinkedIn' | 'GitHub' | 'Other';
  url: string;
}

export interface ProjectDetails {
  name: string;
  logo: string; // URL or empty
  tagline: string; // max 120 chars
  vision: string;
  category: HackathonCategory | '';
}

export interface ProjectLinks {
  github: string;
  website: string;
  demoVideo: string;
  socialLinks: ProjectSocialLink[];
}

export interface ProjectTeam {
  description: string;
  teamSocials: ProjectSocialLink[];
  telegramLead: string;
  contactEmail: string;
}

export interface ProjectStellar {
  selectedTrackIds: string[];
  contractAddress: string; // Soroban contract ID (C...)
  stellarAddress: string; // Stellar public key (G...)
}

// --- Aggregate ---

export interface ProjectSubmission {
  id: string;
  hackathonId: string;
  hackathonName: string;
  status: ProjectSubmissionStatus;
  details: ProjectDetails;
  links: ProjectLinks;
  description: string; // rich-text / markdown
  team: ProjectTeam;
  members: ProjectTeamMember[];
  stellar: ProjectStellar;
  availableTracks: HackathonTrack[];
  submittedAt: string; // ISO datetime or empty
  createdAt: string;
  updatedAt: string;
}

// --- Dashboard Tab ---

export type SubmissionDashboardTab =
  | 'details'
  | 'links'
  | 'description'
  | 'team'
  | 'stellar';

// --- Existing project for selector ---

export interface ExistingProjectSummary {
  id: string;
  name: string;
  hackathonName: string;
  submittedOn: string;
  track: string;
  logo: string;
}


```

app/src/project/context.md

```

# Project Module — Context

## Overview

The **Project** module handles project submission to hackathons and individual project detail pages. Participants land on a submission flow where they choose to create a new project or reuse an existing one, then fill out a 5-tab dashboard. Once submitted, each project has a public detail page viewable by anyone.

---

## File Structure

```
app/src/project/
├── context.md                          ← You are here
├── [id]/
│   └── page.tsx                        ← Individual project detail page (/project/:id)
├── submission/
│   └── [hackathonId]/
│       └── page.tsx                    ← Submission flow entry (/submission/:hackathonId)
├── components/
│   ├── SubmissionDashboard.tsx         ← 5-tab submission UI component
│   ├── useSubmission.ts               ← Business logic hook (state, handlers, validation)
│   └── mockData.ts                    ← Mock data for projects, tracks, existing projects
└── types/
    └── project.types.ts               ← TypeScript interfaces for the module
```

---

## Routes

| Route                            | File                                   | Description                          |
| -------------------------------- | -------------------------------------- | ------------------------------------ |
| `/submission/:hackathonId`       | `submission/[hackathonId]/page.tsx`     | Project submission flow              |
| `/project/:id`                   | `[id]/page.tsx`                        | Individual project detail page       |

Both routes are mapped via **next.config.ts rewrites**:

```ts
{ source: "/submission/:path*", destination: "/src/project/submission/:path*" }
{ source: "/project/:path*", destination: "/src/project/:path*" }
```

---

## Types (`project.types.ts`)

| Type                     | Purpose                                                        |
| ------------------------ | -------------------------------------------------------------- |
| `ProjectSubmissionStatus` | `'Draft' \| 'Submitted' \| 'Under Review' \| 'Judged'`       |
| `TeamMemberRole`         | `'Lead' \| 'Developer' \| 'Designer' \| 'Other'`             |
| `TeamMemberStatus`       | `'Invited' \| 'Accepted' \| 'Declined'`                      |
| `ProjectTeamMember`      | Name, email, role, status, wallet address                      |
| `ProjectSocialLink`      | Platform + URL pair                                            |
| `ProjectDetails`         | Name, tagline, vision, logo, category                          |
| `ProjectLinks`           | GitHub, website, demo video, social links array                |
| `ProjectTeam`            | Description, telegram, email, members, team social links       |
| `ProjectStellar`         | Contract address, stellar address, selected track IDs          |
| `ProjectSubmission`      | Aggregate — all sub-objects + hackathonId + status + timestamps |
| `SubmissionDashboardTab` | Union of the 5 tab names                                       |
| `ExistingProjectSummary` | Lightweight summary for reuse selector                         |

Imports `HackathonCategory` and `HackathonTrack` from `../../hackathon/types/hackathon.types`.

---

## Components

### `SubmissionDashboard.tsx`

A 5-tab form dashboard (mirrors `HackathonDashboard` layout):

1. **Project Details** — Name, tagline, vision, logo URL, category selector + right sidebar with summary & submit checklist.
2. **Links & Media** — GitHub, website, demo video inputs + dynamic social links.
3. **Description** — Full project description with Markdown edit/preview toggle.
4. **Team** — Team description, contact info (telegram, email), invite members form, team social links.
5. **Tracks & Stellar** — Track selection checkboxes, Soroban contract address, Stellar prize address.

**Shared UI primitives** (defined at top of file):
- `Card`, `SectionTitle`, `Label`, `inputClass`, `textareaClass`, `selectClass`
- Uses `aurora-bg` background class.

### `useSubmission.ts`

Central hook exporting all state and handlers:
- `submission` — the full `ProjectSubmission` state object
- `activeTab` / `setActiveTab` — tab navigation
- `isSaving` / `saveSuccess` — save UX indicators
- Update handlers: `updateDetails`, `updateLinks`, `addSocialLink`, `removeSocialLink`, `updateDescription`, `updateTeam`, `addTeamMember`, `removeTeamMember`, `addTeamSocial`, `removeTeamSocial`, `updateStellar`, `toggleTrack`
- `handleSave` — saves draft (mock 800ms delay)
- `handleSubmit` — validates + submits (mock 1.2s delay)
- `canSubmit` — computed validation (all required fields present)
- `prefillFromExisting(projectId)` — loads data from `MOCK_EXISTING_PROJECTS`

### `mockData.ts`

Exports:
- `MOCK_HACKATHON_TRACKS` — 3 tracks (DeFi, NFT & Gaming, Developer Tooling)
- `MOCK_EXISTING_PROJECTS` — 2 lightweight project summaries for reuse selector
- `MOCK_PROJECTS` — 3 full project objects used by the detail page, each with description, links, team members, Stellar addresses, social links
- `ProjectCardData` — local interface for detail page data

---

## Submission Flow (`submission/[hackathonId]/page.tsx`)

Three internal states managed via `step`:

1. **`choose`** — Two cards: "Create New Project" (Rocket icon) or "Add Existing Project" (FolderOpen icon).
2. **`select-existing`** — Searchable list of past projects with name, hackathon, date, track. Selecting one calls `prefillFromExisting()`.
3. **`dashboard`** — Renders `<SubmissionDashboard>` with all hook bindings.

On "Create New" the dashboard starts with a blank submission. On "Add Existing" it prefills fields from the selected project.

---

## Individual Project Page (`[id]/page.tsx`)

Public-facing detail page with layout:

1. **Sticky nav** — Back to Hackathon + Edit Project button.
2. **Hero gradient** — Project initial, team name, category, title, tagline, status badge, track tags.
3. **Key Info Bar** — Hackathon link, tracks, submitted date, team size.
4. **Content (2-column)**:
   - **Left**: About (markdown-ish rendering), Vision, Links & Media cards, Stellar Details (contract + wallet with explorer links).
   - **Right**: Team sidebar (members + contact + socials), Hackathon context card, Category & Tracks card.
5. **Footer** — Copyright + terms.

Project data is looked up from `MOCK_PROJECTS` by ID.

---

## Data Flow

```
User arrives at /submission/:hackathonId
  → step = 'choose'
  → picks "New" or "Existing"
    → if existing → step = 'select-existing' → picks project → prefillFromExisting()
    → step = 'dashboard'
  → fills 5 tabs → handleSave() (saves draft) → handleSubmit() (validates + submits)
  → status changes to 'Submitted'

Submitted projects are viewable at /project/:id
  → reads from MOCK_PROJECTS
  → renders public detail page
  → "Edit Project" links back to /submission/:hackathonId
```

---

## Validation Rules (canSubmit)

All required for submission:
- Project name (non-empty)
- Tagline (non-empty)
- Vision (non-empty)
- Category selected
- Description (non-empty)
- Team description (non-empty)
- Telegram handle
- Contact email
- At least one track selected
- Contract address (non-empty)
- Stellar address (non-empty)

---

## Design Patterns

- **Hook + Dashboard** — Same pattern as hackathon module (`useHackathon` + `HackathonDashboard`).
- **Mock data** — All data is local; no API calls. Ready for backend integration.
- **Shared CSS variables** — Uses `--brand`, `--text`, `--border`, `--bg`, `--bg-hover`, `--bg-muted`, `--text-secondary`, `--text-muted`.
- **Aurora background** — Dashboard pages use the `aurora-bg` CSS class.
- **Poster gradients** — Hero gradients are deterministically assigned from project name's char code.

---

## Changelog

### February 6, 2026
- Created full project submission module with 5-tab dashboard
- Implemented choice screen (new vs. existing project) with search
- Created individual project detail page with hero, info bar, content sections
- Added mock data with 3 complete projects
- Added type definitions importing from hackathon module
- Created route rewrites in next.config.ts

```

