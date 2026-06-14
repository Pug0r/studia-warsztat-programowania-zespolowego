import type {
  CreatePetPayload,
  Pet,
  UpdatePetPayload,
} from "@/modules/pets/types/Pets";
import { usePetList } from "@/modules/pets/hooks/usePetList"; // <-- Czeka na bazę danych
import {
  useCreatePet,
  useDeletePet,
  useUpdatePet,
} from "@/modules/pets/hooks/usePetMutations";
import { PetCard } from "@/modules/pets/components/PetCard";
import { PetForm } from "@/modules/pets/components/PetForm";
import { useState } from "react";
import { PetDetailModal } from "@/modules/pets/components/PetDetailModal";
import { useUserProfile } from "@/modules/auth/hooks/useUserProfile";
import { showToast } from "@/lib/toast";
import "./PetsPage.css";
import Sidebar from "@/components/Sidebar";

type FormMode =
  | { kind: "idle" }
  | { kind: "create" }
  | { kind: "edit"; pet: Pet };

export const PetsPage: React.FC = () => {
  const { data, error, isPending } = usePetList();
  const { role } = useUserProfile();
  const isAdmin = role === "admin";

  const createPet = useCreatePet();
  const updatePet = useUpdatePet();
  const deletePet = useDeletePet();

  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [searchId, setSearchId] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [maxWeight, setMaxWeight] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");

  const [formMode, setFormMode] = useState<FormMode>({ kind: "idle" });

  const [selectedPetId, setSelectedPetId] = useState<string | number | null>(
    null,
  );

  if (error) {
    console.error("BŁĄD Z SUPABASE:", error);
  }

  if (isPending) {
    return (
      <div className="p-6">
        <p>Loading pets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>Something went wrong while fetching pets.</p>
      </div>
    );
  }

  const petsData = data ?? [];

  const handleCreate = (payload: CreatePetPayload | UpdatePetPayload) => {
    createPet.mutate(payload as CreatePetPayload, {
      onSuccess: () => {
        showToast("Pet added.", "success");
        setFormMode({ kind: "idle" });
      },
      onError: () => showToast("Failed to add pet.", "error"),
    });
  };

  const handleUpdate = (
    id: number,
    payload: CreatePetPayload | UpdatePetPayload,
  ) => {
    updatePet.mutate(
      { id, payload },
      {
        onSuccess: () => {
          showToast("Pet updated.", "success");
          setFormMode({ kind: "idle" });
        },
        onError: () => showToast("Failed to update pet.", "error"),
      },
    );
  };

  const handleDelete = (pet: Pet) => {
    const confirmed = window.confirm(
      `Delete ${pet.name}? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }
    deletePet.mutate(pet.id, {
      onSuccess: () => showToast("Pet removed.", "success"),
      onError: () => showToast("Failed to delete pet.", "error"),
    });
  };

  const clearAllFilters = () => {
    setSelectedSpecies("all");
    setSelectedSize("all");
    setSearchId("");
    setMaxAge("");
    setMaxWeight("");
    setSearchName("");
  };

  const filteredPets = petsData.filter((pet: Pet) => {
    const matchesSpecies =
      selectedSpecies === "all" || pet.species === selectedSpecies;
    const matchesSize =
      selectedSize === "all" || pet.size?.toLowerCase() === selectedSize;
    const matchesId =
      searchId === "" || String(pet.id).includes(searchId.trim());
    const matchesAge =
      maxAge === "" || pet.age === null || pet.age <= Number(maxAge);
    const matchesWeight =
      maxWeight === "" ||
      pet.weight === null ||
      pet.weight <= Number(maxWeight);

    const name = pet.name || "";
    const breed = pet.breed || "";
    const matchesSearch =
      searchName.trim() === "" ||
      name.toLowerCase().includes(searchName.trim().toLowerCase()) ||
      breed.toLowerCase().includes(searchName.trim().toLowerCase());

    return (
      matchesSpecies &&
      matchesSize &&
      matchesId &&
      matchesAge &&
      matchesWeight &&
      matchesSearch
    );
  });

  return (
    // 'shelter-public' aktywuje globalne zmienne z HomePage.css
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="shelter-public hp-pets-page ">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Find your friend!
            </h1>
            <p className="text-sm font-semibold text-slate-600">
              It's the best place to find one!
            </p>
          </div>
          {isAdmin && formMode.kind === "idle" && (
            <button
              type="button"
              className="hp-btn hp-btn--primary"
              onClick={() => setFormMode({ kind: "create" })}
            >
              Add pet
            </button>
          )}
        </div>

        {isAdmin && formMode.kind !== "idle" && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              {formMode.kind === "create"
                ? "New pet"
                : `Edit ${formMode.pet.name}`}
            </h2>
            <PetForm
              pet={formMode.kind === "edit" ? formMode.pet : undefined}
              onSubmit={(payload) => {
                if (formMode.kind === "create") {
                  handleCreate(payload);
                } else {
                  handleUpdate(formMode.pet.id, payload);
                }
              }}
              onCancel={() => setFormMode({ kind: "idle" })}
              isSubmitting={createPet.isPending || updatePet.isPending}
            />
          </div>
        )}

        <div className="hp-filters">
          <div className="hp-filter-group">
            <label htmlFor="species">Species:</label>
            <select
              id="species"
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="hp-input"
            >
              <option value="all">All</option>
              <option value="dog">Dogs</option>
              <option value="cat">Cats</option>
            </select>
          </div>

          <div className="hp-filter-group">
            <label htmlFor="size">Size:</label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="hp-input"
            >
              <option value="all">All</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="hp-filter-group">
            <label>Age (max):</label>
            <input
              type="number"
              placeholder="years"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              className="hp-input"
            />
          </div>

          <div className="hp-filter-group">
            <label>Weight (max kg):</label>
            <input
              type="number"
              placeholder="kg"
              value={maxWeight}
              onChange={(e) => setMaxWeight(e.target.value)}
              className="hp-input"
            />
          </div>

          <div className="hp-filter-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Name or breed"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="hp-input"
            />
          </div>

          <div className="hp-filter-group">
            <label>Animal ID:</label>
            <input
              type="text"
              placeholder="id"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="hp-input"
            />
          </div>
        </div>

        {filteredPets.length === 0 ? (
          <div className="hp-empty-state">
            <p>Sorry, we don't have pets matching these criteria.</p>
            <button onClick={clearAllFilters} className="hp-btn-clear">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="hp-pets-grid">
            {filteredPets.map((pet) => (
              <div key={pet.id}>
                <PetCard pet={pet} onPetClick={setSelectedPetId} />
                {isAdmin && (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className="hp-btn hp-btn--secondary flex-1"
                      onClick={() => setFormMode({ kind: "edit", pet })}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="hp-btn hp-btn--secondary flex-1"
                      onClick={() => handleDelete(pet)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal - ukazuje się po kliknięciu na kartę */}
        {selectedPetId !== null && (
          <PetDetailModal
            petId={Number(selectedPetId)}
            initialData={petsData.find((p) => p.id === selectedPetId)}
            isOpen={selectedPetId !== null}
            onClose={() => setSelectedPetId(null)}
          />
        )}
      </section>
    </main>
  );
};
