
import React from "react";
import { SettingsCategory } from "@/pages/Settings";
import { UserSettings } from "./sections/UserSettings";
import { NotificationPreferences } from "./sections/NotificationPreferences";
import { OrganizationSettings } from "./sections/OrganizationSettings";
import { NotificationEditor } from "./sections/NotificationEditor";
import { DownloadSettings } from "./sections/DownloadSettings";
import { PaymentSettings } from "./sections/PaymentSettings";
import { PresentationSettings } from "./sections/PresentationSettings";
import { LegalSettings } from "./sections/LegalSettings";
import { Card } from "@/components/ui/card";

interface SettingsPanelProps {
  activeCategory: SettingsCategory;
}

export function SettingsPanel({ activeCategory }: SettingsPanelProps) {
  return (
    <Card className="p-6">
      {activeCategory === "user" && <UserSettings />}
      {activeCategory === "notifications" && <NotificationPreferences />}
      {activeCategory === "organization" && <OrganizationSettings />}
      {activeCategory === "editor" && <NotificationEditor />}
      {activeCategory === "downloads" && <DownloadSettings />}
      {activeCategory === "payments" && <PaymentSettings />}
      {activeCategory === "presentation" && <PresentationSettings />}
      {activeCategory === "legal" && <LegalSettings />}
    </Card>
  );
}
