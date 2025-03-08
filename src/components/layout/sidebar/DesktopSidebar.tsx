
import { cn } from "@/lib/utils";
import { SidebarLogo } from "./SidebarLogo";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarContent } from "./SidebarContent";
import { DesktopSidebarProps } from "./types";

export function DesktopSidebar({
  collapsed,
  toggleSidebar,
  showCalendarSubmenu,
  showBackButton,
  showMainMenu,
  toggleMainMenu,
  sidebarLinks,
  isActiveLink,
  photographers,
  selectedPhotographers,
  togglePhotographer,
  hideLogo = false
}: DesktopSidebarProps) {
  return (
    <div 
      className={cn(
        "hidden md:flex h-full bg-sidebar transition-all duration-300 ease-in-out flex-col border-r border-sidebar-border",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <SidebarLogo collapsed={collapsed} hide={hideLogo} />

      <SidebarContent
        showCalendarSubmenu={showCalendarSubmenu}
        showBackButton={showBackButton}
        showMainMenu={showMainMenu}
        toggleMainMenu={toggleMainMenu}
        sidebarLinks={sidebarLinks}
        isActiveLink={isActiveLink}
        photographers={photographers}
        selectedPhotographers={selectedPhotographers}
        togglePhotographer={togglePhotographer}
        collapsed={collapsed}
      />

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
  );
}
