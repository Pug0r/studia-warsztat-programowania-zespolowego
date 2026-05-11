import api from "@/api/api";
import type {
  CreateVolunteerDTO,
  UpdateVolunteerDTO,
  Volunteer,
} from "../types/Volunteers";

export const getVolunteersRequest = async (): Promise<Volunteer[]> => {
  const response = await api.get("volunteers/");
  return response.data;
};

export const createVolunteerRequest = async (
  payload: CreateVolunteerDTO,
): Promise<Volunteer> => {
  const response = await api.post("volunteers/", payload);
  return response.data;
};

export const updateVolunteerRequest = async (
  id: number,
  payload: UpdateVolunteerDTO,
): Promise<Volunteer> => {
  const response = await api.patch(`volunteers/${String(id)}`, payload);
  return response.data;
};

export const deleteVolunteerRequest = async (id: number): Promise<void> => {
  await api.delete(`volunteers/${String(id)}`);
};
