"use client";

import { useRouter } from "next/navigation";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { kn as knLocale } from "date-fns/locale";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventFormDialog } from "@/components/admin/event-form-dialog";
import { deleteCalendarEvent } from "@/lib/actions/admin/calendar";
import { useAdminDict } from "@/lib/admin-i18n/provider";
import { toast } from "sonner";
import type { CalendarEventType } from "@/types/database";

type CalendarEvent = {
  id: string;
  title: string;
  event_date: string;
  event_type: CalendarEventType;
};

const typeTone: Record<CalendarEventType, string> = {
  meeting: "bg-primary/10 text-primary",
  assignment: "bg-success/10 text-success",
  salary: "bg-accent/15 text-accent-foreground",
  important: "bg-destructive/10 text-destructive",
};

export function CalendarView({
  monthDate,
  events,
}: {
  monthDate: Date;
  events: CalendarEvent[];
}) {
  const router = useRouter();
  const { dict, locale } = useAdminDict();
  const fnsLocale = locale === "kn" ? knLocale : undefined;
  const weekdayLabels = [
    dict.labels.weekday.sun,
    dict.labels.weekday.mon,
    dict.labels.weekday.tue,
    dict.labels.weekday.wed,
    dict.labels.weekday.thu,
    dict.labels.weekday.fri,
    dict.labels.weekday.sat,
  ];

  const start = startOfWeek(startOfMonth(monthDate));
  const end = endOfWeek(endOfMonth(monthDate));
  const days = eachDayOfInterval({ start, end });

  const eventsByDay = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = event.event_date;
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), event]);
  }

  function goToMonth(next: Date) {
    router.push(`/admin/calendar?month=${format(next, "yyyy-MM")}`);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => goToMonth(subMonths(monthDate, 1))}>
            <ChevronLeft className="size-4" />
          </Button>
          <h2 className="w-40 text-center text-lg font-semibold text-foreground">
            {format(monthDate, "MMMM yyyy", { locale: fnsLocale })}
          </h2>
          <Button variant="outline" size="icon" onClick={() => goToMonth(addMonths(monthDate, 1))}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <EventFormDialog defaultDate={format(monthDate, "yyyy-MM-dd")} />
      </div>

      <div className="mt-5 grid grid-cols-7 overflow-hidden rounded-2xl border border-border bg-card">
        {weekdayLabels.map((d) => (
          <div key={d} className="border-b border-border bg-secondary/50 px-2 py-2 text-center text-xs font-semibold text-muted-foreground">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDay.get(key) ?? [];
          return (
            <div
              key={key}
              className={`min-h-28 border-b border-r border-border p-2 last:border-r-0 ${
                isSameMonth(day, monthDate) ? "bg-card" : "bg-muted/30 text-muted-foreground"
              }`}
            >
              <span className={`text-xs font-medium ${isToday(day) ? "flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground" : ""}`}>
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`group flex items-center justify-between gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${typeTone[event.event_type]}`}
                  >
                    <span className="truncate">{event.title}</span>
                    <button
                      type="button"
                      className="hidden shrink-0 group-hover:block"
                      onClick={async () => {
                        const result = await deleteCalendarEvent(event.id);
                        if (!result.success) toast.error(result.error);
                      }}
                      aria-label={dict.tables.calendar.deleteEvent}
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
