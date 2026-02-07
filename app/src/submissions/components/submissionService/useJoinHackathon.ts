'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMyBuilds, createBuild } from '@/src/builds/components/buildService/buildsApi';
import { createSubmission } from './submissionsApi';
import type { BuildCardData } from '@/src/builds/components/buildUI/BuildCard';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * HOOK: useJoinHackathon
 * Business logic for joining hackathons
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface UseJoinHackathonProps {
  hackathonId: string;
  hackathonName: string;
}

export function useJoinHackathon({ hackathonId, hackathonName }: UseJoinHackathonProps) {
  const router = useRouter();

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userBuilds, setUserBuilds] = useState<BuildCardData[]>([]);
  const [isLoadingBuilds, setIsLoadingBuilds] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Open Modal ── */
  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setError(null);
  }, []);

  /* ── Close Modal ── */
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
    setIsSubmitting(false);
  }, []);

  /* ── Fetch User's Published Builds ── */
  const fetchUserBuilds = useCallback(async () => {
    try {
      setIsLoadingBuilds(true);
      setError(null);

      const builds = await getMyBuilds();

      // Filter only published builds (cannot submit draft builds)
      const publishedBuilds = builds.filter(
        (build) => build.status === 'Published' || build.status === 'PUBLISHED'
      );

      setUserBuilds(publishedBuilds);
    } catch (err) {
      console.error('Failed to fetch user builds:', err);
      setError(err instanceof Error ? err.message : 'Failed to load your builds');
    } finally {
      setIsLoadingBuilds(false);
    }
  }, []);

  /* ── Fetch builds when modal opens ── */
  useEffect(() => {
    if (isModalOpen) {
      fetchUserBuilds();
    }
  }, [isModalOpen, fetchUserBuilds]);

  /* ── Create New Build ── */
  const handleCreateNewBuild = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Create a new draft build with minimal payload
      const newBuild = await createBuild({
        name: `${hackathonName} Project`,
      });

      // Navigate to build edit page with hackathon context
      router.push(`/builds/edit/${newBuild.uuid}?hackathon=${hackathonId}`);

      // Close modal
      closeModal();
    } catch (err) {
      console.error('Failed to create new build:', err);
      setError(err instanceof Error ? err.message : 'Failed to create build');
      setIsSubmitting(false);
    }
  }, [hackathonName, hackathonId, router, closeModal]);

  /* ── Submit Existing Build ── */
  const handleSelectExistingBuild = useCallback(
    async (buildId: string) => {
      try {
        setIsSubmitting(true);
        setError(null);

        // Create submission
        await createSubmission({
          buildUuid: buildId,
          hackathonUuid: hackathonId,
          selectedTrackUuids: [], // TODO: Add track selection if needed
          customAnswers: [], // TODO: Add custom question answers if needed
        });

        // Success! Close modal and show success message
        closeModal();

        // Optional: Navigate to submission confirmation or show toast
        // For now, we'll just close the modal
        alert('Successfully submitted your build to the hackathon!');
      } catch (err) {
        console.error('Failed to submit build:', err);

        // Check for specific error messages from backend
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to submit build. Please try again.';

        setError(errorMessage);
        setIsSubmitting(false);
      }
    },
    [hackathonId, closeModal]
  );

  return {
    // Modal state
    isModalOpen,
    openModal,
    closeModal,

    // Data
    userBuilds,
    isLoadingBuilds,

    // Actions
    handleCreateNewBuild,
    handleSelectExistingBuild,

    // UI state
    isSubmitting,
    error,
  };
}
