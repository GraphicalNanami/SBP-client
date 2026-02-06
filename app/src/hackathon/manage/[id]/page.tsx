'use client';

import { useParams } from 'next/navigation';
import HackathonDashboard from '../../components/HackathonDashboard';
import { useHackathon } from '../../components/useHackathon';

export default function HackathonManagePage() {
  const params = useParams();
  const hackathonId = params.id as string;
  const hook = useHackathon(hackathonId);

  return <HackathonDashboard {...hook} />;
}
