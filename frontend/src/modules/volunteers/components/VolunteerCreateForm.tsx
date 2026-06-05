import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { useCreateVolunteer } from "../hooks/useVolunteers";

export const VolunteerCreateForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { mutate, isPending, isError, error, reset } = useCreateVolunteer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      {
        full_name: fullName,
        email,
        phone: phone.trim() || null,
      },
      {
        onSuccess: () => {
          setFullName("");
          setEmail("");
          setPhone("");
          setIsOpen(false);
        },
      },
    );
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          reset();
        }}
        className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        <UserPlus className="size-4" />
        Add volunteer
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 max-w-xl"
    >
      <h3 className="text-base font-semibold text-slate-900">New volunteer</h3>

      <div>
        <label
          htmlFor="new-volunteer-name"
          className="block text-xs font-medium text-slate-600 mb-1"
        >
          Full name
        </label>
        <input
          id="new-volunteer-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-900 outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="new-volunteer-email"
          className="block text-xs font-medium text-slate-600 mb-1"
        >
          Email
        </label>
        <input
          id="new-volunteer-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-900 outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="new-volunteer-phone"
          className="block text-xs font-medium text-slate-600 mb-1"
        >
          Phone (optional)
        </label>
        <input
          id="new-volunteer-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-900 outline-none"
        />
      </div>

      {isError ? (
        <p className="text-xs text-red-600">
          {error instanceof Error ? error.message : "Failed to create."}
        </p>
      ) : null}

      <div className="flex gap-2 justify-end pt-1">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          disabled={isPending}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};
