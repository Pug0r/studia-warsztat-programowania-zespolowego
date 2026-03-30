export interface CreatePetDTO {
  name: string;
  age: number;
  weight: number;
  description: string;
}

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
    throw new Error("Field 'weight' is required and must be a positive number.");
  }

  if (!isNonEmptyString(description)) {
    throw new Error(
      "Field 'description' is required and must be a non-empty string."
    );
  }

  return {
    age,
    description: description.trim(),
    name: name.trim(),
    weight,
  };
};

export const validatePetId = (id: unknown): string => {
  if (!isNonEmptyString(id)) {
    throw new Error("Parameter 'id' is required.");
  }

  return id.trim();
};
