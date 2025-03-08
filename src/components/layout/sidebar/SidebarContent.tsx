
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarLinks } from "./SidebarLinks";
import { PhotographerFilter } from "./PhotographerFilter";
import { BaseSidebarProps } from "./types";

interface SidebarContentProps extends BaseSidebarProps {
  collapsed?: boolean;
  onLinkClick?: () => void;
}

export function SidebarContent({
  showCalendarSubmenu,
  showBackButton,
  showMainMenu,
  toggleMainMenu,
  sidebarLinks,
  isActiveLink,
  photographers,
  selectedPhotographers,
  togglePhotographer,
  collapsed,
  onLinkClick
}: SidebarContentProps) {
  return (
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
              onLinkClick={onLinkClick}
            />
          ) : (
            <PhotographerFilter
              photographers={photographers}
              selectedPhotographers={selectedPhotographers}
              onToggle={togglePhotographer}
              isMobile={!!onLinkClick}
            />
          )}
        </div>
      ) : (
        <SidebarLinks 
          links={sidebarLinks}
          isActiveLink={isActiveLink} 
          collapsed={collapsed}
          onLinkClick={onLinkClick}
        />
      )}
    </div>
  );
}
