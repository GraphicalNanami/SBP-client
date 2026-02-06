'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MOCK_EVENTS } from '../eventsService/mockData';

// Real cities from Stellar Ambassador Program
const cities = [
  { 
    name: 'São Paulo', 
    region: 'Brazil',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80',
    eventCount: MOCK_EVENTS.filter(e => e.region === 'Brazil').length,
    description: 'Hub of Brazilian blockchain innovation'
  },
  { 
    name: 'Mumbai', 
    region: 'India',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80',
    eventCount: MOCK_EVENTS.filter(e => e.region === 'India').length,
    description: 'India\'s blockchain capital'
  },
  { 
    name: 'Bogotá', 
    region: 'Colombia',
    image: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?auto=format&fit=crop&q=80',
    eventCount: MOCK_EVENTS.filter(e => e.region === 'Colombia').length,
    description: 'StarMaker Colombia headquarters'
  },
  { 
    name: 'Dar es Salaam', 
    region: 'East Africa',
    image: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?auto=format&fit=crop&q=80',
    eventCount: MOCK_EVENTS.filter(e => e.region === 'East Africa').length,
    description: 'East African Stellar Community'
  },
  { 
    name: 'Buenos Aires', 
    region: 'Argentina',
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&q=80',
    eventCount: MOCK_EVENTS.filter(e => e.region === 'Argentina').length,
    description: 'LATAM blockchain hub'
  },
  { 
    name: 'Mexico City', 
    region: 'Mexico',
    image: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&q=80',
    eventCount: MOCK_EVENTS.filter(e => e.region === 'Mexico').length,
    description: 'Growing Stellar community'
  },
  { 
    name: 'Santiago', 
    region: 'Chile',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?auto=format&fit=crop&q=80',
    eventCount: MOCK_EVENTS.filter(e => e.region === 'Chile').length,
    description: 'Chilean blockchain innovation'
  },
  { 
    name: 'Kakuma', 
    region: 'East Africa',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80',
    eventCount: MOCK_EVENTS.filter(e => e.country === 'Kenya').length,
    description: 'Blockchain education in refugee camps'
  },
];

export const PopularCitiesSection = () => {
  const router = useRouter();

  const handleCityClick = (region: string) => {
    // Convert region name to region ID format (e.g., "East Africa" -> "east-africa")
    const regionId = region.toLowerCase().replace(/ /g, '-');
    router.push(`/src/regions/${regionId}`);
  };

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container-main">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'var(--font-onest)' }}>
            Popular Cities on Stellar
          </h2>
          <p className="text-lg text-muted-foreground">
            Real communities building the future of blockchain. Explore events from Stellar Ambassador Program regions worldwide.
          </p>
        </div>

        <div className="relative">
          {/* Decorative wavy lines */}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-20">
            <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
              <path d="M10 10 Q 30 30, 10 50 T 10 70" stroke="currentColor" strokeWidth="3" className="text-accent" />
            </svg>
          </div>
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-20 rotate-180">
            <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
              <path d="M10 10 Q 30 30, 10 50 T 10 70" stroke="currentColor" strokeWidth="3" className="text-accent" />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cities.map((city) => (
              <div 
                key={city.name}
                onClick={() => handleCityClick(city.region)}
                className="group relative cursor-pointer"
              >
                {/* City Image with Wavy Bottom */}
                <div className="relative h-64 rounded-3xl overflow-hidden">
                  <Image 
                    src={city.image} 
                    alt={city.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA9AB//2Q=="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Wavy SVG bottom */}
                  <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
                    <path d="M0,0 Q300,100 600,50 T1200,0 L1200,100 L0,100 Z" fill="white" />
                  </svg>
                </div>

                {/* City Name & Count */}
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">{city.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{city.description}</p>
                  <p className="text-sm font-semibold text-accent">{city.eventCount} {city.eventCount === 1 ? 'event' : 'events'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* View All Regions Button */}
          <div className="mt-12 text-center">
            <button 
              onClick={() => router.push('/src/regions')}
              className="px-8 py-3 bg-foreground text-background rounded-xl font-semibold hover:bg-foreground/90 transition-all"
            >
              View All Regions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
