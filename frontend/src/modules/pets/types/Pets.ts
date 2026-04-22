export type { Pet } from "@repo/types";

export type CreatePetPayload = {
  name: string;
  species: string;
  age: number;
  weight: number;
  description: string;
};

export type UpdatePetPayload = Partial<CreatePetPayload>;
