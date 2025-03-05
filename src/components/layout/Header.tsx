
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  User,
  X,
  Menu
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarLinks } from './sidebar/SidebarLinks';
import { LayoutDashboard, Calendar, Users, Settings, ShoppingCart, Kanban, GraduationCap, Puzzle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { toast } = useToast();
  const { settings } = useHeaderSettings();
  const [showSearch, setShowSearch] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const sidebarLinks = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Calendar", icon: Calendar, path: "/calendar" },
    { name: "Orders", icon: ShoppingCart, path: "/orders" },
    { name: "Customers", icon: Users, path: "/customers" },
    { name: "Production Board", icon: Kanban, path: "/production" },
    { name: "Apps", icon: Puzzle, path: "/apps" },
    { name: "Learning Hub", icon: GraduationCap, path: "/learning" },
    { name: "Settings", icon: Settings, path: "/settings" }
  ];

  // Helper function to determine if a link is active
  const isActiveLink = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Determine if we need light text based on background color
  const isTextLight = settings.color === '#000000' || settings.color.toLowerCase() === 'black';

  return (
    <header 
      className="w-full border-b sticky top-0 z-50 bg-background" 
      style={{ 
        backgroundColor: settings.color || 'hsl(var(--background))',
        height: `${settings.height || 65}px`
      }}
    >
      <div className="container flex items-center justify-between h-full px-4">
        {/* Mobile Menu */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`${isTextLight ? 'text-white hover:text-white hover:bg-white/10' : ''}`}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="py-4 px-2">
                <SidebarLinks 
                  links={sidebarLinks} 
                  isActiveLink={isActiveLink}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Logo */}
        <div className="flex items-center">
          {settings.logoUrl ? (
            <Link to="/">
              <img 
                src={settings.logoUrl} 
                alt="Company Logo" 
                className="h-8 w-auto" 
              />
            </Link>
          ) : (
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded">PS</div>
          )}
          
          {/* Company name (optional based on settings) */}
          {settings.showCompanyName && (
            <span className={`font-semibold text-lg ml-2 ${isTextLight ? 'text-white' : ''}`}>
              Patorama Studios
            </span>
          )}
        </div>

        {/* Search Bar (Mobile Design or Main Design) */}
        {showSearch && isMobile ? (
          <div className="flex-1 px-4 flex items-center">
            <GlobalSearch onClose={() => setShowSearch(false)} />
          </div>
        ) : (
          <>
            {/* Desktop Search - Centered */}
            <div className={`${isMobile ? 'hidden' : 'flex justify-center'} w-full max-w-lg mx-auto`}>
              <GlobalSearch />
            </div>
            
            {/* Mobile Search Button */}
            {isMobile && (
              <Button 
                onClick={() => setShowSearch(true)} 
                variant="ghost" 
                size="icon" 
                className={`${isTextLight ? 'text-white hover:text-white hover:bg-white/10' : ''}`}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </>
        )}
        
        {/* Notifications and User Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <Notifications isTextLight={isTextLight} />
          
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full ${isTextLight ? 'text-white hover:text-white hover:bg-white/10' : ''}`}
              >
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
      </div>
    </header>
  );
}
