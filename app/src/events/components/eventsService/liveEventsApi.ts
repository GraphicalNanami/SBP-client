import { apiClient } from '@/src/shared/lib/api/client';
import type {
  LiveEvent,
  LiveEventRegistrationResponse,
  LiveEventRegistrationsResponse,
  LiveEventsResponse,
  LiveEventStatus,
  LiveEventType,
  CreateLiveEventPayload,
} from '../../types/live-events.types';

const BASE_PATH = '/live-events';

type LiveEventsQuery = {
  status?: LiveEventStatus;
  country?: string;
  limit?: number;
  skip?: number;
  eventType?: LiveEventType;
};

const buildQueryString = (params: LiveEventsQuery = {}) => {
  const query = new URLSearchParams();

  if (params.status) query.set('status', params.status);
  if (params.country) query.set('country', params.country);
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.skip !== undefined) query.set('skip', String(params.skip));
  if (params.eventType) query.set('eventType', params.eventType);

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

export const liveEventsApi = {
  list: async (params?: LiveEventsQuery): Promise<LiveEventsResponse> => {
    const queryString = buildQueryString(params);
    return apiClient.get<LiveEventsResponse>(`${BASE_PATH}${queryString}`);
  },
  getById: async (eventUuid: string): Promise<LiveEvent> => {
    return apiClient.get<LiveEvent>(`${BASE_PATH}/${eventUuid}`);
  },
  register: async (eventUuid: string): Promise<LiveEventRegistrationResponse> => {
    return apiClient.post<LiveEventRegistrationResponse>(`${BASE_PATH}/${eventUuid}/register`, {});
  },
  unregister: async (eventUuid: string): Promise<LiveEventRegistrationResponse> => {
    return apiClient.delete<LiveEventRegistrationResponse>(`${BASE_PATH}/${eventUuid}/register`);
  },
  getMyRegistrations: async (): Promise<LiveEventRegistrationsResponse> => {
    return apiClient.get<LiveEventRegistrationsResponse>(`${BASE_PATH}/me/registrations`);
  },
  create: async (payload: CreateLiveEventPayload): Promise<LiveEvent> => {
    return apiClient.post<LiveEvent>(BASE_PATH, payload);
  },
};
