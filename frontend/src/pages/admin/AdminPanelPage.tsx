import { ShieldCheck } from "lucide-react";
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
import { UsersTable } from "@/modules/admin/components/UsersTable";
import { useUsers } from "@/modules/admin/hooks/useUsers";

export function AdminPanelPage() {
  const { data: users = [], isPending, error } = useUsers();
  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = normalizedSearch
    ? users.filter(
        (user) =>
          (user.email ?? "").toLowerCase().includes(normalizedSearch) ||
          user.role.toLowerCase().includes(normalizedSearch) ||
          user.id.toLowerCase().includes(normalizedSearch),
      )
    : users;

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="space-y-2">
          <Badge>Administration</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Admin panel
          </h1>
          <p className="text-sm text-slate-600">
            Manage user accounts, review roles, and remove users from the
            system.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Search by email, role or ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full max-w-sm rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs outline-none focus:border-slate-900"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5" />
              All users ({users.length})
            </CardTitle>
            <CardDescription>
              Click View to inspect a user and change their role. Delete removes
              the account permanently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p className="text-sm text-slate-500">Loading users...</p>
            ) : null}

            {error instanceof Error ? (
              <p className="text-sm text-red-600">{error.message}</p>
            ) : null}

            {!isPending && users.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                No users found.
              </div>
            ) : null}

            {!isPending && users.length > 0 && filtered.length === 0 ? (
              <p className="text-sm text-slate-500">
                No users match your search.
              </p>
            ) : null}

            {!isPending && filtered.length > 0 ? (
              <UsersTable users={filtered} />
            ) : null}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
