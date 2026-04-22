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
    long_description:
      "Burek arrived at the shelter as a stray found wandering near a local park. Despite his rough start, he quickly won everyone over with his boundless enthusiasm and gentle nature. He is incredibly social and gets along well with other dogs and people of all ages. Burek loves outdoor activities — whether it's chasing a tennis ball, splashing through puddles, or going on long hikes. He already knows basic commands like sit, stay, and paw. He would thrive in an active household with a yard where he can burn off his energy every day.",
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
    long_description:
      "Mruczek was brought to the shelter as part of a litter found in a cardboard box. He is the quietest of his siblings and has always preferred a warm lap over rough play. He enjoys watching birds from the windowsill and will purr for hours when gently stroked. Mruczek is litter-trained, healthy, and up to date on all vaccinations. He would be a perfect companion for someone living in an apartment who wants a low-maintenance, affectionate friend to curl up with on the couch.",
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
    long_description:
      "Azor was surrendered by his previous owner who could no longer care for him due to a move abroad. He is a well-trained, calm, and deeply loyal dog who bonds strongly with his family. Azor is excellent with children — patient, protective, and playful in equal measure. He walks beautifully on a leash and is comfortable around other dogs. He is currently in quarantine as a precaution after a minor skin condition, but the vet expects a full recovery within a week. Azor deserves a stable, loving home where he can be the faithful companion he was born to be.",
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
    long_description:
      "Puszek is a gorgeous Persian with a luxuriously soft coat and the most expressive amber eyes. He was found as a stray but is clearly accustomed to indoor life — he took to the shelter environment immediately, seeking out the softest blanket and the warmest spot in every room. Puszek is gentle and easygoing, rarely startled by noise, and content to spend his days lounging and being pampered. He does require regular grooming to keep his coat in top condition. He would be ideal for a calm household that appreciates a regal, low-energy companion.",
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
    long_description:
      "Reksio is a senior gentleman with a heart of gold. He spent most of his life with an elderly owner who recently passed away. Despite his age, Reksio still enjoys short walks around the neighborhood and loves sniffing every bush along the way. He is house-trained, quiet, and incredibly well-mannered. Reksio gets along with cats and is perfectly happy to share his space. He does have mild arthritis, managed with a daily supplement provided by the shelter vet. All he asks for is a warm bed, regular meals, and a kind hand to pet him — he will repay it with unwavering devotion.",
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
    long_description:
      "Luna is a classic Siamese beauty with striking blue eyes and a personality to match. She is endlessly curious, always investigating new sounds and objects, and she is never shy about letting you know what she thinks — her vocal range is impressive. Luna thrives on interaction and will follow her person from room to room, offering commentary along the way. She is very intelligent and can even learn simple tricks with treat motivation. Luna would do best in a home where someone is around often, as she does not enjoy being left alone for long stretches.",
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
    long_description:
      "Max is a textbook Labrador — happy-go-lucky, food-motivated, and absolutely obsessed with water. He was surrendered by a family that moved to a small apartment and could no longer provide the space he needs. Max is fully trained, walks well on leash, and responds to voice commands. He loves fetch, swimming, and will happily join you for a jog or a hike. He is gentle with children and gets along with most other dogs. Max needs an active family with access to open spaces or water — give him that, and he will be your most enthusiastic adventure buddy for years to come.",
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
    long_description:
      "Kicia is a plush, round-faced British Shorthair with a temperament as soft as her coat. She was returned to the shelter after her previous adopter developed allergies. Kicia is unfazed by change — she adapted to the shelter within hours, calmly surveying her new surroundings before settling into her favorite napping spot. She is independent enough to entertain herself but affectionate enough to seek out a warm lap in the evening. Kicia is a wonderful companion for someone who appreciates a cat with a calm, dignified presence and a quiet but deep bond.",
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
    long_description:
      "Rocky is a muscular, athletic Boxer with a goofy personality that completely contradicts his tough appearance. He was found as a stray and had clearly been on his own for some time, but his trust in people was never broken. Rocky loves roughhousing, tug-of-war, and will do a full-body wiggle every time he sees someone he likes. He is strong on the leash and benefits from a confident handler. Rocky is best suited to a home without small children (simply because of his size and exuberance) but would thrive with an active owner or couple who can match his energy and give him the structure he needs.",
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
    long_description:
      "Mila is a stunning Maine Coon with tufted ears, a magnificent bushy tail, and an incredibly sweet disposition. She was surrendered when her owner relocated for work. Mila is social and dog-like in her affection — she greets visitors at the door, follows her person everywhere, and even enjoys gentle games of fetch with crinkle balls. Despite her large size, she is remarkably graceful. Mila gets along well with other cats and calm dogs. She does require regular brushing to prevent matting of her long coat. She would be a showstopping addition to any home that appreciates a big-hearted, big-bodied feline companion.",
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
