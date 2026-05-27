import type { Tables } from "@repo/types";

export type UserProfile = Tables<"profiles">;
export type UserRole = UserProfile["role"];

export type UpdateUserRoleDTO = {
  role: UserRole;
};

export const USER_ROLE_OPTIONS: UserRole[] = [
  "user",
  "admin",
  "vet",
  "coordinator",
  "volunteer",
];
