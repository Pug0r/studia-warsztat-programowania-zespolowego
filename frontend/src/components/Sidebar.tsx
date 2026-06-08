import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  Dog,
  HeartHandshake,
  Home,
  LogOut,
  PawPrint,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useUserProfile } from "@/modules/auth/hooks/useUserProfile";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const { role } = useUserProfile();
  const email = session?.user.email ?? "Haven Guest";

  const isDashboardOverview = location.pathname === "/dashboard";
  const isDashboardAdoptions = location.pathname === "/dashboard/adoptions";
  const isDashboardVolunteers = location.pathname === "/dashboard/volunteers";
  const isDashboardVolunteerWalks = location.pathname === "/dashboard/walks";
  const isDashboardAdmin = location.pathname === "/dashboard/admin";
  const isCoordinatorWalkCalendar =
    location.pathname === "/dashboard/walk-calendar";
  const isManageEvents = location.pathname === "/dashboard/manage-events";
  const isHealthCards = location.pathname.startsWith("/health-cards");
  const isMedicalSchedule = location.pathname.startsWith("/medical-schedule");
  const canManageWalkCalendar = role === "coordinator" || role === "admin";
  const isVet = role === "vet";
  const isAdmin = role === "admin";

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="border-r border-slate-200 bg-white p-5">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>HS</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Haven Shelter
            </p>
            <p className="text-xs text-slate-500">{email}</p>
          </div>
        </div>

        <Separator />

        <nav className="space-y-2" aria-label="Sidebar">
          <Button
            asChild
            variant={isDashboardOverview ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
          >
            <Link to="/dashboard">
              <Home className="size-4" />
              Overview
            </Link>
          </Button>
          <Button variant="ghost" className="w-full p-0">
            <Link
              to="/pets"
              className="w-full flex items-center gap-2 justify-start px-3 py-2"
            >
              <PawPrint className="size-4" />
              Animals
            </Link>
          </Button>
          <Button
            asChild
            variant={isDashboardVolunteers ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
          >
            <Link to="/dashboard/volunteers">
              <Users className="size-4" />
              Volunteers
            </Link>
          </Button>
          <Button
            asChild
            variant={isDashboardVolunteerWalks ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
          >
            <Link to="/dashboard/walks">
              <Dog className="size-4" />
              My walks
            </Link>
          </Button>
          {canManageWalkCalendar && (
            <Button
              asChild
              variant={isCoordinatorWalkCalendar ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <Link to="/dashboard/walk-calendar">
                <CalendarDays className="size-4" />
                Walk calendar
              </Link>
            </Button>
          )}
          <Button
            asChild
            variant={isDashboardAdoptions ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
          >
            <Link to="/dashboard/adoptions">
              <HeartHandshake className="size-4" />
              Adoptions
            </Link>
          </Button>
          <Button
            asChild
            variant={isManageEvents ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
          >
            <Link to="/dashboard/manage-events">
              <CalendarCheck className="size-4" />
              Manage events
            </Link>
          </Button>
          {isVet && (
            <>
              <Button
                asChild
                variant={isHealthCards ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <Link to="/health-cards">
                  <Stethoscope className="size-4" />
                  Health cards
                </Link>
              </Button>
              <Button
                asChild
                variant={isMedicalSchedule ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <Link to="/medical-schedule">
                  <CalendarClock className="size-4" />
                  Medical calendar
                </Link>
              </Button>
            </>
          )}
          {isAdmin && (
            <Button
              asChild
              variant={isDashboardAdmin ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <Link to="/dashboard/admin">
                <ShieldCheck className="size-4" />
                Admin panel
              </Link>
            </Button>
          )}
        </nav>

        <Separator />

        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
        <Button asChild variant="link" className="px-0 text-slate-600">
          <Link to="/">Back to public home</Link>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
