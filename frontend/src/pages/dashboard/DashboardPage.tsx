import { useState } from "react";
import { CalendarDays, Dog } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const upcomingTasks = [
  { title: "Vet check for Luna", time: "09:00", team: "Veterinary" },
  { title: "Volunteer onboarding", time: "11:30", team: "Community" },
  { title: "Adoption meet-and-greet", time: "14:00", team: "Adoption" },
];

export function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-50 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="space-y-6 p-5 lg:p-8">
        <header className="space-y-2">
          <Badge>Operations Dashboard</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Shelter snapshot
          </h1>
          <p className="text-sm text-slate-600">
            Track adoptions, volunteers, and daily medical work in one place.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Animals in care</CardDescription>
              <CardTitle className="text-2xl">86</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              32 ready for adoption this week
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Open adoptions</CardDescription>
              <CardTitle className="text-2xl">14</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              5 home visits scheduled
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Active volunteers</CardDescription>
              <CardTitle className="text-2xl">42</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              12 currently on shift
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Medical alerts</CardDescription>
              <CardTitle className="text-2xl">3</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              2 require follow-up today
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="size-5" />
                Shelter calendar
              </CardTitle>
              <CardDescription>
                Appointments, adoptions, and community events
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s key tasks</CardTitle>
              <CardDescription>
                Priority items for teams on duty
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.title}
                  className="rounded-lg border border-slate-200 bg-white p-3 text-sm"
                >
                  <p className="font-medium text-slate-900">{task.title}</p>
                  <p className="text-slate-500">{task.time}</p>
                  <Badge variant="secondary" className="mt-2">
                    {task.team}
                  </Badge>
                </div>
              ))}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                <p className="flex items-center gap-2 font-medium">
                  <Dog className="size-4" />
                  Kennel hygiene completed for all zones.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
