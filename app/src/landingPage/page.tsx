'use client';

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PlansSection from "./components/plansSection";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <PlansSection />
      </main>
      <Footer />
    </div>
  );
}
