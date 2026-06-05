import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { useDeleteUser } from "../hooks/useUsers";
import type { UserProfile } from "../types/Users";
import { UserDetailModal } from "./UserDetailModal";
import { UserRoleBadge } from "./UserRoleBadge";

type Props = {
  users: UserProfile[];
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const UsersTable = ({ users }: Props) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const deleteMutation = useDeleteUser();

  const handleDelete = (user: UserProfile) => {
    const label = user.email ?? user.id;
    if (
      !window.confirm(`Delete user "${label}"? This action cannot be undone.`)
    ) {
      return;
    }

    deleteMutation.mutate(user.id, {
      onSuccess: () => {
        showToast("User deleted.", "success");
        if (selectedUserId === user.id) {
          setSelectedUserId(null);
        }
      },
      onError: (error) => {
        showToast(error.message || "Failed to delete user.", "error");
      },
    });
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Role
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Created
              </th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 text-slate-900">
                  {user.email ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <UserRoleBadge role={user.role} />
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      <Eye className="size-4" />
                      View
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDelete(user)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserDetailModal
        userId={selectedUserId}
        isOpen={selectedUserId !== null}
        onClose={() => setSelectedUserId(null)}
      />
    </>
  );
};
