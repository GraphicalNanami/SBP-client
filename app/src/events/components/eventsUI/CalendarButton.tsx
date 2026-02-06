'use client';

import { Calendar } from 'lucide-react';

interface CalendarButtonProps {
  onClick: () => void;
}

export const CalendarButton = ({ onClick }: CalendarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-accent text-accent-foreground font-semibold text-base transition-all duration-300 hover:bg-accent/90 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 mt-8"
    >
      <Calendar className="w-5 h-5 transition-transform group-hover:rotate-12" />
      <span>View Full Calendar</span>
      
      {/* Decorative elements */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/50 to-accent/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity -z-10" />
    </button>
  );
};
