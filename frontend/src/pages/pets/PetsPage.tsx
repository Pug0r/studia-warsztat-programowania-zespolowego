import type { Pet } from "@/modules/pets/types/Pets";
import { usePetList } from "@/modules/pets/hooks/usePetList";
import { PetCard } from "@/modules/pets/components/PetCard";
import { useState } from "react";
import "./PetsPage.css";

export const PetsPage: React.FC = () => {
  const { data, error, isPending } = usePetList();

  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [searchId, setSearchId] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [maxWeight, setMaxWeight] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");

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

  if (!data || data.length === 0) {
    return (
      <div className="p-6">
        <p>No pets found.</p>
      </div>
    );
  }

  const petsData = data || [];

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
    const matchesSize = selectedSize === "all" || pet.size === selectedSize;
    const matchesId =
      searchId === "" || String(pet.id).includes(searchId.trim());
    const matchesAge =
      maxAge === "" || pet.age === null || pet.age <= Number(maxAge);
    const matchesWeight =
      maxWeight === "" || pet.weight === null || pet.weight <= Number(maxWeight);

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
    <div className="shelter-public hp-pets-page">
      <h1 className="hp-pets-title">Find your friend!</h1>

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
          {filteredPets.map((pet: Pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
};
