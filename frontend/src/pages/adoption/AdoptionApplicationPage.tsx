import { useMemo, useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { usePetList } from "@/modules/pets/hooks/usePetList";
import {
  submitAdoptionApplication,
  type CreateAdoptionApplicationRequest,
} from "@/modules/adoption/api";

type FormState = {
  pet_id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  housing_type: string;
  has_other_pets: string;
  message: string;
};

type SubmissionSummary = {
  petName: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  housing_type: string;
  has_other_pets: string;
  message: string;
};

const initialFormState: FormState = {
  pet_id: "",
  full_name: "",
  email: "",
  phone: "",
  city: "",
  housing_type: "",
  has_other_pets: "",
  message: "",
};

export function AdoptionApplicationPage() {
  const { session } = useAuth();
  const { data: pets = [], isPending: petsLoading } = usePetList();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submissionSummary, setSubmissionSummary] =
    useState<SubmissionSummary | null>(null);

  const selectedPetName = useMemo(() => {
    const pet = pets.find((item) => String(item.id) === form.pet_id);
    return pet?.name ?? null;
  }, [form.pet_id, pets]);

  const mutation = useMutation({
    mutationFn: submitAdoptionApplication,
    onSuccess: () => {
      const selectedPet = pets.find((item) => String(item.id) === form.pet_id);

      setSubmissionSummary({
        petName: selectedPet?.name ?? "Selected pet",
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || "Not provided",
        city: form.city || "Not provided",
        housing_type: form.housing_type || "Not provided",
        has_other_pets:
          form.has_other_pets === ""
            ? "Not provided"
            : form.has_other_pets === "true"
              ? "Yes"
              : "No",
        message: form.message,
      });
      setForm(initialFormState);
    },
  });

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionSummary(null);

    const payload: CreateAdoptionApplicationRequest = {
      ...form,
      user_id: session?.user.id,
    };

    await mutation.mutateAsync(payload);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {submissionSummary ? (
          <div className="fixed top-4 right-4 z-50 w-[min(92vw,28rem)] rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  Application received
                </p>
                <h2 className="text-lg font-semibold text-slate-900">
                  Thanks, {submissionSummary.full_name}
                </h2>
                <p className="text-sm text-slate-600">
                  Your request for {submissionSummary.petName} was saved.
                </p>
              </div>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                onClick={() => setSubmissionSummary(null)}
                aria-label="Close confirmation popup"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p>
                <strong>Email:</strong> {submissionSummary.email}
              </p>
              <p>
                <strong>Phone:</strong> {submissionSummary.phone}
              </p>
              <p>
                <strong>City:</strong> {submissionSummary.city}
              </p>
              <p>
                <strong>Housing:</strong> {submissionSummary.housing_type}
              </p>
              <p>
                <strong>Other pets:</strong> {submissionSummary.has_other_pets}
              </p>
              <p className="line-clamp-3">
                <strong>Message:</strong> {submissionSummary.message}
              </p>
            </div>
          </div>
        ) : null}

        <header className="space-y-2">
          <p className="text-sm font-medium text-slate-500">Adoption request</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Send an adoption application
          </h1>
          <p className="text-sm text-slate-600">
            Fill out the form below and we will save your application in the
            system.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Application form</CardTitle>
            <CardDescription>
              Required: pet, name, email, and a short note. Other fields are
              optional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="pet_id">Choose a pet</Label>
                  <select
                    id="pet_id"
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
                    value={form.pet_id}
                    onChange={(event) =>
                      updateField("pet_id", event.target.value)
                    }
                    required
                    disabled={petsLoading}
                  >
                    <option value="">Select a pet</option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name}
                      </option>
                    ))}
                  </select>
                  {selectedPetName ? (
                    <p className="text-xs text-slate-500">
                      Selected: {selectedPetName}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input
                    id="full_name"
                    value={form.full_name}
                    onChange={(event) =>
                      updateField("full_name", event.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(event) =>
                      updateField("city", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="housing_type">Housing type</Label>
                  <Input
                    id="housing_type"
                    placeholder="Apartment, house, etc."
                    value={form.housing_type}
                    onChange={(event) =>
                      updateField("housing_type", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="has_other_pets">Other pets?</Label>
                  <select
                    id="has_other_pets"
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
                    value={form.has_other_pets}
                    onChange={(event) =>
                      updateField("has_other_pets", event.target.value)
                    }
                  >
                    <option value="">Choose one</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="message">Why do you want to adopt?</Label>
                  <textarea
                    id="message"
                    className="min-h-32 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
                    value={form.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {mutation.error instanceof Error ? (
                <p className="text-sm text-red-600">{mutation.error.message}</p>
              ) : null}

              <Button
                type="submit"
                disabled={mutation.isPending || petsLoading}
              >
                {mutation.isPending ? "Sending..." : "Submit application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
