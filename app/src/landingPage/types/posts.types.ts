// API Response Types for Events Indexer

export interface Post {
  author_name: string;
  platform: 'twitter' | 'reddit';
  topics: string[];
  content: string;
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
  recent_activity: any[];
}

export interface RecentPostsResponse {
  posts: Post[];
}

export interface TopicMatchResponse {
  matched: boolean;
  confidence: number;
  topics: string[];
}
