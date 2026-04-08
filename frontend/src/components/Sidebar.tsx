import {
  HeartHandshake,
  Home,
  LifeBuoy,
  LogOut,
  PawPrint,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/modules/auth/AuthProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Sidebar = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const email = session?.user.email ?? "staff@haven-shelter.org";

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
          <Button variant="secondary" className="w-full justify-start gap-2">
            <Home className="size-4" />
            Overview
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <PawPrint className="size-4" />
            Animals
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Users className="size-4" />
            Volunteers
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <HeartHandshake className="size-4" />
            Adoptions
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LifeBuoy className="size-4" />
            Support cases
          </Button>
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
