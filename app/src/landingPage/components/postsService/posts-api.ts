/**
 * Events Indexer API Service
 * Handles all events indexer related API calls using the centralized API client
 */

import { apiClient } from '@/src/shared/lib/api/client';
import { ENDPOINTS } from '@/src/shared/lib/api/endpoints';
import { StatsResponse, RecentPostsResponse, TopicMatchResponse } from '../../types/posts.types';

/**
 * Fetch event statistics
 * @param hours - Optional: Filter stats by hours (default: all time)
 */
export async function fetchEventStats(hours?: number): Promise<StatsResponse> {
  const endpoint = hours
    ? `${ENDPOINTS.EVENTS_INDEXER.STATS}?hours=${hours}`
    : ENDPOINTS.EVENTS_INDEXER.STATS;

  return apiClient.get<StatsResponse>(endpoint);
}

/**
 * Fetch recent posts from all platforms
 */
export async function fetchRecentPosts(): Promise<RecentPostsResponse> {
  return apiClient.get<RecentPostsResponse>(ENDPOINTS.EVENTS_INDEXER.RECENT_POSTS);
}

/**
 * Match a topic against posts
 * @param topic - The topic to match
 */
export async function matchTopic(topic: string): Promise<TopicMatchResponse> {
  return apiClient.post<TopicMatchResponse>(
    ENDPOINTS.EVENTS_INDEXER.MATCH_TOPIC(topic),
    {}
  );
}
