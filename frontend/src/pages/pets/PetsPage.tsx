import type { Pet } from "@/modules/pets/types/Pets";
// import { usePetList } from "@/modules/pets/hooks/usePetList"; // <-- Czeka na bazę danych
import { PetCard } from "@/modules/pets/components/PetCard";
import { useState } from "react";
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
  },
];

export const PetsPage: React.FC = () => {
  // const { data, error, isPending } = usePetList(); // <-- Czeka na bazę danych

  // if (isPending) {
  //   return (
  //     <div className="p-6">
  //       <p>Loading pets...</p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="p-6 text-red-500">
  //       <p>Something went wrong while fetching pets.</p>
  //     </div>
  //   );
  // }

  // if (!data || data.length === 0) {
  //   return (
  //     <div className="p-6">
  //       <p>No pets found.</p>
  //     </div>
  //   );
  // }

  const data = MOCK_PETS; // Na razie używamy mocków (usuń gdy będzie baza danych)

  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [searchId, setSearchId] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [maxWeight, setMaxWeight] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");

  const clearAllFilters = () => {
    setSelectedSpecies("all");
    setSelectedSize("all");
    setSearchId("");
    setMaxAge("");
    setMaxWeight("");
    setSearchName("");
  };

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
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
};