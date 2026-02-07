export type EventType = 'Hackathon' | 'Conference' | 'Meetup' | 'Workshop' | 'Bootcamp' | 'University';
export type EventLocationType = 'Virtual' | 'In-Person' | 'Hybrid';
export type EventStatus = 'Live' | 'Upcoming' | 'Past' | 'Sold Out' | 'Open Registration';
export type EventTag = string;
export type EventRegion = 
  | 'India'
  | 'Brazil'
  | 'Colombia'
  | 'Argentina'
  | 'Mexico'
  | 'Chile'
  | 'West Africa'
  | 'East Africa'
  | 'Southern Africa'
  | 'Virtual'
  | 'Global';

export interface EventOrganizer {
  name: string;
  avatar?: string;
  twitter?: string;
  discord?: string;
}

export interface EventAttendee {
  name: string;
  avatar: string;
}

export interface Web3Event {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  type: EventType;
  locationType: EventLocationType;
  location: string;
  region: EventRegion;
  country: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  timezone: string;
  coverImage: string;
  status: EventStatus;
  organizer: EventOrganizer;
  attendeeCount: number;
  attendees?: EventAttendee[];
  tags: EventTag[];
  cost: 'Free' | 'Paid';
  price?: number;
  registrationLink?: string;
  featured?: boolean;
  // Additional fields
  venue?: string;
  hostedBy?: EventOrganizer[];
}

export interface EventFilters {
  searchQuery: string;
  type: EventType | 'All';
  locationType: EventLocationType | 'All';
  category: string | 'All';
  time: 'Today' | 'This Week' | 'This Month' | 'All';
  region?: EventRegion | 'All';
}
