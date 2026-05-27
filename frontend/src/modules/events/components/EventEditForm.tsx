import { useState } from "react";
import { useUpdateEvent } from "../hooks/useEventManagement";
import type { CalendarEvent, CalendarEventUpdate } from "@repo/types";

type Props = {
  event: CalendarEvent;
  onCancel: () => void;
  onSaved: () => void;
};

export const EventEditForm = ({ event, onCancel, onSaved }: Props) => {
  const pad = (value: number) => String(value).padStart(2, "0");

  const toDateTimeLocalValue = (value: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const toSupabaseTimestamp = (value: string) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
      date.getUTCDate(),
    )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
      date.getUTCSeconds(),
    )}+00`;
  };

  const [title, setTitle] = useState(event.title);
  const [location, setLocation] = useState(event.location);
  const [description, setDescription] = useState(event.description);
  const [startsAt, setStartsAt] = useState(
    toDateTimeLocalValue(event.starts_at),
  );
  const [endsAt, setEndsAt] = useState(
    event.ends_at ? toDateTimeLocalValue(event.ends_at) : "",
  );
  const [eventType, setEventType] = useState<CalendarEventUpdate["event_type"]>(
    event.event_type,
  );
  const [isPublic, setIsPublic] = useState(event.is_public);

  const updateMutation = useUpdateEvent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      {
        id: String(event.id),
        payload: {
          title,
          location,
          description,
          starts_at: startsAt
            ? (toSupabaseTimestamp(startsAt) ?? startsAt)
            : undefined,
          ends_at: endsAt ? toSupabaseTimestamp(endsAt) : null,
          event_type: eventType,
          is_public: isPublic,
        },
      },
      {
        onSuccess: () => onSaved(),
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-slate-900">Edit event</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-600">
          <span>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>Location</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600 md:col-span-2">
          <span>Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>Start</span>
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>End</span>
          <input
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-600">
          <span>Type</span>
          <select
            value={eventType}
            onChange={(e) =>
              setEventType(e.target.value as CalendarEventUpdate["event_type"])
            }
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
          >
            <option value="open_day">Open day</option>
            <option value="food_drive">Food drive</option>
            <option value="volunteer_training">Volunteer training</option>
            <option value="community_event">Community event</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-900"
          />
          Public event
        </label>
      </div>

      {updateMutation.error instanceof Error ? (
        <p className="text-sm text-red-600">{updateMutation.error.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={updateMutation.isPending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        Save changes
      </button>
    </form>
  );
};
