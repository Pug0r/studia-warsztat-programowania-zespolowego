import { useState, type FormEvent } from "react";
import { Dog } from "lucide-react";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { showToast } from "@/lib/toast";
import {
  useRecordPetWalk,
  useWalkPriorityDogs,
  useWalkEvents,
} from "@/modules/pets/hooks/useWalkMonitoring";

const lastWalkFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const getWalkStatus = (daysSinceLastWalk: number | null) => {
  if (daysSinceLastWalk === null) {
    return { label: "No walks yet", variant: "destructive" as const };
  }

  if (daysSinceLastWalk >= 4) {
    return { label: "Needs walk", variant: "destructive" as const };
  }

  if (daysSinceLastWalk >= 2) {
    return { label: "Due soon", variant: "outline" as const };
  }

  return { label: "Recently walked", variant: "secondary" as const };
};

const formatLastWalk = (value: string | null) =>
  value ? lastWalkFormatter.format(new Date(value)) : "No recorded walks yet";

const formatWalkAge = (daysSinceLastWalk: number | null) => {
  if (daysSinceLastWalk === null) {
    return "This pet has not been logged for a walk yet.";
  }

  if (daysSinceLastWalk === 0) {
    return "Walked today.";
  }

  if (daysSinceLastWalk === 1) {
    return "1 day since the last walk.";
  }

  return `${daysSinceLastWalk} days since the last walk.`;
};

type VolunteerPriorityQueueCardProps = {
  selectedDate?: Date | undefined;
  onSelectedDateChange?: (value: Date | undefined) => void;
};

export function VolunteerPriorityQueueCard({
  selectedDate: selectedDateProp,
  //   onSelectedDateChange,
}: VolunteerPriorityQueueCardProps) {
  const { session } = useAuth();
  const [selectedDogId, setSelectedDogId] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState("08:00");

  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState("");

  const selectedDate = selectedDateProp;

  const priorityQuery = useWalkPriorityDogs();
  const walkEventsQuery = useWalkEvents();
  const recordWalkMutation = useRecordPetWalk();

  const priorityDogs = priorityQuery.data ?? [];
  const walkEvents = walkEventsQuery.data ?? [];

  const selectedDog =
    priorityDogs.find((dog) => dog.id === selectedDogId) ??
    priorityDogs[0] ??
    null;

  type WalkEvent = {
    pet_id: number;
    walker_id: string | null;
    walked_at: string;
    end_at: string | null;
  };

  function getWalkEnd(walk: WalkEvent) {
    const start = new Date(walk.walked_at);

    return walk.end_at
      ? new Date(walk.end_at)
      : new Date(start.getTime() + 60 * 60 * 1000);
  }

  function hasOverlap(
    startTime: Date,
    endTime: Date,
    walk: WalkEvent,
    matchPetId: number | null,
    matchWalkerId?: string,
  ) {
    if (matchPetId && walk.pet_id === matchPetId) {
      const walkStart = new Date(walk.walked_at);
      const walkEnd = getWalkEnd(walk);

      if (startTime < walkEnd && endTime > walkStart) return true;
    }

    if (matchWalkerId && walk.walker_id === matchWalkerId) {
      const walkStart = new Date(walk.walked_at);
      const walkEnd = getWalkEnd(walk);

      if (startTime < walkEnd && endTime > walkStart) return true;
    }

    return false;
  }

  function generateTimeSlots(): string[] {
    const slots: string[] = [];

    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(
          `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
        );
      }
    }

    return slots;
  }

  // Generate available time slots (30-minute intervals)
  const availableTimeSlots = selectedDate
    ? generateTimeSlots().filter((timeSlot) => {
        const [hour, minute] = timeSlot.split(":").map(Number);

        const startTime = new Date(selectedDate);
        startTime.setHours(hour, minute, 0, 0);

        const endTime = new Date(
          startTime.getTime() + durationMinutes * 60 * 1000,
        );

        const userId = session?.user.id;
        const petId = selectedDog?.id ?? null;

        for (const walk of walkEvents) {
          if (hasOverlap(startTime, endTime, walk, petId, userId)) {
            return false;
          }
        }

        return true;
      })
    : [];

  const safeSelectedTime = availableTimeSlots.includes(selectedTime)
    ? selectedTime
    : (availableTimeSlots[0] ?? "08:00");

  async function handleWalkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedDog || !selectedDate) {
      showToast("Choose a pet and date before recording a walk.", "warning");
      return;
    }

    const [hour, minute] = safeSelectedTime.split(":").map(Number);
    const walkDate = new Date(selectedDate);
    walkDate.setHours(hour, minute, 0, 0);

    try {
      const endDate = new Date(
        walkDate.getTime() + durationMinutes * 60 * 1000,
      );
      await recordWalkMutation.mutateAsync({
        petId: selectedDog.id,
        payload: {
          walked_at: walkDate.toISOString(),
          end_at: endDate.toISOString(),
          walker_id: session?.user.id,
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        },
      });

      showToast(`Walk recorded for ${selectedDog.name}.`, "success");
      setNotes("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to record the walk.";
      showToast(message, "error");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dog className="size-5" />
          Volunteer priority queue
        </CardTitle>
        <CardDescription>
          Pets that have waited the longest are listed first. Select one to log
          a new outing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {priorityQuery.isPending ? (
          <p className="text-sm text-slate-600">Loading priority pets...</p>
        ) : priorityQuery.error ? (
          <p className="text-sm text-red-600">
            {priorityQuery.error.message ||
              "Unable to load the walk priority queue."}
          </p>
        ) : priorityDogs.length === 0 ? (
          <p className="text-sm text-slate-600">
            No pets are available for walk prioritization.
          </p>
        ) : (
          <div className="space-y-3">
            {priorityDogs.slice(0, 5).map((dog) => {
              const status = getWalkStatus(dog.days_since_last_walk);

              return (
                <div
                  key={dog.id}
                  className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{dog.name}</p>
                        <Badge variant="outline">#{dog.priority_rank}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        Last walk: {formatLastWalk(dog.last_walk_at)}
                      </p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {formatWalkAge(dog.days_since_last_walk)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <form
          className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
          onSubmit={handleWalkSubmit}
        >
          <div className="space-y-2">
            <Label htmlFor="walk-pet-select">Choose a pet</Label>
            <select
              id="walk-pet-select"
              className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
              value={selectedDog?.id?.toString() ?? ""}
              onChange={(event) => setSelectedDogId(Number(event.target.value))}
              disabled={priorityQuery.isPending || priorityDogs.length === 0}
            >
              {priorityDogs.map((dog) => (
                <option key={dog.id} value={dog.id}>
                  {dog.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 items-stretch sm:grid-cols-2">
            <div className="space-y-2">
              <div>
                <Label htmlFor="walk-date-select">Selected date: </Label>
                <p className="px-3 py-3 text-center font-medium text-slate-600 ">
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "No date selected"}
                </p>
              </div>
              <Label htmlFor="walk-duration-select">Walk duration</Label>
              <select
                id="walk-duration-select"
                value={durationMinutes}
                onChange={(event) =>
                  setDurationMinutes(Number(event.target.value))
                }
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1 hour 30 minutes</option>
                <option value={120}>2 hours</option>
              </select>
              <Label htmlFor="walk-time-select">Choose time</Label>
              <select
                id="walk-time-select"
                value={safeSelectedTime}
                onChange={(event) => setSelectedTime(event.target.value)}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
              >
                {availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))
                ) : (
                  <option disabled>No available times</option>
                )}
              </select>
            </div>

            <div className="flex h-full flex-col space-y-2">
              <Label htmlFor="walk-notes">Walk notes</Label>
              <textarea
                id="walk-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional notes for the coordinator"
                className="w-full flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-slate-500 focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedDog || recordWalkMutation.isPending}
          >
            {recordWalkMutation.isPending ? "Recording walk..." : "Record walk"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
