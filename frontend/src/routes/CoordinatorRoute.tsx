import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useUserProfile } from "@/modules/auth/hooks/useUserProfile";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export function CoordinatorRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();
  const { role, isLoading, error } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || error) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "coordinator" && role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-slate-50 p-6 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Access denied</h1>
        <p className="text-sm text-slate-600">
          This page is only available to coordinators.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
