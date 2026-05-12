import React from "react";
import type { Pet } from "../types/Pets";
import { PetPhotoUpload } from "./PetPhotoUpload";

type Props = {
  pet: Pet;
  onPetClick: (petId: string | number) => void;
};

export const PetCard: React.FC<Props> = ({ pet, onPetClick }) => {
  const normalizedSize = pet.size?.toLowerCase();

  return (
    <div
      className="hp-pet-card"
      onClick={() => onPetClick(pet.id)}
      style={{ cursor: "pointer" }}
    >
      {pet.image_url ? (
        <img
          src={pet.image_url}
          alt={pet.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No photo
        </div>
      )}

      <div className="hp-pet-card__header">
        <div>
          <h2 className="hp-pet-card__title">{pet.name}</h2>
          <p className="hp-pet-card__subtitle">{pet.breed}</p>
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
            ? "Dog 🐶"
            : pet.species === "cat"
              ? "Cat 🐱"
              : pet.species}
        </span>
      </div>

      <div className="hp-pet-card__meta">
        <p>
          <strong>Age:</strong> {pet.age} year(s)
        </p>
        <p>
          <strong>Weight:</strong> {pet.weight} kg
        </p>
        <p>
          <strong>Size:</strong>{" "}
          {normalizedSize === "small"
            ? "Small"
            : normalizedSize === "medium"
              ? "Medium"
              : normalizedSize === "large"
                ? "Large"
                : "Unknown"}
        </p>
      </div>

      <p className="hp-pet-card__desc">"{pet.description}"</p>

      <button className="hp-btn hp-btn--primary" style={{ width: "100%" }}>
        Adopt {pet.name}
      </button>

      <PetPhotoUpload petId={pet.id} />
    </div>
  );
};
