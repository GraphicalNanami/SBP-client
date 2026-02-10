'use client';

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { CircleHighlight, UnderlineHighlight } from "@/src/shared/components/ui/highlightText";
import Image from "next/image";
import { useAuth } from "@/src/auth/context/AuthContext";



const floatingNavItems = [
  { name: "Events", link: "/Events" },
  { name: "Hackathons", link: "/src/hackathon" },
  { name: "Builds", link: "/Builds" },
  { name: "Swags", link: "#", disabled: true },
];

const Hero = () => {

  const { isAuthenticated } = useAuth();
  

  return (
    <section className="relative py-13 md:py-17 overflow-hidden">

       
     
      


          {/* Wavy Background Text */}
         

          <div className="container-main relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-8">
              <Sparkles className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">
                 Stellar Builder Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground" style={{ fontFamily: 'var(--font-onest)' }}>
              Building the <UnderlineHighlight>future</UnderlineHighlight>
              <br />
              <CircleHighlight>Of Stellar</CircleHighlight>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
Discover hackathons, connect with top builders, and scale the next generation of Stellar projects.            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
             {!isAuthenticated ? <Link href="/src/auth">
                <button className="group px-8 py-4 text-base font-semibold bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-all duration-200 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link> : <Link href="/Events">
                <button className="group px-8 py-4 text-base font-semibold bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-all duration-200 flex items-center gap-2">
                  Join Upcoming Events
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>}
             { !isAuthenticated && <Link href="/src/events">
                <button className="px-8 py-4 text-base font-semibold bg-white text-[#1A1A1A] rounded-xl hover:bg-gray-50 transition-all duration-200 border-2 border-[#E5E5E5] hover:border-[#1A1A1A]">
                  Explore Events
                </button>
              </Link>}
            </div>

            {/* Calendar Button */}
          </div>
        </section>
  );
};

export default Hero;