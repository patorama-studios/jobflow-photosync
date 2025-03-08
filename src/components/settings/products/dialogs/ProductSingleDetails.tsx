
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Product } from "../types/product-types";

interface ProductSingleDetailsProps {
  product: Partial<Product>;
  setProduct: React.Dispatch<React.SetStateAction<Partial<Product>>>;
}

export function ProductSingleDetails({ product, setProduct }: ProductSingleDetailsProps) {
  return (
    <div className="border-t pt-4 space-y-4">
      <h3 className="text-base font-medium">Product Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={product.price || ''}
            onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
          />
        </div>
        
        {product.isServiceable && (
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={product.duration || ''}
              onChange={(e) => setProduct({ ...product, duration: parseInt(e.target.value) || 0 })}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="defaultPayoutType">Payout Type</Label>
          <RadioGroup
            id="defaultPayoutType"
            value={product.defaultPayoutType || 'percentage'}
            onValueChange={(value: "percentage" | "fixed") => 
              setProduct({ ...product, defaultPayoutType: value })}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage">Percentage</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed">Fixed Amount</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="defaultPayout">
            {product.defaultPayoutType === "percentage" ? "Payout Percentage (%)" : "Fixed Payout Amount ($)"}
          </Label>
          <Input
            id="defaultPayout"
            type="number"
            min="0"
            step={product.defaultPayoutType === "percentage" ? "1" : "0.01"}
            max={product.defaultPayoutType === "percentage" ? "100" : undefined}
            value={product.defaultPayout || ''}
            onChange={(e) => setProduct({ ...product, defaultPayout: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
    </div>
  );
}
