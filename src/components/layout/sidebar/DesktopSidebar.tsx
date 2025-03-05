
import { cn } from "@/lib/utils";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarLinks } from "./SidebarLinks";
import { PhotographerFilter } from "./PhotographerFilter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft, LucideIcon } from "lucide-react";

type DesktopSidebarProps = {
  collapsed: boolean;
  toggleSidebar: () => void;
  showCalendarSubmenu: boolean;
  showBackButton: boolean;
  showMainMenu: boolean;
  toggleMainMenu: () => void;
  sidebarLinks: Array<{
    name: string;
    icon: LucideIcon;
    path: string;
  }>;
  isActiveLink: (path: string) => boolean;
  photographers: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  selectedPhotographers: number[];
  togglePhotographer: (id: number) => void;
};

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
  togglePhotographer
}: DesktopSidebarProps) {
  return (
    <div 
      className={cn(
        "hidden md:flex h-full bg-sidebar transition-all duration-300 ease-in-out flex-col border-r border-sidebar-border",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <SidebarLogo collapsed={collapsed} />

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
              <SidebarLinks 
                links={sidebarLinks} 
                isActiveLink={isActiveLink} 
                collapsed={collapsed} 
              />
            ) : (
              <PhotographerFilter
                photographers={photographers}
                selectedPhotographers={selectedPhotographers}
                onToggle={togglePhotographer}
              />
            )}
          </div>
        ) : (
          <SidebarLinks 
            links={sidebarLinks} 
            isActiveLink={isActiveLink} 
            collapsed={collapsed}
          />
        )}
      </div>

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
