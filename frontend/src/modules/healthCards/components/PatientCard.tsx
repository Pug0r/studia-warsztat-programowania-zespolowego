import type { Pet } from "@/modules/pets/types/Pets";

type Props = {
  pet: Pet;
  onOpen: (petId: number) => void;
};

export const PatientCard = ({ pet, onOpen }: Props) => {
  return (
    <div
      className="hp-pet-card hc-patient-card"
      onClick={() => onOpen(pet.id)}
      style={{ cursor: "pointer" }}
    >
      {pet.image_url ? (
        <img
          src={pet.image_url}
          alt={pet.name}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No photo
        </div>
      )}

      <div className="hp-pet-card__header">
        <div>
          <h2 className="hp-pet-card__title">{pet.name}</h2>
          <p className="hp-pet-card__subtitle">{pet.breed ?? "—"}</p>
          <p className="hp-pet-card__subtitle" style={{ fontSize: "0.7rem" }}>
            id: {pet.id}
          </p>
        </div>
        <span
          className={
            pet.species === "dog"
              ? "hp-badge hp-badge--info"
              : "hp-badge hp-badge--success"
          }
        >
          {pet.species === "dog"
            ? "Dog"
            : pet.species === "cat"
              ? "Cat"
              : pet.species}
        </span>
      </div>

      <button
        type="button"
        className="hp-btn hp-btn--primary"
        style={{ width: "100%" }}
        onClick={(event) => {
          event.stopPropagation();
          onOpen(pet.id);
        }}
      >
        Open health card
      </button>
    </div>
  );
};
