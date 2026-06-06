import {
  MEDICAL_EVENT_STATUSES,
  MEDICAL_EVENT_TYPES,
  type CreateMedicalEventDTO,
  type MedicalEventStatus,
  type MedicalEventType,
  type UpdateMedicalEventDTO,
} from "@repo/types";

const isMedicalEventType = (value: unknown): value is MedicalEventType =>
  typeof value === "string" &&
  (MEDICAL_EVENT_TYPES as readonly string[]).includes(value);

const isMedicalEventStatus = (value: unknown): value is MedicalEventStatus =>
  typeof value === "string" &&
  (MEDICAL_EVENT_STATUSES as readonly string[]).includes(value);

const validateScheduledAt = (value: unknown): string => {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    throw new Error("Field 'scheduled_at' must be a valid date string.");
  }

  return new Date(value).toISOString();
};

const validateTitle = (value: unknown): string => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Field 'title' must be a non-empty string.");
  }

  return value.trim();
};

const validateNotes = (value: unknown): string | null => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Field 'notes' must be a string.");
  }

  return value.trim() || null;
};

export const validateMedicalEventId = (
  value: string | string[] | undefined,
): number => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const id = Number(rawValue);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid medical event ID.");
  }

  return id;
};

export const validateMedicalEventPayload = (
  payload: unknown,
): CreateMedicalEventDTO => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Request body must be an object.");
  }

  const body = payload as Record<string, unknown>;
  const petId = Number(body.pet_id);

  if (!Number.isInteger(petId) || petId <= 0) {
    throw new Error("Field 'pet_id' must be a positive integer.");
  }

  if (!isMedicalEventType(body.type)) {
    throw new Error("Field 'type' is invalid.");
  }

  return {
    pet_id: petId,
    type: body.type,
    title: validateTitle(body.title),
    scheduled_at: validateScheduledAt(body.scheduled_at),
    notes: validateNotes(body.notes),
  };
};

export const validateMedicalEventUpdatePayload = (
  payload: unknown,
): UpdateMedicalEventDTO => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Request body must be an object.");
  }

  const body = payload as Record<string, unknown>;
  const update: UpdateMedicalEventDTO = {};

  if (body.type !== undefined) {
    if (!isMedicalEventType(body.type)) {
      throw new Error("Field 'type' is invalid.");
    }
    update.type = body.type;
  }

  if (body.status !== undefined) {
    if (!isMedicalEventStatus(body.status)) {
      throw new Error("Field 'status' is invalid.");
    }
    update.status = body.status;
  }

  if (body.title !== undefined) {
    update.title = validateTitle(body.title);
  }

  if (body.scheduled_at !== undefined) {
    update.scheduled_at = validateScheduledAt(body.scheduled_at);
  }

  if (body.notes !== undefined) {
    update.notes = validateNotes(body.notes);
  }

  if (Object.keys(update).length === 0) {
    throw new Error("Request body must contain at least one field.");
  }

  return update;
};
