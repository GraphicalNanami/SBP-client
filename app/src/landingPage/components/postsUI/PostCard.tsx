'use client';

import { motion } from 'framer-motion';
import { Twitter, MessageCircle } from 'lucide-react';
import { Post } from '../../types/posts.types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const PlatformIcon = post.platform === 'twitter' ? Twitter : MessageCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 border border-[#E5E5E5] hover:border-[#E6FF80] hover:shadow-lg transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#E6FF80] flex items-center justify-center">
            <span className="text-xl font-bold text-[#1A1A1A]">
              {post.author_name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-[#1A1A1A]">{post.author_name}</p>
            <div className="flex items-center gap-2 mt-1">
              <PlatformIcon className="w-4 h-4 text-[#4D4D4D]" />
              <span className="text-xs text-[#4D4D4D] capitalize">{post.platform}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-[#1A1A1A] leading-relaxed mb-4">{post.content}</p>

      {/* Topics */}
      {post.topics && post.topics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.topics.map((topic, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[#E6FF80]/20 text-[#1A1A1A] text-xs font-medium rounded-full"
            >
              #{topic}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
