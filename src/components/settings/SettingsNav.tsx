
import React from "react";
import { Button } from "@/components/ui/button";
import { SettingsCategory } from "@/pages/Settings";
import {
  User,
  Bell,
  Building,
  FileEdit,
  Download,
  CreditCard,
  Package,
  Presentation,
  LayoutGrid,
  Palette,
  FileText,
  Puzzle,
  Activity,
  UserSquare,
  ServerCog,
  Users,
} from "lucide-react";

interface SettingsNavProps {
  activeCategory: SettingsCategory;
  onCategoryChange: (category: SettingsCategory) => void;
}

export function SettingsNav({ activeCategory, onCategoryChange }: SettingsNavProps) {
  interface SettingsCategoryNavItem {
    id: SettingsCategory;
    label: string;
    icon: React.ReactNode;
  }

  const accountCategories: SettingsCategoryNavItem[] = [
    {
      id: "user-profile",
      label: "Profile",
      icon: <UserSquare className="w-4 h-4 mr-2" />,
    },
    {
      id: "user",
      label: "Team Management",
      icon: <Users className="w-4 h-4 mr-2" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4 mr-2" />,
    },
  ];

  const workspaceCategories: SettingsCategoryNavItem[] = [
    {
      id: "organization",
      label: "Organization",
      icon: <Building className="w-4 h-4 mr-2" />,
    },
    {
      id: "editor",
      label: "Notification Editor",
      icon: <FileEdit className="w-4 h-4 mr-2" />,
    },
    {
      id: "downloads",
      label: "Downloads",
      icon: <Download className="w-4 h-4 mr-2" />,
    },
    {
      id: "payments",
      label: "Payment Settings",
      icon: <CreditCard className="w-4 h-4 mr-2" />,
    },
    {
      id: "header",
      label: "Header Settings",
      icon: <LayoutGrid className="w-4 h-4 mr-2" />,
    },
    {
      id: "theme",
      label: "Theme",
      icon: <Palette className="w-4 h-4 mr-2" />,
    },
    {
      id: "legal",
      label: "Legal",
      icon: <FileText className="w-4 h-4 mr-2" />,
    },
    {
      id: "apps",
      label: "Apps & Integrations",
      icon: <Puzzle className="w-4 h-4 mr-2" />,
    },
    {
      id: "production-status",
      label: "Production Status",
      icon: <Activity className="w-4 h-4 mr-2" />,
    },
    {
      id: "esoft-integration",
      label: "Esoft Integration",
      icon: <ServerCog className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          Account
        </h3>
        {accountCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "ghost"}
            className="justify-start"
            onClick={() => onCategoryChange(category.id)}
          >
            {category.icon}
            {category.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          Workspace
        </h3>
        {workspaceCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "ghost"}
            className="justify-start"
            onClick={() => onCategoryChange(category.id)}
          >
            {category.icon}
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
