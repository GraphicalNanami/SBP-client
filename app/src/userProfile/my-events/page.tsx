'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/auth/hooks/useAuth';
import { liveEventsApi } from '@/src/events/components/eventsService/liveEventsApi';
import type { LiveEvent } from '@/src/events/types/live-events.types';
import { Calendar, MapPin, Users, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function MyEventsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [registrations, setRegistrations] = useState<Array<{ event: LiveEvent; registeredAt: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    const fetchRegistrations = async () => {
      try {
        const response = await liveEventsApi.getMyRegistrations();
        setRegistrations(response.registrations);
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
        setError('Failed to load your registered events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [isAuthenticated, router]);

  const handleUnregister = async (eventUuid: string) => {
    try {
      await liveEventsApi.unregister(eventUuid);
      setRegistrations(prev => prev.filter(reg => reg.event.uuid !== eventUuid));
    } catch (err) {
      console.error('Failed to unregister:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC] py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">My Registered Events</h1>
          <p className="text-[#4D4D4D]">
            {registrations.length} {registrations.length === 1 ? 'event' : 'events'} registered
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {registrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 border border-[#E5E5E5] flex items-center justify-center mb-6">
              <Calendar className="w-10 h-10 text-[#4D4D4D]" />
            </div>
            <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">No Events Yet</h3>
            <p className="text-[#4D4D4D] max-w-sm mb-8">
              You haven&apos;t registered for any events. Explore upcoming events and register to join!
            </p>
            <button
              onClick={() => router.push('/src/events')}
              className="px-8 py-3 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-colors"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {registrations.map(({ event, registeredAt }) => (
              <div
                key={event.uuid}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {event.bannerUrl && (
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-[#E6FF80] rounded-full text-xs font-medium">
                        {event.status}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 hover:text-[#4D4D4D] transition-colors cursor-pointer"
                    onClick={() => router.push(`/src/events/${event.uuid}`)}
                  >
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="text-[#4D4D4D] text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#4D4D4D]">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(event.startDate), 'MMM dd, yyyy')}
                        {' - '}
                        {format(new Date(event.endDate), 'MMM dd, yyyy')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#4D4D4D]">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {event.location ? `${event.location}, ${event.country}` : event.country}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#4D4D4D]">
                      <Users className="w-4 h-4" />
                      <span>{event.registeredCount} registered</span>
                    </div>
                  </div>

                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-[#4D4D4D] mb-4">
                    <span>Registered on {format(new Date(registeredAt), 'MMM dd, yyyy')}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/src/events/${event.uuid}`)}
                      className="flex-1 px-4 py-2 border border-[#E5E5E5] rounded-xl hover:border-[#1A1A1A] transition-colors text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleUnregister(event.uuid)}
                      className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm"
                    >
                      Unregister
                    </button>
                  </div>

                  {event.externalUrl && (
                    <a
                      href={event.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 mt-2 text-sm text-[#4D4D4D] hover:text-[#1A1A1A] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Event Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
