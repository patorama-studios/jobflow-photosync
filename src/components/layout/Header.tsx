
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { 
  LogOut, 
  User, 
  Settings,
  Bell
} from "lucide-react";
import { Notifications } from "./Notifications"; // Fixed from default import to named import
import { useHeaderSettings } from "@/hooks/useHeaderSettings";
import { GlobalSearch } from "./GlobalSearch";

export function Header() {
  const { session, user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { settings } = useHeaderSettings(); // Fixed from headerSettings to settings

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'PS';
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-10 border-b bg-background/80 backdrop-blur-sm"
      style={{
        height: `${settings?.height || 65}px`,
        backgroundColor: settings?.color || 'transparent',
      }}
    >
      <div className="container flex h-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-8 w-auto" />
            ) : (
              <span className="text-xl font-bold">Photorama</span>
            )}
            {settings?.showCompanyName && (
              <span className="hidden md:inline">Studios</span>
            )}
          </Link>
          <span className="hidden text-sm text-muted-foreground md:block">
            {settings?.title && <div className="font-medium">{settings.title}</div>}
            {settings?.description && (
              <div className="text-xs">{settings.description}</div>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <GlobalSearch />

          {session ? (
            <>
              <Notifications />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar} alt="Profile" />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/settings/user-profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')} size="sm">
                Login
              </Button>
              <Button onClick={() => navigate('/register')} size="sm">
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
