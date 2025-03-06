
export interface Order {
  id: string | number;
  customerName: string;
  propertyAddress: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  photographer: string;
  amount?: number;
  completedDate?: string;
  products?: string[];
  notes?: string;
  contactNumber?: string;
  contactEmail?: string;
  type?: string;
}
