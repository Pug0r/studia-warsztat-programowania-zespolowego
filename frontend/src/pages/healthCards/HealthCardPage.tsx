import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import type { MedicalEventType } from "@repo/types";

import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { usePet } from "@/modules/pets/hooks/usePet";
import { HealthCardEntryList } from "@/modules/healthCards/components/HealthCardEntryList";
import { useHealthCardEntries } from "@/modules/healthCards/hooks/useHealthCardEntries";
import {
  formatMedicalEventDate,
  MEDICAL_EVENT_TYPE_LABELS,
} from "@/modules/medicalSchedule/format";
import { useMedicalEvents } from "@/modules/medicalSchedule/hooks";
import "@/modules/healthCards/components/healthCards.css";

export function HealthCardPage() {
  const params = useParams<{ petId: string }>();
  const petId = Number(params.petId);
  const isValidPetId = Number.isInteger(petId) && petId > 0;

  const pet = usePet(petId, { enabled: isValidPetId });
  const entries = useHealthCardEntries(petId, { enabled: isValidPetId });
  const medicalEvents = useMedicalEvents();
  const [filterType, setFilterType] = useState<MedicalEventType | "">("");
  const [includeScheduled, setIncludeScheduled] = useState(false);

  const petMedicalEvents = useMemo(
    () => (medicalEvents.data ?? []).filter((event) => event.pet_id === petId),
    [medicalEvents.data, petId],
  );

  const historyEvents = includeScheduled
    ? petMedicalEvents
    : petMedicalEvents.filter((event) => event.status === "completed");

  const filteredHistoryEvents =
    filterType === ""
      ? historyEvents
      : historyEvents.filter((event) => event.type === filterType);

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
          <h2 className="hc-section__title">Entry history</h2>

          {entries.isPending && <p className="hc-empty">Loading entries…</p>}

          {entries.error && (
            <div className="hc-banner hc-banner--error">
              {entries.error.message}
            </div>
          )}

          {entries.data && <HealthCardEntryList entries={entries.data} />}
        </section>

        <section className="space-y-4">
          <div className="rounded-md border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-4">
              <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="font-semibold text-slate-900">
                    Medical procedures
                  </h2>
                  <label className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-slate-700">Filter:</span>
                    <select
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm"
                      value={filterType}
                      onChange={(event) =>
                        setFilterType(
                          event.target.value as MedicalEventType | "",
                        )
                      }
                    >
                      <option value="">All treatments</option>
                      {Object.entries(MEDICAL_EVENT_TYPE_LABELS).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeScheduled}
                    onChange={(event) =>
                      setIncludeScheduled(event.target.checked)
                    }
                    className="rounded border border-slate-300 cursor-pointer"
                  />
                  <span className="font-medium text-slate-700">
                    Include scheduled procedures
                  </span>
                </label>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {medicalEvents.isPending && (
                <p className="p-4 text-sm text-slate-600">
                  Loading procedures...
                </p>
              )}
              {medicalEvents.error && (
                <p className="p-4 text-sm text-red-600">
                  {medicalEvents.error.message}
                </p>
              )}
              {filteredHistoryEvents.length === 0 &&
                !medicalEvents.isPending && (
                  <p className="p-4 text-sm text-slate-600">
                    {petMedicalEvents.length === 0
                      ? "No medical procedures recorded."
                      : "No procedures match the selected filter."}
                  </p>
                )}
              {filteredHistoryEvents.map((event) => (
                <article
                  key={event.id}
                  className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">
                        {event.title}
                      </p>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          event.status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : event.status === "scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {MEDICAL_EVENT_TYPE_LABELS[event.type]}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatMedicalEventDate(event.scheduled_at)}
                    </p>
                    {event.notes && (
                      <p className="mt-2 text-sm text-slate-500">
                        {event.notes}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
