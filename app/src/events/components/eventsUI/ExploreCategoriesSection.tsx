'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Code, Users, Zap, Sparkles, Trophy } from 'lucide-react';

const categories = [
  { name: 'Hackathons', type: 'Hackathon', icon: Code, color: 'border-[#FF6B6B]', bg: 'bg-[#FFE5E5]' },
  { name: 'Conferences', type: 'Conference', icon: Users, color: 'border-[#4ECDC4]', bg: 'bg-[#E5F9F7]' },
  { name: 'Workshops', type: 'Workshop', icon: Sparkles, color: 'border-[#FFE66D]', bg: 'bg-[#FFF9E5]' },
  { name: 'Meetups', type: 'Meetup', icon: Users, color: 'border-[#A8E6CF]', bg: 'bg-[#E8F5E9]' },
  { name: 'Bootcamps', type: 'Bootcamp', icon: Trophy, color: 'border-[#FF8B94]', bg: 'bg-[#FFE8EA]' },
];

export const ExploreCategoriesSection = () => {
  const router = useRouter();

  const handleCategoryClick = (type: string) => {
    router.push(`/src/events?type=${type}`);
  };
  return (
    <section className="py-24">
      <div className="container-main">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-onest)' }}>
            Explore top categories
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover events that match your interests in the Stellar ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div 
                key={category.name}
                onClick={() => handleCategoryClick(category.type)}
                className={`group relative rounded-3xl ${category.bg} p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-b-4 ${category.color} min-h-[200px] flex flex-col justify-between`}
              >
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-8">
                    {category.name}
                  </h3>
                </div>

                <div className="flex items-end justify-between">
                  <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-foreground/60" />
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
