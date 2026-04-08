import api from "@/api/api";
import type { Pet } from "../types/Pets";

export const getPetListRequest = async (): Promise<Pet[]> => {
  const response = await api.get("pets/");
  return response.data;
};
