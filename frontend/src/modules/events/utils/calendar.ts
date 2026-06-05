import type { CalendarEvent } from "@repo/types";

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const eventDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const eventDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
});

const eventCardDayFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
});

const eventCardMonthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
});

export const CALENDAR_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

const EVENT_TYPE_LABELS: Record<CalendarEvent["event_type"], string> = {
  open_day: "Open day",
  food_drive: "Food drive",
  volunteer_training: "Volunteer training",
  community_event: "Community event",
  other: "Other event",
};

export const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const addMonths = (date: Date, offset: number) =>
  new Date(date.getFullYear(), date.getMonth() + offset, 1);

export const getCalendarMonthLabel = (date: Date) =>
  monthFormatter.format(date);

export const formatEventDateTime = (value: string) =>
  eventDateTimeFormatter.format(new Date(value));

export const formatEventDate = (value: string) =>
  eventDateFormatter.format(new Date(value));

export const formatEventCardDay = (value: string) =>
  eventCardDayFormatter.format(new Date(value));

export const formatEventCardMonth = (value: string) =>
  eventCardMonthFormatter.format(new Date(value));

export const getEventTypeLabel = (type: CalendarEvent["event_type"]) =>
  EVENT_TYPE_LABELS[type];

export const getInitialCalendarMonth = (
  events: CalendarEvent[],
  fallback = new Date(),
) => {
  if (events.length === 0) {
    return startOfMonth(fallback);
  }

  return startOfMonth(new Date(events[0].starts_at));
};

export const buildCalendarWeeks = (monthDate: Date) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingDays = firstDay.getDay();

  const cells: Array<number | null> = [
    ...Array.from({ length: leadingDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: (number | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  return weeks;
};

export const groupEventsByMonthDay = (
  events: CalendarEvent[],
  monthDate: Date,
) => {
  const grouped = new Map<number, CalendarEvent[]>();
  const targetYear = monthDate.getFullYear();
  const targetMonth = monthDate.getMonth();

  for (const event of events) {
    const eventDate = new Date(event.starts_at);
    if (
      eventDate.getFullYear() !== targetYear ||
      eventDate.getMonth() !== targetMonth
    ) {
      continue;
    }

    const day = eventDate.getDate();
    const existing = grouped.get(day) ?? [];
    grouped.set(day, [...existing, event]);
  }

  return grouped;
};
