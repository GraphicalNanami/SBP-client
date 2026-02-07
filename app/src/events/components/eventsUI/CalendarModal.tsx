'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import CalendarDemo from './EventCalender';
import type { Web3Event } from '../../types/event.types';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: Web3Event[];
  onEventClick?: (eventId: string) => void;
}

export const CalendarModal = ({ isOpen, onClose, events, onEventClick }: CalendarModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full h-full md:h-[90vh] md:max-w-7xl bg-background rounded-none md:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-4 md:p-8 m-0 md:m-12">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
          aria-label="Close calendar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Event Calendar
          </h2>
          <p className="text-muted-foreground mt-2">
            Explore all upcoming Stellar events
          </p>
        </div>

        {/* Calendar Content */}
        <div className="h-[calc(100%-100px)] overflow-auto">
          <CalendarDemo events={events} onEventClick={onEventClick} />
        </div>
      </div>
    </div>
  );
};
