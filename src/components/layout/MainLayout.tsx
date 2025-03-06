
import React, { useState, useMemo, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Building2
} from "lucide-react";
import { Header } from './Header';

type MainLayoutProps = {
  children: React.ReactNode;
};

// Define sidebar links
const sidebarLinks = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Orders", icon: ShoppingCart, path: "/orders" },
  { name: "Clients", icon: Users, path: "/clients" },
  { name: "Companies", icon: Building2, path: "/companies" }
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Toggle sidebar function
  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  // Check if link is active
  const isActiveLink = useCallback((path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <Header />
      
      <div className="flex flex-1 pt-16"> {/* Add padding top for fixed header */}
        {/* Sidebar */}
        <div className={`bg-sidebar fixed h-full z-10 transition-all duration-300 shadow-lg ${collapsed ? 'w-20' : 'w-64'}`}>
          <div className="p-4 flex justify-between items-center border-b border-sidebar-border">
            <h1 className={`text-white font-bold transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              Patorama
            </h1>
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
            >
              {collapsed ? '→' : '←'}
            </button>
          </div>
          
          <nav className="py-4">
            <ul className="space-y-2 px-2">
              {sidebarLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    className={`flex items-center p-3 rounded-md transition-colors ${
                      isActiveLink(link.path)
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className={`ml-3 transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="container py-6 px-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
