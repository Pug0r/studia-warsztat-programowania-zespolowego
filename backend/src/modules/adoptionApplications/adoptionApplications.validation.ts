import {
  ADOPTION_STATUSES,
  type AdoptionStatus,
  type CreateAdoptionApplicationDTO,
  type UpdateAdoptionApplicationStatusDTO,
} from "@repo/types";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const parsePositiveInteger = (value: unknown, fieldName: string): number => {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }

  throw new Error(
    `Field '${fieldName}' is required and must be a positive integer.`,
  );
};

const parseOptionalString = (value: unknown): string | undefined => {
  if (!isNonEmptyString(value)) {
    return undefined;
  }

  return value.trim();
};

const parseOptionalBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }
  }

  return undefined;
};

export const validateCreateAdoptionApplicationPayload = (
  payload: unknown,
): CreateAdoptionApplicationDTO => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const {
    city,
    email,
    full_name,
    has_other_pets,
    housing_type,
    message,
    pet_id,
    phone,
    user_id,
  } = payload as Record<string, unknown>;

  if (!isNonEmptyString(full_name)) {
    throw new Error(
      "Field 'full_name' is required and must be a non-empty string.",
    );
  }

  if (!isNonEmptyString(email)) {
    throw new Error(
      "Field 'email' is required and must be a non-empty string.",
    );
  }

  if (!isNonEmptyString(message)) {
    throw new Error(
      "Field 'message' is required and must be a non-empty string.",
    );
  }

  const dto: CreateAdoptionApplicationDTO = {
    pet_id: parsePositiveInteger(pet_id, "pet_id"),
    full_name: full_name.trim(),
    email: email.trim(),
    message: message.trim(),
  };

  const phoneValue = parseOptionalString(phone);
  if (phoneValue !== undefined) {
    dto.phone = phoneValue;
  }

  const cityValue = parseOptionalString(city);
  if (cityValue !== undefined) {
    dto.city = cityValue;
  }

  const housingTypeValue = parseOptionalString(housing_type);
  if (housingTypeValue !== undefined) {
    dto.housing_type = housingTypeValue;
  }

  const hasOtherPetsValue = parseOptionalBoolean(has_other_pets);
  if (hasOtherPetsValue !== undefined) {
    dto.has_other_pets = hasOtherPetsValue;
  }

  const userIdValue = parseOptionalString(user_id);
  if (userIdValue !== undefined) {
    dto.user_id = userIdValue;
  }

  return dto;
};

export const validateAdoptionApplicationId = (value: unknown): number =>
  parsePositiveInteger(value, "id");

export const validateUpdateAdoptionStatusPayload = (
  payload: unknown,
): UpdateAdoptionApplicationStatusDTO => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object.");
  }

  const { status } = payload as Record<string, unknown>;

  if (
    typeof status !== "string" ||
    !ADOPTION_STATUSES.includes(status as AdoptionStatus)
  ) {
    throw new Error(
      `Field 'status' is required and must be one of: ${ADOPTION_STATUSES.join(", ")}.`,
    );
  }

  return { status: status as AdoptionStatus };
};
