
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type SidebarLinkProps = {
  to: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export function SidebarLink({ 
  to, 
  label, 
  icon, 
  active, 
  onClick 
}: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground"
      )}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
