
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, Search, LogOut, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';
import { GlobalSearch } from './GlobalSearch';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const { title, showBackButton, onBackButtonClick } = useHeaderSettings();

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'PS';
  };

  return (
    <header className="bg-background border-b border-border h-16 fixed top-0 left-0 right-0 z-10">
      <div className="flex h-full items-center justify-between px-4">
        {/* Logo and title section */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="bg-primary text-white px-2 py-1 rounded">PS</span>
            <span className="font-semibold hidden md:inline-block">Patorama Studios</span>
          </Link>
          {title && (
            <div className="hidden md:flex items-center">
              <span className="text-muted-foreground mx-2">|</span>
              {showBackButton && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBackButtonClick}
                  className="mr-2"
                >
                  ← Back
                </Button>
              )}
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
          )}
        </div>

        {/* Search and actions section */}
        <div className="flex items-center space-x-2">
          <GlobalSearch />

          <Button variant="ghost" size="icon" asChild>
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} alt={user?.email || 'User'} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
