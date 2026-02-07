'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar } from '@/src/shared/components/Avatar';
import { useAuth } from '@/src/auth/context/AuthContext';
import { liveEventsApi } from '../components/eventsService/liveEventsApi';
import { MOCK_EVENTS } from '../components/eventsService/mockData';
import { convertWeb3EventToPayload } from '../components/eventsService/useEvents';
import type { LiveEvent } from '../types/live-events.types';
import type { Web3Event } from '../types/event.types';

const getTagColor = (tag: string) => {
  switch (tag) {
    case 'hackathon':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'bootcamp':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'meetups':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'builder house':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'stellar ecosystem':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'university':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<LiveEvent | null>(null);
  const [mockEvent, setMockEvent] = useState<Web3Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all events to find the right UUID
        const allEventsResponse = await liveEventsApi.list();
        const liveEvents = allEventsResponse.events;
        
        // Try to find event by UUID (if eventId is already a UUID)
        let targetEvent = liveEvents.find(e => e.uuid === eventId);
        
        // If not found by UUID, eventId might be a mock ID - match by title
        if (!targetEvent) {
          const mockMatch = MOCK_EVENTS.find(m => m.id === eventId);
          if (mockMatch) {
            // Find backend event with matching title
            targetEvent = liveEvents.find(e => 
              e.title.toLowerCase().trim() === mockMatch.title.toLowerCase().trim()
            );
            
            // If no backend match, use mock data
            if (!targetEvent) {
              setMockEvent(mockMatch);
              setEvent(null);
              setRegisteredCount(mockMatch.attendeeCount || 0);
              return;
            }
          }
        }
        
        if (targetEvent) {
          setEvent(targetEvent);
          setMockEvent(null);
          setRegisteredCount(targetEvent.registeredCount || 0);
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        console.error('Failed to load event:', err);
        setError('Event not found. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!isAuthenticated || !event) return;

      try {
        const registrations = await liveEventsApi.getMyRegistrations();
        const isUserRegistered = registrations.registrations.some(
          (registration) => registration.event.uuid === event.uuid
        );
        setIsRegistered(isUserRegistered);
      } catch (err) {
        console.error('Failed to load registrations:', err);
      }
    };

    fetchRegistrations();
  }, [event, isAuthenticated]);

  const startDate = useMemo(() => {
    if (event) return new Date(event.startDate);
    if (mockEvent) return new Date(mockEvent.startDate);
    return null;
  }, [event, mockEvent]);
  
  const endDate = useMemo(() => {
    if (event) return new Date(event.endDate);
    if (mockEvent) return new Date(mockEvent.endDate);
    return null;
  }, [event, mockEvent]);
  
  const isCompleted = event?.status === 'COMPLETED' || mockEvent?.status === 'Past';

  const primaryHost = event?.hosts?.[0] || (mockEvent ? {
    name: mockEvent.organizer.name,
    avatar: mockEvent.organizer.avatar,
    role: 'Organizer'
  } : undefined);
  
  const additionalHosts = event?.hosts?.slice(1) || mockEvent?.hostedBy?.map(host => ({
    name: host.name,
    avatar: host.avatar,
    role: 'Co-host'
  })) || [];
  
  const eventTags = event?.tags || mockEvent?.tags || [];
  
  const eventTitle = event?.title || mockEvent?.title || '';
  const eventDescription = event?.description || mockEvent?.description || '';
  const eventLocation = event?.location || mockEvent?.location || '';
  const eventCountry = event?.country || mockEvent?.country || '';
  const eventBanner = event?.bannerUrl || mockEvent?.coverImage || '';
  const eventExternalUrl = event?.externalUrl || mockEvent?.registrationLink;

  const handleRegisterToggle = async () => {
    if (isRegistering) return;
    if (!isAuthenticated) {
      router.push('/src/auth');
      return;
    }

    try {
      setIsRegistering(true);
      
      // If this is a mock event, auto-create it in backend first
      if (mockEvent && !event) {
        console.log('Creating mock event in backend:', mockEvent.title);
        try {
          const payload = convertWeb3EventToPayload(mockEvent);
          const createdEvent = await liveEventsApi.create(payload);
          console.log('Mock event created successfully:', createdEvent.uuid);
          
          // Update state to use the newly created backend event
          setEvent(createdEvent);
          setMockEvent(null);
          
          // Now register the user
          const response = await liveEventsApi.register(createdEvent.uuid);
          setIsRegistered(true);
          setRegisteredCount(response.registeredCount);
        } catch (createErr) {
          console.error('Failed to create mock event in backend:', createErr);
          throw new Error('Unable to register for this event. Please try again.');
        }
      } else if (event) {
        // Normal registration flow for backend events
        if (isRegistered) {
          const response = await liveEventsApi.unregister(event.uuid);
          setIsRegistered(false);
          setRegisteredCount(response.registeredCount);
        } else {
          try {
            const response = await liveEventsApi.register(event.uuid);
            setIsRegistered(true);
            setRegisteredCount(response.registeredCount);
          } catch (registerErr: unknown) {
            // Check if error is "event not found" - this shouldn't happen but handle it
            const errorMessage = registerErr instanceof Error ? registerErr.message : String(registerErr);
            if (errorMessage.includes('not found') || errorMessage.includes('404')) {
              console.error('Event not found in backend, this should not happen for live events');
            }
            throw registerErr;
          }
        }
      }
    } catch (err) {
      console.error('Failed to update registration:', err);
      alert(err instanceof Error ? err.message : 'Failed to update registration. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading event details...</p>
      </div>
    );
  }

  if (error || (!event && !mockEvent) || !startDate || !endDate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-sm text-muted-foreground mb-4">{error || 'This event is unavailable.'}</p>
          <button
            onClick={() => router.push('/src/events')}
            className="text-[#1A1A1A] hover:underline"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Header with back button */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/src/events')}
            className="flex items-center gap-2 text-[#4D4D4D] hover:bg-black/40 transition-colors text-white bg-black px-3 py-1 rounded-xl cursor-pointer "
          >
           Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column - Image, Hosted By, Attendees, Tags */}
          <div className="lg:col-span-5 space-y-6">
            {/* Event Banner */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#E6FF80]/20 to-blue-500/20">
              {eventBanner && (
                <Image
                  src={eventBanner}
                  alt={eventTitle}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>

            {/* Hosted By Section */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <h3 className="text-sm font-semibold text-[#4D4D4D] mb-4">Hosted By</h3>
              
              {/* Main Organizer */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Avatar
                    src={primaryHost?.avatar}
                    alt={primaryHost?.name || 'Stellar Community'}
                    seed={primaryHost?.name || 'Stellar Community'}
                    className="object-cover"
                    size={48}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1A1A1A]">
                    {primaryHost?.name || 'Stellar Community'}
                  </p>
                </div>
              </div>

              {/* Additional Hosts */}
              {additionalHosts.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-[#E5E5E5]">
                  {additionalHosts.map((host, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                        <Avatar
                          src={host.avatar}
                          alt={host.name}
                          seed={host.name}
                          className="object-cover"
                          size={32}
                        />
                      </div>
                      <span className="text-xs text-[#4D4D4D]">{host.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Registration Count */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2">
                {registeredCount} registered
              </h3>
              <p className="text-xs text-[#4D4D4D]">
                Join builders across the Stellar ecosystem.
              </p>
            </div>

            {/* Tags and Actions */}
            <div className="space-y-4">
              {/* Tags */}
              {eventTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {eventTags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
                    >
                      #{tag.replace(' ', '')}
                    </span>
                  ))}
                </div>
              )}

              {/* Contact and Report Links */}
              <div className="flex items-center gap-4 text-xs text-[#4D4D4D]">
                <button className="hover:text-[#1A1A1A] transition-colors">
                  Contact the Host
                </button>
                <button className="hover:text-[#1A1A1A] transition-colors flex items-center gap-1">
                  <Flag className="w-3 h-3" />
                  Report Event
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Event Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Event Title and Status */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1A1A1A] mb-4 -tracking-tight leading-tight">
                {eventTitle}
              </h1>

              {/* Registration Status Badge */}
              {mockEvent && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg mb-2">
                  <span className="text-sm font-semibold text-yellow-700">
                    Community Event - Register to sync with backend
                  </span>
                </div>
              )}
              {isCompleted ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm font-semibold text-blue-700">Completed</span>
                </div>
              ) : (event?.status === 'ONGOING' || mockEvent?.status === 'Live') ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <span className="text-sm font-semibold text-amber-700">Ongoing</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-semibold text-green-700">Open Registration</span>
                </div>
              )}
            </div>

            {/* Date and Time */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Calendar className="w-6 h-6 text-[#4D4D4D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                    {format(startDate, 'EEEE, d MMMM yyyy')}
                  </p>
                  <p className="text-sm text-[#4D4D4D]">
                    {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')} UTC
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#4D4D4D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                    {eventLocation || 'Location to be announced'}
                  </p>
                  <p className="text-sm text-[#4D4D4D]">{eventCountry}</p>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegisterToggle}
              disabled={isCompleted || isRegistering}
              className={`w-full py-4 px-6 rounded-xl text-base font-semibold transition-all ${
                isCompleted
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : isRegistered
                  ? 'bg-white text-[#1A1A1A] border border-[#E5E5E5] hover:border-[#1A1A1A]'
                  : 'bg-[#1A1A1A] text-white hover:bg-[#333] shadow-sm hover:shadow-md'
              }`}
            >
              {isCompleted
                ? 'Registration Closed'
                : isRegistering
                ? 'Processing...'
                : !isAuthenticated
                ? 'Sign in to register'
                : isRegistered
                ? 'Unregister'
                : 'Register'}
            </button>

            {eventExternalUrl && (
              <a
                href={eventExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-sm font-medium text-[#1A1A1A] hover:underline"
              >
                Visit event website
              </a>
            )}

            {/* About Event */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">About Event</h2>
              <div className="prose prose-sm max-w-none text-[#4D4D4D] leading-relaxed whitespace-pre-line">
                <p>{mockEvent?.longDescription || eventDescription || 'Details will be shared soon.'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
