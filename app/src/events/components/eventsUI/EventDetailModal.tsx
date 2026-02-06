'use client';

import { Web3Event } from '../../types/event.types';
import { X, Calendar, MapPin, Users, Clock, ExternalLink, Flag } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { getAvatarUrl } from '@/src/shared/utils/avatar';

interface EventDetailModalProps {
  event: Web3Event;
  onClose: () => void;
}

export const EventDetailModal = ({ event, onClose }: EventDetailModalProps) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      'hackathon': 'bg-red-100 text-red-700 border-red-200',
      'bootcamp': 'bg-blue-100 text-blue-700 border-blue-200',
      'meetups': 'bg-green-100 text-green-700 border-green-200',
      'university': 'bg-purple-100 text-purple-700 border-purple-200',
      'builder house': 'bg-orange-100 text-orange-700 border-orange-200',
      'stellar ecosystem': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    };
    return colors[tag] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Card - Netflix Style */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-background rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 rounded-full bg-background/90 backdrop-blur-md border border-border text-foreground hover:bg-secondary transition-all shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Hero Image */}
          <div className="relative h-[300px] md:h-[400px] w-full">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA9AB//2Q=="
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            
            {/* Floating Badge */}
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-bold uppercase tracking-wider shadow-lg">
                {event.type}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10 space-y-6">
            {/* Registration Status Badge */}
            {event.status === 'Sold Out' && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 border border-red-200">
                <span className="text-sm font-semibold text-red-700">🎫 Sold Out</span>
                <span className="text-xs text-red-600">This event is sold out and no longer taking registrations.</span>
              </div>
            )}

            {event.status === 'Open Registration' && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Registration</h3>
                <p className="text-sm text-muted-foreground">Welcome! To join the event, please register below.</p>
              </div>
            )}

            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
                {event.title}
              </h1>
            </div>

            {/* Event Date & Time */}
            <div className="flex items-start gap-3 py-4">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {format(startDate, 'EEEE, d MMMM')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')} {event.timezone}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">{event.venue || event.location}</p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>
            </div>

            {/* Register Button */}
            {event.status !== 'Sold Out' && (
              <button className="w-full py-3 px-6 rounded-xl bg-[#8B4513] hover:bg-[#7A3A11] text-white font-semibold text-base transition-all shadow-md">
                Register
              </button>
            )}

            {/* Separator */}
            <div className="border-t border-border my-6" />

            {/* Hosted By Section */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Hosted By</h3>
              
              <div className="space-y-3">
                {/* Organizer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image 
                        src={getAvatarUrl(event.organizer.avatar, event.organizer.name)} 
                        alt={event.organizer.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">{event.organizer.name}</span>
                  </div>
                  {event.organizer.twitter && (
                    <a href={`https://twitter.com/${event.organizer.twitter}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                </div>

                {/* Additional Hosts */}
                {event.hostedBy && event.hostedBy.length > 0 && event.hostedBy.map((host, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image 
                        src={getAvatarUrl(host.avatar, host.name)} 
                        alt={host.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{host.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendees Section */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">{event.attendeeCount} Going</h3>
              {event.attendees && event.attendees.length > 0 && (
                <div className="flex -space-x-2">
                  {event.attendees.slice(0, 5).map((attendee, idx) => (
                    <div key={idx} className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-background">
                      <Image 
                        src={getAvatarUrl(attendee.avatar, attendee.name)} 
                        alt={attendee.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                  ))}
                  {event.attendeeCount > 5 && (
                    <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      +{event.attendeeCount - 5}
                    </div>
                  )}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {event.attendees?.slice(0, 2).map((attendee, idx) => (
                  <span key={idx} className="text-xs text-muted-foreground">{attendee.name}</span>
                ))}
                {event.attendeeCount > 2 && (
                  <span className="text-xs text-muted-foreground">and {event.attendeeCount - 2} others</span>
                )}
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-border my-6" />

            {/* Links */}
            <div className="flex gap-4 text-sm">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Contact the Host
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Flag className="w-4 h-4" />
                Report Event
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              {event.tags.map(tag => (
                <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* About Event */}
            {event.longDescription && (
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">About Event</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                  {event.longDescription}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
