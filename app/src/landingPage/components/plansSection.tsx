'use client';

import { ArrowRight } from "lucide-react";
import { CircleHighlight } from "@/src/shared/components/ui/highlightText";
import { useRouter } from "next/navigation";
import Image from "next/image";
 
const PlansSection = () => {
  const router = useRouter();

  const handleCardClick = (cardType: string) => {
    switch (cardType) {
      case 'Hackers':
        router.push('/src/hackathons');
        break;
      case 'Organizers':
        router.push('/src/regions');
        break;
      case 'Partners':
        router.push('/src/events');
        break;
      default:
        break;
    }
  };

  return (
    <section className="relative py-24 bg-[#FCF9EA] backdrop-blur-sm overflow-hidden">
      {/* Decorative doodles in background */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-20 pointer-events-none hidden lg:block">
        <Image
          src="/open-doodles/svg/PlantDoodle.svg"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute bottom-10 right-10 w-40 h-40 opacity-20 pointer-events-none hidden lg:block">
        <Image
          src="/open-doodles/svg/CoffeeDoddle.svg"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="container-main relative z-10">
        {/* Heading */}
        <div className="text-center mb-6" style={{ fontFamily: 'var(--font-jersey)' }}>
          <h2 className="heading-section">
            Built for the <CircleHighlight>entire</CircleHighlight>
            <br />
            ecosystem.
          </h2>
        </div>
        
        <p className="text-body text-center mb-16">
          Connecting builders, organizers, and partners.
        </p>
        
        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <PlanCard 
            title="Hackers"
            description="Join hackathons, build innovative projects, and win prizes in the Stellar ecosystem."
            onClick={() => handleCardClick('Hackers')}
            doodle="/open-doodles/svg/UnboxingDoodle.svg"
          />
          <PlanCard 
            title="Stellar Regions"
            description="Host world-class hackathons and manage your community with Stellar-integrated tools."
            onClick={() => handleCardClick('Organizers')}
            doodle="/open-doodles/svg/LovingDoodle.svg"
          />
        </div>
      </div>
    </section>
  );
};

interface PlanCardProps {
  title: string;
  description: string;
  onClick: () => void;
  doodle: string;
}

const PlanCard = ({ title, description, onClick, doodle }: PlanCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-card border border-border rounded-3xl p-8 hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:bg-black transition-all duration-300 flex flex-col justify-between min-h-[400px] cursor-pointer overflow-hidden"
    >
      {/* Doodle illustration */}
      <div className="absolute bottom-0 right-0 w-48 h-48 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <Image
          src={doodle}
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-3xl font-semibold text-foreground transition-colors duration-200 group-hover:text-white">
            {title}
          </h3>
          <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center transition-all duration-200 group-hover:bg-white group-hover:text-black group-hover:border-white/20">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-muted-foreground text-base leading-relaxed transition-colors duration-200 group-hover:text-white/90">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PlansSection;