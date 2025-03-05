
import React from "react";
import { 
  User, Bell, Building2, PenLine, Download, 
  CreditCard, LayoutGrid, FileText, Layout
} from "lucide-react";
import { SettingsCategory } from "@/pages/Settings";
import { cn } from "@/lib/utils";

interface SettingsNavProps {
  activeCategory: SettingsCategory;
  onCategoryChange: (category: SettingsCategory) => void;
}

interface NavItem {
  id: SettingsCategory;
  label: string;
  icon: React.ReactNode;
}

export function SettingsNav({ activeCategory, onCategoryChange }: SettingsNavProps) {
  const navItems: NavItem[] = [
    { id: "user", label: "User Details", icon: <User className="h-5 w-5" /> },
    { id: "notifications", label: "Notification Preferences", icon: <Bell className="h-5 w-5" /> },
    { id: "organization", label: "Organization Settings", icon: <Building2 className="h-5 w-5" /> },
    { id: "editor", label: "Notification Editor", icon: <PenLine className="h-5 w-5" /> },
    { id: "downloads", label: "Download Settings", icon: <Download className="h-5 w-5" /> },
    { id: "payments", label: "Payments & Orders", icon: <CreditCard className="h-5 w-5" /> },
    { id: "presentation", label: "Order Presentation", icon: <LayoutGrid className="h-5 w-5" /> },
    { id: "header", label: "Header Settings", icon: <Layout className="h-5 w-5" /> },
    { id: "legal", label: "Legal Settings", icon: <FileText className="h-5 w-5" /> },
  ];
  
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onCategoryChange(item.id)}
          className={cn(
            "flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium",
            activeCategory === item.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
