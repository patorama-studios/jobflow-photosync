
import React from "react";
import { SettingsCategory } from "@/pages/Settings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  User,
  Bell,
  Building,
  PenTool,
  Download,
  CreditCard,
  Package,
  Palette,
  LayoutDashboard,
  Moon,
  BookOpenCheck,
  Plug2,
  Users,
  ListChecks,
  Factory,
} from "lucide-react";

interface SettingsNavProps {
  activeCategory: SettingsCategory;
  onCategoryChange: (category: SettingsCategory) => void;
}

interface SettingsCategoryItem {
  id: SettingsCategory;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

export function SettingsNav({ activeCategory, onCategoryChange }: SettingsNavProps) {
  // Group settings categories by section
  const categories: {
    [key: string]: SettingsCategoryItem[];
  } = {
    account: [
      { id: "user", label: "User Profile", icon: <User className="mr-2 h-4 w-4" /> },
      { id: "team", label: "Team", icon: <Users className="mr-2 h-4 w-4" /> },
      { id: "notifications", label: "Notifications", icon: <Bell className="mr-2 h-4 w-4" /> },
      { id: "organization", label: "Organization", icon: <Building className="mr-2 h-4 w-4" /> },
    ],
    preferences: [
      { id: "editor", label: "Editor", icon: <PenTool className="mr-2 h-4 w-4" /> },
      { id: "downloads", label: "Downloads", icon: <Download className="mr-2 h-4 w-4" /> },
      { id: "payments", label: "Payments", icon: <CreditCard className="mr-2 h-4 w-4" /> },
      { id: "products", label: "Products", icon: <Package className="mr-2 h-4 w-4" /> },
    ],
    appearance: [
      { id: "presentation", label: "Presentation", icon: <Palette className="mr-2 h-4 w-4" /> },
      { id: "header", label: "Header", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
      { id: "theme", label: "Theme", icon: <Moon className="mr-2 h-4 w-4" /> },
    ],
    integrations: [
      { id: "esoft-integration", label: "Esoft Integration", icon: <Factory className="mr-2 h-4 w-4" /> },
      { id: "production-status", label: "Production Status", icon: <ListChecks className="mr-2 h-4 w-4" /> },
      { id: "apps", label: "Apps & Integrations", icon: <Plug2 className="mr-2 h-4 w-4" /> },
      { id: "legal", label: "Legal", icon: <BookOpenCheck className="mr-2 h-4 w-4" /> },
    ],
  };

  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([section, items]) => (
        <div key={section} className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </h3>
          <nav className="space-y-1.5">
            {items.map((item) => (
              <Button
                key={item.id}
                variant={activeCategory === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeCategory === item.id
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => onCategoryChange(item.id)}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      ))}
    </div>
  );
}
