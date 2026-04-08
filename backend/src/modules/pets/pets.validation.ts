import type { PetInsert } from "@repo/types";

export type CreatePetDTO = Pick<
  PetInsert,
  "name" | "age" | "weight" | "description"
>;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isPositiveNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

export const validateCreatePetPayload = (payload: unknown): CreatePetDTO => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const { age, description, name, weight } = payload as Record<string, unknown>;

  if (!isNonEmptyString(name)) {
    throw new Error("Field 'name' is required and must be a non-empty string.");
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
    weight,
  };
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
