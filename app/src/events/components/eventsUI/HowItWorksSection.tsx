'use client';

import { Search, Users, Sparkles } from 'lucide-react';

export const HowItWorksSection = () => {
  return (
    <section className="py-24">
      <div className="container-main">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-onest)' }}>
            How Stellar Events work
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting wavy lines */}
          <svg className="hidden md:block absolute top-1/4 left-0 w-full h-32 -z-10 opacity-20" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,50 Q300,10 600,50 T1200,50" stroke="currentColor" strokeWidth="3" fill="none" className="text-accent" />
          </svg>

          {/* Step 1 */}
          <div className="relative bg-background border border-border rounded-3xl p-8 hover:shadow-lg transition-all">
            <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Discover events
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              See who&apos;s hosting local Stellar events for all the things you love. Search by category, location, or date.
            </p>
            <a href="#" className="text-accent-foreground font-semibold hover:underline">
              Search events →
            </a>
          </div>

          {/* Step 2 */}
          <div className="relative bg-background border border-border rounded-3xl p-8 hover:shadow-lg transition-all">
            <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Find your people
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Connect over shared interests in blockchain, and enjoy meaningful experiences with fellow builders.
            </p>
            <a href="#" className="text-accent-foreground font-semibold hover:underline">
              Join community →
            </a>
          </div>

          {/* Step 3 */}
          <div className="relative bg-background border border-border rounded-3xl p-8 hover:shadow-lg transition-all">
            <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Build together
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Create your own Stellar event, and draw from a community of millions of passionate developers.
            </p>
            <a href="/src/organization" className="text-accent-foreground font-semibold hover:underline">
              Start a group →
            </a>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-16">
          <p className="text-2xl font-bold text-accent-foreground inline-flex items-center gap-2">
            <span className="text-accent text-3xl">♥</span>
            Stellar Events = community
          </p>
        </div>
      </div>
    </section>
  );
};
