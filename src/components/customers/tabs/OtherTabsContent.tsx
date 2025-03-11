
import React from "react";

interface OtherTabsContentProps {
  activeTab: string;
  tabValue: string;
  title: string;
}

export function OtherTabsContent({ activeTab, tabValue, title }: OtherTabsContentProps) {
  return (
    <div className="py-8 text-center">
      <p className="text-muted-foreground">
        {title} {activeTab === "clients" ? "clients" : "companies"} view
      </p>
    </div>
  );
}
