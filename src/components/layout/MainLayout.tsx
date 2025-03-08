
import React, { memo } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings,
  ShoppingCart,
  Kanban,
  GraduationCap,
  Bell,
  Package
} from "lucide-react";
import { DesktopSidebar } from "./sidebar/DesktopSidebar";
import { MobileSidebar } from "./sidebar/MobileSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from './Header';
import { useSidebarState } from './sidebar/useSidebarState';

type MainLayoutProps = {
  children: React.ReactNode;
  showCalendarSubmenu?: boolean;
};

// Memoize the sidebar links array since it never changes
const sidebarLinks = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Calendar", icon: Calendar, path: "/calendar" },
  { name: "Orders", icon: ShoppingCart, path: "/orders" },
  { name: "Products", icon: Package, path: "/products" },
  { name: "Customers", icon: Users, path: "/customers" },
  { name: "Production Board", icon: Kanban, path: "/production" },
  { name: "Learning Hub", icon: GraduationCap, path: "/learning-hub" },
  { name: "Notifications", icon: Bell, path: "/notifications" },
  { name: "Settings", icon: Settings, path: "/settings" }
];

const MainLayout: React.FC<MainLayoutProps> = memo(({ children, showCalendarSubmenu = false }) => {
  const isMobile = useIsMobile();
  const {
    collapsed,
    mobileOpen,
    showMainMenu,
    photographers,
    selectedPhotographers,
    toggleSidebar,
    toggleMobileSidebar,
    toggleMainMenu,
    togglePhotographer,
    isActiveLink
  } = useSidebarState(showCalendarSubmenu);

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

export default MainLayout; // Only export as default
