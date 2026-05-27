import { useState } from "react";
import type { MedicalEventType } from "@repo/types";
import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePetList } from "@/modules/pets/hooks/usePetList";
import {
  formatMedicalEventDate,
  MEDICAL_EVENT_TYPE_LABELS,
} from "@/modules/medicalSchedule/format";
import {
  useCancelMedicalEvent,
  useCreateMedicalEvent,
  useMedicalEvents,
  useUpcomingMedicalEvents,
} from "@/modules/medicalSchedule/hooks";

const toDateTimeLocal = (date: Date) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

export function MedicalSchedulePage() {
  const pets = usePetList();
  const events = useMedicalEvents();
  const reminders = useUpcomingMedicalEvents(true, 2);
  const createEvent = useCreateMedicalEvent();
  const cancelEvent = useCancelMedicalEvent();
  const [scheduledAt, setScheduledAt] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(10, 0, 0, 0);
    return toDateTimeLocal(date);
  });
  const [type, setType] = useState<MedicalEventType>("vaccination");

  const firstPet = pets.data?.[0];

  async function createDemoEvent() {
    if (!firstPet) {
      return;
    }

    await createEvent.mutateAsync({
      notes: "Frontend demo payload.",
      pet_id: firstPet.id,
      scheduled_at: new Date(scheduledAt).toISOString(),
      title: MEDICAL_EVENT_TYPE_LABELS[type],
      type,
    });
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="space-y-2">
          <Badge>Medical schedule demo</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Frontend handoff
          </h1>
          <p className="text-sm text-slate-600">
            Backend, API hooks and walk blocking are ready. This page shows the
            calls the final UI should use.
          </p>
        </header>

        <section className="space-y-3 rounded-md border border-dashed border-slate-300 bg-white p-4">
          <h2 className="font-semibold text-slate-900">Create event demo</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <select
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={type}
              onChange={(event) => setType(event.target.value as MedicalEventType)}
            >
              {Object.entries(MEDICAL_EVENT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              type="datetime-local"
              value={scheduledAt}
              onChange={(event) => setScheduledAt(event.target.value)}
            />
            <Button
              type="button"
              disabled={!firstPet || createEvent.isPending}
              onClick={createDemoEvent}
            >
              {createEvent.isPending ? "Creating..." : "Create for first pet"}
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            Uses: useCreateMedicalEvent(), usePetList().
          </p>
        </section>

        <section className="space-y-3 rounded-md border border-dashed border-slate-300 bg-white p-4">
          <h2 className="font-semibold text-slate-900">Upcoming procedures demo</h2>
          {events.isPending && <p className="text-sm">Loading events...</p>}
          {events.error && (
            <p className="text-sm text-red-600">{events.error.message}</p>
          )}
          {(events.data ?? []).slice(0, 5).map((event) => (
            <div key={event.id} className="rounded-md bg-slate-50 p-3 text-sm">
              <p className="font-medium text-slate-900">{event.title}</p>
              <p>
                {MEDICAL_EVENT_TYPE_LABELS[event.type]} -{" "}
                {formatMedicalEventDate(event.scheduled_at)}
              </p>
              {event.status === "scheduled" && (
                <Button
                  className="mt-2"
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => cancelEvent.mutate(event.id)}
                >
                  Cancel demo
                </Button>
              )}
            </div>
          ))}
          <p className="text-xs text-slate-500">
            Uses: useMedicalEvents(), useCancelMedicalEvent().
          </p>
        </section>

        <section className="space-y-3 rounded-md border border-dashed border-slate-300 bg-white p-4">
          <h2 className="font-semibold text-slate-900">2-day reminders demo</h2>
          {(reminders.data ?? []).slice(0, 3).map((event) => (
            <div key={event.id} className="rounded-md bg-amber-50 p-3 text-sm">
              {event.title} - {formatMedicalEventDate(event.scheduled_at)}
            </div>
          ))}
          {reminders.data?.length === 0 && (
            <p className="text-sm text-slate-600">No reminders in 2 days.</p>
          )}
          <p className="text-xs text-slate-500">
            Uses: useUpcomingMedicalEvents(true, 2). Final dashboard/banner is
            left for frontend integration.
          </p>
        </section>
      </section>
    </main>
  );
}
