
export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
  orderNumber: string;
}

export interface ProductOverride {
  id: string;
  name: string;
  standardPrice: number;
  overridePrice: number;
  discount: string;
}
