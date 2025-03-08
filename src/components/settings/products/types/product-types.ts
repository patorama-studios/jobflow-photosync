
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
  isServiceable: boolean;
  hasVariants: boolean;
  price?: number;
  duration?: number;
  defaultPayout?: number;
  defaultPayoutType?: "percentage" | "fixed";
  variants?: ProductVariant[];
  type: "main" | "addon";
  imageUrl?: string;
}
