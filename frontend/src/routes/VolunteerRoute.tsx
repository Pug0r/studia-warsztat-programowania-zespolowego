import { useAuth } from "@/modules/auth/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export function VolunteerRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading your schedule...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //   const role = session?.user?.user_metadata?.role as string | undefined;
  //   if (role !== "volunteer") {
  //     return (
  //       <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
  //         <h1 className="text-xl font-semibold text-slate-900">Access denied</h1>
  //         <p className="text-sm text-slate-600">
  //           This page is only available to shelter volunteers.
  //         </p>
  //       </div>
  //     );
  //   }

  return <>{children}</>;
}
