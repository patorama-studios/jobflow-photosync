
import { useState } from 'react';

interface DownloadSettings {
  contentLocked: boolean;
  enableCreditLimit: boolean;
  creditLimit: string;
  paymentTerms: "onDelivery" | "14days" | "30days";
}

export function useClientDownloadSettings() {
  // Default settings (would normally come from the database)
  const [downloadSettings, setDownloadSettings] = useState<DownloadSettings>({
    contentLocked: true,
    enableCreditLimit: false,
    creditLimit: "1000",
    paymentTerms: "onDelivery",
  });

  const handleSaveDownloadSettings = (values: DownloadSettings) => {
    console.log("Saving client download settings:", values);
    setDownloadSettings(values);
    // Here you would update the client settings in your data store
  };

  return {
    downloadSettings,
    handleSaveDownloadSettings
  };
}
