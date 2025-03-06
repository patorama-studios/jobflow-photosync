
import React, { useState } from "react";
import { SettingsNav } from "@/components/settings/SettingsNav";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { PageTransition } from "@/components/layout/PageTransition";

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
  | "apps";

export function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>("user");
  
  return (
    <PageTransition>
      <div className="w-full">
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
  );
}

// Default export for simpler imports
export default SettingsPage;
