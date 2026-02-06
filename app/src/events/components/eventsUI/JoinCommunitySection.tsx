'use client';

import { ArrowRight, Sparkles, Users } from 'lucide-react';
import { BackgroundHighlight } from '@/src/shared/components/ui/highlightText';

export const JoinCommunitySection = () => {
  return (
    <section className="py-24 overflow-hidden">
      <div className="container-main">
        <div className="relative rounded-[3rem] bg-gradient-to-br from-secondary to-background border border-border p-12 md:p-16 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute top-20 right-20 rotate-12">
            <Sparkles className="w-8 h-8 text-accent/20" />
          </div>
          <div className="absolute bottom-32 left-32 -rotate-6">
            <Users className="w-12 h-12 text-accent/15" />
          </div>
          
          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Images */}
            <div className="relative h-[400px] hidden md:block">
              {/* Abstract blob shapes with images */}
              <div className="absolute top-0 left-0 w-64 h-64 rounded-[40%_60%_70%_30%/60%_30%_70%_40%] overflow-hidden shadow-xl rotate-6 hover:rotate-12 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80" 
                  alt="Community" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-56 h-56 rounded-[60%_40%_30%_70%/40%_60%_70%_30%] overflow-hidden shadow-xl -rotate-6 hover:-rotate-12 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80" 
                  alt="Event" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Decorative wavy line */}
              <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full opacity-10" viewBox="0 0 200 200" fill="none">
                <path d="M10 100 Q 60 60, 100 100 T 190 100" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-accent font-bold text-lg tracking-tight -rotate-3 inline-block">
                  Get started!
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight" style={{ fontFamily: 'var(--font-onest)' }}>
                Join the <BackgroundHighlight>Stellar</BackgroundHighlight> Community
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Connect with builders, learn new technologies, find support, get out of your comfort zone, and pursue your blockchain passions, together. Membership is free.
              </p>
              
              <a 
                href="http://discord.gg/stellardev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-2xl font-bold text-lg hover:bg-foreground/90 transition-all shadow-lg mt-4"
              >
                Join Discord Community
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
