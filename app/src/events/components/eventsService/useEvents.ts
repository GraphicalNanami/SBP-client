
'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Web3Event, EventFilters, EventType, EventLocationType, EventRegion } from '../../types/event.types';
import type { LiveEvent, LiveEventStatus, LiveEventType, CreateLiveEventPayload } from '../../types/live-events.types';
import { liveEventsApi } from './liveEventsApi';
import { MOCK_EVENTS } from './mockData';

const DEFAULT_BANNER = '/open-doodles/svg/ReadingDoodle.svg';

const mapEventType = (eventType: LiveEventType): EventType => {
  switch (eventType) {
    case 'MEETUP':
      return 'Meetup';
    case 'WORKSHOP_VIRTUAL':
    case 'WORKSHOP_PHYSICAL':
      return 'Workshop';
    case 'CONFERENCE':
      return 'Conference';
    default:
      return 'Meetup';
  }
};

const mapLocationType = (eventType: LiveEventType): EventLocationType => {
  if (eventType === 'WORKSHOP_VIRTUAL') return 'Virtual';
  if (eventType === 'WORKSHOP_PHYSICAL') return 'In-Person';
  return 'In-Person';
};

const mapStatus = (status: LiveEventStatus) => {
  switch (status) {
    case 'UPCOMING':
      return 'Upcoming';
    case 'ONGOING':
      return 'Live';
    case 'COMPLETED':
      return 'Past';
    default:
      return 'Upcoming';
  }
};

const mapLiveEventToWeb3Event = (event: LiveEvent): Web3Event => {
  const [primaryHost, ...additionalHosts] = event.hosts || [];

  return {
    id: event.uuid,
    title: event.title,
    description: event.description || 'Stellar community event',
    type: mapEventType(event.eventType),
    locationType: mapLocationType(event.eventType),
    location: event.location || event.country,
    region: event.eventType === 'WORKSHOP_VIRTUAL' ? 'Virtual' : 'Global',
    country: event.country,
    startDate: event.startDate,
    endDate: event.endDate,
    timezone: 'UTC',
    coverImage: event.bannerUrl || DEFAULT_BANNER,
    status: mapStatus(event.status),
    organizer: {
      name: primaryHost?.name || 'Stellar Community',
      avatar: primaryHost?.avatar,
    },
    attendeeCount: event.registeredCount,
    tags: event.tags || [],
    cost: 'Free',
    registrationLink: event.externalUrl,
    hostedBy: additionalHosts.map((host) => ({
      name: host.name,
      avatar: host.avatar,
    })),
  };
};

// Helper to convert Web3Event (mock format) to CreateLiveEventPayload
export const convertWeb3EventToPayload = (event: Web3Event): CreateLiveEventPayload => {
  // Map event type from frontend to backend
  let eventType: LiveEventType = 'MEETUP';
  if (event.type === 'Workshop') {
    eventType = event.locationType === 'Virtual' ? 'WORKSHOP_VIRTUAL' : 'WORKSHOP_PHYSICAL';
  } else if (event.type === 'Conference') {
    eventType = 'CONFERENCE';
  } else if (event.type === 'Hackathon' || event.type === 'Bootcamp') {
    eventType = 'MEETUP'; // Map hackathons/bootcamps to meetup for now
  }

  // Build hosts array
  const hosts = [
    {
      name: event.organizer.name,
      role: 'Organizer',
      avatar: event.organizer.avatar,
    },
    ...(event.hostedBy || []).map(host => ({
      name: host.name,
      role: 'Co-host',
      avatar: host.avatar,
    })),
  ];

  return {
    title: event.title,
    description: event.longDescription || event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventType,
    country: event.country || 'Global',
    location: event.location,
    hosts,
    bannerUrl: event.coverImage !== DEFAULT_BANNER ? event.coverImage : undefined,
    externalUrl: event.registrationLink,
    tags: event.tags,
  };
};

export const useEvents = () => {
  const [events, setEvents] = useState<Web3Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<EventFilters>({
    searchQuery: '',
    type: 'All',
    locationType: 'All',
    category: 'All',
    time: 'All',
    region: 'All'
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch live events from backend
        const response = await liveEventsApi.list();
        const liveEvents = response.events.map(mapLiveEventToWeb3Event);
        
        // Create a Map of live events by title (case-insensitive) for quick lookup
        const liveEventsByTitle = new Map(
          liveEvents.map(e => [e.title.toLowerCase().trim(), e])
        );
        
        // Merge: Use backend version if exists (match by title), otherwise use mock
        const mergedEvents = MOCK_EVENTS.map(mockEvent => {
          const backendVersion = liveEventsByTitle.get(mockEvent.title.toLowerCase().trim());
          if (backendVersion) {
            // Backend version exists with UUID - use it instead of mock
            return backendVersion;
          }
          // Mock event not in backend yet - keep mock
          return mockEvent;
        });
        
        // Add any backend-only events that don't match mock titles
        liveEvents.forEach(liveEvent => {
          const mockExists = MOCK_EVENTS.some(
            mock => mock.title.toLowerCase().trim() === liveEvent.title.toLowerCase().trim()
          );
          if (!mockExists) {
            mergedEvents.push(liveEvent);
          }
        });
        
        setEvents(mergedEvents);
        setTotalCount(mergedEvents.length);
      } catch (err) {
        console.error('Failed to load live events:', err);
        // If backend fails, fallback to mock events only
        setEvents(MOCK_EVENTS);
        setTotalCount(MOCK_EVENTS.length);
        setError('Using offline events. Some features may be limited.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const matchesType = filters.type === 'All' || event.type === filters.type;
      
      const matchesLocation = filters.locationType === 'All' || event.locationType === filters.locationType;
      
      const matchesRegion = filters.region === 'All' || event.region === filters.region;
      
      // Category and Time filters could be more complex, but simplified for now
      const matchesCategory = filters.category === 'All' || event.tags.some(tag => tag.toLowerCase() === filters.category.toLowerCase());
      
      return matchesSearch && matchesType && matchesLocation && matchesCategory && matchesRegion;
    });
  }, [events, filters]);

  const updateSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const updateTypeFilter = (type: EventType | 'All') => {
    setFilters(prev => ({ ...prev, type }));
  };

  const updateLocationFilter = (loc: EventLocationType | 'All') => {
    setFilters(prev => ({ ...prev, locationType: loc }));
  };

  const updateRegionFilter = (region: EventRegion | 'All') => {
    setFilters(prev => ({ ...prev, region }));
  };

  return {
    events: filteredEvents,
    filters,
    isLoading,
    error,
    updateSearchQuery,
    updateTypeFilter,
    updateLocationFilter,
    updateRegionFilter,
    totalCount,
    filteredCount: filteredEvents.length
  };
};
