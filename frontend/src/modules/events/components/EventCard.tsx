import { useState } from "react";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import type { CalendarEvent } from "@repo/types";
import { EventEditForm } from "./EventEditForm";
import { useDeleteEvent } from "../hooks/useEventManagement";

type Props = {
  event: CalendarEvent;
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

export const EventCard = ({ event }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const deleteMutation = useDeleteEvent();

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete event "${event.title}" scheduled for ${formatDateTime(
          event.starts_at,
        )}?`,
      )
    ) {
      deleteMutation.mutate(String(event.id));
    }
  };

  if (isEditing) {
    return (
      <EventEditForm
        event={event}
        onCancel={() => setIsEditing(false)}
        onSaved={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-900">
            {event.title}
          </p>
          <p className="text-sm text-slate-500">{event.location}</p>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <CalendarDays className="size-4" />
          <span className="text-xs uppercase tracking-wide text-slate-400">
            {event.event_type.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-sm text-slate-600">
        <p>{event.description}</p>
        <p>
          <span className="font-medium text-slate-900">Starts:</span>{" "}
          {formatDateTime(event.starts_at)}
        </p>
        {event.ends_at ? (
          <p>
            <span className="font-medium text-slate-900">Ends:</span>{" "}
            {formatDateTime(event.ends_at)}
          </p>
        ) : null}
        <p>
          <span className="font-medium text-slate-900">Public:</span>{" "}
          {event.is_public ? "Yes" : "No"}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200"
        >
          <Pencil className="size-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100 disabled:opacity-50"
        >
          <Trash2 className="size-4" />
          Delete
        </button>
      </div>
    </div>
  );
};
