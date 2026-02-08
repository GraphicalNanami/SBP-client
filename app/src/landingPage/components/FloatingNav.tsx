"use client";

import React from "react";
import Link from "next/link";

type NavItem = {
  name: string;
  link: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export default function FloatingNav({ navItems }: { navItems: NavItem[] }) {
  return (
    <div className="hidden md:flex items-center gap-8">
      {navItems.map((item) =>
        item.disabled ? (
          <span
            key={item.name}
            className="text-sm text-muted-foreground cursor-not-allowed opacity-50 relative group"
            title="Coming Soon"
          >
            {item.name}
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Coming Soon
            </span>
          </span>
        ) : (
          <Link
            key={item.name}
            href={item.link}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {item.icon ? <span className="w-4 h-4">{item.icon}</span> : null}
            <span>{item.name}</span>
          </Link>
        )
      )}
    </div>
  );
}
