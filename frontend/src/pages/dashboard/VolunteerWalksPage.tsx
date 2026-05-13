import { useState } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";

import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock3 } from "lucide-react";
import { VolunteerPriorityQueueCard } from "./VolunteerPriorityQueueCard";
import { useWalkEvents } from "@/modules/pets/hooks/useWalkMonitoring";
import { useMemo } from "react";

export function VolunteerWalksPage() {
  const { session } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const walkEventsQuery = useWalkEvents();

  const volunteerName =
    session?.user.user_metadata?.full_name ??
    session?.user.email ??
    "Volunteer";

  const walkDays = useMemo(() => {
    if (!walkEventsQuery.data) {
      return [];
    }

    const seenDates = new Set<string>();
    return walkEventsQuery.data.reduce<Date[]>((acc, walk) => {
      const date = new Date(walk.walked_at);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString();

      if (!seenDates.has(dateKey)) {
        seenDates.add(dateKey);
        acc.push(date);
      }

      return acc;
    }, []);
  }, [walkEventsQuery.data]);

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="space-y-2">
          <Badge>Volunteer schedule</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {volunteerName}'s walk calendar
          </h1>
          <p className="text-sm text-slate-600">
            Pick a date, choose a priority pet, and register a new walk.
          </p>
        </header>

        <div className="grid gap-4 xl:grid-cols-[1fr_1.5fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock3 className="size-5" />
                Walk calendar
              </CardTitle>
              <CardDescription>Choose a day for the walk.</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                modifiers={{ walked: walkDays }}
                modifiersClassNames={{
                  walked: "bg-emerald-100 text-emerald-900 rounded-md",
                }}
              />
            </CardContent>
          </Card>

          <div>
            <VolunteerPriorityQueueCard
              selectedDate={selectedDate}
              onSelectedDateChange={setSelectedDate}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
