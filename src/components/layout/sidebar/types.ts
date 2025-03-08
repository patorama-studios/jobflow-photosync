
import { LucideIcon } from "lucide-react";

export interface SidebarLinkItem {
  name: string;
  icon: LucideIcon;
  path: string;
}

export interface Photographer {
  id: number;
  name: string;
  color: string;
}

export interface BaseSidebarProps {
  showCalendarSubmenu: boolean;
  showBackButton: boolean;
  showMainMenu: boolean;
  toggleMainMenu: () => void;
  sidebarLinks: SidebarLinkItem[];
  isActiveLink: (path: string) => boolean;
  photographers: Photographer[];
  selectedPhotographers: number[];
  togglePhotographer: (id: number) => void;
  hideLogo?: boolean;
}

export interface DesktopSidebarProps extends BaseSidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export interface MobileSidebarProps extends BaseSidebarProps {
  mobileOpen: boolean;
  toggleMobileSidebar: () => void;
}
