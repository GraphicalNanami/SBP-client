// API Response Types for Events Indexer

export interface Post {
  id: string;
  author_name: string;
  platform: 'twitter' | 'reddit';
  topics: string[];
  content: string;
  url: string;
  created_at: string;
  entity_count: number;
}

export interface StatsResponse {
  total_posts: number;
  by_platform: {
    twitter: number;
    reddit: number;
  };
  top_topics: Array<{
    topic: string;
    count: number;
  }>;
  recent_activity: unknown[];
}

export interface RecentPostsResponse {
  posts: Post[];
}

export interface TopicMatchResponse {
  matched: boolean;
  confidence: number;
  topics: string[];
}
