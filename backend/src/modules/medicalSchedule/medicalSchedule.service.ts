import type {
  CreateMedicalEventDTO,
  MedicalEventReminderRow,
  MedicalEventRow,
  MedicalReminderRunResult,
  UpdateMedicalEventDTO,
} from "@repo/types";
import {
  medicalScheduleDb,
  type MedicalEventInsert,
  type MedicalEventReminderInsert,
} from "./medicalSchedule.types.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const REMINDER_ROLES = ["admin", "coordinator"] as const;

const isMissingMedicalTableError = (message: string) =>
  message.includes("medical_events") || message.includes("schema cache");

interface Actor {
  id?: string;
  email?: string;
}

const getUtcDayRange = (dateLike: string | Date) => {
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date.");
  }

  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return {
    end: end.toISOString(),
    start: start.toISOString(),
  };
};

const getReminderWindow = (now = new Date()) => {
  const start = new Date(now.getTime() + 2 * MS_PER_DAY);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(now.getTime() + 4 * MS_PER_DAY);
  end.setUTCHours(0, 0, 0, 0);

  return {
    end: end.toISOString(),
    start: start.toISOString(),
  };
};

export const listEvents = async (): Promise<MedicalEventRow[]> => {
  const { data, error } = await medicalScheduleDb
    .from("medical_events")
    .select("*")
    .order("scheduled_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const listUpcomingEvents = async (
  days = 14,
): Promise<MedicalEventRow[]> => {
  const now = new Date();
  const max = new Date(now.getTime() + days * MS_PER_DAY);

  const { data, error } = await medicalScheduleDb
    .from("medical_events")
    .select("*")
    .eq("status", "scheduled")
    .gte("scheduled_at", now.toISOString())
    .lte("scheduled_at", max.toISOString())
    .order("scheduled_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createEvent = async (
  payload: CreateMedicalEventDTO,
  actor: Actor,
): Promise<MedicalEventRow> => {
  const row: MedicalEventInsert = {
    ...payload,
    created_by: actor.id ?? null,
    created_by_email: actor.email ?? null,
    status: "scheduled",
  };

  const { data, error } = await medicalScheduleDb
    .from("medical_events")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateEvent = async (
  id: number,
  payload: UpdateMedicalEventDTO,
): Promise<MedicalEventRow> => {
  const { data, error } = await medicalScheduleDb
    .from("medical_events")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const cancelEvent = async (id: number): Promise<MedicalEventRow> =>
  updateEvent(id, { status: "cancelled" });

export const listReminders = async (
  audienceRole?: "admin" | "coordinator",
): Promise<MedicalEventReminderRow[]> => {
  let query = medicalScheduleDb
    .from("medical_event_reminders")
    .select("*")
    .order("due_at", { ascending: true });

  if (audienceRole) {
    query = query.eq("audience_role", audienceRole);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createDueReminders =
  async (): Promise<MedicalReminderRunResult> => {
    const window = getReminderWindow();
    const dueEvents = await listEventsInRange(window.start, window.end);
    const rows: MedicalEventReminderInsert[] = dueEvents.flatMap((event) =>
      REMINDER_ROLES.map((role) => ({
        audience_role: role,
        due_at: event.scheduled_at,
        medical_event_id: event.id,
      })),
    );

    if (rows.length > 0) {
      const { error } = await medicalScheduleDb
        .from("medical_event_reminders")
        .upsert(rows, {
          ignoreDuplicates: true,
          onConflict: "medical_event_id,audience_role",
        });

      if (error) {
        throw new Error(error.message);
      }

      await markRemindersSent(dueEvents.map((event) => event.id));
    }

    return {
      events: dueEvents.length,
      reminders: rows.length,
    };
  };

export const listEventsInRange = async (
  start: string,
  end: string,
): Promise<MedicalEventRow[]> => {
  const { data, error } = await medicalScheduleDb
    .from("medical_events")
    .select("*")
    .eq("status", "scheduled")
    .gte("scheduled_at", start)
    .lt("scheduled_at", end)
    .order("scheduled_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getBlockedPetIdsForWalkDate = async (
  walkDate: string | Date,
): Promise<Set<number>> => {
  const range = getUtcDayRange(walkDate);
  let events: MedicalEventRow[];

  try {
    events = await listEventsInRange(range.start, range.end);
  } catch (error) {
    if (error instanceof Error && isMissingMedicalTableError(error.message)) {
      return new Set();
    }

    throw error;
  }

  return new Set(events.map((event) => event.pet_id));
};

export const isPetBlockedForWalk = async (
  petId: number,
  walkDate: string,
): Promise<boolean> => {
  const blockedPetIds = await getBlockedPetIdsForWalkDate(walkDate);
  return blockedPetIds.has(petId);
};

const markRemindersSent = async (ids: number[]) => {
  if (ids.length === 0) {
    return;
  }

  const { error } = await medicalScheduleDb
    .from("medical_events")
    .update({
      reminder_sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .in("id", ids);

  if (error) {
    throw new Error(error.message);
  }
};
