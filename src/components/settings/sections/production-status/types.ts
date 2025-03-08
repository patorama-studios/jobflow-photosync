
export interface ProductionStatus {
  id: string;
  name: string;
  color: string;
  description: string | null;
  is_default: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface StatusFormData {
  name: string;
  color: string;
  description: string;
  isDefault: boolean;
}
