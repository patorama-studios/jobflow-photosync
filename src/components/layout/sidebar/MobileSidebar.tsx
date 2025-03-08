
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarContent } from "./SidebarContent";
import { MobileSidebarProps } from "./types";

export function MobileSidebar({
  mobileOpen,
  toggleMobileSidebar,
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
}: MobileSidebarProps) {
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div 
        className={cn(
          "fixed inset-0 z-40 transform transition-transform ease-in-out duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="relative flex h-full w-[240px] flex-col bg-sidebar border-r border-sidebar-border">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4"
            onClick={toggleMobileSidebar}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex h-16 items-center px-4 border-b border-sidebar-border mt-2">
            <SidebarLogo hide={hideLogo} />
          </div>

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
            onLinkClick={toggleMobileSidebar}
          />
        </div>
        
        <div 
          className="absolute inset-0 bg-black/50 -z-10"
          onClick={toggleMobileSidebar}
        />
      </div>
    </>
  );
}
