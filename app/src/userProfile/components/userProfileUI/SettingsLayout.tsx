'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Personal Info', href: '/src/dashboard/settings/personal-info' },
    { name: 'Social Accounts', href: '/src/dashboard/settings/social-accounts' },
    { name: 'Experience', href: '/src/dashboard/settings/experience' },
    { name: 'Wallets', href: '/src/dashboard/settings/wallets' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <nav className="space-y-1 bg-white rounded-2xl p-4 shadow-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 text-sm transition-all duration-200 rounded-xl ${
                    isActive(item.href)
                      ? 'bg-[hsl(var(--accent))] text-foreground font-semibold border-l-4 border-foreground'
                      : 'border-l-4 border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-2xl p-8 lg:p-12 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
