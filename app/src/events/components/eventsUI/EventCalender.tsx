"use client"

import { FullScreenCalendar } from "@/src/shared/components/ui/full-screen-calender"
import { MOCK_EVENTS } from "../eventsService/mockData"

interface CalendarDemoProps {
  onEventClick?: (eventId: string) => void;
}

// Transform MOCK_EVENTS to calendar format
const calendarEvents = MOCK_EVENTS.map(event => ({
  day: new Date(event.startDate),
  events: [{
    id: Number(event.id),
    name: event.title,
    time: new Date(event.startDate).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    datetime: event.startDate,
    eventId: event.id // Keep original event ID for click handling
  }]
}));

// Group events by date
type CalendarEvent = typeof calendarEvents[number];
const groupedEvents = calendarEvents.reduce((acc: CalendarEvent[], curr) => {
  const dateKey = curr.day.toDateString();
  const existing = acc.find(item => item.day.toDateString() === dateKey);
  
  if (existing) {
    existing.events.push(...curr.events);
  } else {
    acc.push(curr);
  }
  
  return acc;
}, []);

export default function CalendarDemo({ onEventClick }: CalendarDemoProps) {
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