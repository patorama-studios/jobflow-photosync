
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarLink } from './SidebarLink';
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
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="space-y-1 py-2">
      <SidebarLink 
        to="/dashboard" 
        label="Dashboard" 
        icon={<LayoutDashboard className="h-5 w-5" />} 
        active={isActive('/dashboard')}
        onClick={closeSidebar}
      />
      <SidebarLink 
        to="/calendar" 
        label="Calendar" 
        icon={<Calendar className="h-5 w-5" />} 
        active={isActive('/calendar')}
        onClick={closeSidebar}
      />
      <SidebarLink 
        to="/orders" 
        label="Orders" 
        icon={<ShoppingBasket className="h-5 w-5" />} 
        active={isActive('/orders')}
        onClick={closeSidebar}
      />
      <SidebarLink 
        to="/clients" 
        label="Clients" 
        icon={<Users className="h-5 w-5" />} 
        active={isActive('/clients')}
        onClick={closeSidebar}
      />
      <SidebarLink 
        to="/customers" 
        label="Customers" 
        icon={<UserCircle className="h-5 w-5" />} 
        active={isActive('/customers')}
        onClick={closeSidebar}
      />
      <SidebarLink 
        to="/production/board" 
        label="Production" 
        icon={<ClipboardEdit className="h-5 w-5" />} 
        active={isActive('/production')}
        onClick={closeSidebar}
      />
      <SidebarLink 
        to="/products" 
        label="Products" 
        icon={<Package className="h-5 w-5" />} 
        active={isActive('/products')}
        onClick={closeSidebar}
      />
      <SidebarLink 
        to="/notifications" 
        label="Notifications" 
        icon={<Bell className="h-5 w-5" />} 
        active={isActive('/notifications')}
        onClick={closeSidebar}
      />
      <SidebarLink 
        to="/property-website/1" 
        label="Property Website" 
        icon={<Building className="h-5 w-5" />} 
        active={isActive('/property-website')}
        onClick={closeSidebar}
      />
      <SidebarLink 
        to="/delivery/1" 
        label="Content Delivery" 
        icon={<FileBox className="h-5 w-5" />} 
        active={isActive('/delivery')}
        onClick={closeSidebar}
      />
      <SidebarLink 
        to="/downloads" 
        label="Downloads" 
        icon={<Download className="h-5 w-5" />} 
        active={isActive('/downloads')}
        onClick={closeSidebar}
      />
      <SidebarLink 
        to="/generate-data" 
        label="Generator" 
        icon={<Bolt className="h-5 w-5" />} 
        active={isActive('/generate-data')}
        onClick={closeSidebar}
      />
      <SidebarLink 
        to="/settings" 
        label="Settings" 
        icon={<Settings className="h-5 w-5" />} 
        active={isActive('/settings')}
        onClick={closeSidebar}
      />
    </div>
  );
}
