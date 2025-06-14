
import React from "react";
import { Button } from "@/components/ui/button";
import { SettingsCategory } from "@/pages/Settings";
import { 
  User, Bell, Building2, Edit, Download, CreditCard, 
  Package, Layout, Palette, FileText, AppWindow, Users,
  Tags, ExternalLink, Workflow, Server
} from "lucide-react";

interface SettingsNavProps {
  activeCategory: SettingsCategory;
  onCategoryChange: (category: SettingsCategory) => void;
}

interface SettingsLink {
  category: SettingsCategory;
  label: string;
  icon: React.ReactNode;
}

export function SettingsNav({ activeCategory, onCategoryChange }: SettingsNavProps) {
  // Define settings categories with icons
  const settingsLinks: SettingsLink[] = [
    {
      category: "user-profile",
      label: "User Profile",
      icon: <User className="mr-2 h-4 w-4" />
    },
    {
      category: "user",
      label: "Team Management",
      icon: <Users className="mr-2 h-4 w-4" />
    },
    {
      category: "notifications",
      label: "Notifications",
      icon: <Bell className="mr-2 h-4 w-4" />
    },
    {
      category: "organization",
      label: "Organization",
      icon: <Building2 className="mr-2 h-4 w-4" />
    },
    {
      category: "editor",
      label: "Notification Editor",
      icon: <Edit className="mr-2 h-4 w-4" />
    },
    {
      category: "downloads",
      label: "Downloads",
      icon: <Download className="mr-2 h-4 w-4" />
    },
    {
      category: "payments",
      label: "Payments",
      icon: <CreditCard className="mr-2 h-4 w-4" />
    },
    {
      category: "products",
      label: "Products",
      icon: <Package className="mr-2 h-4 w-4" />
    },
    {
      category: "presentation",
      label: "Presentation",
      icon: <Layout className="mr-2 h-4 w-4" />
    },
    {
      category: "header",
      label: "Header",
      icon: <Palette className="mr-2 h-4 w-4" />
    },
    {
      category: "theme",
      label: "Theme",
      icon: <Palette className="mr-2 h-4 w-4" />
    },
    {
      category: "legal",
      label: "Legal",
      icon: <FileText className="mr-2 h-4 w-4" />
    },
    {
      category: "apps",
      label: "Integrations",
      icon: <AppWindow className="mr-2 h-4 w-4" />
    },
    {
      category: "production-status",
      label: "Production Status",
      icon: <Workflow className="mr-2 h-4 w-4" />
    }
  ];
  
  // Group settings into categories
  const accountSettings = settingsLinks.slice(0, 3);
  const companySettings = settingsLinks.slice(3, 8);
  const uiSettings = settingsLinks.slice(8, 12);
  const integrationSettings = settingsLinks.slice(12);
  
  const renderSettingsGroup = (links: SettingsLink[], title: string) => (
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-muted-foreground px-4 py-2">{title}</h3>
      {links.map((link) => (
        <SettingsNavButton
          key={link.category}
          active={activeCategory === link.category}
          onClick={() => onCategoryChange(link.category)}
          icon={link.icon}
        >
          {link.label}
        </SettingsNavButton>
      ))}
    </div>
  );
  
  return (
    <div className="space-y-6">
      {renderSettingsGroup(accountSettings, "Account")}
      {renderSettingsGroup(companySettings, "Company")}
      {renderSettingsGroup(uiSettings, "Appearance")}
      {renderSettingsGroup(integrationSettings, "Integrations")}
    </div>
  );
}

interface SettingsNavButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

function SettingsNavButton({ children, active, onClick, icon }: SettingsNavButtonProps) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      className={`w-full justify-start ${active ? "font-medium" : "font-normal"}`}
      onClick={onClick}
    >
      {icon}
      {children}
    </Button>
  );
}
