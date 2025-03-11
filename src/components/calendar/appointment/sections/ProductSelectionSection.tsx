
import React, { useState } from 'react';
import { ToggleSection } from '../components/ToggleSection';
import { ProductSearch } from '../components/ProductSearch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { SelectedProduct } from '@/hooks/use-create-appointment-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const [isAddCustomProductOpen, setIsAddCustomProductOpen] = useState(false);
  const [customProductName, setCustomProductName] = useState('');
  const [customProductPrice, setCustomProductPrice] = useState('');

  const handleProductSelect = (product: SelectedProduct) => {
    // Check if product already exists in selected products to avoid duplicates
    if (!selectedProducts.some(p => p.id === product.id)) {
      onProductsChange([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    onProductsChange(selectedProducts.filter(p => p.id !== productId));
  };
  
  const handleAddCustomProduct = () => {
    setIsAddCustomProductOpen(true);
  };
  
  const handleCustomProductSubmit = () => {
    if (customProductName && customProductPrice) {
      const newProduct: SelectedProduct = {
        id: `custom-${Date.now()}`,
        name: customProductName,
        price: parseFloat(customProductPrice)
      };
      
      onProductsChange([...selectedProducts, newProduct]);
      setCustomProductName('');
      setCustomProductPrice('');
      setIsAddCustomProductOpen(false);
    }
  };

  return (
    <>
      <ToggleSection 
        title="Product Selection" 
        isOpen={isOpen} 
        onToggle={onToggle}
      >
        <div className="space-y-4">
          <ProductSearch 
            onProductSelect={handleProductSelect} 
            onAddCustomProduct={handleAddCustomProduct}
          />
          
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
      
      <Dialog open={isAddCustomProductOpen} onOpenChange={setIsAddCustomProductOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Custom Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="custom-product-name">Product Name</Label>
              <Input
                id="custom-product-name"
                placeholder="Enter product name"
                value={customProductName}
                onChange={(e) => setCustomProductName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="custom-product-price">Price ($)</Label>
              <Input
                id="custom-product-price"
                type="number"
                placeholder="Enter price"
                value={customProductPrice}
                onChange={(e) => setCustomProductPrice(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCustomProductOpen(false)}>Cancel</Button>
            <Button onClick={handleCustomProductSubmit} disabled={!customProductName || !customProductPrice}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
