import { CalendarClock, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { usePetList } from "@/modules/pets/hooks/usePetList";
import { useUpcomingMedicalEvents } from "./hooks";
import { formatMedicalEventDate, MEDICAL_EVENT_TYPE_LABELS } from "./format";

const STORAGE_KEY = "dismissed_medical_reminders";

const readDismissed = (): number[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((value): value is number => Number.isInteger(value))
      : [];
  } catch {
    return [];
  }
};

const writeDismissed = (ids: number[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

export function MedicalReminderBanner() {
  const { session } = useAuth();
  const role = session?.user?.user_metadata?.role as string | undefined;
  const enabled = role === "admin" || role === "coordinator";
  const events = useUpcomingMedicalEvents(enabled, 2);
  const pets = usePetList({ enabled });
  const [dismissedIds, setDismissedIds] = useState(readDismissed);

  const dueEvents = useMemo(() => {
    return (events.data ?? []).filter(
      (event) => !dismissedIds.includes(event.id),
    );
  }, [dismissedIds, events.data]);

  if (!enabled || dueEvents.length === 0) {
    return null;
  }

  const petNames = new Map((pets.data ?? []).map((pet) => [pet.id, pet.name]));

  function dismiss(eventId: number) {
    const nextDismissedIds = [...new Set([...dismissedIds, eventId])];
    setDismissedIds(nextDismissedIds);
    writeDismissed(nextDismissedIds);
  }

  return (
    <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <div className="flex items-center gap-2 font-semibold">
        <CalendarClock className="size-4" />
        Medical reminders
      </div>

      <div className="space-y-2">
        {dueEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-start justify-between gap-3 rounded-md bg-white/70 p-3"
          >
            <div>
              <p className="font-medium">
                {petNames.get(event.pet_id) ?? `Pet #${event.pet_id}`}:{" "}
                {event.title}
              </p>
              <p>
                {MEDICAL_EVENT_TYPE_LABELS[event.type]} -{" "}
                {formatMedicalEventDate(event.scheduled_at)}
              </p>
            </div>
            <button
              type="button"
              className="rounded-full p-1 text-amber-900 transition hover:bg-amber-100"
              aria-label="Dismiss medical reminder"
              onClick={() => dismiss(event.id)}
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
