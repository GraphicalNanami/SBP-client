// Service layer for Events Indexer API calls
import { StatsResponse, RecentPostsResponse, TopicMatchResponse } from '../../types/posts.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Fetch event statistics
 * @param hours - Optional: Filter stats by hours (default: all time)
 */
export async function fetchEventStats(hours?: number): Promise<StatsResponse> {
  try {
    const url = hours 
      ? `${API_BASE_URL}/api/events-indexer/stats?hours=${hours}`
      : `${API_BASE_URL}/api/events-indexer/stats`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching event stats:', error);
    throw error;
  }
}

/**
 * Fetch recent posts from all platforms
 */
export async function fetchRecentPosts(): Promise<RecentPostsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events-indexer/posts/recent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recent posts: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    throw error;
  }
}

/**
 * Match a topic against posts
 * @param topic - The topic to match
 */
export async function matchTopic(topic: string): Promise<TopicMatchResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events-indexer/topics/${encodeURIComponent(topic)}/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to match topic: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error matching topic:', error);
    throw error;
  }
}
