"use client";

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    selected || new Date()
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart, { locale: enUS });
  const calEnd = endOfWeek(monthEnd, { locale: enUS });

  const days: Date[] = [];
  let day = calStart;
  while (day <= calEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-foreground">
          {format(currentMonth, "MMMM yyyy", { locale: enUS })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-muted-foreground py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const isCurrentMonth = isSameMonth(d, currentMonth);
          const isSelected = selected && isSameDay(d, selected);
          const isToday = isSameDay(d, new Date());

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect?.(d)}
              className={cn(
                "h-9 w-9 rounded-lg text-sm transition-colors flex items-center justify-center",
                !isCurrentMonth && "text-muted-foreground/40",
                isCurrentMonth &&
                  !isSelected &&
                  "text-foreground hover:bg-orange-100 dark:hover:bg-stone-700",
                isSelected &&
                  "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-500",
                isToday &&
                  !isSelected &&
                  "border border-orange-400 dark:border-orange-500"
              )}
            >
              {format(d, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
