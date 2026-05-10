import React, { useState } from "react";
import type { Volunteer } from "../types/Volunteers";
import { useUpdateVolunteer } from "../hooks/useVolunteers";

type Props = {
  volunteer: Volunteer;
  onCancel: () => void;
  onSaved: () => void;
};

export const VolunteerEditForm: React.FC<Props> = ({
  volunteer,
  onCancel,
  onSaved,
}) => {
  const [fullName, setFullName] = useState(volunteer.full_name);
  const [email, setEmail] = useState(volunteer.email);
  const [phone, setPhone] = useState(volunteer.phone ?? "");

  const { mutate, isPending, isError, error } = useUpdateVolunteer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      {
        id: volunteer.id,
        payload: {
          full_name: fullName,
          email,
          phone: phone.trim() || null,
        },
      },
      {
        onSuccess: onSaved,
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
    >
      <h3 className="text-base font-semibold text-slate-900">Edit volunteer</h3>

      <div>
        <label
          htmlFor={`name-${String(volunteer.id)}`}
          className="block text-xs font-medium text-slate-600 mb-1"
        >
          Full name
        </label>
        <input
          id={`name-${String(volunteer.id)}`}
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-900 outline-none"
        />
      </div>

      <div>
        <label
          htmlFor={`email-${String(volunteer.id)}`}
          className="block text-xs font-medium text-slate-600 mb-1"
        >
          Email
        </label>
        <input
          id={`email-${String(volunteer.id)}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-900 outline-none"
        />
      </div>

      <div>
        <label
          htmlFor={`phone-${String(volunteer.id)}`}
          className="block text-xs font-medium text-slate-600 mb-1"
        >
          Phone
        </label>
        <input
          id={`phone-${String(volunteer.id)}`}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-900 outline-none"
        />
      </div>

      {isError ? (
        <p className="text-xs text-red-600">
          {error instanceof Error ? error.message : "Failed to save."}
        </p>
      ) : null}

      <div className="flex gap-2 justify-end pt-1">
        <button
          type="button"
          onClick={onCancel}
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
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};
