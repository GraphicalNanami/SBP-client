'use client';

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PlansSection from "./components/plansSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <PlansSection />
      </main>
      {/* Add Footer here if needed */}
    </div>
  );
}
