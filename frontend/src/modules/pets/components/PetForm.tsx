import type { ChangeEvent, FC, SyntheticEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PetPhotoUpload } from "./PetPhotoUpload";
import type { CreatePetPayload, Pet, UpdatePetPayload } from "../types/Pets";

type PetFormState = {
  name: string;
  species: string;
  age: string;
  weight: string;
  description: string;
  breed: string;
  size: string;
};

const emptyForm: PetFormState = {
  name: "",
  species: "",
  age: "",
  weight: "",
  description: "",
  breed: "",
  size: "",
};

const toFormState = (pet: Pet): PetFormState => ({
  name: pet.name,
  species: pet.species,
  age: pet.age !== null ? String(pet.age) : "",
  weight: pet.weight !== null ? String(pet.weight) : "",
  description: pet.description,
  breed: pet.breed ?? "",
  size: pet.size ?? "",
});

type Props = {
  pet?: Pet;
  onSubmit: (payload: CreatePetPayload | UpdatePetPayload) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

const getPetFormKey = (pet?: Pet) => {
  if (!pet) {
    return "new";
  }

  return [
    pet.id,
    pet.name,
    pet.species,
    pet.age,
    pet.weight,
    pet.description,
    pet.breed,
    pet.size,
  ].join(":");
};

const PetFormFields: FC<Props> = ({
  pet,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}) => {
  const [form, setForm] = useState<PetFormState>(
    pet ? toFormState(pet) : emptyForm,
  );
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: keyof PetFormState) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    setError(null);

    const name = form.name.trim();
    const species = form.species.trim();
    const description = form.description.trim();
    const age = Number(form.age);
    const weight = Number(form.weight);

    if (!name || !species || !description) {
      setError("Name, species, and description are required.");
      return;
    }

    if (!Number.isFinite(age) || age <= 0) {
      setError("Age must be a positive number.");
      return;
    }

    if (!Number.isFinite(weight) || weight <= 0) {
      setError("Weight must be a positive number.");
      return;
    }

    onSubmit({
      name,
      species,
      age,
      weight,
      description,
      breed: form.breed.trim() || null,
      size: form.size || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="pet-name">Name</Label>
          <Input
            id="pet-name"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="e.g. Luna"
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="pet-species">Species</Label>
          <Input
            id="pet-species"
            value={form.species}
            onChange={handleChange("species")}
            placeholder="e.g. dog"
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="pet-age">Age (years)</Label>
          <Input
            id="pet-age"
            type="number"
            min="0"
            step="0.1"
            value={form.age}
            onChange={handleChange("age")}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="pet-weight">Weight (kg)</Label>
          <Input
            id="pet-weight"
            type="number"
            min="0"
            step="0.1"
            value={form.weight}
            onChange={handleChange("weight")}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="pet-breed">Breed</Label>
          <Input
            id="pet-breed"
            value={form.breed}
            onChange={handleChange("breed")}
            placeholder="e.g. Labrador"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="pet-size">Size</Label>
          <select
            id="pet-size"
            value={form.size}
            onChange={handleChange("size")}
            className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
          >
            <option value="">Not specified</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="pet-description">Description</Label>
        <textarea
          id="pet-description"
          value={form.description}
          onChange={handleChange("description")}
          rows={4}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
          required
        />
      </div>

      {pet ? (
        <div className="space-y-1">
          <Label>Photo</Label>
          {pet.image_url && (
            <img
              src={pet.image_url}
              alt={pet.name}
              className="h-24 w-24 rounded-md object-cover"
            />
          )}
          <PetPhotoUpload petId={pet.id} />
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Save the pet first, then edit it to add a photo.
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel ?? (pet ? "Save changes" : "Add pet")}
        </Button>
      </div>
    </form>
  );
};

export const PetForm: FC<Props> = (props) => (
  <PetFormFields key={getPetFormKey(props.pet)} {...props} />
);
