import { Clock, Dog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMyWalks } from "@/modules/pets/hooks/useWalkMonitoring";

const walkDateFormatter = new Intl.DateTimeFormat("pl-PL", {
  dateStyle: "long",
  timeStyle: "short",
});

const formatWalkDateTime = (dateString: string) => {
  return walkDateFormatter.format(new Date(dateString));
};

export function MyWalksPanel() {
  const walksQuery = useMyWalks();
  const walks = walksQuery.data ?? [];

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
            {walks.map((walk) => (
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
                  <Badge variant="outline">Walk</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
