const ALLOWED_ROLES = [
  "user",
  "admin",
  "vet",
  "coordinator",
  "volunteer",
] as const;

export type UserRole = (typeof ALLOWED_ROLES)[number];

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export const validateUserId = (id: unknown): string => {
  if (!isNonEmptyString(id)) {
    throw new Error("Invalid user id.");
  }

  return id;
};

export const validateRole = (role: unknown): UserRole => {
  if (typeof role !== "string") {
    throw new Error("Role is required.");
  }

  if (!ALLOWED_ROLES.includes(role as UserRole)) {
    throw new Error("Invalid role.");
  }

  return role as UserRole;
};

export const validateAddUserPayload = (
  body: unknown,
): {
  email: string;
  password: string;
  role: UserRole;
} => {
  if (!body || typeof body !== "object") {
    throw new Error("Payload must be an object.");
  }

  const { email, password, role } = body as Record<string, unknown>;

  if (!isNonEmptyString(email)) {
    throw new Error("Email is required.");
  }

  if (!isNonEmptyString(password)) {
    throw new Error("Password is required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  return {
    email,
    password,
    role: validateRole(role),
  };
};

export const validateAddRolePayload = (
  body: unknown,
): {
  role: UserRole;
} => {
  if (!body || typeof body !== "object") {
    throw new Error("Payload must be an object.");
  }

  const { role } = body as Record<string, unknown>;

  return {
    role: validateRole(role),
  };
};
