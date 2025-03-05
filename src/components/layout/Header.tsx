
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  User, 
  X,
  Settings
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { GlobalSearch } from './GlobalSearch';
import { Notifications } from './Notifications';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';

export const Header: React.FC = () => {
  const { toast } = useToast();
  const { settings } = useHeaderSettings();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header 
      className="w-full border-b sticky top-0 z-50 bg-background" 
      style={{ 
        backgroundColor: settings.color || 'hsl(var(--background))',
        height: `${settings.height}px`
      }}
    >
      <div className="container flex items-center justify-between h-full px-4">
        {/* Logo/Company Name */}
        <div className="flex items-center gap-2">
          {settings.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt="Company Logo" 
              className="h-8 w-auto" 
            />
          ) : (
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded">PS</div>
          )}
          <span className="font-semibold text-lg">Patorama Studios</span>
        </div>

        {/* Search Bar (Mobile Toggle) */}
        {showSearch ? (
          <div className="flex-1 px-4 flex items-center">
            <GlobalSearch onClose={() => setShowSearch(false)} />
          </div>
        ) : (
          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Search */}
            <div className="hidden md:block w-72">
              <GlobalSearch />
            </div>
            
            {/* Mobile Search Button */}
            <Button 
              onClick={() => setShowSearch(true)} 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Notifications */}
            <Notifications />
            
            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => 
                  toast({
                    title: "Logged out",
                    description: "You have been logged out successfully.",
                  })
                }>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};
