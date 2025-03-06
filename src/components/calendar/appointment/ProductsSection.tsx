
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  searchProduct,
  setSearchProduct,
  filteredProducts,
  handleProductSelect
}) => {
  return (
    <div>
      <p className="text-sm font-medium mb-2">Products</p>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search for a product..." 
          className="pl-9"
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
        />
      </div>
      
      {searchProduct && filteredProducts.length > 0 && (
        <div className="mt-1 border rounded-md shadow-sm bg-background max-h-40 overflow-y-auto z-10 absolute">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              className="p-2 hover:bg-muted/50 cursor-pointer"
              onClick={() => handleProductSelect(product)}
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
  );
};
