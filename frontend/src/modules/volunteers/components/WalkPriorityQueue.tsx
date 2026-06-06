import { Dog } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useWalkPriorityDogs } from "@/modules/pets/hooks/useWalkMonitoring";

export function WalkPriorityQueue() {
  const q = useWalkPriorityDogs();
  const dogs = q.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dog className="size-5" />
          Walk priority queue
        </CardTitle>
        <CardDescription>Dogs waiting longest for a walk</CardDescription>
      </CardHeader>
      <CardContent>
        {q.isPending ? (
          <p className="text-sm text-slate-600">
            Loading walk priority queue...
          </p>
        ) : q.error ? (
          <p className="text-sm text-red-600">
            {q.error.message || "Unable to load queue."}
          </p>
        ) : dogs.length === 0 ? (
          <p className="text-sm text-slate-600">No items in the queue.</p>
        ) : (
          <ul className="space-y-3">
            {dogs.slice(0, 8).map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">{d.name}</p>
                  <p className="text-xs text-slate-500">
                    Last walk:{" "}
                    {d.last_walk_at
                      ? new Date(d.last_walk_at).toLocaleString()
                      : "—"}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  #{d.priority_rank}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default WalkPriorityQueue;
