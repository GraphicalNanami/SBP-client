'use client';

import { ArrowRight, Calendar, MapPin, Users, Zap, Globe, Code } from "lucide-react";
import { UnderlineHighlight } from "@/src/shared/components/ui/highlightText";
import { useState, useEffect } from "react";

const hackathonImages = [
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
];

const FeaturedSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % hackathonImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24">
      <div className="container-main">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              What's happening
            </span>
            <h2 className="heading-section">
              Featured <UnderlineHighlight>Events</UnderlineHighlight>
            </h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-foreground font-medium hover:gap-3 transition-all duration-200">
            View all events
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Grid Layout - 4 columns for better symmetry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Large Featured Card - spans 2 cols and 2 rows */}
          <div className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl min-h-[400px] lg:min-h-[520px]">
            {/* Background Image Carousel */}
            <div className="absolute inset-0">
              {hackathonImages.map((img, index) => (
                <div
                  key={img}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={img}
                    alt="Hackathon"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
            </div>

            {/* Image indicators */}
            <div className="absolute top-6 right-6 flex gap-1.5 z-20">
              {hackathonImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? "bg-white w-6" 
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            
            <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                    Hackathon
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm backdrop-blur-sm">
                    48 Hours
                  </span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-semibold leading-tight mb-4">
                  Global Innovation <br />Challenge 2026
                </h3>
                <p className="text-white/70 text-lg max-w-md">
                  Join 5,000+ developers worldwide to build the future of AI-powered applications.
                </p>
              </div>
              
              <div>
                <div className="flex flex-wrap gap-6 mb-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">March 15-17, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Virtual + San Francisco</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">2,847 registered</span>
                  </div>
                </div>
                
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-medium group-hover:gap-3 transition-all duration-200">
                  Register Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Top Right - Workshop Card */}
          <EventCard
            type="Workshop"
            title="Design Systems Masterclass"
            date="Feb 28, 2026"
            attendees={156}
            color="bg-[#FFE5E5]"
            icon={<Code className="w-5 h-5" />}
          />
          
          {/* Stats Card */}
          <div className="rounded-3xl bg-foreground text-background p-6 flex flex-col justify-between min-h-[200px]">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-background/60">This month</span>
            </div>
            <div>
              <div className="text-5xl font-semibold text-background mb-2">24+</div>
              <p className="text-background/60">Events happening around the globe</p>
            </div>
          </div>

          {/* Bottom Right - Meetup Card */}
          <EventCard
            type="Meetup"
            title="React London Monthly"
            date="Mar 5, 2026"
            attendees={89}
            color="bg-[#E5F0FF]"
            icon={<Globe className="w-5 h-5" />}
          />

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
            <button className="inline-flex items-center gap-2 text-accent-foreground font-medium hover:gap-3 transition-all duration-200">
              Get started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

interface EventCardProps {
  type: string;
  title: string;
  date: string;
  attendees: number;
  color: string;
  icon?: React.ReactNode;
}

const EventCard = ({ type, title, date, attendees, color, icon }: EventCardProps) => {
  return (
    <div className={`group rounded-3xl ${color} p-6 flex flex-col justify-between min-h-[200px] hover:shadow-lg transition-all duration-300`}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-2 py-0.5 rounded-full bg-foreground/10 text-foreground text-xs font-medium">
            {type}
          </span>
          {icon && <span className="text-foreground/40">{icon}</span>}
        </div>
        <h4 className="text-lg font-semibold text-foreground leading-snug">
          {title}
        </h4>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/70">
          <span>{date}</span>
          <span className="mx-2">·</span>
          <span>{attendees} attending</span>
        </div>
        <button className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;
