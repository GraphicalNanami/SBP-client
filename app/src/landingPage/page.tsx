'use client';

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PlansSection from "./components/plansSection";
import Footer from "./components/Footer";
import LogoCarousel from "./components/logoCarousel";
import FeaturedSection from "./components/featuredSection";
import Testimonials from "./components/Posts";
import { Component } from "@/src/shared/components/ui/heroBackground";

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
      
      <Navbar />
      <main className="relative z-10 flex-grow">
        <Hero />
        <LogoCarousel />
        <FeaturedSection />
        <Testimonials />
        <PlansSection />
      </main>
      <Footer />
    </div>
  );
}
