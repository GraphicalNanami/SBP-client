export type LiveEventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';

export type LiveEventType =
  | 'MEETUP'
  | 'WORKSHOP_VIRTUAL'
  | 'WORKSHOP_PHYSICAL'
  | 'CONFERENCE';

export interface LiveEventHost {
  name: string;
  role?: string;
  avatar?: string;
}

export interface LiveEvent {
  uuid: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: LiveEventStatus;
  eventType: LiveEventType;
  country: string;
  location?: string;
  hosts: LiveEventHost[];
  bannerUrl?: string;
  externalUrl?: string;
  tags?: string[];
  registeredCount: number;
}

export interface LiveEventsResponse {
  events: LiveEvent[];
  total: number;
  limit: number;
  skip: number;
}

export interface LiveEventRegistrationResponse {
  eventUuid: string;
  userUuid: string;
  registered?: boolean;
  alreadyRegistered?: boolean;
  unregistered?: boolean;
  registeredCount: number;
  registeredAt?: string;
}

export interface LiveEventRegistrationsResponse {
  userUuid: string;
  registrations: Array<{
    event: LiveEvent;
    registeredAt: string;
  }>;
  total: number;
}

export interface CreateLiveEventPayload {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  eventType: LiveEventType;
  country: string;
  location?: string;
  hosts: LiveEventHost[];
  bannerUrl?: string;
  externalUrl?: string;
  tags?: string[];
}
