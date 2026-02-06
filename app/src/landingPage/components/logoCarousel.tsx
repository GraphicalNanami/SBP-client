import { motion } from "framer-motion";

// SVG Icons for topics
const TopicIcon = ({ name }: { name: string }) => {
  const icons: Record<string, JSX.Element> = {
    'stellar': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 8L18.5 13.5L24 16L18.5 18.5L16 24L13.5 18.5L8 16L13.5 13.5L16 8Z" fill="currentColor"/>
      </svg>
    ),
    'stellar network': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="16" r="3" fill="currentColor"/>
        <circle cx="24" cy="16" r="3" fill="currentColor"/>
        <circle cx="16" cy="8" r="3" fill="currentColor"/>
        <circle cx="16" cy="24" r="3" fill="currentColor"/>
        <path d="M11 16H21M16 11V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'cross border payments': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 4V28M4 16H28" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 10L22 22M22 10L10 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    'soroban': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="12" width="4" height="12" rx="2" fill="currentColor"/>
        <rect x="12" y="8" width="4" height="16" rx="2" fill="currentColor"/>
        <rect x="18" y="10" width="4" height="14" rx="2" fill="currentColor"/>
        <rect x="24" y="14" width="4" height="10" rx="2" fill="currentColor"/>
      </svg>
    ),
    'stellar laboratory': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8L16 20L20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <ellipse cx="16" cy="22" rx="8" ry="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 18L8 24L24 24L22 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'xlm': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 12L16 8L24 12L16 16L8 12Z" fill="currentColor"/>
        <path d="M8 16L16 20L24 16L16 20L8 16Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M8 20L16 24L24 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'stellar lumens': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="12" r="4" fill="currentColor"/>
        <path d="M12 16L16 28L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 20H22M11 24H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'moneygram': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="10" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M6 14H26M16 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
        <circle cx="20" cy="18" r="1.5" fill="currentColor"/>
      </svg>
    ),
  };

  return icons[name] || icons['stellar'];
};

const TOPIC_TAGS = [
  'stellar',
  'stellar network',
  'cross border payments',
  'soroban',
  'stellar laboratory',
  'xlm',
  'stellar lumens',
  'moneygram',
];

const logos = TOPIC_TAGS.map((tag) => ({
  name: tag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  tag: tag,
}));

const LogoCarousel = () => {
  // Duplicate for seamless loop
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-10 overflow-hidden bg-[#FCFCFC]">
      <div className="container-main mb-8">
        <p className="text-center text-[#4D4D4D] text-sm font-medium tracking-wide uppercase">
          Ecosystem Topics
        </p>
      </div>
      
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#FCFCFC] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#FCFCFC] to-transparent z-10 pointer-events-none" />
        
        {/* Carousel track */}
        <motion.div
          className="flex gap-12 items-center"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex items-center gap-3 shrink-0 px-4 py-3 rounded-xl hover:bg-white/50 transition-all duration-300 group"
            >
              <div className="text-[#1A1A1A] group-hover:scale-110 transition-transform duration-300">
                <TopicIcon name={logo.tag} />
              </div>
              <span className="text-base font-semibold text-[#1A1A1A] whitespace-nowrap tracking-tight">
                {logo.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LogoCarousel;
