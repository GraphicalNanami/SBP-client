'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEvents } from './components/eventsService/useEvents';
import { FilterBar } from './components/eventsUI/FilterBar';
import { EventGrid } from './components/eventsUI/EventGrid';
import { EventDetailModal } from './components/eventsUI/EventDetailModal';
import { JoinCommunitySection } from './components/eventsUI/JoinCommunitySection';
import { ExploreCategoriesSection } from './components/eventsUI/ExploreCategoriesSection';
import { PopularCitiesSection } from './components/eventsUI/PopularCitiesSection';
import { HowItWorksSection } from './components/eventsUI/HowItWorksSection';
import { CalendarButton } from './components/eventsUI/CalendarButton';
import { CalendarModal } from './components/eventsUI/CalendarModal';
import { Web3Event } from './types/event.types';
import Navbar from '../landingPage/components/Navbar';
import Footer from '../landingPage/components/Footer';
import { Sparkles, Plus } from 'lucide-react';
import { UnderlineHighlight, CircleHighlight } from '@/src/shared/components/ui/highlightText';
import { useAuth } from '../auth/hooks/useAuth';
import Link from 'next/link';

export default function EventsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { 
    events, 
    filters, 
    isLoading,
    error,
    updateSearchQuery, 
    updateTypeFilter, 
    updateLocationFilter,
    filteredCount 
  } = useEvents();
  
  const [selectedEvent, setSelectedEvent] = useState<Web3Event | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleReset = () => {
    updateSearchQuery('');
    updateTypeFilter('All');
    updateLocationFilter('All');
  };

  const handleEventClick = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      // For hackathons, show modal
      if (event.type === 'Hackathon') {
        setSelectedEvent(event);
        setIsCalendarOpen(false);
      } else {
        // For all other events, navigate to dedicated page
        router.push(`/src/events/${eventId}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Simplified Hero */}
        <section className="relative py-20 md:py-24 overflow-hidden">
          {/* Wavy Background Text */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] select-none">
            <div className="absolute top-20 left-10 text-9xl font-bold text-foreground transform -rotate-12">Events</div>
            <div className="absolute top-60 right-20 text-8xl font-bold text-foreground transform rotate-6">Stellar</div>
            <div className="absolute bottom-40 left-1/4 text-7xl font-bold text-foreground transform -rotate-6">Build</div>
          </div>

          <div className="container-main relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-8">
              <Sparkles className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">
                {filteredCount} events • 12 countries • 5,200+ builders
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground" style={{ fontFamily: 'var(--font-onest)' }}>
              Discover <UnderlineHighlight>Amazing</UnderlineHighlight>
              <br />
              <CircleHighlight>Stellar Events</CircleHighlight>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join conferences, hackathons, and meetups building the future of blockchain technology.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <CalendarButton onClick={() => setIsCalendarOpen(true)} />
              {isAuthenticated && (
              <Link
                href="/src/events/create"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#E6FF80] text-[#1A1A1A] rounded-xl hover:bg-[#d4ed6e] transition-all font-medium"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </Link>
              )}
            </div>
          </div>
        </section>
        
        {/* Filter Bar */}
        <FilterBar 
          activeType={filters.type}
          activeLocation={filters.locationType}
          onTypeChange={updateTypeFilter}
          onLocationChange={updateLocationFilter}
          onReset={handleReset}
        />
        
        {/* Main Bento Grid */}
        <div className="container-main py-12">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <EventGrid 
            events={events} 
            onEventClick={setSelectedEvent}
            isLoading={isLoading}
          />
        </div>

        {/* New Sections */}
        <JoinCommunitySection />
        <ExploreCategoriesSection />
        <PopularCitiesSection events={events} />
        <HowItWorksSection />
      </main>

      <Footer />

      {/* Calendar Modal */}
      <CalendarModal 
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        events={events}
        onEventClick={handleEventClick}
      />

      {/* Netflix-Style Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal 
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}


