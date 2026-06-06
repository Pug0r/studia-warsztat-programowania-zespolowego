import { supabase } from "@/lib/supabaseClient";
import type {
  CreateMedicalEventDTO,
  MedicalEventReminderRow,
  MedicalEventRow,
  MedicalReminderRunResult,
  UpdateMedicalEventDTO,
} from "@repo/types";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  if (!supabase) {
    throw new Error("Supabase client is not initialized");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error("You must be signed in.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const readError = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  try {
    const data = await response.json();
    if (typeof data?.error === "string") {
      return data.error;
    }
  } catch {
    // no JSON body
  }

  return `${fallback} (${response.status})`;
};

export const listMedicalEvents = async (): Promise<MedicalEventRow[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/medical-schedule", { headers });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to load events"));
  }

  return response.json();
};

export const listUpcomingMedicalEvents = async (
  days?: number,
): Promise<MedicalEventRow[]> => {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams();
  if (days !== undefined) {
    params.set("days", String(days));
  }
  const query = params.toString();
  const response = await fetch(
    `/api/medical-schedule/upcoming${query ? `?${query}` : ""}`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(
      await readError(response, "Failed to load upcoming events"),
    );
  }

  return response.json();
};

export const createMedicalEvent = async (
  payload: CreateMedicalEventDTO,
): Promise<MedicalEventRow> => {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/medical-schedule", {
    body: JSON.stringify(payload),
    headers,
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to create event"));
  }

  return response.json();
};

export const updateMedicalEvent = async (
  id: number,
  payload: UpdateMedicalEventDTO,
): Promise<MedicalEventRow> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/medical-schedule/${id}`, {
    body: JSON.stringify(payload),
    headers,
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to update event"));
  }

  return response.json();
};

export const cancelMedicalEvent = async (
  id: number,
): Promise<MedicalEventRow> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/medical-schedule/${id}`, {
    headers,
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to cancel event"));
  }

  return response.json();
};

export const listMedicalReminders = async (): Promise<
  MedicalEventReminderRow[]
> => {
  const headers = await getAuthHeaders();
  const response = await fetch("/api/medical-schedule/reminders", { headers });

  if (!response.ok) {
    throw new Error(await readError(response, "Failed to load reminders"));
  }

  return response.json();
};

export const runMedicalReminders =
  async (): Promise<MedicalReminderRunResult> => {
    const headers = await getAuthHeaders();
    const response = await fetch("/api/medical-schedule/reminders/run", {
      headers,
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(await readError(response, "Failed to run reminders"));
    }

    return response.json();
  };
