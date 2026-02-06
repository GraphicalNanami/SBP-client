'use client';

import { motion } from "framer-motion";
import { usePosts, useStats } from "./postsService/usePosts";
import { PostsColumn } from "./postsUI/PostsColumn";

const Posts = () => {
  const { posts, isLoading, error } = usePosts();
  const { stats, isLoading: statsLoading } = useStats(72);

  // Split posts into three columns for animation
  const firstColumn = posts.slice(0, 3);
  const secondColumn = posts.slice(3, 6);
  const thirdColumn = posts.slice(6, 9);

  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto">
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

          <h2 className="text-5xl sm:text-6xl font-bold tracking-tighter mt-5 text-center">
            What the Stellar Community is Saying
          </h2>
          <p className="text-center text-xl mt-5 opacity-75">
            Real-time updates from Twitter and Reddit about Stellar events and discussions.
          </p>
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
            <PostsColumn posts={firstColumn} duration={15} />
            <PostsColumn posts={secondColumn} className="hidden md:block" duration={19} />
            <PostsColumn posts={thirdColumn} className="hidden lg:block" duration={17} />
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
