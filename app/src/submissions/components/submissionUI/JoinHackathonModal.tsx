'use client';

import { X, Check, Plus, Loader2, Rocket } from 'lucide-react';
import Link from 'next/link';
import type { BuildCardData } from '@/src/builds/components/buildUI/BuildCard';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * TYPES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

type ModalStep = 'choose' | 'select-build';

interface JoinHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathonId: string;
  hackathonName: string;

  // Data
  userBuilds: BuildCardData[];
  isLoadingBuilds: boolean;

  // Actions
  onSelectExistingBuild: (buildId: string) => void;
  onCreateNewBuild: () => void;

  // State
  isSubmitting: boolean;
  error: string | null;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * COMPONENT
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function JoinHackathonModal({
  isOpen,
  onClose,
  hackathonName,
  userBuilds,
  isLoadingBuilds,
  onSelectExistingBuild,
  onCreateNewBuild,
  isSubmitting,
  error,
}: JoinHackathonModalProps) {
  const [step, setStep] = React.useState<ModalStep>('choose');
  const [selectedBuildId, setSelectedBuildId] = React.useState<string | null>(null);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setStep('choose');
      setSelectedBuildId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  /* ── Choose Step: Show two options ── */
  const renderChooseStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
          Join {hackathonName}
        </h2>
        <p className="text-sm text-[#4D4D4D]">
          Choose how you'd like to participate in this hackathon
        </p>
      </div>

      {/* Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: Submit Existing Build */}
        <button
          onClick={() => setStep('select-build')}
          disabled={isLoadingBuilds}
          className="group relative p-6 border-2 border-[#E5E5E5] rounded-2xl hover:border-[#8B4513] transition-all hover:shadow-md text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 rounded-full bg-[#8B4513]/10 flex items-center justify-center group-hover:bg-[#8B4513]/20 transition-colors">
              <Rocket className="w-5 h-5 text-[#8B4513]" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
            Submit Existing Build
          </h3>
          <p className="text-sm text-[#4D4D4D] mb-4">
            Choose from your published builds to submit
          </p>

          {isLoadingBuilds && (
            <div className="flex items-center gap-2 text-xs text-[#4D4D4D]">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading your builds...
            </div>
          )}

          {!isLoadingBuilds && (
            <div className="text-xs font-medium text-[#8B4513]">
              {userBuilds.length} build{userBuilds.length !== 1 ? 's' : ''} available
            </div>
          )}
        </button>

        {/* Option 2: Create New Build */}
        <button
          onClick={onCreateNewBuild}
          disabled={isSubmitting}
          className="group relative p-6 border-2 border-[#E5E5E5] rounded-2xl hover:border-[#8B4513] transition-all hover:shadow-md text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 rounded-full bg-[#8B4513]/10 flex items-center justify-center group-hover:bg-[#8B4513]/20 transition-colors">
              <Plus className="w-5 h-5 text-[#8B4513]" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
            Create New Build
          </h3>
          <p className="text-sm text-[#4D4D4D]">
            Start a fresh build for this hackathon
          </p>

          {isSubmitting && (
            <div className="flex items-center gap-2 text-xs text-[#4D4D4D] mt-4">
              <Loader2 className="w-3 h-3 animate-spin" />
              Creating build...
            </div>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );

  /* ── Select Build Step: Show user's builds ── */
  const renderSelectBuildStep = () => (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => setStep('choose')}
          className="text-sm text-[#4D4D4D] hover:text-[#1A1A1A] mb-4 flex items-center gap-1"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
          Select a Build
        </h2>
        <p className="text-sm text-[#4D4D4D]">
          Choose which build you want to submit to {hackathonName}
        </p>
      </div>

      {/* Builds List */}
      {isLoadingBuilds ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#4D4D4D]" />
        </div>
      ) : userBuilds.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-[#4D4D4D] mb-4">
            You don't have any published builds yet
          </p>
          <Link
            href="/builds/my-builds"
            className="text-sm text-[#8B4513] hover:underline inline-block"
          >
            Go to My Builds →
          </Link>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {userBuilds.map((build) => (
            <button
              key={build.id}
              onClick={() => setSelectedBuildId(build.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedBuildId === build.id
                  ? 'border-[#8B4513] bg-[#8B4513]/5'
                  : 'border-[#E5E5E5] hover:border-[#8B4513] hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Build Logo */}
                {build.logo && (
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={build.logo}
                      alt={build.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Build Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">
                    {build.name}
                  </h3>
                  {build.tagline && (
                    <p className="text-sm text-[#4D4D4D] line-clamp-2 mb-2">
                      {build.tagline}
                    </p>
                  )}
                  {build.category && (
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      {build.category}
                    </span>
                  )}
                </div>

                {/* Selected Indicator */}
                {selectedBuildId === build.id && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#8B4513] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#E5E5E5]">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 rounded-xl border border-[#E5E5E5] text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={() => selectedBuildId && onSelectExistingBuild(selectedBuildId)}
          disabled={!selectedBuildId || isSubmitting}
          className="flex-1 px-6 py-3 rounded-xl bg-[#8B4513] text-white hover:bg-[#6F3410] transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Build'
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-[#4D4D4D]" />
          </button>

          {/* Content */}
          <div className="p-8">
            {step === 'choose' && renderChooseStep()}
            {step === 'select-build' && renderSelectBuildStep()}
          </div>
        </div>
      </div>
    </>
  );
}

// Add React import for useState
import * as React from 'react';
