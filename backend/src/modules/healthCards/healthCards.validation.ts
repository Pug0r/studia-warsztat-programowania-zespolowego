import {
  HEALTH_CARD_ENTRY_TYPES,
  type CreateHealthCardEntryDTO,
  type HealthCardEntryType,
  type UpdateHealthCardEntryDTO,
} from "./healthCards.types.js";

export const validatePetId = (id: unknown): number => {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Parameter 'petId' is required.");
  }
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error("Parameter 'petId' must be a positive integer.");
  }
  return n;
};

export const validateEntryId = (id: unknown): number => {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Parameter 'entryId' is required.");
  }
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error("Parameter 'entryId' must be a positive integer.");
  }
  return n;
};

const isEntryType = (value: unknown): value is HealthCardEntryType =>
  typeof value === "string" &&
  (HEALTH_CARD_ENTRY_TYPES as readonly string[]).includes(value);

const isValidDate = (value: unknown): value is string =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  !Number.isNaN(Date.parse(value));

const optionalText = (value: unknown, field: string): string | null => {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== "string") {
    throw new Error(`Field '${field}' must be a string.`);
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const validateCreateEntryPayload = (
  payload: unknown,
): CreateHealthCardEntryDTO => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const { entry_type, title, description, medication, treatment_date } =
    payload as Record<string, unknown>;

  if (!isEntryType(entry_type)) {
    throw new Error("Field 'entry_type' is invalid.");
  }

  if (typeof title !== "string" || !title.trim()) {
    throw new Error("Field 'title' is required.");
  }

  if (!isValidDate(treatment_date)) {
    throw new Error("Field 'treatment_date' must be a valid date.");
  }

  return {
    entry_type,
    title: title.trim(),
    description: optionalText(description, "description"),
    medication: optionalText(medication, "medication"),
    treatment_date,
  };
};

export const validateUpdateEntryPayload = (
  payload: unknown,
): UpdateHealthCardEntryDTO => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const { entry_type, title, description, medication, treatment_date } =
    payload as Record<string, unknown>;
  const dto: UpdateHealthCardEntryDTO = {};

  if (entry_type !== undefined) {
    if (!isEntryType(entry_type)) {
      throw new Error("Field 'entry_type' is invalid.");
    }
    dto.entry_type = entry_type;
  }

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      throw new Error("Field 'title' must be a non-empty string.");
    }
    dto.title = title.trim();
  }

  if (treatment_date !== undefined) {
    if (!isValidDate(treatment_date)) {
      throw new Error("Field 'treatment_date' must be a valid date.");
    }
    dto.treatment_date = treatment_date;
  }

  if (description !== undefined) {
    dto.description = optionalText(description, "description");
  }

  if (medication !== undefined) {
    dto.medication = optionalText(medication, "medication");
  }

  if (Object.keys(dto).length === 0) {
    throw new Error("At least one field must be provided for update.");
  }

  return dto;
};
