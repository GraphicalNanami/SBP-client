import { redirect } from 'next/navigation';

export default function SettingsPage() {
  redirect('/src/dashboard/settings/personal-info');
}
