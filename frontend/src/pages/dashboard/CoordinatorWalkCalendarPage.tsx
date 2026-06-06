import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, Clock3, Edit3, Save, Trash2, X } from "lucide-react";
import type { Pet, PetWalkRow } from "@repo/types";

import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { showToast } from "@/lib/toast";
import { usePetList } from "@/modules/pets/hooks/usePetList";
import {
  useDeletePetWalk,
  useUpdatePetWalk,
  useWalkEvents,
} from "@/modules/pets/hooks/useWalkMonitoring";

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
});

const EMPTY_PETS: Pet[] = [];
const EMPTY_WALKS: PetWalkRow[] = [];

type WalkEditFormState = {
  date: string;
  durationMinutes: number;
  notes: string;
  petId: string;
  time: string;
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const toTimeInputValue = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;

const combineDateAndTime = (dateValue: string, timeValue: string) => {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);
  const date = new Date(year, month - 1, day, hour, minute, 0, 0);

  return date;
};

const getWalkEnd = (walk: PetWalkRow) => {
  const start = new Date(walk.walked_at);

  return walk.end_at
    ? new Date(walk.end_at)
    : new Date(start.getTime() + 60 * 60 * 1000);
};

const getDurationMinutes = (walk: PetWalkRow) => {
  const start = new Date(walk.walked_at);
  const end = getWalkEnd(walk);
  const duration = Math.round((end.getTime() - start.getTime()) / 60000);

  return duration > 0 ? duration : 60;
};

const createFormState = (walk: PetWalkRow): WalkEditFormState => {
  const start = new Date(walk.walked_at);

  return {
    date: toDateKey(start),
    durationMinutes: getDurationMinutes(walk),
    notes: walk.notes ?? "",
    petId: String(walk.pet_id),
    time: toTimeInputValue(start),
  };
};

const getPetName = (petsById: Map<number, Pet>, petId: number) =>
  petsById.get(petId)?.name ?? `Pet #${petId}`;

const getWalkerLabel = (walkerId: string | null) => {
  if (!walkerId) {
    return "No walker assigned";
  }

  return `Walker ${walkerId.slice(0, 8)}`;
};

export function CoordinatorWalkCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [editingWalkId, setEditingWalkId] = useState<number | null>(null);
  const [formState, setFormState] = useState<WalkEditFormState | null>(null);

  const walkEventsQuery = useWalkEvents();
  const petsQuery = usePetList();
  const updateWalkMutation = useUpdatePetWalk();
  const deleteWalkMutation = useDeletePetWalk();

  const walks = walkEventsQuery.data ?? EMPTY_WALKS;
  const pets = petsQuery.data ?? EMPTY_PETS;
  const selectedDateKey = selectedDate ? toDateKey(selectedDate) : null;

  const petsById = useMemo(
    () => new Map(pets.map((pet) => [pet.id, pet])),
    [pets],
  );

  const walkDays = useMemo(() => {
    const seenDates = new Set<string>();

    return walks.reduce<Date[]>((acc, walk) => {
      const date = new Date(walk.walked_at);
      const dateKey = toDateKey(date);

      if (!seenDates.has(dateKey)) {
        seenDates.add(dateKey);
        acc.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
      }

      return acc;
    }, []);
  }, [walks]);

  const selectedDayWalks = useMemo(() => {
    if (!selectedDateKey) {
      return [];
    }

    return walks
      .filter((walk) => toDateKey(new Date(walk.walked_at)) === selectedDateKey)
      .sort(
        (a, b) =>
          new Date(a.walked_at).getTime() - new Date(b.walked_at).getTime(),
      );
  }, [selectedDateKey, walks]);

  const editingWalk =
    selectedDayWalks.find((walk) => walk.id === editingWalkId) ??
    walks.find((walk) => walk.id === editingWalkId) ??
    null;

  function startEditing(walk: PetWalkRow) {
    setEditingWalkId(walk.id);
    setFormState(createFormState(walk));
  }

  function stopEditing() {
    setEditingWalkId(null);
    setFormState(null);
  }

  async function handleDelete(walk: PetWalkRow) {
    const confirmed = window.confirm(
      `Delete the walk for ${getPetName(petsById, walk.pet_id)}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteWalkMutation.mutateAsync(walk.id);
      showToast("Walk entry deleted.", "success");

      if (editingWalkId === walk.id) {
        stopEditing();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete walk entry.";
      showToast(message, "error");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingWalk || !formState) {
      return;
    }

    const startDate = combineDateAndTime(formState.date, formState.time);
    const endDate = new Date(
      startDate.getTime() + formState.durationMinutes * 60 * 1000,
    );

    try {
      await updateWalkMutation.mutateAsync({
        walkId: editingWalk.id,
        payload: {
          end_at: endDate.toISOString(),
          notes: formState.notes.trim() || null,
          pet_id: Number(formState.petId),
          walked_at: startDate.toISOString(),
        },
      });

      showToast("Walk entry updated.", "success");
      setSelectedDate(startDate);
      stopEditing();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update walk entry.";
      showToast(message, "error");
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="space-y-2">
          <Badge>Coordinator schedule</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Global walk calendar
          </h1>
          <p className="text-sm text-slate-600">
            Review, edit, and remove walk entries across the shelter schedule.
          </p>
        </header>

        <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="size-5" />
                Walk days
              </CardTitle>
              <CardDescription>
                Days with recorded walks are highlighted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                modifiers={{ walked: walkDays }}
                modifiersClassNames={{
                  walked: "bg-emerald-100 text-emerald-900 rounded-md",
                }}
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_420px]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock3 className="size-5" />
                  {selectedDate
                    ? dayFormatter.format(selectedDate)
                    : "Selected day"}
                </CardTitle>
                <CardDescription>
                  {selectedDayWalks.length === 1
                    ? "1 walk entry"
                    : `${selectedDayWalks.length} walk entries`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {walkEventsQuery.isPending || petsQuery.isPending ? (
                  <p className="text-sm text-slate-600">Loading walks...</p>
                ) : walkEventsQuery.error || petsQuery.error ? (
                  <p className="text-sm text-red-600">
                    {walkEventsQuery.error?.message ||
                      petsQuery.error?.message ||
                      "Unable to load walks."}
                  </p>
                ) : selectedDayWalks.length === 0 ? (
                  <p className="text-sm text-slate-600">
                    No walks are recorded for this day.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedDayWalks.map((walk) => {
                      const startDate = new Date(walk.walked_at);
                      const endDate = getWalkEnd(walk);
                      const isEditing = editingWalkId === walk.id;

                      return (
                        <div
                          key={walk.id}
                          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium text-slate-900">
                                  {getPetName(petsById, walk.pet_id)}
                                </p>
                                {isEditing && (
                                  <Badge variant="secondary">Editing</Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600">
                                {timeFormatter.format(startDate)} -{" "}
                                {timeFormatter.format(endDate)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {getWalkerLabel(walk.walker_id)}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => startEditing(walk)}
                              >
                                <Edit3 className="size-4" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="gap-2"
                                disabled={deleteWalkMutation.isPending}
                                onClick={() => void handleDelete(walk)}
                              >
                                <Trash2 className="size-4" />
                                Delete
                              </Button>
                            </div>
                          </div>

                          {walk.notes && (
                            <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
                              {walk.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Walk details</CardTitle>
                <CardDescription>
                  {editingWalk
                    ? dateTimeFormatter.format(new Date(editingWalk.walked_at))
                    : "Select a walk to edit it."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editingWalk && formState ? (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="coordinator-walk-pet">Pet</Label>
                      <select
                        id="coordinator-walk-pet"
                        className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
                        value={formState.petId}
                        onChange={(event) =>
                          setFormState({
                            ...formState,
                            petId: event.target.value,
                          })
                        }
                      >
                        {pets.map((pet) => (
                          <option key={pet.id} value={pet.id}>
                            {pet.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="coordinator-walk-date">Date</Label>
                        <input
                          id="coordinator-walk-date"
                          type="date"
                          className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
                          value={formState.date}
                          onChange={(event) =>
                            setFormState({
                              ...formState,
                              date: event.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="coordinator-walk-time">Start</Label>
                        <input
                          id="coordinator-walk-time"
                          type="time"
                          className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
                          value={formState.time}
                          onChange={(event) =>
                            setFormState({
                              ...formState,
                              time: event.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coordinator-walk-duration">
                        Duration
                      </Label>
                      <select
                        id="coordinator-walk-duration"
                        className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
                        value={formState.durationMinutes}
                        onChange={(event) =>
                          setFormState({
                            ...formState,
                            durationMinutes: Number(event.target.value),
                          })
                        }
                      >
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1 hour 30 minutes</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coordinator-walk-notes">Notes</Label>
                      <textarea
                        id="coordinator-walk-notes"
                        rows={5}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-slate-500 focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
                        value={formState.notes}
                        onChange={(event) =>
                          setFormState({
                            ...formState,
                            notes: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        type="submit"
                        className="gap-2"
                        disabled={updateWalkMutation.isPending}
                      >
                        <Save className="size-4" />
                        {updateWalkMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={stopEditing}
                      >
                        <X className="size-4" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <p className="text-sm text-slate-600">
                    Choose any entry from the selected day.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
