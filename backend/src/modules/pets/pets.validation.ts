import type {
  CreatePetWalkDTO,
  PetInsert,
  PetUpdate,
  PetWalkUpdate,
} from "@repo/types";

export type CreatePetDTO = Pick<
  PetInsert,
  | "age"
  | "breed"
  | "description"
  | "ideal_home"
  | "name"
  | "personality"
  | "size"
  | "species"
  | "special_needs"
  | "weight"
>;

export type UpdatePetDTO = Pick<
  PetUpdate,
  | "age"
  | "breed"
  | "description"
  | "ideal_home"
  | "name"
  | "personality"
  | "size"
  | "species"
  | "special_needs"
  | "weight"
>;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isPositiveNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const ALLOWED_SIZES = ["small", "medium", "large"];

const parseOptionalSize = (value: unknown): string | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value !== "string" || !ALLOWED_SIZES.includes(value)) {
    throw new Error("Field 'size' must be one of: small, medium, large.");
  }
  return value;
};

const parseOptionalBreed = (value: unknown): string | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new Error("Field 'breed' must be a string.");
  }
  return value.trim();
};

export const validateCreatePetPayload = (payload: unknown): CreatePetDTO => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const {
    age,
    breed,
    description,
    ideal_home,
    name,
    personality,
    size,
    species,
    special_needs,
    weight,
  } = payload as Record<string, unknown>;

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
    breed: parseOptionalBreed(breed) ?? null,
    description: description.trim(),
    ideal_home:
      typeof ideal_home === "string" ? ideal_home.trim() || null : undefined,
    name: name.trim(),
    personality:
      typeof personality === "string" ? personality.trim() || null : undefined,
    size: parseOptionalSize(size) ?? null,
    species: species.trim(),
    special_needs:
      typeof special_needs === "string"
        ? special_needs.trim() || null
        : undefined,
    weight,
  };
};

export const validateUpdatePetPayload = (payload: unknown): UpdatePetDTO => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const {
    age,
    breed,
    description,
    ideal_home,
    name,
    personality,
    size,
    species,
    special_needs,
    weight,
  } = payload as Record<string, unknown>;

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

  if (breed !== undefined) {
    dto.breed = parseOptionalBreed(breed) ?? null;
  }

  if (ideal_home !== undefined) {
    if (ideal_home !== null && typeof ideal_home !== "string") {
      throw new Error("Field 'ideal_home' must be a string or null.");
    }
    dto.ideal_home = ideal_home === null ? null : ideal_home.trim();
  }

  if (personality !== undefined) {
    if (personality !== null && typeof personality !== "string") {
      throw new Error("Field 'personality' must be a string or null.");
    }
    dto.personality = personality === null ? null : personality.trim();
  }

  if (special_needs !== undefined) {
    if (special_needs !== null && typeof special_needs !== "string") {
      throw new Error("Field 'special_needs' must be a string or null.");
    }
    dto.special_needs = special_needs === null ? null : special_needs.trim();
  }

  if (size !== undefined) {
    dto.size = parseOptionalSize(size) ?? null;
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

export const validateWalkId = (id: unknown): number => {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Parameter 'walkId' is required.");
  }

  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error("Parameter 'walkId' must be a positive integer.");
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

export const validateOptionalDate = (value: unknown): string | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    throw new Error("Date must be a valid date string.");
  }

  return new Date(value).toISOString();
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

  const { notes, walked_at, walker_id, end_at } = payload as Record<
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

  // Handle end_at if provided directly
  if (end_at !== undefined) {
    if (!isValidDateString(end_at)) {
      throw new Error("Field 'end_at' must be a valid date string.");
    }

    walkPayload.end_at = new Date(end_at).toISOString();
  }

  return walkPayload;
};

export const validateUpdatePetWalkPayload = (
  payload: unknown,
): PetWalkUpdate => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const { end_at, notes, pet_id, walked_at, walker_id } = payload as Record<
    string,
    unknown
  >;
  const walkPayload: PetWalkUpdate = {};

  if (pet_id !== undefined) {
    if (
      typeof pet_id !== "number" ||
      !Number.isInteger(pet_id) ||
      pet_id <= 0
    ) {
      throw new Error("Field 'pet_id' must be a positive integer.");
    }

    walkPayload.pet_id = pet_id;
  }

  if (notes !== undefined) {
    if (notes !== null && typeof notes !== "string") {
      throw new Error("Field 'notes' must be a string or null when provided.");
    }

    walkPayload.notes = notes === null ? null : notes.trim() || null;
  }

  if (walked_at !== undefined) {
    if (!isValidDateString(walked_at)) {
      throw new Error("Field 'walked_at' must be a valid date string.");
    }

    walkPayload.walked_at = new Date(walked_at).toISOString();
  }

  if (walker_id !== undefined) {
    if (
      walker_id !== null &&
      (typeof walker_id !== "string" || !walker_id.trim())
    ) {
      throw new Error("Field 'walker_id' must be a non-empty string or null.");
    }

    walkPayload.walker_id = walker_id === null ? null : walker_id.trim();
  }

  if (end_at !== undefined) {
    if (end_at !== null && !isValidDateString(end_at)) {
      throw new Error("Field 'end_at' must be a valid date string or null.");
    }

    walkPayload.end_at =
      end_at === null ? null : new Date(end_at).toISOString();
  }

  if (Object.keys(walkPayload).length === 0) {
    throw new Error("At least one field must be provided.");
  }

  return walkPayload;
};
