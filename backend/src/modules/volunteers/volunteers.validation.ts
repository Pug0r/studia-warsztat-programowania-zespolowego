import type { CreateVolunteerDTO, UpdateVolunteerDTO } from "@repo/types";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isOptionalString = (value: unknown): value is string | null | undefined =>
  value === undefined || value === null || typeof value === "string";

const isValidEmail = (value: string): boolean => /^\S+@\S+\.\S+$/.test(value);

export const validateCreateVolunteerPayload = (
  payload: unknown,
): CreateVolunteerDTO => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const { email, full_name, phone } = payload as Record<string, unknown>;

  if (!isNonEmptyString(full_name)) {
    throw new Error(
      "Field 'full_name' is required and must be a non-empty string.",
    );
  }

  if (!isNonEmptyString(email) || !isValidEmail(email)) {
    throw new Error("Field 'email' is required and must be a valid email.");
  }

  if (!isOptionalString(phone)) {
    throw new Error("Field 'phone' must be a string when provided.");
  }

  return {
    email: email.trim(),
    full_name: full_name.trim(),
    phone: typeof phone === "string" ? phone.trim() || null : null,
  };
};

export const validateUpdateVolunteerPayload = (
  payload: unknown,
): UpdateVolunteerDTO => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const { email, full_name, phone } = payload as Record<string, unknown>;
  const result: UpdateVolunteerDTO = {};

  if (full_name !== undefined) {
    if (!isNonEmptyString(full_name)) {
      throw new Error("Field 'full_name' must be a non-empty string.");
    }
    result.full_name = full_name.trim();
  }

  if (email !== undefined) {
    if (!isNonEmptyString(email) || !isValidEmail(email)) {
      throw new Error("Field 'email' must be a valid email.");
    }
    result.email = email.trim();
  }

  if (phone !== undefined) {
    if (!isOptionalString(phone)) {
      throw new Error("Field 'phone' must be a string when provided.");
    }
    result.phone = typeof phone === "string" ? phone.trim() || null : null;
  }

  if (Object.keys(result).length === 0) {
    throw new Error("At least one field must be provided to update.");
  }

  return result;
};

export const validateVolunteerId = (id: unknown): number => {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Parameter 'id' is required.");
  }

  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error("Parameter 'id' must be a positive integer.");
  }

  return n;
};
