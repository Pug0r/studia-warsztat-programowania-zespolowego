import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadPetPhotoRequest } from "../api/petsApi";

export const usePetPhotoUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, file }: { petId: number; file: File }) =>
      uploadPetPhotoRequest(petId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_pet_list"] });
    },
  });
};
