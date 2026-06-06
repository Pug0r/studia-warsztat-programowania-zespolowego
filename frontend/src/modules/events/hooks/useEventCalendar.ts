import { useMemo, useState } from "react";
import type { CalendarEvent } from "@repo/types";

import {
  addMonths,
  buildCalendarWeeks,
  getCalendarMonthLabel,
  groupEventsByMonthDay,
  startOfMonth,
} from "../utils/calendar";

export const useEventCalendar = (events: CalendarEvent[]) => {
  const [activeMonth, setActiveMonth] = useState(() =>
    startOfMonth(new Date()),
  );

  const monthLabel = useMemo(
    () => getCalendarMonthLabel(activeMonth),
    [activeMonth],
  );

  const calendarWeeks = useMemo(
    () => buildCalendarWeeks(activeMonth),
    [activeMonth],
  );

  const eventsByDay = useMemo(
    () => groupEventsByMonthDay(events, activeMonth),
    [activeMonth, events],
  );

  return {
    activeMonth,
    calendarWeeks,
    eventsByDay,
    goToNextMonth: () => setActiveMonth((current) => addMonths(current, 1)),
    goToPreviousMonth: () =>
      setActiveMonth((current) => addMonths(current, -1)),
    monthLabel,
  };
};
