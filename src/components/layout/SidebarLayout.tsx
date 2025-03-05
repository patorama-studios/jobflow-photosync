<lov-codelov-code>
import { useState, useEffect } from "react";
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
  Puzzle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Checkbox } from "@/components/ui/checkbox";
import { useSampleOrders } from "@/hooks/useSampleOrders";

type SidebarProps = {
  children: React.ReactNode;
  showCalendarSubmenu?: boolean;
  showBackButton?: boolean;
};

export function SidebarLayout({ children, showCalendarSubmenu = false, showBackButton = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(!showCalendarSubmenu);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { orders } = useSampleOrders();
  const [selectedPhotographers, setSelectedPhotographers] = useState<number[]>([1, 2, 3, 4, 5]);
  
  // Create array of photographer objects from orders
  const photographers = Array.from(
    new Set(orders.map(order => order.photographer))
  ).map(name => {
    const id = orders.findIndex(order => order.photographer === name) + 1;
    return { 
      id, 
      name,
      color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}` // Random color
    };
  });

  const togglePhotographer = (id: number) => {
    setSelectedPhotographers(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id]
    );
  };

  const toggleMainMenu = () => {
    setShowMainMenu(!showMainMenu);
  };
  
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

  // Push content to the edge when in calendar submenu mode
  useEffect(() => {
    if (showCalendarSubmenu && !isMobile) {
      setCollapsed(false);
    }
  }, [showCalendarSubmenu, isMobile]);

  // Set initial state of main menu based on showCalendarSubmenu prop
  useEffect(() => {
    setShowMainMenu(!showCalendarSubmenu);
  }, [showCalendarSubmenu]);

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

        {/* Navigation Links or Calendar Submenu */}
        <div className="flex-1 overflow-y-auto py-6 px-3">
          {showCalendarSubmenu ? (
            <div className="space-y-4">
              {showBackButton && (
                <Button 
                  variant="ghost" 
                  className="flex items-center w-full mb-4 justify-start"
                  onClick={toggleMainMenu}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span>Main Menu</span>
                </Button>
              )}
              
              {showMainMenu ? (
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
              ) : (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-3 px-3">Photographers</h3>
                  <div className="space-y-2">
                    {photographers.map((photographer) => (
                      <div key={photographer.id} className="flex items-center space-x-2 px-3 py-1">
                        <Checkbox 
                          id={`photographer-${photographer.id}`}
                          checked={selectedPhotographers.includes(photographer.id)}
                          onCheckedChange={() => togglePhotographer(photographer.id)}
                        />
                        <label 
                          htmlFor={`photographer-${photographer.id}`}
                          className="text-sm flex items-center cursor-pointer"
                        >
                          <span 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: photographer.color }}
                          ></span>
                          {photographer.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
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
          )}
        </div>

        {/* Collapse toggle */}
        {!showCalendarSubmenu && (
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
        )}
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

            {/* Navigation Links or Calendar Submenu */}
            <div className="flex-1 overflow-y-auto py-6 px-3">
              {showCalendarSubmenu ? (
                <div className="space-y-4">
                  {showBackButton && (
                    <Button 
                      variant="ghost" 
                      className="flex items-center w-full mb-4 justify-start"
                      onClick={toggleMainMenu}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      <span>Main Menu</span>
                    </Button>
                  )}
                  
                  {showMainMenu ? (
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
                  ) : (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-3">Photographers</h3>
                      <div className="space-y-2">
                        {photographers.map((photographer) => (
                          <div key={photographer.id} className="flex items-center space-x-2 py-1">
                            <Checkbox 
                              id={`mobile-photographer-${photographer.id}`}
                              checked={selectedPhotographers.includes(photographer.id)}
                              onCheckedChange={() => togglePhotographer(photographer.id)}
                            />
                            <label 
                              htmlFor={`mobile-photographer-${photographer.id}`}
                              className="text-sm flex items-center cursor-pointer"
                            >
                              <span 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: photographer.color }}
                              ></span>
                              {photographer.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
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
              )}
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
      <div className="flex-1 overflow-y-auto">
        <div className="container py-6 px-1 md:px-2 lg:px-4 max-w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
</lov-code>
