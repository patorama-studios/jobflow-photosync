
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

interface SidebarLinksProps {
  closeSidebar?: () => void;
  links?: Array<{ name: string; icon: LucideIcon; path: string }>;
  isActiveLink?: (path: string) => boolean;
  collapsed?: boolean;
  onLinkClick?: () => void;
}

export function SidebarLinks({ 
  closeSidebar, 
  links, 
  isActiveLink, 
  collapsed,
  onLinkClick 
}: SidebarLinksProps) {
  // Use the passed links prop if provided, otherwise use the default links array
  const defaultLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { to: "/calendar", label: "Calendar", icon: "Calendar" },
    { to: "/orders", label: "Orders", icon: "ShoppingBasket" },
    { to: "/products", label: "Products", icon: "Package" },
    { to: "/clients", label: "Clients", icon: "Users" },
    { to: "/customers", label: "Customers", icon: "UserCircle" },
    { to: "/notifications", label: "Notifications", icon: "Bell" },
    { to: "/property-website/1", label: "Property Website", icon: "Building" },
    { to: "/delivery/1", label: "Content Delivery", icon: "FileBox" },
    { to: "/downloads", label: "Downloads", icon: "Download" },
    { to: "/generate-data", label: "Generator", icon: "Bolt" },
    { to: "/settings", label: "Settings", icon: "Settings" },
  ];
  
  const renderLinks = () => {
    if (links) {
      return links.map((link, index) => {
        const Icon = link.icon;
        const isActive = isActiveLink ? isActiveLink(link.path) : false;
        
        return (
          <SidebarLink
            key={index}
            to={link.path}
            label={link.name}
            icon={<Icon className="h-5 w-5" />}
            active={isActive}
            onClick={onLinkClick || closeSidebar}
          />
        );
      });
    }
    
    return defaultLinks.map((link, index) => (
      <SidebarLink
        key={index}
        to={link.to}
        label={link.label}
        icon={link.icon}
        onClick={closeSidebar}
      />
    ));
  };

  return (
    <div className={cn("space-y-1 py-2", collapsed && "flex flex-col items-center")}>
      {renderLinks()}
    </div>
  );
}

type SidebarLinkProps = {
  to: string;
  label: string;
  icon: React.ReactNode | string;
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
  // Render icon based on type (ReactNode or string)
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return <span className="mr-3">{icon}</span>;
    }
    
    return null;
  };

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
      {renderIcon()}
      <span>{label}</span>
    </Link>
  );
}
