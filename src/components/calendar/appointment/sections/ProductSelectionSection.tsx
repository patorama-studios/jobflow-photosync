
import React from 'react';
import { ToggleSection } from '../components/ToggleSection';
import { ProductSearch } from '../components/ProductSearch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { SelectedProduct } from '@/hooks/use-create-appointment-form';

interface ProductSelectionSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedProducts: SelectedProduct[];
  onProductsChange: (products: SelectedProduct[]) => void;
}

export const ProductSelectionSection: React.FC<ProductSelectionSectionProps> = ({
  isOpen,
  onToggle,
  selectedProducts,
  onProductsChange
}) => {
  const handleProductSelect = (product: SelectedProduct) => {
    // Check if product already exists in selected products to avoid duplicates
    if (!selectedProducts.some(p => p.id === product.id)) {
      onProductsChange([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    onProductsChange(selectedProducts.filter(p => p.id !== productId));
  };

  return (
    <ToggleSection 
      title="Product Selection" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <ProductSearch onProductSelect={handleProductSelect} />
        
        {selectedProducts.length > 0 && (
          <div className="border rounded-md p-4">
            <h4 className="text-sm font-medium mb-2">Selected Products</h4>
            <div className="flex flex-wrap gap-2">
              {selectedProducts.map((product) => (
                <Badge key={product.id} variant="secondary" className="flex items-center space-x-1">
                  <span>{product.name} (${product.price.toFixed(2)})</span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-4 w-4 p-0" 
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToggleSection>
  );
};
