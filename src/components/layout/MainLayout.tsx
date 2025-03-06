
import React, { useState, useMemo, memo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings,
  ShoppingCart,
  Kanban,
  GraduationCap,
  Bell,
} from "lucide-react";
import { DesktopSidebar } from "./sidebar/DesktopSidebar";
import { MobileSidebar } from "./sidebar/MobileSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from './Header';
import { useSampleOrders } from "@/hooks/useSampleOrders";

type MainLayoutProps = {
  children: React.ReactNode;
  showCalendarSubmenu?: boolean;
};

// Memoize the sidebar links array since it never changes
const useSidebarLinks = () => {
  return useMemo(() => [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Calendar", icon: Calendar, path: "/calendar" },
    { name: "Orders", icon: ShoppingCart, path: "/orders" },
    { name: "Customers", icon: Users, path: "/customers" },
    { name: "Production Board", icon: Kanban, path: "/production" },
    { name: "Learning Hub", icon: GraduationCap, path: "/learning" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Settings", icon: Settings, path: "/settings" }
  ], []);
};

const MainLayout: React.FC<MainLayoutProps> = memo(({ children, showCalendarSubmenu = false }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(!showCalendarSubmenu);
  const location = useLocation();
  const isMobile = useIsMobile();
  const sidebarLinks = useSidebarLinks();
  const { orders } = useSampleOrders();

  // Create array of photographer objects from orders
  const photographers = useMemo(() => Array.from(
    new Set(orders.map(order => order.photographer))
  ).map((name, index) => {
    return { 
      id: index + 1, 
      name,
      color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}` // Random color
    };
  }), [orders]);

  // Get selected photographers from localStorage or use all by default
  const [selectedPhotographers, setSelectedPhotographers] = useState<number[]>(() => {
    const saved = localStorage.getItem('selectedPhotographers');
    return saved ? JSON.parse(saved) : photographers.map(p => p.id);
  });

  // Update selected photographers if photographers list changes
  useEffect(() => {
    const saved = localStorage.getItem('selectedPhotographers');
    if (!saved) {
      setSelectedPhotographers(photographers.map(p => p.id));
    }
  }, [photographers]);

  // Memoize expensive functions
  const toggleSidebar = useCallback(() => 
    setCollapsed(prev => !prev),
  []);
  
  const toggleMobileSidebar = useCallback(() => 
    setMobileOpen(prev => !prev),
  []);

  const toggleMainMenu = useCallback(() => 
    setShowMainMenu(prev => !prev),
  []);

  const togglePhotographer = useCallback((id: number) => {
    setSelectedPhotographers(prev => {
      const updated = prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id];
      
      // Save to localStorage
      localStorage.setItem('selectedPhotographers', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Memoize active link checker function
  const isActiveLink = useMemo(() => (path: string) => 
    location.pathname === path || location.pathname.startsWith(`${path}/`),
  [location.pathname]);

  // Update showMainMenu when showCalendarSubmenu changes
  useEffect(() => {
    setShowMainMenu(!showCalendarSubmenu);
  }, [showCalendarSubmenu]);

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Only render the appropriate sidebar based on device type */}
        {!isMobile ? (
          <DesktopSidebar
            collapsed={collapsed}
            toggleSidebar={toggleSidebar}
            showCalendarSubmenu={showCalendarSubmenu}
            showBackButton={showCalendarSubmenu && !showMainMenu}
            showMainMenu={showMainMenu}
            toggleMainMenu={toggleMainMenu}
            sidebarLinks={sidebarLinks}
            isActiveLink={isActiveLink}
            photographers={photographers}
            selectedPhotographers={selectedPhotographers}
            togglePhotographer={togglePhotographer}
          />
        ) : (
          <MobileSidebar
            mobileOpen={mobileOpen}
            toggleMobileSidebar={toggleMobileSidebar}
            showCalendarSubmenu={showCalendarSubmenu}
            showBackButton={showCalendarSubmenu && !showMainMenu}
            showMainMenu={showMainMenu}
            toggleMainMenu={toggleMainMenu}
            sidebarLinks={sidebarLinks}
            isActiveLink={isActiveLink}
            photographers={photographers}
            selectedPhotographers={selectedPhotographers}
            togglePhotographer={togglePhotographer}
          />
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto pt-16"> {/* Add padding top for the header */}
          <div className="container py-6 px-1 md:px-2 lg:px-4 max-w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

export { MainLayout }; // Export named component

export default MainLayout; // Also export as default for backward compatibility
