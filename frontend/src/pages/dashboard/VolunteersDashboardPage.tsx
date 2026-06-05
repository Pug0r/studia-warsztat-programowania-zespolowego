import { Users } from "lucide-react";
import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVolunteers } from "@/modules/volunteers/hooks/useVolunteers";
import { VolunteerCard } from "@/modules/volunteers/components/VolunteerCard";
import { VolunteerCreateForm } from "@/modules/volunteers/components/VolunteerCreateForm";

export function VolunteersDashboardPage() {
  const { data: volunteers = [], isPending, error } = useVolunteers();
  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = normalizedSearch
    ? volunteers.filter(
        (v) =>
          v.full_name.toLowerCase().includes(normalizedSearch) ||
          v.email.toLowerCase().includes(normalizedSearch) ||
          (v.phone ?? "").toLowerCase().includes(normalizedSearch),
      )
    : volunteers;

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="space-y-2">
          <Badge>Volunteers</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Volunteers contact database
          </h1>
          <p className="text-sm text-slate-600">
            Browse and edit volunteer contact data. Click email or phone for
            quick contact.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs outline-none focus:border-slate-900"
          />
          <VolunteerCreateForm />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              All volunteers ({volunteers.length})
            </CardTitle>
            <CardDescription>
              Click pencil to edit, trash to remove. Email and phone are
              clickable for quick contact.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p className="text-sm text-slate-500">Loading volunteers...</p>
            ) : null}

            {error instanceof Error ? (
              <p className="text-sm text-red-600">{error.message}</p>
            ) : null}

            {!isPending && volunteers.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                No volunteers yet. Add the first one above.
              </div>
            ) : null}

            {!isPending && volunteers.length > 0 && filtered.length === 0 ? (
              <p className="text-sm text-slate-500">
                No volunteers match your search.
              </p>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((volunteer) => (
                <VolunteerCard key={volunteer.id} volunteer={volunteer} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
