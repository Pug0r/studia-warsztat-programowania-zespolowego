import type { Json } from "@repo/types";
import {
  authAuditActions,
  type AuthAuditAction,
  type AuthAuditEventPayload,
} from "./audit.types.js";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isJsonValue = (value: unknown): value is Json => {
  if (value === null) {
    return true;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  if (!isPlainObject(value)) {
    return false;
  }

  return Object.values(value).every(
    (nestedValue) => nestedValue === undefined || isJsonValue(nestedValue),
  );
};

const parseMetadata = (value: unknown): Record<string, Json> => {
  if (value === undefined) {
    return {};
  }

  if (!isPlainObject(value)) {
    throw new Error("Audit metadata must be a JSON object.");
  }

  const metadata: Record<string, Json> = {};

  for (const [key, metadataValue] of Object.entries(value)) {
    if (metadataValue === undefined) {
      continue;
    }

    if (!isJsonValue(metadataValue)) {
      throw new Error(
        `Audit metadata field "${key}" is not JSON-serializable.`,
      );
    }

    metadata[key] = metadataValue;
  }

  return metadata;
};

export const validateAuthAuditEventPayload = (
  value: unknown,
): AuthAuditEventPayload => {
  if (!isPlainObject(value)) {
    throw new Error("Audit payload must be an object.");
  }

  const action = value.action;

  if (
    typeof action !== "string" ||
    !authAuditActions.includes(action as AuthAuditAction)
  ) {
    throw new Error("Unsupported auth audit action.");
  }

  return {
    action: action as AuthAuditAction,
    metadata: parseMetadata(value.metadata),
  };
};
