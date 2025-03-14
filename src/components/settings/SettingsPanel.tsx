
import React, { memo } from "react";
import { SettingsCategory } from "@/pages/Settings";
import { UserSettings } from "./sections/UserSettings";
import { NotificationPreferences } from "./sections/NotificationPreferences";
import { OrganizationSettings } from "./sections/OrganizationSettings";
import { NotificationEditor } from "./sections/NotificationEditor";
import { DownloadSettings } from "./sections/DownloadSettings";
import { PaymentSettings } from "./sections/PaymentSettings";
import { PresentationSettings } from "./sections/PresentationSettings";
import { HeaderSettings } from "./sections/HeaderSettings";
import { ThemeSettings } from "./sections/ThemeSettings";
import { LegalSettings } from "./sections/LegalSettings";
import { AppsSettings } from "./sections/AppsSettings";
import { TeamMembers } from "./sections/TeamMembers";
import { EsoftIntegrationSettings } from "./sections/EsoftIntegrationSettings";
import { UserProfileSettings } from "./sections/UserProfileSettings";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SettingsPanelProps {
  activeCategory: SettingsCategory;
}

export const SettingsPanel = memo(function SettingsPanel({ activeCategory }: SettingsPanelProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Show a login prompt if not loading and no user
  if (!isLoading && !user && !import.meta.env.DEV) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <h3 className="text-xl font-medium">Authentication Required</h3>
          <p className="text-muted-foreground text-center max-w-md">
            You need to be logged in to access settings. Please log in to view and edit your settings.
          </p>
          <Button 
            onClick={() => navigate('/login', { state: { from: '/settings' } })}
            className="mt-4"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6">
      {activeCategory === "user-profile" && <UserProfileSettings />}
      {activeCategory === "user" && <TeamMembers />}
      {activeCategory === "notifications" && <NotificationPreferences />}
      {activeCategory === "organization" && <OrganizationSettings />}
      {activeCategory === "editor" && <NotificationEditor />}
      {activeCategory === "downloads" && <DownloadSettings />}
      {activeCategory === "payments" && <PaymentSettings />}
      {activeCategory === "presentation" && <PresentationSettings />}
      {activeCategory === "header" && <HeaderSettings />}
      {activeCategory === "theme" && <ThemeSettings />}
      {activeCategory === "legal" && <LegalSettings />}
      {activeCategory === "apps" && (
        <>
          <AppsSettings />
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Esoft Integration</h2>
            <EsoftIntegrationSettings />
          </div>
        </>
      )}
    </Card>
  );
});
