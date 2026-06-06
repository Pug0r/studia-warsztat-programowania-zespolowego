export type { Pet } from "@repo/types";

export type CreatePetPayload = {
  name: string;
  species: string;
  age: number;
  weight: number;
  description: string;
  breed?: string | null;
  size?: string | null;
};

export type UpdatePetPayload = Partial<CreatePetPayload>;
