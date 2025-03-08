
import { Json } from '@/integrations/supabase/types';

export interface NotificationSetting {
  type: string;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface OrganizationSettings {
  companyName: string;
  website: string;
  supportEmail: string;
  companyPhone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  title: string;
  avatar?: string;
}

// Type to help with type conversion from Supabase Json to our types
export type JsonValue<T> = T extends object ? JsonObject<T> : Json;

type JsonObject<T> = {
  [K in keyof T]: JsonValue<T[K]>;
};
