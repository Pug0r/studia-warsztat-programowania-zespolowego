import type { CreatePetWalkDTO, PetInsert } from "@repo/types";

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

export const validateSize = (size: unknown): string | undefined => {
  if (size === undefined || size === null) return undefined;
  if (typeof size !== "string") throw new Error("Size must be a string.");
  const allowedSizes = ["small", "medium", "large"];
  if (!allowedSizes.includes(size)) throw new Error(`Invalid size: ${size}`);
  return size;
};

const isValidDateString = (value: unknown): value is string => {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
};

export const validateCreatePetWalkPayload = (
  payload: unknown,
): CreatePetWalkDTO => {
  if (payload == null) {
    return {};
  }

  if (typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const { notes, walked_at, walker_id, duration_minutes } = payload as Record<
    string,
    unknown
  >;
  const walkPayload: CreatePetWalkDTO = {};

  if (notes !== undefined) {
    if (typeof notes !== "string") {
      throw new Error("Field 'notes' must be a string when provided.");
    }

    const trimmedNotes = notes.trim();
    if (trimmedNotes) {
      walkPayload.notes = trimmedNotes;
    }
  }

  if (walked_at !== undefined) {
    if (!isValidDateString(walked_at)) {
      throw new Error("Field 'walked_at' must be a valid date string.");
    }

    walkPayload.walked_at = new Date(walked_at).toISOString();
  }

  if (walker_id !== undefined) {
    if (typeof walker_id !== "string" || !walker_id.trim()) {
      throw new Error("Field 'walker_id' must be a non-empty string.");
    }

    walkPayload.walker_id = walker_id.trim();
  }

  // Handle duration_minutes and calculate end_at
  if (duration_minutes !== undefined) {
    const validDurations = [30, 60, 90, 120];
    if (
      typeof duration_minutes !== "number" ||
      !validDurations.includes(duration_minutes)
    ) {
      throw new Error(
        `Field 'duration_minutes' must be one of: ${validDurations.join(", ")}`,
      );
    }

    if (walkPayload.walked_at) {
      const startTime = new Date(walkPayload.walked_at);
      const endTime = new Date(
        startTime.getTime() + duration_minutes * 60 * 1000,
      );
      walkPayload.end_at = endTime.toISOString();
    }
  }

  return walkPayload;
};
