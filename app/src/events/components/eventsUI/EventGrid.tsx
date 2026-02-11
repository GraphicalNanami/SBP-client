'use client';
import { useRouter } from 'next/navigation';import { Web3Event } from '../../types/event.types';
import { EventCard } from './EventCard';
import CalendarWithPresets from '@/components/ui/calendar-demo';

interface EventGridProps {
  events: Web3Event[];
  onEventClick: (event: Web3Event) => void;
  isLoading?: boolean;
}

export const EventGrid = ({ events, onEventClick, isLoading }: EventGridProps) => {
  const router = useRouter();

  const handleCardClick = (event: Web3Event) => {
    // For hackathons, use the modal
    if (event.type === 'Hackathon') {
      onEventClick(event);
    } else {
      // For all other events, navigate to dedicated page
      router.push(`/src/events/${event.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="h-[500px] rounded-3xl bg-secondary animate-pulse" />
        <div className="grid grid-rows-2 gap-5">
          <div className="h-[242px] rounded-3xl bg-secondary animate-pulse" />
          <div className="h-[242px] rounded-3xl bg-secondary animate-pulse" />
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary border border-border flex items-center justify-center mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">No events found</h3>
        <p className="text-muted-foreground max-w-sm">
          Try adjusting your filters or search query to find what you&apos;re looking for.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-2.5 rounded-xl border border-border text-foreground hover:bg-secondary transition-all"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  const [featured, second, third, ...remainingEvents] = events;

  return (
    <div className="space-y-12">
      {/* Main 2-Column Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
        {/* Left: Large Rectangular Card */}
        {featured && (
          <EventCard 
            event={featured} 
            onClick={() => handleCardClick(featured)}
            featured
          />
        )}

        {/* Right: 2 Stacked Cards */}
        <div className="grid grid-cols-3 gap-5 ">
          {second && (
            <EventCard 
              event={second} 
              onClick={() => handleCardClick(second)} 
            />
          )}
          {third && (
            <EventCard 
              event={third} 
              onClick={() => handleCardClick(third)} 
            />
          )}
        </div>
      </div>

      {/* Remaining Events in Regular Grid */}
      {remainingEvents.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">More Events</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {remainingEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={() => handleCardClick(event)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

