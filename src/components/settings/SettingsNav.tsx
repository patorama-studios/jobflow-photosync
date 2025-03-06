
import React from "react";
import { SettingsCategory } from "@/pages/Settings";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Bell, 
  Building2, 
  Edit, 
  Download, 
  CreditCard, 
  Palette, 
  MonitorSmartphone,
  FileText,
  Paintbrush,
  Package
} from "lucide-react";

interface SettingsNavProps {
  activeCategory: SettingsCategory;
  onCategoryChange: (category: SettingsCategory) => void;
}

interface SettingsNavItem {
  category: SettingsCategory;
  label: string;
  icon: React.ReactNode;
}

export function SettingsNav({ activeCategory, onCategoryChange }: SettingsNavProps) {
  const navItems: SettingsNavItem[] = [
    { category: "user", label: "User Settings", icon: <User className="h-4 w-4 mr-2" /> },
    { category: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4 mr-2" /> },
    { category: "organization", label: "Organization", icon: <Building2 className="h-4 w-4 mr-2" /> },
    { category: "editor", label: "Editor", icon: <Edit className="h-4 w-4 mr-2" /> },
    { category: "downloads", label: "Downloads", icon: <Download className="h-4 w-4 mr-2" /> },
    { category: "payments", label: "Payments", icon: <CreditCard className="h-4 w-4 mr-2" /> },
    { category: "products", label: "Products", icon: <Package className="h-4 w-4 mr-2" /> },
    { category: "presentation", label: "Presentation", icon: <Palette className="h-4 w-4 mr-2" /> },
    { category: "header", label: "Header", icon: <MonitorSmartphone className="h-4 w-4 mr-2" /> },
    { category: "theme", label: "Theme", icon: <Paintbrush className="h-4 w-4 mr-2" /> },
    { category: "legal", label: "Legal", icon: <FileText className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Button
          key={item.category}
          variant={activeCategory === item.category ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => onCategoryChange(item.category)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </div>
  );
}
