
import { SidebarLink } from "./SidebarLink";
import { LucideIcon } from "lucide-react";

type SidebarLinksProps = {
  links: Array<{
    name: string;
    icon: LucideIcon;
    path: string;
  }>;
  isActiveLink: (path: string) => boolean;
  collapsed?: boolean;
  onLinkClick?: () => void;
};

export function SidebarLinks({ 
  links, 
  isActiveLink, 
  collapsed = false,
  onLinkClick
}: SidebarLinksProps) {
  return (
    <nav className="space-y-2">
      {links.map((link) => (
        <SidebarLink
          key={link.path}
          path={link.path}
          name={link.name}
          icon={link.icon}
          isActive={isActiveLink(link.path)}
          collapsed={collapsed}
          onClick={onLinkClick}
        />
      ))}
    </nav>
  );
}
