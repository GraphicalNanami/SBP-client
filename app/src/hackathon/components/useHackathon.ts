'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { hackathonApi } from '@/src/shared/lib/api/hackathonApi';
import type {
  Hackathon,
  HackathonGeneral,
  HackathonTrack,
  HackathonDashboardTab,
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
    id: 'new',
    organizationId: orgId,
    status: 'Draft',
    general: { ...emptyGeneral },
    tracks: [],
    description: '',
    admins: [],
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
export function useHackathon(hackathonId: string, organizationId?: string) {
  const isNew = hackathonId === 'new';

  const [hackathon, setHackathon] = useState<Hackathon>(() =>
    createEmptyHackathon(organizationId || 'org-placeholder'),
  );
  const [activeTab, setActiveTab] = useState<HackathonDashboardTab>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /* ── Update organizationId when it changes (for new hackathons) ── */
  useEffect(() => {
    if (isNew && organizationId && organizationId !== hackathon.organizationId) {
      setHackathon((prev) => ({
        ...prev,
        organizationId,
      }));
    }
  }, [organizationId, isNew, hackathon.organizationId]);

  /* ── Load hackathon from backend if not new ── */
  useEffect(() => {
    if (!isNew && hackathonId) {
      setIsLoading(true);
      setError(null);

      hackathonApi.getHackathon(hackathonId)
        .then((data) => {
          setHackathon(data);
          setIsLoading(false);
        })
        .catch((err: unknown) => {
          console.error('Failed to load hackathon:', err);
          const error = err as { message?: string };
          setError(error.message || 'Failed to load hackathon');
          setIsLoading(false);
        });
    }
  }, [hackathonId, isNew]);

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

  /* ── Save to backend ── */
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    setValidationError(null);
    setFieldErrors({});

    try {
      if (isNew) {
        // Validate organizationId before creating
        if (!hackathon.organizationId || hackathon.organizationId.includes('placeholder')) {
          throw new Error('Invalid organization. Please select a valid organization.');
        }

        // Create new hackathon
        const created = await hackathonApi.createHackathon(hackathon.general, hackathon.organizationId, hackathon.description);
        setHackathon(created);
        // Update URL to the new ID (in a real app, you'd use router.replace)
        window.history.replaceState(null, '', `/hackathon/manage/${created.id}`);
      } else {
        // Update existing hackathon using comprehensive update endpoint
        // This sends all hackathon data including tracks, prizes, custom questions, etc.
        const updated = await hackathonApi.updateHackathon(hackathon.id, hackathon);
        setHackathon(updated);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: unknown) {
      console.error('Failed to save hackathon:', err);

      // Check if this is a validation error (400 status) or file too large (413 status)
      const error = err as { status?: number; message?: string };
      if (error.status === 400 || error.status === 413) {
        // This is a validation error - don't break the page
        setValidationError(error.message || 'Please fix the validation errors');

        // Map common error messages to field names
        const errorMessage = error.message || '';
        const errors: Record<string, string> = {};

        if (errorMessage.includes('Start time')) {
          errors.startTime = errorMessage;
        }
        if (errorMessage.includes('submission deadline') || errorMessage.includes('Submission deadline')) {
          errors.submissionDeadline = errorMessage;
        }
        if (errorMessage.includes('pre-registration') || errorMessage.includes('Pre-registration')) {
          errors.preRegEndTime = errorMessage;
        }
        if (errorMessage.includes('Prize pool')) {
          errors.prizePool = errorMessage;
        }
        if (errorMessage.includes('name') && errorMessage.includes('required')) {
          errors.name = errorMessage;
        }
        if (errorMessage.includes('category')) {
          errors.category = errorMessage;
        }
        if (errorMessage.includes('admin contact') || errorMessage.includes('contact')) {
          errors.adminContact = errorMessage;
        }
        // Handle file size errors
        if (errorMessage.toLowerCase().includes('too large') || errorMessage.toLowerCase().includes('entity too large')) {
          errors.poster = 'Image file is too large. Please upload an image under 2MB.';
        }

        setFieldErrors(errors);

        // Auto-clear validation error after 5 seconds
        setTimeout(() => {
          setValidationError(null);
        }, 5000);
      } else {
        // This is a fatal error (network, server, etc.)
        const errorMessage = error.message || 'Failed to save hackathon';
        setError(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  }, [hackathon, isNew]);

  /* ── Submit for review ── */
  const handleSubmitForReview = useCallback(async () => {
    // Must save before submitting
    if (isNew) {
      setValidationError('Please save the hackathon before submitting for review');
      setTimeout(() => setValidationError(null), 5000);
      return;
    }

    // Validate required fields
    if (!canPublish) {
      setValidationError('Please complete all required fields before submitting for review');
      setTimeout(() => setValidationError(null), 5000);
      return;
    }

    setIsSaving(true);
    setError(null);
    setValidationError(null);

    try {
      const updated = await hackathonApi.submitForReview(hackathon.id);
      setHackathon(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: unknown) {
      console.error('Failed to submit hackathon for review:', err);

      // Check if this is a validation error
      const error = err as { status?: number; message?: string };
      if (error.status === 400 || error.status === 403) {
        setValidationError(error.message || 'Failed to submit hackathon for review');
        setTimeout(() => setValidationError(null), 5000);
      } else {
        setError(error.message || 'Failed to submit hackathon for review');
      }
    } finally {
      setIsSaving(false);
    }
  }, [hackathon.id, isNew, canPublish]);

  return {
    hackathon,
    activeTab,
    setActiveTab,
    isSaving,
    saveSuccess,
    isLoading,
    error,
    validationError,
    fieldErrors,
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
  };
}
