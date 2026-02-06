"use client"

import * as React from "react"
import { addDays, startOfMonth, endOfMonth, addMonths } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Separator } from "@radix-ui/react-separator"

import { cn } from "@/src/shared/utils/cn"

import { Calendar } from "./calendar"
import { Button } from "./button"

const presets = [
  {
    label: "Today",
    range: (): DateRange => {
      const today = new Date()
      return { from: today, to: today }
    },
  },
  {
    label: "Last 7 Days",
    range: (): DateRange => {
      const today = new Date()
      return { from: addDays(today, -6), to: today }
    },
  },
  {
    label: "Last 30 Days",
    range: (): DateRange => {
      const today = new Date()
      return { from: addDays(today, -29), to: today }
    },
  },
  {
    label: "This Month",
    range: (): DateRange => {
      const today = new Date()
      return { from: startOfMonth(today), to: endOfMonth(today) }
    },
  },
  {
    label: "Next Month",
    range: (): DateRange => {
      const next = addMonths(new Date(), 1)
      return { from: startOfMonth(next), to: endOfMonth(next) }
    },
  },
]

function CalendarWithPresets() {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined)

  return (
    <div className="flex rounded-xl border bg-background">
      <div className="flex flex-col gap-1 p-3">
        <p className="px-2 pb-1 text-sm font-medium">Presets</p>
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="ghost"
            size="sm"
            className={cn(
              "justify-start text-left font-normal",
              date?.from?.getTime() === preset.range().from?.getTime() &&
                date?.to?.getTime() === preset.range().to?.getTime() &&
                "bg-accent"
            )}
            onClick={() => setDate(preset.range())}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <Separator orientation="vertical" className="w-px bg-border" />
      <div className="p-3">
        <Calendar
          mode="range"
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
      </div>
    </div>
  )
}

export default CalendarWithPresets
