
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShoppingCart,
  Kanban,
  GraduationCap,
  AppWindow,
  Puzzle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type SidebarProps = {
  children: React.ReactNode;
};

export function SidebarLayout({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
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

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  // Helper function to determine if a link is active
  const isActiveLink = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar for desktop */}
      <div 
        className={cn(
          "hidden md:flex h-full bg-sidebar transition-all duration-300 ease-in-out flex-col border-r border-sidebar-border",
          collapsed ? "w-[70px]" : "w-[240px]"
        )}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center space-x-2">
            <span className="bg-primary text-white px-2 py-1 rounded font-bold">PS</span>
            {!collapsed && <span className="font-semibold">Patorama Studios</span>}
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3">
          <nav className="space-y-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActiveLink(link.path) 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground"
                )}
              >
                <link.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                {!collapsed && <span>{link.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-sidebar-border">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex justify-center"
            onClick={toggleSidebar}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isMobile && (
        <div 
          className={cn(
            "fixed inset-0 z-40 transform transition-transform ease-in-out duration-300 md:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="relative flex h-full w-[240px] flex-col bg-sidebar border-r border-sidebar-border">
            {/* Close button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4"
              onClick={toggleMobileSidebar}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Logo area */}
            <div className="flex h-16 items-center px-4 border-b border-sidebar-border mt-2">
              <Link to="/" className="flex items-center space-x-2">
                <span className="bg-primary text-white px-2 py-1 rounded font-bold">PS</span>
                <span className="font-semibold">Patorama Studios</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-6 px-3">
              <nav className="space-y-2">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActiveLink(link.path) 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "text-sidebar-foreground"
                    )}
                    onClick={toggleMobileSidebar}
                  >
                    <link.icon className="h-5 w-5 mr-3" />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 -z-10"
            onClick={toggleMobileSidebar}
          />
        </div>
      )}

      {/* Main content */}
      <div className={cn(
        "flex-1 overflow-y-auto transition-all duration-300",
        isMobile ? "w-full" : (collapsed ? "ml-[70px]" : "ml-[240px]")
      )}>
        <div className="container py-6 px-4 md:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
