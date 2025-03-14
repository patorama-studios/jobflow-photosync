
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  title: string;
  avatar: string;
  full_name: string; // Changed from optional to required
  role: string; // Changed from optional to required
}

// Adding missing type definitions
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export interface HeaderSettings {
  color: string;
  height: number;
  logoUrl: string;
  showCompanyName: boolean;
  title: string;
  description: string;
}

export interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface OrganizationSettings {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
}

export interface DownloadSettings {
  automaticDownloads: boolean;
  downloadPath: string;
  qualityPreference: 'high' | 'medium' | 'low';
  organizationMethod: 'date' | 'client' | 'project';
}

export interface LegalSettings {
  termsUrl: string;
  privacyUrl: string;
  cookiePolicy: string;
  dataRetentionPeriod: number;
}

// Define the ProfileType that matches what the component expects
export interface ProfileType extends UserProfile {
  full_name: string; // Explicitly required here
  role: string;      // Explicitly required here
}
