
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings,
  ShoppingCart,
  Kanban,
  GraduationCap,
  Puzzle,
  Package,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DesktopSidebar } from "./sidebar/DesktopSidebar";
import { MobileSidebar } from "./sidebar/MobileSidebar";
import { useSidebarState } from "./sidebar/useSidebarState";

// This component is deprecated and should be removed in future versions
// Use MainLayout instead

type SidebarProps = {
  children: React.ReactNode;
  showCalendarSubmenu?: boolean;
  showBackButton?: boolean;
};

// Define sidebar links outside of component to prevent recreation on each render
const sidebarLinks = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Calendar", icon: Calendar, path: "/calendar" },
  { name: "Orders", icon: ShoppingCart, path: "/orders" },
  { name: "Products", icon: Package, path: "/products" },
  { name: "Customers", icon: Users, path: "/customers" },
  { name: "Production Board", icon: Kanban, path: "/production" },
  { name: "Apps", icon: Puzzle, path: "/apps" },
  { name: "Learning Hub", icon: GraduationCap, path: "/learning-hub" },
  { name: "Settings", icon: Settings, path: "/settings" }
];

export function SidebarLayout({ 
  children, 
  showCalendarSubmenu = false, 
  showBackButton = false 
}: SidebarProps) {
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

  // This component is deprecated, redirect to MainLayout
  console.warn('SidebarLayout is deprecated, please use MainLayout instead');

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
