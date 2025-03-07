
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ContentDownloadSettings } from "@/components/clients/ContentDownloadSettings";

interface ClientSettingsProps {
  downloadSettings: {
    contentLocked: boolean;
    enableCreditLimit: boolean;
    creditLimit: string;
    paymentTerms: "onDelivery" | "14days" | "30days";
  };
  onSaveDownloadSettings: (values: any) => void;
}

export function ClientSettings({ downloadSettings, onSaveDownloadSettings }: ClientSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage client account preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">General settings form would go here</p>
        </CardContent>
      </Card>
      
      <ContentDownloadSettings 
        entityType="client" 
        initialValues={downloadSettings}
        onSave={onSaveDownloadSettings}
      />
    </div>
  );
}
