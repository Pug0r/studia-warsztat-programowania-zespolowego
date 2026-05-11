import React, { useState } from "react";
import { Mail, Phone, Pencil, Trash2 } from "lucide-react";
import type { Volunteer } from "../types/Volunteers";
import { VolunteerEditForm } from "./VolunteerEditForm";
import { useDeleteVolunteer } from "../hooks/useVolunteers";

type Props = {
  volunteer: Volunteer;
};

export const VolunteerCard: React.FC<Props> = ({ volunteer }) => {
  const [isEditing, setIsEditing] = useState(false);
  const deleteMutation = useDeleteVolunteer();

  const handleDelete = () => {
    if (window.confirm(`Delete volunteer "${volunteer.full_name}"?`)) {
      deleteMutation.mutate(volunteer.id);
    }
  };

  if (isEditing) {
    return (
      <VolunteerEditForm
        volunteer={volunteer}
        onCancel={() => setIsEditing(false)}
        onSaved={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900">
          {volunteer.full_name}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Edit volunteer"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            aria-label="Delete volunteer"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-sm">
        <a
          href={`mailto:${volunteer.email}`}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
        >
          <Mail className="size-4 text-slate-400" />
          <span>{volunteer.email}</span>
        </a>
        {volunteer.phone ? (
          <a
            href={`tel:${volunteer.phone}`}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
          >
            <Phone className="size-4 text-slate-400" />
            <span>{volunteer.phone}</span>
          </a>
        ) : (
          <div className="flex items-center gap-2 text-slate-400">
            <Phone className="size-4" />
            <span>No phone</span>
          </div>
        )}
      </div>
    </div>
  );
};
