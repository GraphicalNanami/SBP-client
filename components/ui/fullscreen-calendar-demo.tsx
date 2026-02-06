"use client"

import { FullScreenCalendar } from "./fullscreen-calendar"

const dummyEvents = [
  {
    day: new Date("2026-02-02"),
    events: [
      {
        id: 1,
        name: "Q1 Planning Session",
        time: "10:00 AM",
        datetime: "2026-02-02T00:00",
      },
      {
        id: 2,
        name: "Team Sync",
        time: "2:00 PM",
        datetime: "2026-02-02T00:00",
      },
    ],
  },
  {
    day: new Date("2026-02-07"),
    events: [
      {
        id: 3,
        name: "Product Launch Review",
        time: "2:00 PM",
        datetime: "2026-02-07T00:00",
      },
      {
        id: 4,
        name: "Marketing Sync",
        time: "11:00 AM",
        datetime: "2026-02-07T00:00",
      },
      {
        id: 5,
        name: "Vendor Meeting",
        time: "4:30 PM",
        datetime: "2026-02-07T00:00",
      },
    ],
  },
  {
    day: new Date("2026-02-10"),
    events: [
      {
        id: 6,
        name: "Team Building Workshop",
        time: "11:00 AM",
        datetime: "2026-02-10T00:00",
      },
    ],
  },
  {
    day: new Date("2026-02-13"),
    events: [
      {
        id: 7,
        name: "Budget Analysis Meeting",
        time: "3:30 PM",
        datetime: "2026-02-14T00:00",
      },
      {
        id: 8,
        name: "Sprint Planning",
        time: "9:00 AM",
        datetime: "2026-02-14T00:00",
      },
      {
        id: 9,
        name: "Design Review",
        time: "1:00 PM",
        datetime: "2026-02-14T00:00",
      },
    ],
  },
  {
    day: new Date("2026-02-16"),
    events: [
      {
        id: 10,
        name: "Client Presentation",
        time: "10:00 AM",
        datetime: "2026-02-16T00:00",
      },
      {
        id: 11,
        name: "Team Lunch",
        time: "12:30 PM",
        datetime: "2026-02-16T00:00",
      },
      {
        id: 12,
        name: "Project Status Update",
        time: "2:00 PM",
        datetime: "2026-02-16T00:00",
      },
    ],
  },
]

export function CalendarDemo() {
  return (
    <div className="flex h-screen flex-1 flex-col scale-90">
      <FullScreenCalendar data={dummyEvents} />
    </div>
  )
}
