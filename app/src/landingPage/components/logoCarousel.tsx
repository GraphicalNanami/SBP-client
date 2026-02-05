import { motion } from "framer-motion";

const logos = [
  { name: "Stripe", icon: "💳" },
  { name: "Notion", icon: "📝" },
  { name: "Slack", icon: "💬" },
  { name: "Figma", icon: "🎨" },
  { name: "GitHub", icon: "🐙" },
  { name: "Vercel", icon: "▲" },
  { name: "Linear", icon: "🔷" },
  { name: "Loom", icon: "🎥" },
  { name: "Webflow", icon: "🌊" },
  { name: "Framer", icon: "⚡" },
];

const LogoCarousel = () => {
  // Duplicate for seamless loop
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-16 overflow-hidden">
      <div className="container-main mb-8">
        <p className="text-center text-muted-foreground text-sm font-medium tracking-wide uppercase">
          Trusted by teams at
        </p>
      </div>
      
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        {/* Carousel track */}
        <motion.div
          className="flex gap-16 items-center"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex items-center gap-3 shrink-0"
            >
              <span className="text-2xl">{logo.icon}</span>
              <span className="text-lg font-medium text-muted-foreground whitespace-nowrap">
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
