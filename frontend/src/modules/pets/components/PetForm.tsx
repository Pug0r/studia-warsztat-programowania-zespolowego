import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  CreatePetPayload,
  Pet,
  UpdatePetPayload,
} from "../types/Pets";

type PetFormState = {
  name: string;
  species: string;
  age: string;
  weight: string;
  description: string;
};

const emptyForm: PetFormState = {
  name: "",
  species: "",
  age: "",
  weight: "",
  description: "",
};

const toFormState = (pet: Pet): PetFormState => ({
  name: pet.name,
  species: pet.species,
  age: pet.age !== null ? String(pet.age) : "",
  weight: pet.weight !== null ? String(pet.weight) : "",
  description: pet.description,
});

type Props = {
  pet?: Pet;
  onSubmit: (payload: CreatePetPayload | UpdatePetPayload) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export const PetForm: React.FC<Props> = ({
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

  useEffect(() => {
    setForm(pet ? toFormState(pet) : emptyForm);
    setError(null);
  }, [pet]);

  const handleChange =
    (field: keyof PetFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent) => {
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

    onSubmit({ name, species, age, weight, description });
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
