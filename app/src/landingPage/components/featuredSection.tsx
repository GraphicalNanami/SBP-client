'use client';

import { ArrowRight, Calendar, MapPin, Users, Zap, Globe, Code } from "lucide-react";
import { UnderlineHighlight } from "@/src/shared/components/ui/highlightText";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MOCK_EVENTS } from "@/src/events/components/eventsService/mockData";
import { Web3Event } from "@/src/events/types/event.types";

const FeaturedSection = () => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get featured events from real data
  const featuredEvents = MOCK_EVENTS.filter(event => event.featured).slice(0, 4);
  const mainFeaturedEvent = featuredEvents[0];
  const secondaryEvents = featuredEvents.slice(1, 4);

  // Get all hackathon images for carousel
  const hackathonImages = featuredEvents
    .filter(event => event.coverImage)
    .map(event => event.coverImage);

  useEffect(() => {
    if (hackathonImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % hackathonImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [hackathonImages.length]);

  const handleViewAllEvents = () => {
    router.push('/src/events');
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/src/events/${eventId}`);
  };

  const formatDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const startStr = start.toLocaleDateString('en-US', options);
    
    if (start.toDateString() === end.toDateString()) {
      return startStr;
    }
    
    const endDay = end.getDate();
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${endDay}, ${start.getFullYear()}`;
  };

  if (featuredEvents.length === 0) {
    return null;
  }

  return (
    <section className="relative py-24">
      {/* Doodle decorations */}
      <div className="absolute top-10 right-10 w-32 h-32 opacity-20 pointer-events-none hidden lg:block">
        <img src="/open-doodles/svg/GroovySittingDoodle.svg" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-10 left-10 w-40 h-40 opacity-20 pointer-events-none hidden lg:block">
        <img src="/open-doodles/svg/MeditatingDoodle.svg" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="container-main relative z-10">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              What&apos;s happening
            </span>
            <h2 className="heading-section" style={{ fontFamily: 'var(--font-jersey)' }}>
              Featured <UnderlineHighlight>Events</UnderlineHighlight>
            </h2>
          </div>
          <button 
            onClick={handleViewAllEvents}
            className="hidden md:flex items-center gap-2 text-foreground font-medium hover:gap-3 transition-all duration-200"
          >
            View all events
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Grid Layout - 4 columns for better symmetry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Large Featured Card - spans 2 cols and 2 rows */}
          {mainFeaturedEvent && (
            <div 
              onClick={() => handleEventClick(mainFeaturedEvent.id)}
              className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl min-h-[400px] lg:min-h-[520px] cursor-pointer"
            >
              {/* Background Image Carousel */}
              <div className="absolute inset-0">
                {hackathonImages.map((img, index) => (
                  <div
                    key={`carousel-image-${index}`}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={img}
                      alt="Event"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
              </div>

              {/* Image indicators */}
              {hackathonImages.length > 1 && (
                <div className="absolute top-6 right-6 flex gap-1.5 z-20">
                  {hackathonImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? "bg-white w-6" 
                          : "bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              )}
            
              <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                      {mainFeaturedEvent.type}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm backdrop-blur-sm">
                      {mainFeaturedEvent.locationType}
                    </span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-semibold leading-tight mb-4">
                    {mainFeaturedEvent.title}
                  </h3>
                  <p className="text-white/70 text-lg max-w-md line-clamp-2">
                    {mainFeaturedEvent.description}
                  </p>
                </div>
              
                <div>
                  <div className="flex flex-wrap gap-6 mb-6 text-white/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(mainFeaturedEvent.startDate, mainFeaturedEvent.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{mainFeaturedEvent.location}</span>
                    </div>
                    {mainFeaturedEvent.attendeeCount && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{mainFeaturedEvent.attendeeCount} registered</span>
                      </div>
                    )}
                  </div>
                
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-medium group-hover:gap-3 transition-all duration-200">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Event Cards */}
          {secondaryEvents.map((event, index) => (
            <RealEventCard
              key={event.id}
              event={event}
              onClick={() => handleEventClick(event.id)}
              formatDate={formatDate}
            />
          ))}
          
          {/* Stats Card */}
          <div className="rounded-3xl bg-foreground text-background p-6 flex flex-col justify-between min-h-[200px]">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-background/60">Live Events</span>
            </div>
            <div>
              <div className="text-5xl font-semibold text-background mb-2">{MOCK_EVENTS.length}+</div>
              <p className="text-background/60">Events happening around the globe</p>
            </div>
          </div>

          {/* CTA Card */}
          <div className="rounded-3xl bg-accent p-6 flex flex-col justify-between min-h-[200px]">
            <div>
              <h4 className="text-xl font-semibold text-accent-foreground mb-2">
                Host your event
              </h4>
              <p className="text-accent-foreground/70 text-sm">
                Create and manage events with our powerful tools.
              </p>
            </div>
            <button 
              onClick={handleViewAllEvents}
              className="inline-flex items-center gap-2 text-accent-foreground font-medium hover:gap-3 transition-all duration-200"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

interface RealEventCardProps {
  event: Web3Event;
  onClick: () => void;
  formatDate: (start: string, end: string) => string;
}

const RealEventCard = ({ event, onClick, formatDate }: RealEventCardProps) => {
  const getColorForType = (type: string) => {
    switch (type) {
      case 'Hackathon':
        return 'bg-[#FFE5E5]';
      case 'Workshop':
      case 'Bootcamp':
        return 'bg-[#E5F0FF]';
      case 'Meetup':
      case 'Conference':
        return 'bg-[#E5FFE5]';
      default:
        return 'bg-[#F5F5F5]';
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Workshop':
      case 'Bootcamp':
        return <Code className="w-5 h-5" />;
      case 'Meetup':
      case 'Conference':
        return <Globe className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`group rounded-3xl ${getColorForType(event.type)} p-6 flex flex-col justify-between min-h-[200px] hover:shadow-lg transition-all duration-300 cursor-pointer`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-2 py-0.5 rounded-full bg-foreground/10 text-foreground text-xs font-medium">
            {event.type}
          </span>
          <span className="text-foreground/40">{getIconForType(event.type)}</span>
        </div>
        <h4 className="text-lg font-semibold text-foreground leading-snug line-clamp-2">
          {event.title}
        </h4>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/70">
          <span>{formatDate(event.startDate, event.endDate)}</span>
          {event.attendeeCount && (
            <>
              <span className="mx-2">·</span>
              <span>{event.attendeeCount} attending</span>
            </>
          )}
        </div>
        <button className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;
