import type { PetInsert, PetUpdate } from "@repo/types";

export type CreatePetDTO = Pick<
  PetInsert,
  "age" | "description" | "name" | "species" | "weight"
>;

export type UpdatePetDTO = Pick<
  PetUpdate,
  "age" | "description" | "name" | "species" | "weight"
>;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isPositiveNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

export const validateCreatePetPayload = (payload: unknown): CreatePetDTO => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const { age, description, name, species, weight } = payload as Record<
    string,
    unknown
  >;

  if (!isNonEmptyString(name)) {
    throw new Error("Field 'name' is required and must be a non-empty string.");
  }

  if (!isNonEmptyString(species)) {
    throw new Error(
      "Field 'species' is required and must be a non-empty string.",
    );
  }

  if (!isPositiveNumber(age)) {
    throw new Error("Field 'age' is required and must be a positive number.");
  }

  if (!isPositiveNumber(weight)) {
    throw new Error(
      "Field 'weight' is required and must be a positive number.",
    );
  }

  if (!isNonEmptyString(description)) {
    throw new Error(
      "Field 'description' is required and must be a non-empty string.",
    );
  }

  return {
    age,
    description: description.trim(),
    name: name.trim(),
    species: species.trim(),
    weight,
  };
};

export const validateUpdatePetPayload = (payload: unknown): UpdatePetDTO => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const { age, description, name, species, weight } = payload as Record<
    string,
    unknown
  >;

  const dto: UpdatePetDTO = {};

  if (name !== undefined) {
    if (!isNonEmptyString(name)) {
      throw new Error("Field 'name' must be a non-empty string.");
    }
    dto.name = name.trim();
  }

  if (species !== undefined) {
    if (!isNonEmptyString(species)) {
      throw new Error("Field 'species' must be a non-empty string.");
    }
    dto.species = species.trim();
  }

  if (age !== undefined) {
    if (!isPositiveNumber(age)) {
      throw new Error("Field 'age' must be a positive number.");
    }
    dto.age = age;
  }

  if (weight !== undefined) {
    if (!isPositiveNumber(weight)) {
      throw new Error("Field 'weight' must be a positive number.");
    }
    dto.weight = weight;
  }

  if (description !== undefined) {
    if (!isNonEmptyString(description)) {
      throw new Error("Field 'description' must be a non-empty string.");
    }
    dto.description = description.trim();
  }

  if (Object.keys(dto).length === 0) {
    throw new Error("At least one field must be provided for update.");
  }

  return dto;
};

export const validatePetId = (id: unknown): number => {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Parameter 'id' is required.");
  }

  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error("Parameter 'id' must be a positive integer.");
  }

  return n;
};
