'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import type {
  Hackathon,
  HackathonGeneral,
  HackathonTrack,
  HackathonDashboardTab,
  HackathonStatus,
  HackathonAdmin,
} from '../types/hackathon.types';

/* ── Empty defaults ── */
const emptyGeneral: HackathonGeneral = {
  name: '',
  category: '',
  visibility: 'Public',
  poster: '',
  prizePool: 0,
  prizeAsset: 'USDC',
  tags: [],
  startTime: '',
  preRegEndTime: '',
  submissionDeadline: '',
  venue: 'Online',
  venueLocation: '',
  submissionRequirements: '',
  adminContact: '',
  customQuestions: [],
};

function createEmptyHackathon(orgId: string): Hackathon {
  const now = new Date().toISOString();
  return {
    id: `hack-${Date.now()}`,
    organizationId: orgId,
    status: 'Draft',
    general: { ...emptyGeneral },
    tracks: [],
    description: '',
    admins: [
      {
        id: `admin-${Date.now()}`,
        email: 'you@example.com',
        name: 'You',
        permission: 'Full Access',
        addedAt: now,
      },
    ],
    prizes: [],
    judges: [],
    builders: [],
    projects: [],
    createdAt: now,
    updatedAt: now,
  };
}

/* ═══════════════════════════════════════════════════════
   useHackathon hook
   ═══════════════════════════════════════════════════════ */
export function useHackathon(hackathonId: string) {
  const isNew = hackathonId === 'new';

  const [hackathon, setHackathon] = useState<Hackathon>(() =>
    createEmptyHackathon('org-placeholder'),
  );
  const [activeTab, setActiveTab] = useState<HackathonDashboardTab>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  /* ── Sync hackathon data to sessionStorage for preview ── */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`hackathon-preview-${hackathonId}`, JSON.stringify(hackathon));
    }
  }, [hackathon, hackathonId]);

  /* ── General field updates ── */
  const updateGeneral = useCallback(
    <K extends keyof HackathonGeneral>(field: K, value: HackathonGeneral[K]) => {
      setHackathon((prev) => ({
        ...prev,
        general: { ...prev.general, [field]: value },
        updatedAt: new Date().toISOString(),
      }));
    },
    [],
  );

  /* ── Description ── */
  const updateDescription = useCallback((value: string) => {
    setHackathon((prev) => ({
      ...prev,
      description: value,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /* ── Tracks ── */
  const addTrack = useCallback(() => {
    const track: HackathonTrack = {
      id: `track-${Date.now()}`,
      name: '',
      description: '',
      order: 0,
    };
    setHackathon((prev) => {
      const tracks = [...prev.tracks, { ...track, order: prev.tracks.length }];
      return { ...prev, tracks, updatedAt: new Date().toISOString() };
    });
  }, []);

  const updateTrack = useCallback(
    (trackId: string, field: keyof HackathonTrack, value: string | number) => {
      setHackathon((prev) => ({
        ...prev,
        tracks: prev.tracks.map((t) => (t.id === trackId ? { ...t, [field]: value } : t)),
        updatedAt: new Date().toISOString(),
      }));
    },
    [],
  );

  const removeTrack = useCallback((trackId: string) => {
    setHackathon((prev) => ({
      ...prev,
      tracks: prev.tracks.filter((t) => t.id !== trackId).map((t, i) => ({ ...t, order: i })),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /* ── Admins ── */
  const addAdmin = useCallback((email: string, permission: HackathonAdmin['permission']) => {
    const admin: HackathonAdmin = {
      id: `admin-${Date.now()}`,
      email,
      name: email.split('@')[0],
      permission,
      addedAt: new Date().toISOString(),
    };
    setHackathon((prev) => ({
      ...prev,
      admins: [...prev.admins, admin],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeAdmin = useCallback((adminId: string) => {
    setHackathon((prev) => ({
      ...prev,
      admins: prev.admins.filter((a) => a.id !== adminId),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /* ── Tags ── */
  const addTag = useCallback((tag: string) => {
    setHackathon((prev) => {
      if (prev.general.tags.includes(tag)) return prev;
      return {
        ...prev,
        general: { ...prev.general, tags: [...prev.general.tags, tag] },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const removeTag = useCallback((tag: string) => {
    setHackathon((prev) => ({
      ...prev,
      general: { ...prev.general, tags: prev.general.tags.filter((t) => t !== tag) },
      updatedAt: new Date().toISOString(),
    }));
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

  /* ── Publish validation ── */
  const canPublish = useMemo(() => {
    const g = hackathon.general;
    return (
      g.name.trim() !== '' &&
      g.category !== '' &&
      g.startTime !== '' &&
      g.submissionDeadline !== '' &&
      g.adminContact.trim() !== '' &&
      g.prizePool > 0 &&
      hackathon.tracks.length > 0
    );
  }, [hackathon]);

  return {
    hackathon,
    activeTab,
    setActiveTab,
    isSaving,
    saveSuccess,
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
  };
}
