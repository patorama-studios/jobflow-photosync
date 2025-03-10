
import React, { memo } from "react";
import { SettingsCategory } from "@/pages/Settings";
import { UserSettings } from "./sections/UserSettings";
import { NotificationPreferences } from "./sections/NotificationPreferences";
import { OrganizationSettings } from "./sections/OrganizationSettings";
import { NotificationEditor } from "./sections/NotificationEditor";
import { DownloadSettings } from "./sections/DownloadSettings";
import { PaymentSettings } from "./sections/PaymentSettings";
import { ProductSettings } from "./sections/ProductSettings";
import { PresentationSettings } from "./sections/PresentationSettings";
import { HeaderSettings } from "./sections/HeaderSettings";
import { ThemeSettings } from "./sections/ThemeSettings";
import { LegalSettings } from "./sections/LegalSettings";
import { AppsSettings } from "./sections/AppsSettings";
import { TeamSettings } from "./sections/TeamSettings";
import { ProductionStatusSettings } from "./sections/production-status/ProductionStatusSettings";
import { EsoftIntegrationSettings } from "./sections/EsoftIntegrationSettings";
import { UserProfileSettings } from "./sections/UserProfileSettings";
import { Card } from "@/components/ui/card";

interface SettingsPanelProps {
  activeCategory: SettingsCategory;
}

export const SettingsPanel = memo(function SettingsPanel({ activeCategory }: SettingsPanelProps) {
  return (
    <Card className="p-6">
      {activeCategory === "user-profile" && <UserProfileSettings />}
      {activeCategory === "user" && <UserSettings />}
      {activeCategory === "team" && <TeamSettings />}
      {activeCategory === "notifications" && <NotificationPreferences />}
      {activeCategory === "organization" && <OrganizationSettings />}
      {activeCategory === "editor" && <NotificationEditor />}
      {activeCategory === "downloads" && <DownloadSettings />}
      {activeCategory === "payments" && <PaymentSettings />}
      {activeCategory === "products" && <ProductSettings />}
      {activeCategory === "presentation" && <PresentationSettings />}
      {activeCategory === "header" && <HeaderSettings />}
      {activeCategory === "theme" && <ThemeSettings />}
      {activeCategory === "legal" && <LegalSettings />}
      {activeCategory === "production-status" && <ProductionStatusSettings />}
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
