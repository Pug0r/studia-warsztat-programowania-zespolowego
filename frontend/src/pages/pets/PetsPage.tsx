import type { Pet } from "@/modules/pets/types/Pets";
import { usePetList } from "@/modules/pets/hooks/usePetList";
import { PetCard } from "@/modules/pets/components/PetCard";

const PetsPage: React.FC = () => {
  const { data, error, isPending } = usePetList();

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Pets</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((pet: Pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
};

export default PetsPage;
