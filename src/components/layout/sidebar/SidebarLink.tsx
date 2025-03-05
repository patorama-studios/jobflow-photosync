
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type SidebarLinkProps = {
  path: string;
  name: string;
  icon: LucideIcon;
  isActive: boolean;
  collapsed?: boolean;
  onClick?: () => void;
};

export function SidebarLink({ 
  path, 
  name, 
  icon: Icon, 
  isActive, 
  collapsed = false,
  onClick 
}: SidebarLinkProps) {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground"
      )}
      onClick={onClick}
    >
      <Icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
      {!collapsed && <span>{name}</span>}
    </Link>
  );
}
