import { CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { usePetList } from "@/modules/pets/hooks/usePetList";
import { useUpcomingMedicalEvents } from "./hooks";
import { formatMedicalEventDate, MEDICAL_EVENT_TYPE_LABELS } from "./format";

export function UpcomingMedicalEventsPanel() {
  const { session } = useAuth();
  const role = session?.user?.user_metadata?.role as string | undefined;
  const enabled = role === "admin" || role === "coordinator";
  const events = useUpcomingMedicalEvents(enabled);
  const pets = usePetList({ enabled });

  if (!enabled) {
    return null;
  }

  const petNames = new Map((pets.data ?? []).map((pet) => [pet.id, pet.name]));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="size-5" />
          Upcoming procedures
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-700">
        {events.isPending && <p>Loading procedures...</p>}
        {events.error && <p className="text-red-600">{events.error.message}</p>}
        {events.data?.length === 0 && <p>No upcoming procedures.</p>}
        {events.data?.slice(0, 6).map((event) => (
          <div
            key={event.id}
            className="rounded-md border border-slate-200 bg-white p-3"
          >
            <p className="font-medium text-slate-900">{event.title}</p>
            <p>
              {petNames.get(event.pet_id) ?? `Pet #${event.pet_id}`} -{" "}
              {MEDICAL_EVENT_TYPE_LABELS[event.type]}
            </p>
            <p className="text-slate-500">
              {formatMedicalEventDate(event.scheduled_at)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
