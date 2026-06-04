import React, { useMemo, useState } from "react";
import { Clock, Dog, X } from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { showToast } from "@/lib/toast";
import {
  useCancelWalk,
  useMyWalks,
  useWalkEvents,
} from "@/modules/pets/hooks/useWalkMonitoring";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { usePetList } from "@/modules/pets/hooks/usePetList";
import {
  addMonths,
  buildCalendarWeeks,
  getCalendarMonthLabel,
  startOfMonth,
  CALENDAR_DAYS,
} from "@/modules/events/utils/calendar";
import { VolunteerPriorityQueueCard } from "@/modules/volunteers/components/VolunteerPriorityQueueCard.tsx";

const CANCELLATION_WINDOW_MS = 24 * 60 * 60 * 1000;

const walkDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
});

const formatWalkDateTime = (dateString: string) => {
  return walkDateFormatter.format(new Date(dateString));
};

const canCancelWalk = (walkedAt: string, now: number): boolean => {
  return new Date(walkedAt).getTime() - now > CANCELLATION_WINDOW_MS;
};

export function VolunteerWalksPage() {
  const { session } = useAuth();
  const walksQuery = useMyWalks();
  const allWalksQuery = useWalkEvents();
  const petsQuery = usePetList();
  const cancelWalk = useCancelWalk();

  const walks = useMemo(() => walksQuery.data ?? [], [walksQuery.data]);
  const allWalks = useMemo(
    () => allWalksQuery.data ?? [],
    [allWalksQuery.data],
  );
  const pets = petsQuery.data ?? [];

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [now, setNow] = useState(() => Date.now());
  const [activeMonth, setActiveMonth] = useState(() =>
    startOfMonth(new Date()),
  );

  // Update current time for cancellation window
  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Build walk calendar
  const monthLabel = useMemo(
    () => getCalendarMonthLabel(activeMonth),
    [activeMonth],
  );

  const calendarWeeks = useMemo(
    () => buildCalendarWeeks(activeMonth),
    [activeMonth],
  );

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const walksByDay = useMemo(() => {
    const map = new Map<number, typeof walks>();
    walks.forEach((walk) => {
      const date = new Date(walk.walked_at);
      // Normalize to start of day
      const dayKey = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ).getTime();
      if (!map.has(dayKey)) {
        map.set(dayKey, []);
      }
      map.get(dayKey)!.push(walk);
    });
    return map;
  }, [walks]);

  const reservedByDay = useMemo(() => {
    const map = new Map<number, number>();
    allWalks.forEach((walk) => {
      if (walk.walker_id === session?.user.id) {
        return;
      }
      const date = new Date(walk.walked_at);
      const dayKey = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ).getTime();
      map.set(dayKey, (map.get(dayKey) ?? 0) + 1);
    });
    return map;
  }, [allWalks, session?.user.id]);

  const handleCancel = (walkId: number, walkedAt: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel this walk scheduled for ${formatWalkDateTime(walkedAt)}?`,
    );
    if (!confirmed) {
      return;
    }

    cancelWalk.mutate(walkId, {
      onSuccess: () => {
        showToast("Walk cancelled.", "success");
      },
      onError: (err) => {
        showToast(err.message || "Failed to cancel walk.", "error");
      },
    });
  };

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="space-y-2">
          <Badge>Volunteer Schedule</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            My walks
          </h1>
          <p className="text-sm text-slate-600">
            View your upcoming walks and register for new ones.
          </p>
        </header>

        <div className="grid gap-4 xl:grid-cols-[1fr_1.5fr]">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5" />
                Walk calendar
              </CardTitle>
              <CardDescription>Days with walks are highlighted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">
                        {monthLabel}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Green: your walks. Amber: reserved by others.
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="rounded-full border border-slate-200 px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
                        aria-label="Previous month"
                        onClick={() =>
                          setActiveMonth((current) => addMonths(current, -1))
                        }
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-slate-200 px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
                        aria-label="Next month"
                        onClick={() =>
                          setActiveMonth((current) => addMonths(current, 1))
                        }
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
                    {calendarWeeks.flatMap((week, wi) =>
                      week.map((day, di) => {
                        if (day === null) {
                          return (
                            <span
                              key={`empty-${wi}-${di}`}
                              className="aspect-square rounded-lg bg-slate-50"
                            />
                          );
                        }

                        const dayStart = new Date(
                          activeMonth.getFullYear(),
                          activeMonth.getMonth(),
                          day,
                        );
                        const dayKey = dayStart.getTime();
                        const walksOnDay = walksByDay.get(dayKey) ?? [];
                        const hasWalks = walksOnDay.length > 0;
                        const reservedCount = reservedByDay.get(dayKey) ?? 0;
                        const hasReserved = reservedCount > 0;

                        const isPast = dayStart < today;

                        return (
                          <button
                            key={`${wi}-${di}-${day}`}
                            type="button"
                            disabled={isPast}
                            className={`aspect-square rounded-lg border text-sm font-medium transition ${
                              isPast && !hasWalks && !hasReserved
                                ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                                : hasWalks
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                                  : hasReserved
                                    ? "border-amber-300 bg-amber-50 text-amber-900"
                                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                            }`}
                            onClick={() => setSelectedDate(dayStart)}
                            aria-label={`${monthLabel} ${day}${
                              hasWalks
                                ? `, ${walksOnDay.length} walk${
                                    walksOnDay.length === 1 ? "" : "s"
                                  }`
                                : hasReserved
                                  ? `, ${reservedCount} reserved`
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
            </CardContent>
          </Card>

          <VolunteerPriorityQueueCard selectedDate={selectedDate} />

          {/* My Walks List */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5" />
                My upcoming walks
              </CardTitle>
              <CardDescription>
                Scheduled walks for today and upcoming days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {walksQuery.isPending ? (
                <p className="text-sm text-slate-600">Loading walks...</p>
              ) : walksQuery.error ? (
                <p className="text-sm text-red-600">
                  {walksQuery.error.message || "Unable to load walks."}
                </p>
              ) : walks.length === 0 ? (
                <p className="text-sm text-slate-600">
                  No upcoming walks scheduled.
                </p>
              ) : (
                <div className="space-y-3">
                  {walks.map((walk) => {
                    const isCancellable = canCancelWalk(walk.walked_at, now);
                    const isCancellingThis =
                      cancelWalk.isPending && cancelWalk.variables === walk.id;

                    return (
                      <div
                        key={walk.id}
                        className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Dog className="size-4 text-slate-500" />
                              <p className="font-medium text-slate-900">
                                {pets.find((pet) => pet.id === walk.pet_id)
                                  ?.name || "Unknown"}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">
                              {formatWalkDateTime(walk.walked_at)}
                            </p>
                            {walk.notes && (
                              <p className="mt-2 text-xs text-slate-500 italic">
                                {walk.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant="outline">Walk</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              disabled={!isCancellable || isCancellingThis}
                              onClick={() =>
                                handleCancel(walk.id, walk.walked_at)
                              }
                              title={
                                isCancellable
                                  ? "Cancel this walk"
                                  : "Can cancel until 24h before start"
                              }
                            >
                              <X className="size-3.5" />
                              {isCancellingThis ? "Cancelling…" : "Cancel"}
                            </Button>
                            {!isCancellable && (
                              <span className="text-[10px] text-slate-400">
                                &lt;24h
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
