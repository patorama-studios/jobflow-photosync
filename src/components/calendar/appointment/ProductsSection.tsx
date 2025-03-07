
import React, { useEffect, useState } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/use-products';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductsSectionProps {
  searchProduct: string;
  setSearchProduct: React.Dispatch<React.SetStateAction<string>>;
  filteredProducts: Product[];
  handleProductSelect: (product: any) => void;
  openAddProductDialog: () => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  searchProduct,
  setSearchProduct,
  filteredProducts: _filteredProducts,
  handleProductSelect,
  openAddProductDialog
}) => {
  const { products, isLoading } = useProducts();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  
  // Filter products based on search query
  const filteredProducts = searchProduct
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchProduct.toLowerCase()))
    : [];

  // Handle selecting a product
  const onSelectProduct = (product: Product) => {
    handleProductSelect(product);
    setSelectedProducts(prev => [...prev, product]);
    setSearchProduct('');
  };

  // Calculate total price
  const totalPrice = selectedProducts.reduce((sum, product) => sum + Number(product.price), 0);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">Products</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={openAddProductDialog}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Product
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for a product..." 
            className="pl-9"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="flex items-center space-x-2 mt-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading products...</span>
          </div>
        ) : null}
        
        {searchProduct && filteredProducts.length > 0 && (
          <div className="mt-1 border rounded-md shadow-sm bg-background max-h-40 overflow-y-auto z-10 absolute">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                className="p-2 hover:bg-muted/50 cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                <div className="flex justify-between">
                  <p className="font-medium">{product.name}</p>
                  <p className="font-medium">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="border rounded-md p-3 space-y-2">
          <p className="font-medium text-sm">Selected Products</p>
          {selectedProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <p>{product.name}</p>
              <div className="flex items-center">
                <p className="font-medium">${product.price}</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="ml-2 h-8 w-8 p-0" 
                  onClick={() => setSelectedProducts(prev => prev.filter((_, i) => i !== index))}
                >
                  <span className="sr-only">Remove</span>
                  <span className="text-muted-foreground">×</span>
                </Button>
              </div>
            </div>
          ))}
          <div className="flex justify-between font-medium pt-2">
            <p>Total</p>
            <p>${totalPrice}</p>
          </div>
        </div>
      )}
    </div>
  );
};
