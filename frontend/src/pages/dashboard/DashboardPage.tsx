import { CalendarDays } from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEventCalendar } from "@/modules/events/hooks/useEventCalendar";
import { useUpcomingEvents } from "@/modules/events/hooks/useUpcomingEvents";
import {
  CALENDAR_DAYS,
  formatEventDateTime,
  getEventTypeLabel,
} from "@/modules/events/utils/calendar";
import { MedicalReminderBanner } from "@/modules/medicalSchedule/MedicalReminderBanner";
import { UpcomingMedicalEventsPanel } from "@/modules/medicalSchedule/UpcomingMedicalEventsPanel";
import { WalkMonitoringPanel } from "@/modules/volunteers/components/WalkMonitoringPanel";

export function DashboardPage() {
  const eventsQuery = useUpcomingEvents();
  const events = eventsQuery.data ?? [];
  const calendar = useEventCalendar(events);

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="space-y-2">
          <Badge>Operations Dashboard</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Shelter snapshot
          </h1>
          <p className="text-sm text-slate-600">
            Track adoptions, volunteers, and daily medical work in one place.
          </p>
        </header>

        <MedicalReminderBanner />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Animals in care</CardDescription>
              <CardTitle className="text-2xl">86</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              32 ready for adoption this week
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Open adoptions</CardDescription>
              <CardTitle className="text-2xl">14</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              5 home visits scheduled
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Active volunteers</CardDescription>
              <CardTitle className="text-2xl">42</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              12 currently on shift
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Medical alerts</CardDescription>
              <CardTitle className="text-2xl">3</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              2 require follow-up today
            </CardContent>
          </Card>
        </div>

        <UpcomingMedicalEventsPanel />

        <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="size-5" />
                Shelter calendar
              </CardTitle>
              <CardDescription>
                Public upcoming events and open days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventsQuery.isPending ? (
                <p className="text-sm text-slate-600">
                  Loading public events...
                </p>
              ) : eventsQuery.error ? (
                <p className="text-sm text-red-600">
                  {eventsQuery.error.message || "Unable to load events."}
                </p>
              ) : events.length === 0 ? (
                <p className="text-sm text-slate-600">
                  No upcoming public events yet.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-3">
                      {events.slice(0, 4).map((event) => (
                        <div
                          key={event.id}
                          className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-slate-900">
                                {event.title}
                              </p>
                              <p className="text-sm text-slate-600">
                                {event.location}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {getEventTypeLabel(event.event_type)}
                            </Badge>
                          </div>
                          <p className="mt-2 text-xs text-slate-500">
                            {formatEventDateTime(event.starts_at)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-medium text-slate-900">
                            {calendar.monthLabel}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Highlighted days have public events.
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="rounded-full border border-slate-200 px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
                            aria-label="Previous month"
                            onClick={calendar.goToPreviousMonth}
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-slate-200 px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
                            aria-label="Next month"
                            onClick={calendar.goToNextMonth}
                          >
                            ›
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        {CALENDAR_DAYS.map((day) => (
                          <span key={day}>{day}</span>
                        ))}
                      </div>

                      <div className="mt-2 grid grid-cols-7 gap-1">
                        {calendar.calendarWeeks.flatMap((week, wi) =>
                          week.map((day, di) => {
                            if (day === null) {
                              return (
                                <span
                                  key={`empty-${wi}-${di}`}
                                  className="aspect-square rounded-lg bg-slate-50"
                                />
                              );
                            }

                            const eventsOnDay =
                              calendar.eventsByDay.get(day) ?? [];
                            const isEvent = eventsOnDay.length > 0;

                            return (
                              <button
                                key={`${wi}-${di}-${day}`}
                                type="button"
                                className={`aspect-square rounded-lg border text-sm font-medium transition ${
                                  isEvent
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                                }`}
                                aria-label={`${calendar.monthLabel} ${day}${
                                  isEvent
                                    ? `, ${eventsOnDay.length} event${
                                        eventsOnDay.length === 1 ? "" : "s"
                                      } scheduled`
                                    : ""
                                }`}
                              >
                                {day}
                              </button>
                            );
                          }),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <WalkMonitoringPanel />
        </div>
      </section>
    </main>
  );
}
