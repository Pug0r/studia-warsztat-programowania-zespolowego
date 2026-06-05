import api from "@/api/api";
import type { UpdateUserRoleDTO, UserProfile } from "../types/Users";

export const getAllUsersRequest = async (): Promise<UserProfile[]> => {
  const response = await api.get("administration/all-users");
  return response.data;
};

export const getUserByIdRequest = async (id: string): Promise<UserProfile> => {
  const response = await api.get(`administration/${id}`);
  return response.data;
};

export const updateUserRoleRequest = async (
  id: string,
  payload: UpdateUserRoleDTO,
): Promise<UserProfile> => {
  const response = await api.post(`administration/add-role/${id}`, payload);
  return response.data;
};

export const deleteUserRequest = async (id: string): Promise<void> => {
  await api.delete(`administration/${id}`);
};
