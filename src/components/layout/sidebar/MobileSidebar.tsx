
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, Menu, LucideIcon } from "lucide-react";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarLinks } from "./SidebarLinks";
import { PhotographerFilter } from "./PhotographerFilter";

type MobileSidebarProps = {
  mobileOpen: boolean;
  toggleMobileSidebar: () => void;
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
  hideLogo?: boolean;
};

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
                    onLinkClick={toggleMobileSidebar}
                  />
                ) : (
                  <PhotographerFilter
                    photographers={photographers}
                    selectedPhotographers={selectedPhotographers}
                    onToggle={togglePhotographer}
                    isMobile={true}
                  />
                )}
              </div>
            ) : (
              <SidebarLinks 
                links={sidebarLinks}
                isActiveLink={isActiveLink}
                onLinkClick={toggleMobileSidebar}
              />
            )}
          </div>
        </div>
        
        <div 
          className="absolute inset-0 bg-black/50 -z-10"
          onClick={toggleMobileSidebar}
        />
      </div>
    </>
  );
}
