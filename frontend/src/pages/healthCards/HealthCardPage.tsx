import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { usePet } from "@/modules/pets/hooks/usePet";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { HealthCardEntryList } from "@/modules/healthCards/components/HealthCardEntryList";
import { HealthCardEntryForm } from "@/modules/healthCards/components/HealthCardEntryForm";
import { useHealthCardEntries } from "@/modules/healthCards/hooks/useHealthCardEntries";
import {
  useCreateHealthCardEntry,
  useDeleteHealthCardEntry,
  useUpdateHealthCardEntry,
} from "@/modules/healthCards/hooks/useHealthCardMutations";
import type {
  HealthCardEntry,
  HealthCardEntryPayload,
} from "@/modules/healthCards/types/HealthCard";
import "@/modules/healthCards/components/healthCards.css";

type FormState =
  | { mode: "idle" }
  | { mode: "create" }
  | { mode: "edit"; entry: HealthCardEntry };

export function HealthCardPage() {
  const params = useParams<{ petId: string }>();
  const petId = Number(params.petId);
  const isValidPetId = Number.isInteger(petId) && petId > 0;

  const { session } = useAuth();
  const isVet = session?.user?.user_metadata?.role === "vet";

  const pet = usePet(petId, { enabled: isValidPetId });
  const entries = useHealthCardEntries(petId, { enabled: isValidPetId });

  const createEntry = useCreateHealthCardEntry(petId);
  const updateEntry = useUpdateHealthCardEntry(petId);
  const deleteEntry = useDeleteHealthCardEntry(petId);

  const [form, setForm] = useState<FormState>({ mode: "idle" });
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleDelete = (entry: HealthCardEntry) => {
    const confirmed = window.confirm(
      `Delete this entry "${entry.title}"? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }
    deleteEntry.mutate(entry.id, {
      onSuccess: () => {
        if (form.mode === "edit" && form.entry.id === entry.id) {
          setForm({ mode: "idle" });
        }
      },
    });
  };

  const handleSubmit = (payload: HealthCardEntryPayload) => {
    setSaveError(null);
    if (form.mode === "edit") {
      updateEntry.mutate(
        { entryId: form.entry.id, payload },
        {
          onSuccess: () => setForm({ mode: "idle" }),
          onError: (err) => setSaveError(err.message),
        },
      );
    } else {
      createEntry.mutate(payload, {
        onSuccess: () => setForm({ mode: "idle" }),
        onError: (err) => setSaveError(err.message),
      });
    }
  };

  if (!isValidPetId) {
    return (
      <main className="hc-page-wrap grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <section className="p-5 lg:p-8">
          <p className="hc-banner hc-banner--error">Invalid animal ID.</p>
          <Link to="/health-cards" className="hp-btn hp-btn--secondary">
            Back to list
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="hc-page-wrap grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="space-y-2">
          <Badge>Health card</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {pet.data?.name ?? "Patient"}
          </h1>
          <Link
            to="/health-cards"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to patients list
          </Link>
        </header>

        {pet.isPending && <p className="hc-empty">Loading animal data…</p>}
        {pet.error && (
          <div className="hc-banner hc-banner--error">
            Failed to load animal data: {pet.error.message}
          </div>
        )}

        {pet.data && (
          <section className="hc-section">
            <div className="hc-pet-summary">
              {pet.data.image_url ? (
                <img
                  src={pet.data.image_url}
                  alt={pet.data.name}
                  className="hc-pet-summary__img"
                />
              ) : (
                <div className="hc-pet-summary__placeholder">no photo</div>
              )}
              <div>
                <h2 className="hc-pet-summary__name">{pet.data.name}</h2>
                <p className="hc-pet-summary__meta">
                  {pet.data.species === "dog"
                    ? "Dog"
                    : pet.data.species === "cat"
                      ? "Cat"
                      : pet.data.species}
                  {pet.data.breed ? ` • ${pet.data.breed}` : ""}
                  {pet.data.age ? ` • ${pet.data.age} years` : ""}
                  {pet.data.weight ? ` • ${pet.data.weight} kg` : ""}
                </p>
                <p className="hc-pet-summary__meta">id: {pet.data.id}</p>
              </div>
            </div>
          </section>
        )}

        <section className="hc-section">
          <div className="hc-page__header">
            <h2 className="hc-section__title">Entry history</h2>
            {isVet && form.mode === "idle" && (
              <button
                type="button"
                className="hp-btn hp-btn--primary"
                onClick={() => {
                  setSaveError(null);
                  setForm({ mode: "create" });
                }}
              >
                Add entry
              </button>
            )}
          </div>

          {form.mode !== "idle" && (
            <div className="hc-section">
              {saveError && (
                <p className="hc-form__error">{saveError}</p>
              )}
              <HealthCardEntryForm
                entry={form.mode === "edit" ? form.entry : undefined}
                isSaving={createEntry.isPending || updateEntry.isPending}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setSaveError(null);
                  setForm({ mode: "idle" });
                }}
              />
            </div>
          )}

          {entries.isPending && <p className="hc-empty">Loading entries…</p>}

          {entries.error && (
            <div className="hc-banner hc-banner--error">
              {entries.error.message}
            </div>
          )}

          {entries.data && (
            <HealthCardEntryList
              entries={entries.data}
              onEdit={
                isVet
                  ? (entry) => {
                      setSaveError(null);
                      setForm({ mode: "edit", entry });
                    }
                  : undefined
              }
              onDelete={isVet ? handleDelete : undefined}
            />
          )}
        </section>
      </section>
    </main>
  );
}
