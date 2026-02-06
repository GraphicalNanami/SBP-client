'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Post } from '../../types/posts.types';
import { PostCard } from './PostCard';

interface PostsColumnProps {
  posts: Post[];
  className?: string;
  duration?: number;
}

export function PostsColumn({ posts, className = '', duration = 15 }: PostsColumnProps) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <motion.div
        animate={{
          y: isPaused ? undefined : [0, -100 * posts.length],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex flex-col gap-6"
      >
        {[...posts, ...posts].map((post, index) => (
          <div
            key={`${post.id}-${index}`}
            className="max-w-sm"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <PostCard post={post} onUnpause={() => setIsPaused(false)} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
