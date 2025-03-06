
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings,
  ShoppingCart,
  Kanban,
  GraduationCap,
  Puzzle,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSampleOrders } from "@/hooks/useSampleOrders";
import { DesktopSidebar } from "./sidebar/DesktopSidebar";
import { MobileSidebar } from "./sidebar/MobileSidebar";

type SidebarProps = {
  children: React.ReactNode;
  showCalendarSubmenu?: boolean;
  showBackButton?: boolean;
};

export function SidebarLayout({ 
  children, 
  showCalendarSubmenu = false, 
  showBackButton = false 
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(!showCalendarSubmenu);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { orders } = useSampleOrders();

  // Create array of photographer objects from orders
  const photographers = Array.from(
    new Set(orders.map(order => order.photographer))
  ).map((name, index) => {
    return { 
      id: index + 1, 
      name,
      color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}` // Random color
    };
  });

  // Get selected photographers from localStorage or use all by default
  const [selectedPhotographers, setSelectedPhotographers] = useState<number[]>(() => {
    const saved = localStorage.getItem('selectedPhotographers');
    return saved ? JSON.parse(saved) : photographers.map(p => p.id);
  });

  const togglePhotographer = (id: number) => {
    setSelectedPhotographers(prev => {
      const updated = prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id];
      
      // Save to localStorage
      localStorage.setItem('selectedPhotographers', JSON.stringify(updated));
      return updated;
    });
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
      {/* Desktop Sidebar */}
      <DesktopSidebar
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
        showCalendarSubmenu={showCalendarSubmenu}
        showBackButton={showBackButton}
        showMainMenu={showMainMenu}
        toggleMainMenu={toggleMainMenu}
        sidebarLinks={sidebarLinks}
        isActiveLink={isActiveLink}
        photographers={photographers}
        selectedPhotographers={selectedPhotographers}
        togglePhotographer={togglePhotographer}
        hideLogo={true}
      />

      {/* Mobile Sidebar */}
      {isMobile && (
        <MobileSidebar
          mobileOpen={mobileOpen}
          toggleMobileSidebar={toggleMobileSidebar}
          showCalendarSubmenu={showCalendarSubmenu}
          showBackButton={showBackButton}
          showMainMenu={showMainMenu}
          toggleMainMenu={toggleMainMenu}
          sidebarLinks={sidebarLinks}
          isActiveLink={isActiveLink}
          photographers={photographers}
          selectedPhotographers={selectedPhotographers}
          togglePhotographer={togglePhotographer}
          hideLogo={true}
        />
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
