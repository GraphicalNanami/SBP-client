'use client';

import { EventType, EventLocationType } from '../../types/event.types';
import { Calendar, LayoutGrid, RotateCcw, ChevronDown } from 'lucide-react';
import { cn } from '@/src/shared/utils/cn'; 

interface FilterBarProps {
  activeType: EventType | 'All';
  activeLocation: EventLocationType | 'All';
  onTypeChange: (type: EventType | 'All') => void;
  onLocationChange: (loc: EventLocationType | 'All') => void;
  onReset: () => void;
}

const FilterPill = ({ 
  label, 
  isActive, 
  onClick 
}: { 
  label: string; 
  isActive: boolean; 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
      isActive 
        ? "bg-accent text-accent-foreground border-transparent shadow-sm" 
        : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
    )}
  >
    {label}
  </button>
);

export const FilterBar = ({
  activeType,
  activeLocation,
  onTypeChange,
  onLocationChange,
  onReset
}: FilterBarProps) => {
  const types: (EventType | 'All')[] = ['All', 'Hackathon', 'Conference', 'Meetup', 'Workshop'];
  const locations: (EventLocationType | 'All')[] = ['All', 'Virtual', 'In-Person', 'Hybrid'];

  return (
    <div className="sticky top-[72px] z-40 w-full py-4 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container-main flex flex-wrap items-center justify-between gap-4">
        {/* Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {types.map((type) => (
            <FilterPill
              key={type}
              label={type}
              isActive={activeType === type}
              onClick={() => onTypeChange(type)}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Location Dropdown (Simplified as buttons for now) */}
          <div className="hidden lg:flex items-center gap-2 border-l border-border pl-4">
             {locations.map((loc) => (
               <button
                 key={loc}
                 onClick={() => onLocationChange(loc)}
                 className={cn(
                   "text-sm font-medium transition-colors",
                   activeLocation === loc ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                 )}
               >
                 {loc}
               </button>
             ))}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onReset}
              className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <div className="h-4 w-[1px] bg-border" />
            
            <div className="flex items-center p-1 bg-card rounded-lg border border-border">
              <button className="p-1.5 rounded-md bg-secondary text-foreground shadow-sm">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground">
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
