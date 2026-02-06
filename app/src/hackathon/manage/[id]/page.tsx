'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import HackathonDashboard from '../../components/HackathonDashboard';
import { useHackathon } from '../../components/useHackathon';
import { organizationApi } from '@/src/shared/lib/api/organizationApi';

export default function HackathonManagePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hackathonId = params.id as string;
  const organizationId = searchParams.get('orgId') || undefined;
  const isNew = hackathonId === 'new';

  const [isLoadingOrg, setIsLoadingOrg] = useState(false);
  const [resolvedOrgId, setResolvedOrgId] = useState<string | undefined>(organizationId);

  // For new hackathons, if no orgId is provided, fetch user's organizations
  useEffect(() => {
    if (isNew && !organizationId) {
      setIsLoadingOrg(true);
      organizationApi.getUserOrganizations()
        .then((orgs) => {
          if (orgs.length === 0) {
            // No organizations, redirect to create one
            router.push('/organization');
          } else if (orgs.length === 1) {
            // Only one organization, use it automatically
            setResolvedOrgId(orgs[0].id);
          } else {
            // Multiple organizations, redirect to organization selector
            // For now, just use the first one
            setResolvedOrgId(orgs[0].id);
          }
          setIsLoadingOrg(false);
        })
        .catch((err) => {
          console.error('Failed to load organizations:', err);
          // Redirect to organization page on error
          router.push('/organization');
        });
    }
  }, [isNew, organizationId, router]);

  const hook = useHackathon(hackathonId, resolvedOrgId);

  // Show loading state while fetching organization
  if (isNew && !resolvedOrgId && isLoadingOrg) {
    return (
      <div className="aurora-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[var(--brand)]" />
          <p className="text-sm text-[var(--text-muted)]">Loading organization...</p>
        </div>
      </div>
    );
  }

  return <HackathonDashboard {...hook} />;
}
