
import React, { useState } from 'react';
import { ToggleSection } from '../components/ToggleSection';
import { ProductSearch } from '../components/ProductSearch';
import { Product } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface SelectedProduct extends Product {
  quantity: number;
}

interface ProductSelectionSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  onProductsChange: (products: SelectedProduct[]) => void;
  selectedProducts: SelectedProduct[];
}

export const ProductSelectionSection: React.FC<ProductSelectionSectionProps> = ({
  isOpen,
  onToggle,
  onProductsChange,
  selectedProducts = []
}) => {
  const [isAddingCustomProduct, setIsAddingCustomProduct] = useState(false);
  const { setValue } = useForm();

  const handleProductSelect = (product: Product) => {
    // Check if product already exists in the list
    const existingIndex = selectedProducts.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      // Increment quantity if already exists
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingIndex] = {
        ...updatedProducts[existingIndex],
        quantity: updatedProducts[existingIndex].quantity + 1
      };
      onProductsChange(updatedProducts);
    } else {
      // Add new product with quantity 1
      onProductsChange([...selectedProducts, { ...product, quantity: 1 }]);
    }
    
    // Update the package field in the form
    if (product && product.name) {
      setValue('package', product.name);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    const updatedProducts = selectedProducts.filter(p => p.id !== productId);
    onProductsChange(updatedProducts);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedProducts = selectedProducts.map(p => 
      p.id === productId ? { ...p, quantity: newQuantity } : p
    );
    
    onProductsChange(updatedProducts);
  };

  return (
    <ToggleSection 
      title="Product Selection" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <ProductSearch 
          onProductSelect={handleProductSelect}
          onAddCustomProduct={() => setIsAddingCustomProduct(true)}
        />
        
        {selectedProducts.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Selected Products</h4>
            <div className="border rounded-md divide-y">
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-3 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-muted-foreground">{product.description}</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{product.quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <span className="font-medium">${(product.price * product.quantity).toFixed(2)}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveProduct(product.id)}
                      className="h-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-2 p-2">
              <span className="font-medium">
                Total: ${selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </ToggleSection>
  );
};
