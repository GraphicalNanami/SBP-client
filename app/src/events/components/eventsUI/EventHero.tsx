'use client';

import { Search, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { UnderlineHighlight, CircleHighlight } from '@/src/shared/components/ui/highlightText';

interface EventHeroProps {
  onSearch: (query: string) => void;
  eventCount: number;
}

export const EventHero = ({ onSearch, eventCount }: EventHeroProps) => {
  return (
    <section className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden">
      {/* Wavy Background Text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] select-none">
        <div className="absolute top-20 left-10 text-9xl font-bold text-foreground transform -rotate-12">Events</div>
        <div className="absolute top-60 right-20 text-8xl font-bold text-foreground transform rotate-6">Stellar</div>
        <div className="absolute bottom-40 left-1/4 text-7xl font-bold text-foreground transform -rotate-6">Build</div>
      </div>

      <div className="container-main relative z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-8">
          <Sparkles className="w-4 h-4 text-accent-foreground" />
          <span className="text-sm font-medium text-accent-foreground">
            {eventCount} events • 12 countries • 5,200+ builders
          </span>
        </div>

        {/* Title with Highlights */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground" style={{ fontFamily: 'var(--font-onest)' }}>
          Discover <UnderlineHighlight>Amazing</UnderlineHighlight>
          <br className="hidden md:block" />
          <CircleHighlight>Stellar Events</CircleHighlight>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Join conferences, hackathons, and meetups building the future of blockchain technology.
        </p>

        {/* Search and CTA */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-3xl">
          <div className="relative flex-grow group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <input
              type="text"
              placeholder="Search events, cities, or tracks..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
            />
          </div>
          
          <Link href="/src/organization">
            <button className="whitespace-nowrap px-8 py-4 rounded-2xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Submit Event
            </button>
          </Link>
        </div>

        {/* Categories Preview */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 text-muted-foreground text-sm">
          <span className="font-medium">Popular:</span>
          <button className="hover:text-foreground transition-colors font-medium">#Stellar</button>
          <button className="hover:text-foreground transition-colors font-medium">#Soroban</button>
          <button className="hover:text-foreground transition-colors font-medium">#DeFi</button>
          <button className="hover:text-foreground transition-colors font-medium">#Hackathons</button>
        </div>
      </div>
    </section>
  );
};
