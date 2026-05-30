import { Badge } from "@/components/ui/badge";
import type { UserRole } from "../types/Users";

const ROLE_LABELS: Record<UserRole, string> = {
  user: "User",
  admin: "Admin",
  vet: "Vet",
  coordinator: "Coordinator",
  volunteer: "Volunteer",
};

type Props = {
  role: UserRole;
};

export const UserRoleBadge = ({ role }: Props) => {
  return <Badge variant="secondary">{ROLE_LABELS[role]}</Badge>;
};
