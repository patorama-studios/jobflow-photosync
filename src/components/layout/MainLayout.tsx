
import React, { useState, useMemo, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings,
  ShoppingCart,
  Kanban,
  GraduationCap,
  Puzzle,
  Bell
} from "lucide-react";
import { DesktopSidebar } from "./sidebar/DesktopSidebar";
import { MobileSidebar } from "./sidebar/MobileSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from './Header';

type MainLayoutProps = {
  children: React.ReactNode;
};

// Memoize the sidebar links array since it never changes
const useSidebarLinks = () => {
  return useMemo(() => [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Calendar", icon: Calendar, path: "/calendar" },
    { name: "Orders", icon: ShoppingCart, path: "/orders" },
    { name: "Customers", icon: Users, path: "/customers" },
    { name: "Production Board", icon: Kanban, path: "/production" },
    { name: "Apps", icon: Puzzle, path: "/apps" },
    { name: "Learning Hub", icon: GraduationCap, path: "/learning" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Settings", icon: Settings, path: "/settings" }
  ], []);
};

const MainLayout: React.FC<MainLayoutProps> = memo(({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const sidebarLinks = useSidebarLinks();

  // Memoize expensive functions
  const toggleSidebar = useMemo(() => () => 
    setCollapsed(prev => !prev), 
  []);
  
  const toggleMobileSidebar = useMemo(() => () => 
    setMobileOpen(prev => !prev), 
  []);

  // Memoize active link checker function
  const isActiveLink = useMemo(() => (path: string) => 
    location.pathname === path || location.pathname.startsWith(`${path}/`),
  [location.pathname]);

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
            showCalendarSubmenu={false}
            showBackButton={false}
            showMainMenu={true}
            toggleMainMenu={() => {}}
            sidebarLinks={sidebarLinks}
            isActiveLink={isActiveLink}
            photographers={[]}
            selectedPhotographers={[]}
            togglePhotographer={() => {}}
          />
        ) : (
          <MobileSidebar
            mobileOpen={mobileOpen}
            toggleMobileSidebar={toggleMobileSidebar}
            showCalendarSubmenu={false}
            showBackButton={false}
            showMainMenu={true}
            toggleMainMenu={() => {}}
            sidebarLinks={sidebarLinks}
            isActiveLink={isActiveLink}
            photographers={[]}
            selectedPhotographers={[]}
            togglePhotographer={() => {}}
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

export default MainLayout;
