"use client"

import { useMemo } from "react";
import { FullScreenCalendar } from "@/src/shared/components/ui/full-screen-calender"
import type { Web3Event } from "../../types/event.types"

interface CalendarDemoProps {
  events: Web3Event[];
  onEventClick?: (eventId: string) => void;
}

export default function CalendarDemo({ events, onEventClick }: CalendarDemoProps) {
  const groupedEvents = useMemo(() => {
    const calendarEvents = events.map((event, index) => ({
      day: new Date(event.startDate),
      events: [{
        id: index + 1,
        name: event.title,
        time: new Date(event.startDate).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        datetime: event.startDate,
        eventId: event.id
      }]
    }));

    type CalendarEvent = typeof calendarEvents[number];
    return calendarEvents.reduce((acc: CalendarEvent[], curr) => {
      const dateKey = curr.day.toDateString();
      const existing = acc.find(item => item.day.toDateString() === dateKey);
      
      if (existing) {
        existing.events.push(...curr.events);
      } else {
        acc.push(curr);
      }
      
      return acc;
    }, []);
  }, [events]);

  return (
    <div className="flex h-full flex-1 flex-col">
      <FullScreenCalendar 
        data={groupedEvents}
        onEventClick={(eventId) => {
          if (onEventClick) {
            // Find the actual event ID from the calendar event
            const calendarEvent = groupedEvents
              .flatMap(day => day.events)
              .find(e => e.id === eventId);
            
            if (calendarEvent && calendarEvent.eventId) {
              onEventClick(calendarEvent.eventId);
            }
          }
        }}
      />
    </div>
  )
}