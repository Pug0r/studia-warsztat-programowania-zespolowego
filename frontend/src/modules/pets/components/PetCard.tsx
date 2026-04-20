import React from "react";
import type { Pet } from "../types/Pets";

type Props = {
  pet: any; // Na czas mocków
};

export const PetCard: React.FC<Props> = ({ pet }) => {
  return (
    <div className="hp-pet-card">
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
          {pet.size === "small"
            ? "Small"
            : pet.size === "medium"
              ? "Medium"
              : "Large"}
        </p>
      </div>

      <p className="hp-pet-card__desc">"{pet.description}"</p>

      {/* Używamy globalnej klasy przycisku z HomePage.css */}
      <button className="hp-btn hp-btn--primary" style={{ width: "100%" }}>
        Adopt {pet.name}
      </button>
    </div>
  );
};
