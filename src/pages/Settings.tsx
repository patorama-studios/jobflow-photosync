
import React, { useState } from "react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { SettingsNav } from "@/components/settings/SettingsNav";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

// Define the different settings categories
export type SettingsCategory = 
  | "user"
  | "notifications"
  | "organization"
  | "editor"
  | "downloads"
  | "payments"
  | "presentation"
  | "legal";

export function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>("user");
  
  return (
    <SidebarLayout showBackButton={true}>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and application preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <SettingsNav 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
        <SettingsPanel activeCategory={activeCategory} />
      </div>
    </SidebarLayout>
  );
}
