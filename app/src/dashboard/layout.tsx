import { FloatingNav } from '@/src/shared/components/ui/floating-navbar';

const floatingNavItems = [
  { name: "Events", link: "/Events" },
  { name: "Hackathons", link: "/src/hackathon" },
  { name: "Builds", link: "/Builds" },
  { name: "Swags", link: "#", disabled: true },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  );
}
