
// Type definitions for user settings

export type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface NotificationSetting {
  type: string;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  title: string;
  avatar: string;
}

export interface ThemeSettings {
  fontSize: number;
  enableAnimations: boolean;
  uiDensity: 'compact' | 'comfortable' | 'spacious';
}

export interface HeaderSettings {
  color: string;
  height: number;
  logoUrl: string;
  showCompanyName: boolean;
  title?: string;
  description?: string;
}

export interface DownloadSettings {
  maxDimension: number;
  imageQuality: number;
  dpi: string;
  fileNaming: string;
  [key: string]: JsonValue;
}

export interface LegalSettings {
  termsOfService: string;
  privacyPolicy: string;
  cookiePolicy: string;
  disclaimers: string;
  [key: string]: JsonValue;
}

export interface OrganizationSettings {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  timezone?: string;
  addressFormat?: string;
  [key: string]: JsonValue;
}
