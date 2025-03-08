
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingBasket, 
  Users, 
  UserCircle,
  ClipboardEdit,
  Bell,
  FileBox,
  Settings,
  Package,
  Building,
  Bolt,
  Download,
} from 'lucide-react';

interface SidebarLinksProps {
  closeSidebar?: () => void;
}

export function SidebarLinks({ closeSidebar }: SidebarLinksProps) {
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { to: "/calendar", label: "Calendar", icon: <Calendar className="h-5 w-5" /> },
    { to: "/orders", label: "Orders", icon: <ShoppingBasket className="h-5 w-5" /> },
    { to: "/clients", label: "Clients", icon: <Users className="h-5 w-5" /> },
    { to: "/customers", label: "Customers", icon: <UserCircle className="h-5 w-5" /> },
    { to: "/production/board", label: "Production", icon: <ClipboardEdit className="h-5 w-5" /> },
    { to: "/products", label: "Products", icon: <Package className="h-5 w-5" /> },
    { to: "/notifications", label: "Notifications", icon: <Bell className="h-5 w-5" /> },
    { to: "/property-website/1", label: "Property Website", icon: <Building className="h-5 w-5" /> },
    { to: "/delivery/1", label: "Content Delivery", icon: <FileBox className="h-5 w-5" /> },
    { to: "/downloads", label: "Downloads", icon: <Download className="h-5 w-5" /> },
    { to: "/generate-data", label: "Generator", icon: <Bolt className="h-5 w-5" /> },
    { to: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-1 py-2">
      {links.map((link, index) => (
        <SidebarLink
          key={index}
          to={link.to}
          label={link.label}
          icon={link.icon}
          onClick={closeSidebar}
        />
      ))}
    </div>
  );
}

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
