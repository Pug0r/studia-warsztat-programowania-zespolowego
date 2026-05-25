import { supabase } from "#config/supabaseClient.js";
import type { HealthCardEntryRow } from "./healthCards.types.js";

// The `health_card_entries` table is not yet in the generated Database types
// from @repo/types, so we use an untyped reference to the table. Types are
// enforced manually via the row type defined in healthCards.types.ts.
const table = () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any).from("health_card_entries");

export const listByPet = async (
  petId: number,
): Promise<HealthCardEntryRow[]> => {
  const { data, error } = await table()
    .select("*")
    .eq("pet_id", petId)
    .order("treatment_date", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as HealthCardEntryRow[];
};
