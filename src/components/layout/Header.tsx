
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Settings, 
  Bell, 
  LogOut, 
  Menu, 
  MessageSquarePlus, 
  LogIn, 
  UserPlus 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GlobalSearch from "./GlobalSearch";
import Notifications from "./Notifications";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useHeaderSettings } from "@/hooks/useHeaderSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function Header() {
  const { session, user } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { headerSettings } = useHeaderSettings();
  const isLoggedIn = !!session;
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    } else if (profile.full_name) {
      const parts = profile.full_name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
      } else if (parts.length === 1) {
        return parts[0].charAt(0);
      }
    }
    return user?.email?.charAt(0).toUpperCase() || '?';
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  // Generate CSS variables for dynamic header styling
  const headerStyles = {
    '--header-height': headerSettings?.height ? `${headerSettings.height}px` : '64px',
    '--header-bg': headerSettings?.backgroundColor || '#ffffff',
    '--header-text': headerSettings?.textColor || '#000000',
    '--header-border': headerSettings?.borderColor || '#e2e8f0',
  } as React.CSSProperties;

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b"
      style={headerStyles}
    >
      <div className="flex h-[var(--header-height)] items-center px-4 gap-4">
        {/* Mobile menu button - visible on small screens */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Logo */}
        <div className="flex-1 md:flex-initial">
          {headerSettings?.showLogo && headerSettings?.logoUrl ? (
            <img 
              src={headerSettings.logoUrl} 
              alt="Logo" 
              className="h-8 sm:h-10 object-contain" 
            />
          ) : (
            <span className="font-semibold text-lg">
              {headerSettings?.companyName || "Patorama Studios"}
            </span>
          )}
        </div>
        
        {/* Global search - hide on small screens */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <GlobalSearch />
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Notifications />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar} alt={profile.firstName} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile.firstName ? `${profile.firstName} ${profile.lastName}` : profile.full_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                <LogIn className="mr-2 h-4 w-4" />
                <span>Log in</span>
              </Button>
              <Button variant="default" size="sm" onClick={() => navigate('/register')}>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Register</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
