'use client';

import { motion } from 'framer-motion';
import { Post } from '../../types/posts.types';
import { PostCard } from './PostCard';

interface PostsColumnProps {
  posts: Post[];
  className?: string;
  duration?: number;
}

export function PostsColumn({ posts, className = '', duration = 15 }: PostsColumnProps) {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <motion.div
        animate={{
          y: [0, -100 * posts.length],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex flex-col gap-6"
      >
        {[...posts, ...posts].map((post, index) => (
          <div key={`${post.author_name}-${post.platform}-${index}`} className="max-w-sm">
            <PostCard post={post} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
