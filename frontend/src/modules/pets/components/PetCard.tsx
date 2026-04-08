import React from "react";
import type { Pet } from "../types/Pets";

type Props = {
  pet: Pet;
};

export const PetCard: React.FC<Props> = ({ pet }) => {
  return (
    <div className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
      <h2 className="text-lg font-semibold mb-2">{pet.name}</h2>

      <div className="text-sm text-gray-600 space-y-1">
        <p>Age: {pet.age} years</p>
        <p>Weight: {pet.weight} kg</p>
      </div>

      <p className="mt-3 text-sm text-gray-700">{pet.description}</p>
    </div>
  );
};
