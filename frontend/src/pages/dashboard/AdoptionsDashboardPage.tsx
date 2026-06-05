import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HeartHandshake } from "lucide-react";
import { ADOPTION_STATUSES, type AdoptionStatus } from "@repo/types";

import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAdoptionApplications,
  updateAdoptionStatus,
} from "@/modules/adoption/api";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export function AdoptionsDashboardPage() {
  const queryClient = useQueryClient();

  const {
    data: applications = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["adoption_applications"],
    queryFn: getAdoptionApplications,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: AdoptionStatus }) =>
      updateAdoptionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adoption_applications"] });
    },
  });

  const newCount = applications.filter(
    (application) => application.status === "new",
  ).length;

  const reviewingCount = applications.filter(
    (application) => application.status === "reviewing",
  ).length;

  const acceptedCount = applications.filter(
    (application) => application.status === "accepted",
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "rejected",
  ).length;

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="space-y-2">
          <Badge>Adoptions</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Adoption applications
          </h1>
          <p className="text-sm text-slate-600">
            Review current applications and update their progress.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>New</CardDescription>
              <CardTitle className="text-2xl">{newCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Reviewing</CardDescription>
              <CardTitle className="text-2xl">{reviewingCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Accepted</CardDescription>
              <CardTitle className="text-2xl">{acceptedCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Rejected</CardDescription>
              <CardTitle className="text-2xl">{rejectedCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartHandshake className="size-5" />
              Status management
            </CardTitle>
            <CardDescription>
              Each change is saved immediately after selecting a new status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPending ? (
              <p className="text-sm text-slate-500">
                Loading adoption applications...
              </p>
            ) : null}

            {error instanceof Error ? (
              <p className="text-sm text-red-600">{error.message}</p>
            ) : null}

            {!isPending && applications.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                No adoption applications yet.
              </div>
            ) : null}

            {applications.map((application) => {
              const petLabel = application.pet
                ? `${application.pet.name} (${application.pet.species})`
                : `Pet #${application.pet_id}`;
              const isUpdating =
                updateStatusMutation.isPending &&
                updateStatusMutation.variables?.id === application.id;

              return (
                <div
                  key={application.id}
                  className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px]"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {application.full_name}
                      </p>
                      <Badge variant="outline">{petLabel}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      {application.email}
                    </p>
                    {application.phone ? (
                      <p className="text-sm text-slate-500">
                        Phone: {application.phone}
                      </p>
                    ) : null}
                    <p className="text-sm text-slate-500">
                      Submitted: {formatDate(application.created_at)}
                    </p>
                    <p className="text-sm text-slate-700">
                      {application.message}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`status-${application.id}`}
                      className="text-sm font-medium text-slate-700"
                    >
                      Status
                    </label>
                    <select
                      id={`status-${application.id}`}
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm shadow-xs outline-none focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50"
                      value={application.status}
                      disabled={isUpdating}
                      onChange={(event) =>
                        updateStatusMutation.mutate({
                          id: application.id,
                          status: event.target.value as AdoptionStatus,
                        })
                      }
                    >
                      {ADOPTION_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {isUpdating ? (
                      <p className="text-xs text-slate-500">Saving change...</p>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {updateStatusMutation.error instanceof Error ? (
              <p className="text-sm text-red-600">
                {updateStatusMutation.error.message}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
