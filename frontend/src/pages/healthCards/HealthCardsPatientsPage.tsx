import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { usePetList } from "@/modules/pets/hooks/usePetList";
import type { Pet } from "@/modules/pets/types/Pets";
import { PatientCard } from "@/modules/healthCards/components/PatientCard";
import "@/modules/healthCards/components/healthCards.css";
import "@/pages/pets/PetsPage.css";

export function HealthCardsPatientsPage() {
  const { data, error, isPending } = usePetList();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo<Pet[]>(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return data ?? [];
    return (data ?? []).filter((pet) => {
      const name = (pet.name ?? "").toLowerCase();
      const breed = (pet.breed ?? "").toLowerCase();
      const id = String(pet.id);
      return (
        name.includes(normalized) ||
        breed.includes(normalized) ||
        id.includes(normalized)
      );
    });
  }, [data, search]);

  return (
    <main className="hc-page-wrap grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="space-y-2">
          <Badge>Health cards</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Patients
          </h1>
          <p className="text-sm text-slate-600">
            Select an animal to browse its digital health card: treatment
            history, administered medications and past illnesses.
          </p>
        </header>

        <div className="hc-search">
          <input
            type="search"
            className="hp-input"
            placeholder="Search by name, breed or ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {isPending && <p className="hc-empty">Loading patients…</p>}

        {error && (
          <div className="hc-banner hc-banner--error">
            Failed to load patients: {error.message}
          </div>
        )}

        {!isPending && !error && filtered.length === 0 && (
          <p className="hc-empty">No patients match your search.</p>
        )}

        {!isPending && !error && filtered.length > 0 && (
          <div className="hc-patient-grid">
            {filtered.map((pet) => (
              <PatientCard
                key={pet.id}
                pet={pet}
                onOpen={(petId) => navigate(`/health-cards/${petId}`)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
