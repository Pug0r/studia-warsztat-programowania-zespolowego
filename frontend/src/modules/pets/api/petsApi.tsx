import type { Pet } from "../types/Pets";

export const getPetListRequest = async (): Promise<Pet[]> => {
  const response = await fetch("/api/pets/");

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const uploadPetPhotoRequest = async (
  petId: number,
  file: File,
): Promise<string> => {
  const formData = new FormData();
  formData.append("photo", file);
  const response = await fetch(`/api/pets/${petId}/photo`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Upload error: ${response.status}`);
  }
  const data = await response.json();
  return data.image_url;
};
