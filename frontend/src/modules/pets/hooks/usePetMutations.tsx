import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPetRequest,
  deletePetRequest,
  updatePetRequest,
} from "../api/petsApi";
import type {
  CreatePetPayload,
  Pet,
  UpdatePetPayload,
} from "../types/Pets";

const PET_LIST_KEY = ["get_pet_list"];

export const useCreatePet = () => {
  const queryClient = useQueryClient();

  return useMutation<Pet, Error, CreatePetPayload>({
    mutationFn: createPetRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PET_LIST_KEY });
    },
  });
};

export const useUpdatePet = () => {
  const queryClient = useQueryClient();

  return useMutation<Pet, Error, { id: number; payload: UpdatePetPayload }>({
    mutationFn: ({ id, payload }) => updatePetRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PET_LIST_KEY });
    },
  });
};

export const useDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deletePetRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PET_LIST_KEY });
    },
  });
};
