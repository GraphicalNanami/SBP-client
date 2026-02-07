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
          <img src="logo.png" alt="SBP Logo" className="w-6 h-6 object-contain" />

          <span className="text-xl font-semibold text-foreground">SBP</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/Events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Events</Link>
          <Link href="/src/hackathon" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Hackathons</Link>
          <Link href="/Builds" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Builds</Link>
            <button 
            disabled 
            className="text-sm text-muted-foreground cursor-not-allowed group relative"
            title="Coming soon"
            >
            Swags
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Coming soon
            </span>
            </button>
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
                     sign in
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
