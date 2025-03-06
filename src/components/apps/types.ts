
import { ReactElement } from "react";

export type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  connected: boolean;
  status?: 'active' | 'pending' | 'error';
  lastSynced?: string;
};
