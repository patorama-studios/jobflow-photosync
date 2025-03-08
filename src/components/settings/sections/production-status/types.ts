
export interface ProductionStatus {
  id: string;
  name: string;
  color: string;
  description?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
  sort_order?: number;
}

export interface StatusFormData {
  name: string;
  color: string;
  description: string;
  is_default: boolean;
}
