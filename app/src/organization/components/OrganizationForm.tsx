'use client';

import { useState } from 'react';
import { ArrowRight, Check, AlertCircle, Loader2 } from 'lucide-react';
import { OrganizationCreatePayload } from '../types/organization.types';
// import type { OrganizationCreatePayload } from '../../types/organization.types';

interface OrganizationFormProps {
  onSubmit: (payload: OrganizationCreatePayload) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function OrganizationForm({ onSubmit, isLoading = false, error = null }: OrganizationFormProps) {
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
      onSubmit({ name: name.trim(), website: website.trim(), termsAccepted });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-16">
      <div className="w-full max-w-[440px]">
        {/* Heading */}
        <h1
          className="mb-3 text-center text-[28px] font-bold text-text"
          style={{ letterSpacing: '-0.04em', lineHeight: '1.15' }}
        >
          Create your Organization
        </h1>
        <p className="mb-8 text-center text-[15px] leading-relaxed text-text-secondary">
          Set up your organization profile to start creating hackathons on the Stellar platform.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-error/20 bg-error/5 px-4 py-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
            <div className="flex-1">
              <p className="text-sm font-medium text-error">Error</p>
              <p className="mt-0.5 text-sm text-error/90">{error}</p>
            </div>
          </div>
        )}

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
              className="h-[52px] w-full rounded-full border border-border bg-bg-card px-5 text-[15px] text-text transition-all duration-200 placeholder:text-text-muted hover:border-border-hover focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
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
              className="h-[52px] w-full rounded-full border border-border bg-bg-card px-5 text-[15px] text-text transition-all duration-200 placeholder:text-text-muted hover:border-border-hover focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
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
              disabled={isLoading}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-semibold text-brand-fg transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-xs leading-relaxed text-text-muted">
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
