'use client';

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PlansSection from "./components/plansSection";
import Footer from "./components/Footer";
import LogoCarousel from "./components/logoCarousel";
import FeaturedSection from "./components/featuredSection";
import { Component } from "@/src/shared/components/ui/heroBackground";

export default function LandingPage() {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Background Component for entire landing page */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Component />
      </div>
      
      <Navbar />
      <main className="relative z-10 flex-grow">
        <Hero />
        <LogoCarousel />
        <FeaturedSection />
        <PlansSection />
      </main>
      <Footer />
    </div>
  );
}
