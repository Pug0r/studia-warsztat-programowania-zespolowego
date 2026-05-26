import { Link, useParams } from "react-router-dom";

import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { usePet } from "@/modules/pets/hooks/usePet";
import { HealthCardEntryList } from "@/modules/healthCards/components/HealthCardEntryList";
import { useHealthCardEntries } from "@/modules/healthCards/hooks/useHealthCardEntries";
import "@/modules/healthCards/components/healthCards.css";

export function HealthCardPage() {
  const params = useParams<{ petId: string }>();
  const petId = Number(params.petId);
  const isValidPetId = Number.isInteger(petId) && petId > 0;

  const pet = usePet(petId, { enabled: isValidPetId });
  const entries = useHealthCardEntries(petId, { enabled: isValidPetId });

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
      </section>
    </main>
  );
}
