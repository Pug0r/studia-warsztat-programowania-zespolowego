import { useState } from "react";
import type { Pet } from "@/modules/pets/types/Pets";
// import { usePetList } from "@/modules/pets/hooks/usePetList"; // <-- Czeka na bazę danych
import { PetCard } from "@/modules/pets/components/PetCard";
import { PetDetailModal } from "@/modules/pets/components/PetDetailModal";
import "./PetsPage.css";

// 1. IDEALNIE SKROJONE SZTUCZNE DANE
const MOCK_PETS = [
  {
    id: "1",
    name: "Burek",
    species: "dog",
    breed: "Mixed breed",
    size: "large",
    age: 3,
    weight: 25,
    description:
      "A big, friendly dog full of energy. Loves running after a ball.",
    photo_url:
      "https://images.unsplash.com/photo-1633722715463-d30628519b4e?w=400",
    status: "available",
  },
  {
    id: "2",
    name: "Mruczek",
    species: "cat",
    breed: "Domestic Shorthair",
    size: "small",
    age: 1,
    weight: 3,
    description: "A small and calm kitten who loves sleeping in warm places.",
    photo_url:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
    status: "available",
  },
  {
    id: "3",
    name: "Azor",
    species: "dog",
    breed: "German Shepherd Mix",
    size: "medium",
    age: 5,
    weight: 15,
    description: "A loyal companion who gets along great with children.",
    photo_url:
      "https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400",
    status: "quarantine",
  },
  {
    id: "4",
    name: "Puszek",
    species: "cat",
    breed: "Persian Cat",
    size: "medium",
    age: 2,
    weight: 5,
    description: "A fluffy cat that enjoys cuddles and relaxing naps.",
    photo_url:
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400",
    status: "available",
  },
  {
    id: "5",
    name: "Reksio",
    species: "dog",
    breed: "Jack Russell Terrier",
    size: "small",
    age: 10,
    weight: 8,
    description: "An older, very wise dog looking for a calm and loving home.",
    photo_url:
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400",
    status: "available",
  },
  {
    id: "6",
    name: "Luna",
    species: "cat",
    breed: "Siamese",
    size: "small",
    age: 2,
    weight: 4,
    description: "A curious and talkative cat who loves human attention.",
    photo_url:
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400",
    status: "available",
  },
  {
    id: "7",
    name: "Max",
    species: "dog",
    breed: "Labrador Retriever",
    size: "large",
    age: 4,
    weight: 30,
    description:
      "A friendly and playful dog who enjoys long walks and swimming.",
    photo_url:
      "https://images.unsplash.com/photo-1633722715463-d30628519b4e?w=400",
    status: "available",
  },
  {
    id: "8",
    name: "Kicia",
    species: "cat",
    breed: "British Shorthair",
    size: "medium",
    age: 3,
    weight: 6,
    description:
      "A calm and gentle cat that enjoys quiet evenings with people.",
    photo_url:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
    status: "available",
  },
  {
    id: "9",
    name: "Rocky",
    species: "dog",
    breed: "Boxer",
    size: "large",
    age: 6,
    weight: 28,
    description:
      "A strong but very affectionate dog who loves playing outside.",
    photo_url:
      "https://images.unsplash.com/photo-1633722715463-d30628519b4e?w=400",
    status: "available",
  },
  {
    id: "10",
    name: "Mila",
    species: "cat",
    breed: "Maine Coon",
    size: "large",
    age: 4,
    weight: 7,
    description: "A large, majestic cat with a very friendly personality.",
    photo_url:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
    status: "available",
  },
];

export const PetsPage: React.FC = () => {
  // State for filters
  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [searchId, setSearchId] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [maxWeight, setMaxWeight] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");

  // State for detail modal
  const [selectedPetId, setSelectedPetId] = useState<string | number | null>(
    null,
  );

  const clearAllFilters = () => {
    setSelectedSpecies("all");
    setSelectedSize("all");
    setSearchId("");
    setMaxAge("");
    setMaxWeight("");
    setSearchName("");
  };

  const data = MOCK_PETS; // Na razie używamy mocków (usuń gdy będzie baza danych)

  const filteredPets = data.filter((pet) => {
    const matchesSpecies =
      selectedSpecies === "all" || pet.species === selectedSpecies;
    const matchesSize = selectedSize === "all" || pet.size === selectedSize;
    const matchesId = searchId === "" || pet.id.includes(searchId.trim());
    const matchesAge = maxAge === "" || pet.age <= Number(maxAge);
    const matchesWeight = maxWeight === "" || pet.weight <= Number(maxWeight);
    const matchesSearch =
      searchName.trim() === "" ||
      pet.name.toLowerCase().includes(searchName.trim().toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchName.trim().toLowerCase());

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
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onPetClick={setSelectedPetId} />
          ))}
        </div>
      )}

      {/* Detail Modal - shown when a pet is clicked */}
      {selectedPetId !== null && (
        <PetDetailModal
          petId={Number(selectedPetId)}
          isOpen={selectedPetId !== null}
          onClose={() => setSelectedPetId(null)}
          mockPet={MOCK_PETS.find((p) => p.id === selectedPetId)}
        />
      )}
    </div>
  );
};
