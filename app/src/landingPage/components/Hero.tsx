'use client';

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { CircleHighlight, UnderlineHighlight } from "@/src/shared/components/ui/highlightText";
import Image from "next/image";

const Hero = () => {
  const navigateToAuth = () => {
    window.location.href = "/src/auth";
  };

  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
          {/* Wavy Background Text */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] select-none">
            <div className="absolute top-20 left-10 text-9xl font-bold text-foreground transform -rotate-12">Build</div>
            <Image
              src="/open-doodles/svg/TechDoodle.svg"
              alt=""
              width={200}
              height={200}
              className="object-contain opacity-20 pointer-events-none"
              style={{ filter: 'invert(1) sepia(1) saturate(5) hue-rotate(175deg)' }}
            />
            <div className="absolute top-60 right-20 text-8xl font-bold text-foreground transform rotate-6">Stellar</div>
            <div className="absolute bottom-40 left-1/4 text-7xl font-bold text-foreground transform -rotate-6">Build</div>
          </div>

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
              <Link href="/src/auth">
                <button className="group px-8 py-4 text-base font-semibold bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-all duration-200 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/src/events">
                <button className="px-8 py-4 text-base font-semibold bg-white text-[#1A1A1A] rounded-xl hover:bg-gray-50 transition-all duration-200 border-2 border-[#E5E5E5] hover:border-[#1A1A1A]">
                  Explore Events
                </button>
              </Link>
            </div>

            {/* Calendar Button */}
          </div>
        </section>
  );
};

export default Hero;