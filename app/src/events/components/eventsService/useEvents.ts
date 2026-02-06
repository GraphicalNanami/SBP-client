'use client';

import { useState, useMemo } from 'react';
import { Web3Event, EventFilters, EventType, EventLocationType, EventRegion } from '../../types/event.types';
import { MOCK_EVENTS } from './mockData';

export const useEvents = () => {
  const [events] = useState<Web3Event[]>(MOCK_EVENTS);
  const [filters, setFilters] = useState<EventFilters>({
    searchQuery: '',
    type: 'All',
    locationType: 'All',
    category: 'All',
    time: 'All',
    region: 'All'
  });

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const matchesType = filters.type === 'All' || event.type === filters.type;
      
      const matchesLocation = filters.locationType === 'All' || event.locationType === filters.locationType;
      
      const matchesRegion = filters.region === 'All' || event.region === filters.region;
      
      // Category and Time filters could be more complex, but simplified for now
      const matchesCategory = filters.category === 'All' || event.tags.includes(filters.category.toLowerCase());
      
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
    updateSearchQuery,
    updateTypeFilter,
    updateLocationFilter,
    updateRegionFilter,
    totalCount: events.length,
    filteredCount: filteredEvents.length
  };
};
