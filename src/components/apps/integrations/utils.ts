
import { Integration } from "../types";

export function isConnectDisabled(
  id: string, 
  masterFolderId: string, 
  apiKey: string, 
  secretKey: string
): boolean {
  if (id === 'box') {
    return !masterFolderId;
  } else if (id === 'stripe') {
    return !apiKey || !secretKey;
  } else {
    return !apiKey;
  }
}

export function getConnectionStatus(integration: Integration): {
  isConnected: boolean;
  status?: 'active' | 'pending' | 'error';
  lastSynced?: string;
} {
  return {
    isConnected: integration.connected,
    status: integration.status === 'inactive' ? 'pending' : integration.status,
    lastSynced: integration.lastSynced
  };
}
