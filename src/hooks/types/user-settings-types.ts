
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
  type: string; // Added missing field
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
  timezone?: string; // Added missing field
  city?: string; // Added missing field
  state?: string; // Added missing field
  addressFormat?: string; // Added missing field
}

export interface DownloadSettings {
  automaticDownloads: boolean;
  downloadPath: string;
  qualityPreference: 'high' | 'medium' | 'low';
  organizationMethod: 'date' | 'client' | 'project';
  maxDimension: number; // Added missing field
  imageQuality: number; // Added missing field
  dpi: string; // Added missing field
  fileNaming: string; // Added missing field
  customFormat?: string; // Added missing field
}

export interface LegalSettings {
  termsUrl: string;
  privacyUrl: string;
  cookiePolicy: string;
  dataRetentionPeriod: number;
  termsOfService: string; // Added missing field
  privacyPolicy: string; // Added missing field
  disclaimers: string; // Added missing field
}

// Define the ProfileType that matches what the component expects
export interface ProfileType extends UserProfile {
  full_name: string; // Explicitly required here
  role: string;      // Explicitly required here
}
