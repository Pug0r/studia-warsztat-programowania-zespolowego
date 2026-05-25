import { useAuth } from "@/modules/auth/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export function VetRoute({ children }: Props) {
  const { session, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = session?.user?.user_metadata?.role as string | undefined;
  if (role !== "vet") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-slate-50 p-6 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Access denied</h1>
        <p className="text-sm text-slate-600">
          This section is only available to vets.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
