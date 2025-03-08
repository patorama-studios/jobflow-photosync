
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  duration: number;
  payoutAmount: number;
  payoutType: "percentage" | "fixed";
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price?: number;
  isActive?: boolean;
  isServiceable: boolean;
  hasVariants: boolean;
  duration?: number;
  defaultPayout?: number;
  defaultPayoutType?: "percentage" | "fixed";
  variants?: ProductVariant[];
  type: "main" | "addon";
  imageUrl?: string;
  productType?: string;
}
