import { supabase } from "@/lib/supabaseClient";
import type { HealthCardEntry } from "../types/HealthCard";

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
  return { Authorization: `Bearer ${token}` };
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

export const listHealthCardEntries = async (
  petId: number,
): Promise<HealthCardEntry[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`/api/health-cards/pets/${petId}/entries`, {
    headers,
  });
  if (!response.ok) {
    throw new Error(await readError(response, "Failed to load health card"));
  }
  return response.json();
};
