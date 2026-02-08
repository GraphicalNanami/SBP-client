'use client';

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { usePosts, useStats } from "./postsService/usePosts";
import { PostsColumn } from "./postsUI/PostsColumn";
import { Check } from 'lucide-react';
import Image from 'next/image';

const TOPIC_TAGS = [
  "stellar",
                "xlm",
                "stellar development foundation",
                "stellar lumens",
                  "soroban",
                "stellar anchor"
];

           

const Posts = () => {
  const { posts, isLoading, error } = usePosts();
  const { stats, isLoading: statsLoading } = useStats(72);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [filteredPosts, setFilteredPosts] = useState(posts);

  // Handle topic selection
  const handleTopicToggle = async (topic: string) => {
    const newSelectedTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter((t) => t !== topic)
      : [...selectedTopics, topic];
    
    setSelectedTopics(newSelectedTopics);

    // If no topics selected, show all posts
    if (newSelectedTopics.length === 0) {
      setFilteredPosts(posts);
      return;
    }

    // Filter posts that match any of the selected topics (exact match from backend topics)
    const filtered = posts.filter((post) =>
      post.topics.some((postTopic) =>
        newSelectedTopics.some((selectedTopic) =>
          postTopic.toLowerCase() === selectedTopic.toLowerCase()
        )
      )
    );
    setFilteredPosts(filtered);
  };

  // Update filtered posts when posts change
  useEffect(() => {
    if (selectedTopics.length === 0) {
      setFilteredPosts(posts);
    }
  }, [posts, selectedTopics.length]);

  // Split filtered posts into three columns for animation
  const displayPosts = filteredPosts.length > 0 ? filteredPosts : posts;
  const firstColumn = displayPosts.slice(0, 3);
  const secondColumn = displayPosts.slice(3, 6);
  const thirdColumn = displayPosts.slice(6, 9);

  return (
    <section className="bg-background py-20 relative overflow-hidden">
      {/* Decorative doodles */}
      
      <div className="container z-10 mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
<div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">
              Community Buzz
            </div>          
          </div>

          <h2 className="text-5xl sm:text-6xl font-bold tracking-tighter mt-5 text-center" style={{ fontFamily: 'var(--font-onest)' }}>
            What the Stellar Community is Saying
          </h2>
          <p className="text-center text-xl mt-5 opacity-75" style={{ fontFamily: 'var(--font-onest)' }}>
            Real-time updates from Twitter and Reddit about Stellar events and discussions.
          </p>
          
          {/* Topic Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-2xl mx-auto">
            {TOPIC_TAGS.map((topic) => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => handleTopicToggle(topic)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#E6FF80] text-[#1A1A1A] border-2 border-[#1A1A1A]'
                      : 'bg-white text-[#4D4D4D] border border-[#E5E5E5] hover:border-[#1A1A1A]'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                  {topic}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Banner */}
       

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E6FF80]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
              <p className="text-red-600 font-medium">Failed to load posts</p>
              <p className="text-red-500 text-sm mt-2">{error}</p>
            </div>
          </div>
        )}

        {/* Posts Grid - Same layout as Testimonials */}
        {!isLoading && !error && posts.length > 0 && (
          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            {firstColumn.length > 0 && <PostsColumn posts={firstColumn} duration={15} />}
            {secondColumn.length > 0 && <PostsColumn posts={secondColumn} className="hidden md:block" duration={19} />}
            {thirdColumn.length > 0 && <PostsColumn posts={thirdColumn} className="hidden lg:block" duration={17} />}
          </div>
        )}

        {/* Filtered Empty State */}
        {!isLoading && !error && selectedTopics.length > 0 && filteredPosts.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-[#4D4D4D] text-lg">No posts found for selected topics.</p>
              <p className="text-[#4D4D4D] text-sm mt-2">Try selecting different topics or clear filters.</p>
              <button
                onClick={() => setSelectedTopics([])}
                className="mt-4 px-6 py-2 bg-[#E6FF80] text-[#1A1A1A] rounded-full font-medium hover:bg-[#d4ed6e] transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && posts.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-[#4D4D4D] text-lg">No posts available at the moment.</p>
              <p className="text-[#4D4D4D] text-sm mt-2">Check back soon for updates!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Posts;
