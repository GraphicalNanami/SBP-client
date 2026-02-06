'use client';

import { Web3Event } from '../../types/event.types';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';

interface EventCardProps {
  event: Web3Event;
  onClick: (event: Web3Event) => void;
  featured?: boolean;
}

export const EventCard = ({ event, onClick, featured = false }: EventCardProps) => {
  const startDate = new Date(event.startDate);
  
  const getTypeColor = (type: Web3Event['type']) => {
    switch (type) {
      case 'Hackathon': return 'bg-[#FFE5E5]';
      case 'Conference': return 'bg-[#E5F0FF]';
      case 'Meetup': return 'bg-[#F0E5FF]';
      case 'Workshop': return 'bg-[#FFF5E5]';
      default: return 'bg-[#E5FFE5]';
    }
  };

  if (featured) {
    return (
      <div 
        onClick={() => onClick(event)}
        className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl min-h-[400px] lg:min-h-[520px] cursor-pointer"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>
        
        <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                {event.type}
              </span>
              {event.cost === 'Free' && (
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm backdrop-blur-sm">
                  Free
                </span>
              )}
            </div>
            <h3 className="text-3xl lg:text-4xl font-semibold leading-tight mb-4">
              {event.title}
            </h3>
            <p className="text-white/70 text-lg max-w-md">
              {event.description}
            </p>
          </div>
          
          <div>
            <div className="flex flex-wrap gap-6 mb-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{format(startDate, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{event.attendeeCount} registered</span>
              </div>
            </div>
            
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-medium group-hover:gap-3 transition-all duration-200">
              View Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(event)}
      className={`group rounded-3xl ${getTypeColor(event.type)} p-6 flex flex-col justify-between min-h-[400px] hover:shadow-lg transition-all duration-300 cursor-pointer`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-2 py-0.5 rounded-full bg-foreground/10 text-foreground text-xs font-medium">
            {event.type}
          </span>
          {event.cost === 'Free' && (
            <span className="text-xs font-semibold text-foreground/60">FREE</span>
          )}
        </div>
        <h4 className="text-lg font-semibold text-foreground leading-snug line-clamp-2">
          {event.title}
        </h4>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-foreground/70">
          <span>{format(startDate, 'MMM d')}</span>
          <span className="mx-2">·</span>
          <span>{event.attendeeCount} attending</span>
        </div>
        <button className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
