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
import { EventCreateForm } from "@/modules/events/components/EventCreateForm";
import { EventCard } from "@/modules/events/components/EventCard";
import { useEventsForManagement } from "@/modules/events/hooks/useEventManagement";

export const EventsManagementPage = () => {
  const { data: events = [], isPending, error } = useEventsForManagement();

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="space-y-2">
          <Badge>Events management</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Manage calendar events
          </h1>
          <p className="text-sm text-slate-600">
            Create, update and remove calendar events visible in the shelter
            schedule.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-3">
          <EventCreateForm />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-5" />
              Calendar events ({events.length})
            </CardTitle>
            <CardDescription>
              Edit or delete events to keep the calendar up to date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p className="text-sm text-slate-500">Loading events...</p>
            ) : null}

            {error instanceof Error ? (
              <p className="text-sm text-red-600">{error.message}</p>
            ) : null}

            {!isPending && events.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                No calendar events yet. Add one using the button above.
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};
