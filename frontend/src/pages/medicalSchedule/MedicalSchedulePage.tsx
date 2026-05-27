import { CalendarClock, CheckCircle2, Clock3, Stethoscope } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import type { MedicalEventStatus, MedicalEventType } from "@repo/types";
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
  useUpdateMedicalEvent,
  useUpcomingMedicalEvents,
} from "@/modules/medicalSchedule/hooks";

const toDateTimeLocal = (date: Date) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

const getInitialDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(10, 0, 0, 0);
  return toDateTimeLocal(date);
};

const statusStyles: Record<MedicalEventStatus, string> = {
  cancelled: "bg-slate-100 text-slate-700",
  completed: "bg-emerald-100 text-emerald-800",
  scheduled: "bg-blue-100 text-blue-800",
};

export function MedicalSchedulePage() {
  const pets = usePetList();
  const events = useMedicalEvents();
  const reminders = useUpcomingMedicalEvents(true, 2);
  const createEvent = useCreateMedicalEvent();
  const cancelEvent = useCancelMedicalEvent();
  const updateEvent = useUpdateMedicalEvent();
  const [petId, setPetId] = useState("");
  const [scheduledAt, setScheduledAt] = useState(getInitialDate);
  const [type, setType] = useState<MedicalEventType>("vaccination");
  const [title, setTitle] = useState(MEDICAL_EVENT_TYPE_LABELS.vaccination);
  const [notes, setNotes] = useState("");

  const petNames = useMemo(
    () => new Map((pets.data ?? []).map((pet) => [pet.id, pet.name])),
    [pets.data],
  );

  const scheduledEvents = (events.data ?? []).filter(
    (event) => event.status === "scheduled",
  );
  const completedEvents = (events.data ?? []).filter(
    (event) => event.status === "completed",
  );
  const nextEvent = scheduledEvents[0];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await createEvent.mutateAsync({
      notes: notes.trim() || null,
      pet_id: Number(petId),
      scheduled_at: new Date(scheduledAt).toISOString(),
      title: title.trim(),
      type,
    });

    setNotes("");
  }

  const error =
    createEvent.error?.message ??
    cancelEvent.error?.message ??
    updateEvent.error?.message;

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge>Medical calendar</Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Procedure schedule
            </h1>
            <p className="max-w-2xl text-sm text-slate-600">
              Plan vaccinations, checkups and procedures. A pet with a medical
              event is blocked from volunteer walks on that day.
            </p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock3 className="size-4" />
              Scheduled
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {scheduledEvents.length}
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CalendarClock className="size-4" />
              Next 2 days
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {reminders.data?.length ?? 0}
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 className="size-4" />
              Completed
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {completedEvents.length}
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.35fr]">
          <form
            className="space-y-4 rounded-md border border-slate-200 bg-white p-4"
            onSubmit={handleSubmit}
          >
            <div>
              <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                <Stethoscope className="size-4" />
                New procedure
              </h2>
              <p className="text-sm text-slate-500">
                The selected pet will be unavailable for walks on this date.
              </p>
            </div>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Pet</span>
              <select
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
                required
                value={petId}
                onChange={(event) => setPetId(event.target.value)}
              >
                <option value="">Choose pet</option>
                {(pets.data ?? []).map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">Type</span>
                <select
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
                  value={type}
                  onChange={(event) => {
                    const nextType = event.target.value as MedicalEventType;
                    setType(nextType);
                    setTitle(MEDICAL_EVENT_TYPE_LABELS[nextType]);
                  }}
                >
                  {Object.entries(MEDICAL_EVENT_TYPE_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-slate-700">Date</span>
                <input
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                  required
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(event) => setScheduledAt(event.target.value)}
                />
              </label>
            </div>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Title</span>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Notes</span>
              <textarea
                className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              className="w-full"
              disabled={!petId || createEvent.isPending}
              type="submit"
            >
              {createEvent.isPending ? "Saving..." : "Add procedure"}
            </Button>
          </form>

          <section className="space-y-4">
            {nextEvent && (
              <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-950">
                  Next procedure
                </p>
                <p className="mt-1 text-lg font-semibold text-blue-950">
                  {petNames.get(nextEvent.pet_id) ?? `Pet #${nextEvent.pet_id}`}
                  : {nextEvent.title}
                </p>
                <p className="text-sm text-blue-900">
                  {formatMedicalEventDate(nextEvent.scheduled_at)}
                </p>
              </div>
            )}

            <div className="rounded-md border border-slate-200 bg-white">
              <div className="border-b border-slate-200 p-4">
                <h2 className="font-semibold text-slate-900">
                  Scheduled procedures
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {events.isPending && (
                  <p className="p-4 text-sm text-slate-600">
                    Loading events...
                  </p>
                )}
                {events.error && (
                  <p className="p-4 text-sm text-red-600">
                    {events.error.message}
                  </p>
                )}
                {events.data?.length === 0 && (
                  <p className="p-4 text-sm text-slate-600">
                    No procedures scheduled.
                  </p>
                )}
                {events.data?.map((event) => (
                  <article
                    key={event.id}
                    className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate-900">
                          {event.title}
                        </p>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${statusStyles[event.status]}`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {petNames.get(event.pet_id) ?? `Pet #${event.pet_id}`} -{" "}
                        {MEDICAL_EVENT_TYPE_LABELS[event.type]}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatMedicalEventDate(event.scheduled_at)}
                      </p>
                      {event.notes && (
                        <p className="mt-2 text-sm text-slate-500">
                          {event.notes}
                        </p>
                      )}
                    </div>

                    {event.status === "scheduled" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() =>
                            updateEvent.mutate({
                              id: event.id,
                              payload: { status: "completed" },
                            })
                          }
                        >
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => cancelEvent.mutate(event.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
