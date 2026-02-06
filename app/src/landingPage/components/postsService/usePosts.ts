'use client';

import { useState, useEffect } from 'react';
import { Post, StatsResponse } from '../../types/posts.types';
import { fetchRecentPosts, fetchEventStats } from './posts-api';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchRecentPosts();
        setPosts(data.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
        console.error('Error loading posts:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  return { posts, isLoading, error };
}

export function useStats(hours?: number) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchEventStats(hours);
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
        console.error('Error loading stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, [hours]);

  return { stats, isLoading, error };
}
