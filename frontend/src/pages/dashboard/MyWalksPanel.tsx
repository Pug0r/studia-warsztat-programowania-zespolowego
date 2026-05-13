import { useEffect, useState } from "react";
import { Clock, Dog, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCancelWalk,
  useMyWalks,
} from "@/modules/pets/hooks/useWalkMonitoring";
import { showToast } from "@/lib/toast";

const CANCELLATION_WINDOW_MS = 24 * 60 * 60 * 1000;

const walkDateFormatter = new Intl.DateTimeFormat("pl-PL", {
  dateStyle: "long",
  timeStyle: "short",
});

const formatWalkDateTime = (dateString: string) => {
  return walkDateFormatter.format(new Date(dateString));
};

const canCancelWalk = (walkedAt: string, now: number): boolean => {
  return new Date(walkedAt).getTime() - now > CANCELLATION_WINDOW_MS;
};

export function MyWalksPanel() {
  const walksQuery = useMyWalks();
  const cancelWalk = useCancelWalk();
  const walks = walksQuery.data ?? [];

  // Re-render every minute so cancel buttons disable themselves
  // as the 24h cutoff approaches without requiring user action.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCancel = (walkId: number, walkedAt: string) => {
    const confirmed = window.confirm(
      `Czy na pewno chcesz anulować spacer zaplanowany na ${formatWalkDateTime(walkedAt)}?`,
    );
    if (!confirmed) {
      return;
    }

    cancelWalk.mutate(walkId, {
      onSuccess: () => {
        showToast("Spacer anulowany.", "success");
      },
      onError: (err) => {
        showToast(err.message || "Nie udało się anulować spaceru.", "error");
      },
    });
  };

  return (
    <Card>
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
          <p className="text-sm text-slate-600">No upcoming walks scheduled.</p>
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
                          Pet: {walk.pets?.name || "Unknown"}
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
                        onClick={() => handleCancel(walk.id, walk.walked_at)}
                        title={
                          isCancellable
                            ? "Anuluj spacer"
                            : "Można anulować najpóźniej 24h przed startem"
                        }
                      >
                        <X className="size-3.5" />
                        {isCancellingThis ? "Anulowanie…" : "Anuluj"}
                      </Button>
                      {!isCancellable && (
                        <span className="text-[10px] text-slate-400">
                          &lt;24h do startu
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
  );
}
