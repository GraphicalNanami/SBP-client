import { motion } from "framer-motion";
import React from "react";

// SVG Icons for topics


const TOPIC_TAGS = [
  'stellar',
  'stellar network',
  'cross border payments',
  'soroban',
  'stellar laboratory',
  'XLM',
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
    <section className="py-10 overflow-hidden bg-transparent">
      <div className="container-main mb-8">
        <p className="text-center text-[#4D4D4D] text-sm font-medium tracking-wide uppercase">
          Ecosystem
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
                
              </div>
              <span className="text-base group-hover:scale-110 transition-transform duration-300 font-semibold text-[#1A1A1A] whitespace-nowrap tracking-tight">
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
