import { useState, type FormEvent } from "react";
import { Dog, ListChecks } from "lucide-react";

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
  useWalkSummary,
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

type WalkMonitoringPanelProps = {
  selectedDate?: Date | undefined;
  onSelectedDateChange?: (value: Date | undefined) => void;
};

export function WalkMonitoringPanel({
  selectedDate: selectedDateProp,
  // onSelectedDateChange,
}: WalkMonitoringPanelProps) {
  const { session } = useAuth();
  const [selectedDogId, setSelectedDogId] = useState("");
  const [selectedTime, setSelectedTime] = useState("08:00");
  const [notes, setNotes] = useState("");
  // const [internalSelectedDate, setInternalSelectedDate] = useState<
  //   Date | undefined
  // >(new Date());

  const selectedDate = selectedDateProp ?? new Date();
  // const setSelectedDate = onSelectedDateChange ?? setInternalSelectedDate;

  const priorityQuery = useWalkPriorityDogs();
  const summaryQuery = useWalkSummary();
  const recordWalkMutation = useRecordPetWalk();

  const priorityDogs = priorityQuery.data ?? [];
  const walkSummary = summaryQuery.data ?? [];

  const selectedDog =
    priorityDogs.find((dog) => String(dog.id) === selectedDogId) ??
    priorityDogs[0] ??
    null;

  async function handleWalkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedDog || !selectedDate) {
      showToast("Choose a pet and date before recording a walk.", "warning");
      return;
    }

    const [hour, minute] = selectedTime.split(":").map(Number);
    const walkDate = new Date(selectedDate);
    walkDate.setHours(hour, minute, 0, 0);

    try {
      await recordWalkMutation.mutateAsync({
        petId: selectedDog.id,
        payload: {
          walked_at: walkDate.toISOString(),
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dog className="size-5" />
            Volunteer priority queue
          </CardTitle>
          <CardDescription>
            Pets that have waited the longest are listed first. Select one to
            log a new outing.
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
                          <p className="font-medium text-slate-900">
                            {dog.name}
                          </p>
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
                value={
                  selectedDogId ||
                  (selectedDog?.id ? String(selectedDog.id) : "")
                }
                onChange={(event) => setSelectedDogId(event.target.value)}
                disabled={priorityQuery.isPending || priorityDogs.length === 0}
              >
                <option value="">Select a pet</option>
                {priorityDogs.map((dog) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name} - last walk: {formatLastWalk(dog.last_walk_at)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="walk-time-select">Walk time</Label>
                <select
                  id="walk-time-select"
                  value={selectedTime}
                  onChange={(event) => setSelectedTime(event.target.value)}
                  className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
                >
                  {Array.from({ length: 8 }, (_, index) => {
                    const hour = index + 8;
                    const time = `${String(hour).padStart(2, "0")}:00`;
                    return (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="walk-notes">Walk notes</Label>
                <textarea
                  id="walk-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Optional notes for the coordinator"
                  rows={4}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-slate-500 focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!selectedDog || recordWalkMutation.isPending}
            >
              {recordWalkMutation.isPending
                ? "Recording walk..."
                : "Record walk"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="size-5" />
            Coordinator walk ledger
          </CardTitle>
          <CardDescription>
            Every pet with the most recent walk date in one place for shift
            coordination.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summaryQuery.isPending ? (
            <p className="text-sm text-slate-600">Loading walk summary...</p>
          ) : summaryQuery.error ? (
            <p className="text-sm text-red-600">
              {summaryQuery.error.message || "Unable to load the walk ledger."}
            </p>
          ) : walkSummary.length === 0 ? (
            <p className="text-sm text-slate-600">
              No walk history has been recorded yet.
            </p>
          ) : (
            <div className="max-h-128 space-y-3 overflow-auto pr-1">
              {walkSummary.map((pet) => {
                const status = getWalkStatus(pet.days_since_last_walk);

                return (
                  <div
                    key={pet.id}
                    className="rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{pet.name}</p>
                        <p className="text-slate-500">
                          Last walk: {formatLastWalk(pet.last_walk_at)}
                        </p>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>#{pet.id}</span>
                      <span>Walk count: {pet.walk_count}</span>
                      <span>
                        {pet.days_since_last_walk === null
                          ? "No walks yet"
                          : `${pet.days_since_last_walk} days ago`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
