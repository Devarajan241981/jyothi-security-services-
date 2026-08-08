import { endOfMonth, startOfMonth } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { CalendarView } from "@/components/admin/calendar-view";
import { getAdminDictionary } from "@/lib/admin-i18n/get-locale";

export const metadata = { title: "Calendar" };

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const monthDate = month ? new Date(`${month}-01T00:00:00`) : new Date();

  const supabase = await createClient();
  const { dict } = await getAdminDictionary();
  const { data: events } = await supabase
    .from("calendar_events")
    .select("id, title, event_date, event_type")
    .gte("event_date", startOfMonth(monthDate).toISOString().slice(0, 10))
    .lte("event_date", endOfMonth(monthDate).toISOString().slice(0, 10));

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{dict.pages.calendar.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{dict.pages.calendar.subtitle}</p>
      <div className="mt-6">
        <CalendarView monthDate={monthDate} events={events ?? []} />
      </div>
    </div>
  );
}
