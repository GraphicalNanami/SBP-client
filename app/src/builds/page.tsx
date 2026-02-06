'use client';

import Navbar from '../landingPage/components/Navbar';
import Footer from '../landingPage/components/Footer';
import { Sparkles, Hammer, Code2, Rocket, Bell } from 'lucide-react';
import { UnderlineHighlight, CircleHighlight } from '@/src/shared/components/ui/highlightText';
import { useState } from 'react';

export default function BuildsPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center">
        {/* Coming Soon Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden w-full">
          {/* Wavy Background Text */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] select-none">
            <div className="absolute top-20 left-10 text-9xl font-bold text-foreground transform -rotate-12">Builds</div>
            <div className="absolute top-60 right-20 text-8xl font-bold text-foreground transform rotate-6">Stellar</div>
            <div className="absolute bottom-40 left-1/4 text-7xl font-bold text-foreground transform -rotate-6">Innovate</div>
            <div className="absolute top-1/2 right-1/3 text-6xl font-bold text-foreground transform rotate-12">Create</div>
          </div>

          <div className="container-main relative z-10 text-center">
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-8 animate-pulse">
              <Sparkles className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">
                Coming Soon
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground" style={{ fontFamily: 'var(--font-onest)' }}>
              Showcase Your <UnderlineHighlight>Stellar</UnderlineHighlight>
              <br />
              <CircleHighlight>Projects & Builds</CircleHighlight>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
              A dedicated platform to discover, share, and celebrate innovative projects built on the Stellar blockchain. Connect with builders, showcase your work, and inspire the ecosystem.
            </p>

            {/* Feature Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto mb-16">
              {/* Feature 1 */}
              <div className="group p-6 rounded-2xl border border-border bg-card hover:bg-accent/5 transition-all duration-300 hover:shadow-lg hover:border-accent/30">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Code2 className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Project Gallery</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Browse and discover amazing projects built by the Stellar developer community
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-6 rounded-2xl border border-border bg-card hover:bg-accent/5 transition-all duration-300 hover:shadow-lg hover:border-accent/30">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Hammer className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Builder Profiles</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create your portfolio and showcase all your Stellar ecosystem contributions
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-6 rounded-2xl border border-border bg-card hover:bg-accent/5 transition-all duration-300 hover:shadow-lg hover:border-accent/30">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Launch Showcase</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Highlight your latest launches and gain visibility within the ecosystem
                </p>
              </div>
            </div>

            {/* Notify Me Form */}
            <div className="max-w-md mx-auto">
              <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Bell className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:bg-foreground/90 transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubscribed}
                >
                  {isSubscribed ? '✓ Subscribed!' : 'Notify Me'}
                </button>
              </form>
              {isSubscribed && (
                <p className="mt-3 text-sm text-accent-foreground animate-fade-in">
                  Thanks! We'll notify you when Builds launches.
                </p>
              )}
            </div>

            {/* Launch Timeline */}
            <div className="mt-16 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Expected Launch: <span className="font-semibold text-foreground">Q1 2026</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
