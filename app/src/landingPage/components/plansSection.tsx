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
        router.push('/users');
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
      

      <div className="container-main relative z-10">
        {/* Heading */}
        <div className="text-center mb-6" style={{ fontFamily: 'var(--font-onest)' }}>
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
            doodle="https://anthillonline.com/wp-content/uploads/2015/04/angelhack.jpg"
          />
          <PlanCard 
            title="Stellar Regions"
            description="Host world-class hackathons and manage your community with Stellar-integrated tools."
            onClick={() => handleCardClick('Organizers')}
            doodle="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiDeMQA5OD5wwDSu9w2S36a4x1UXB5sGPoHg&s"
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
      className="group relative bg-card border border-border rounded-3xl p-8 hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:bg-black transition-all duration-300 flex flex-col justify-between min-w-[150px] min-h-[400px] cursor-pointer overflow-hidden"
    >
      {/* Doodle illustration */}
      <div className="absolute bottom-0 right-0 w-78 h-58 opacity-100  group-hover:opacity-70 transition-opacity duration-300">
        <Image
          src={doodle}
          alt=""
          fill
          className="object-contain rounded-xl h-[400px] w-full group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-3xl font-semibold text-foreground transition-colors duration-200 group-hover:text-white">
            {title}
          </h3>
            <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:text-black group-hover:border-white/20 group-hover:-rotate-45">
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