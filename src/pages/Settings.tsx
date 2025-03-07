
import React, { useState, useEffect, useRef } from "react";
import { SettingsNav } from "@/components/settings/SettingsNav";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { PageTransition } from "@/components/layout/PageTransition";
import { MainLayout } from "@/components/layout/MainLayout";
import { useHeaderSettings } from "@/hooks/useHeaderSettings";

// Define the different settings categories
export type SettingsCategory = 
  | "user"
  | "notifications"
  | "organization"
  | "editor"
  | "downloads"
  | "payments"
  | "products"
  | "presentation"
  | "header"
  | "theme"
  | "legal"
  | "apps"
  | "team";

export function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>("user");
  const { updateSettings } = useHeaderSettings();
  const hasSetHeader = useRef(false);

  // Only update the header settings once when the component mounts
  useEffect(() => {
    if (!hasSetHeader.current) {
      updateSettings({
        title: "Settings",
        description: "Manage your account and application preferences"
      });
      hasSetHeader.current = true;
    }
  }, [updateSettings]);
  
  return (
    <MainLayout>
      <PageTransition>
        <div className="w-full p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account and application preferences
            </p>
          </div>
          
          <div className="flex flex-col w-full">
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
              <SettingsNav 
                activeCategory={activeCategory} 
                onCategoryChange={setActiveCategory} 
              />
              <SettingsPanel activeCategory={activeCategory} />
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
}

// Default export for simpler imports
export default SettingsPage;
