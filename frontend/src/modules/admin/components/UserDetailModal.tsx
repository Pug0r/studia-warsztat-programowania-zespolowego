import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from "@/lib/toast";
import { useUser } from "../hooks/useUser";
import { useUpdateUserRole } from "../hooks/useUsers";
import {
  USER_ROLE_OPTIONS,
  type UserProfile,
  type UserRole,
} from "../types/Users";
import { UserRoleBadge } from "./UserRoleBadge";

type Props = {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

type UserDetailBodyProps = {
  user: UserProfile;
  userId: string;
  onClose: () => void;
};

const UserDetailBody = ({ user, userId, onClose }: UserDetailBodyProps) => {
  const updateRoleMutation = useUpdateUserRole();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);

  const handleSaveRole = () => {
    if (selectedRole === user.role) {
      return;
    }

    updateRoleMutation.mutate(
      { id: userId, payload: { role: selectedRole } },
      {
        onSuccess: () => {
          showToast("User role updated.", "success");
        },
        onError: (mutationError) => {
          showToast(
            mutationError.message || "Failed to update user role.",
            "error",
          );
        },
      },
    );
  };

  return (
    <>
      <div className="space-y-4">
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Email
            </dt>
            <dd className="mt-1 text-slate-900">{user.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              User ID
            </dt>
            <dd className="mt-1 break-all font-mono text-xs text-slate-700">
              {user.id}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Current role
            </dt>
            <dd className="mt-1">
              <UserRoleBadge role={user.role} />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Created at
            </dt>
            <dd className="mt-1 text-slate-700">
              {formatDateTime(user.created_at)}
            </dd>
          </div>
        </dl>

        <div>
          <label
            htmlFor="user-role-select"
            className="block text-xs font-medium text-slate-600 mb-1.5"
          >
            Change role
          </label>
          <select
            id="user-role-select"
            value={selectedRole}
            onChange={(event) =>
              setSelectedRole(event.target.value as UserRole)
            }
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
          >
            {USER_ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button
          type="button"
          disabled={selectedRole === user.role || updateRoleMutation.isPending}
          onClick={handleSaveRole}
        >
          {updateRoleMutation.isPending ? "Saving..." : "Save role"}
        </Button>
      </DialogFooter>
    </>
  );
};

export const UserDetailModal = ({ userId, isOpen, onClose }: Props) => {
  const { data: user, isPending, error } = useUser(userId, { enabled: isOpen });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-full p-6">
        <DialogHeader>
          <DialogTitle>User details</DialogTitle>
          <DialogDescription>
            Review account information and update the user role.
          </DialogDescription>
        </DialogHeader>

        {isPending ? (
          <p className="text-sm text-slate-500">Loading user...</p>
        ) : null}

        {error instanceof Error ? (
          <p className="text-sm text-red-600">{error.message}</p>
        ) : null}

        {user && userId ? (
          <UserDetailBody
            key={user.id}
            user={user}
            userId={userId}
            onClose={onClose}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
