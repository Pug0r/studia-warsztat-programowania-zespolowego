import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PetForm } from "@/modules/pets/components/PetForm";
import { usePetList } from "@/modules/pets/hooks/usePetList";
import {
  useCreatePet,
  useDeletePet,
  useUpdatePet,
} from "@/modules/pets/hooks/usePetMutations";
import type {
  CreatePetPayload,
  Pet,
  UpdatePetPayload,
} from "@/modules/pets/types/Pets";
import { showToast } from "@/lib/toast";

type FormMode = { kind: "idle" } | { kind: "create" } | { kind: "edit"; pet: Pet };

const errorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { error?: unknown } } }).response
      ?.data?.error === "string"
  ) {
    return (error as { response: { data: { error: string } } }).response.data
      .error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export function PetsAdminPage() {
  const { data, error, isPending, refetch } = usePetList();
  const createPet = useCreatePet();
  const updatePet = useUpdatePet();
  const deletePet = useDeletePet();

  const [mode, setMode] = useState<FormMode>({ kind: "idle" });

  const handleCreate = (payload: CreatePetPayload | UpdatePetPayload) => {
    createPet.mutate(payload as CreatePetPayload, {
      onSuccess: () => {
        showToast("Pet added.", "success");
        setMode({ kind: "idle" });
      },
      onError: (err) => {
        showToast(errorMessage(err, "Failed to add pet."), "error");
      },
    });
  };

  const handleUpdate = (
    id: number,
    payload: CreatePetPayload | UpdatePetPayload,
  ) => {
    updatePet.mutate(
      { id, payload },
      {
        onSuccess: () => {
          showToast("Pet updated.", "success");
          setMode({ kind: "idle" });
        },
        onError: (err) => {
          showToast(errorMessage(err, "Failed to update pet."), "error");
        },
      },
    );
  };

  const handleDelete = (pet: Pet) => {
    const confirmed = window.confirm(
      `Delete ${pet.name}? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    deletePet.mutate(pet.id, {
      onSuccess: () => {
        showToast("Pet removed.", "success");
      },
      onError: (err) => {
        showToast(errorMessage(err, "Failed to delete pet."), "error");
      },
    });
  };

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge>Admin · Animals</Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Manage animals
            </h1>
            <p className="text-sm text-slate-600">
              Add new animals, edit their details, or remove profiles after
              adoption.
            </p>
          </div>
          <Button
            onClick={() => setMode({ kind: "create" })}
            className="gap-2"
          >
            <Plus className="size-4" />
            Add pet
          </Button>
        </header>

        {mode.kind !== "idle" && (
          <Card>
            <CardHeader>
              <CardTitle>
                {mode.kind === "create" ? "New pet" : `Edit ${mode.pet.name}`}
              </CardTitle>
              <CardDescription>
                {mode.kind === "create"
                  ? "Create a profile for an animal currently in the shelter."
                  : "Update the animal's profile."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PetForm
                pet={mode.kind === "edit" ? mode.pet : undefined}
                onSubmit={(payload) => {
                  if (mode.kind === "create") {
                    handleCreate(payload);
                  } else {
                    handleUpdate(mode.pet.id, payload);
                  }
                }}
                onCancel={() => setMode({ kind: "idle" })}
                isSubmitting={createPet.isPending || updatePet.isPending}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Animal profiles</CardTitle>
            <CardDescription>
              {data?.length ?? 0} registered in the shelter.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPending && <p className="text-sm text-slate-500">Loading…</p>}

            {error && (
              <div className="space-y-2">
                <p className="text-sm text-red-500">
                  Failed to load pets: {error.message}
                </p>
                <Button variant="outline" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            )}

            {!isPending && !error && (!data || data.length === 0) && (
              <p className="text-sm text-slate-500">
                No pets yet. Add the first one using the button above.
              </p>
            )}

            {data && data.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Species</th>
                      <th className="py-2 pr-4">Age</th>
                      <th className="py-2 pr-4">Weight</th>
                      <th className="py-2 pr-4">Description</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((pet) => (
                      <tr
                        key={pet.id}
                        className="border-b border-slate-100 align-top"
                      >
                        <td className="py-3 pr-4 font-medium text-slate-900">
                          {pet.name}
                        </td>
                        <td className="py-3 pr-4 text-slate-700">
                          {pet.species}
                        </td>
                        <td className="py-3 pr-4 text-slate-700">
                          {pet.age ?? "—"}
                        </td>
                        <td className="py-3 pr-4 text-slate-700">
                          {pet.weight ?? "—"}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          <span className="line-clamp-2">
                            {pet.description}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => setMode({ kind: "edit", pet })}
                            >
                              <Pencil className="size-3.5" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="gap-1"
                              onClick={() => handleDelete(pet)}
                              disabled={
                                deletePet.isPending &&
                                deletePet.variables === pet.id
                              }
                            >
                              <Trash2 className="size-3.5" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
