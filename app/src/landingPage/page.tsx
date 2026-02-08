'use client';

import Link from "next/link";
import Image from "next/image";
import Hero from "./components/Hero";
import PlansSection from "./components/plansSection";
import Footer from "./components/Footer";
import LogoCarousel from "./components/logoCarousel";
import FeaturedSection from "./components/featuredSection";
import Posts from "./components/Posts";
import { Component } from "@/src/shared/components/ui/heroBackground";
import { FloatingNav } from "@/src/shared//components/ui/floating-navbar";

const floatingNavItems = [
  { name: "Events", link: "/Events" },
  { name: "Hackathons", link: "/src/hackathon" },
  { name: "Builds", link: "/Builds" },
  { name: "Swags", link: "#", disabled: true },
];

export default function LandingPage() {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Background Component with dot pattern for entire landing page */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Component />
        {/* Subtle dot pattern overlay */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.4
          }}
        />
      </div>
      
      <main className="relative z-10 flex-grow">
        <Link href="/src/landingPage" className="flex items-center gap-2 py-2 px-8">
        
                 
                  <div className="w-12 h-20 rounded-sm flex items-center justify-center relative">
                    <Image 
                      src="/logo.svg" 
                      alt="SBP Logo" 
                      width={32} 
                      height={40} 
                      className="object-contain" 
                    />
                  </div>
                  <span className="text-md">SBP</span>
                </Link>
                      <FloatingNav navItems={floatingNavItems} />

        <Hero />
        <LogoCarousel />
        <FeaturedSection />
        <Posts />
        <PlansSection />
      </main>
      <Footer />
    </div>
  );
}
