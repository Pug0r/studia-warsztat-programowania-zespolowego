import type {
  AdoptionApplicationWithPetSummary,
  AdoptionStatus,
} from "@repo/types";
import api from "../../api/api";

export type CreateAdoptionApplicationRequest = {
  pet_id: string;
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  housing_type?: string;
  has_other_pets?: string;
  message: string;
  user_id?: string;
};

export const submitAdoptionApplication = async (
  payload: CreateAdoptionApplicationRequest,
) => {
  const response = await api.post("adoption-applications/", payload);
  return response.data;
};

export const getAdoptionApplications = async () => {
  const response = await api.get<AdoptionApplicationWithPetSummary[]>(
    "adoption-applications/",
  );
  return response.data;
};

export const updateAdoptionStatus = async (
  id: number,
  status: AdoptionStatus,
) => {
  const response = await api.patch<AdoptionApplicationWithPetSummary>(
    `adoption-applications/${id}/status`,
    { status },
  );
  return response.data;
};
