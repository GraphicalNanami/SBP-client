'use client';

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/src/auth/hooks/useAuth";
import ProfileDropdown from "@/src/userProfile/components/userProfileUI/ProfileDropdown";

const Navbar = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <nav className="relative w-full py-4 backdrop-blur-sm bg-transparent sticky top-0 z-50 rounded-9xl">
      <div className="container-main flex items-center justify-between">
        {/* Logo */}
        <Link href="/src/landingPage" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-foreground rounded-sm flex items-center justify-center">
            <span className="text-background text-xs font-bold">≡</span>
          </div>
          <span className="text-xl font-semibold text-foreground">SBP</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/Events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Events</Link>
          <Link href="/hackathons" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Hackathons</Link>
          <Link href="/Builds" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Builds</Link>
        </div>
        
        {/* CTAs - Conditional Rendering */}
        <div className="flex items-center gap-3">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <ProfileDropdown />
              ) : (
                <>
                  <Link href="/src/auth">
                    <button className="px-5 py-2.5 text-sm font-medium bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 flex items-center gap-2">
                      sign up / sign in
                    </button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
