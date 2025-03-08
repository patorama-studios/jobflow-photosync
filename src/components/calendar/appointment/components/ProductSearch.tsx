
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormItem, FormLabel } from '@/components/ui/form';
import { SearchIcon, PlusCircleIcon } from 'lucide-react';
import { useProducts, Product } from '@/hooks/use-products';
import { toast } from 'sonner';

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
  onAddCustomProduct: () => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onProductSelect,
  onAddCustomProduct
}) => {
  const { products, isLoading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products && searchQuery) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products || []);
    }
  }, [searchQuery, products]);

  if (error) {
    toast.error(`Error loading products: ${error}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <FormItem>
            <FormLabel>Search Products</FormLabel>
            <div className="relative">
              <Input
                placeholder="Search by product name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                disabled={isLoading}
              />
              <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </FormItem>
        </div>
        <Button type="button" onClick={onAddCustomProduct} variant="outline">
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Custom Product
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-center text-muted-foreground">Loading products...</div>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => onProductSelect(product)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{product.name}</span>
                      <span className="font-medium">${product.price.toFixed(2)}</span>
                    </div>
                    {product.description && (
                      <div className="text-sm text-muted-foreground">{product.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-center text-muted-foreground py-2">
              {searchQuery ? 'No products found. Try a different search.' : 'No products available.'}
            </div>
          )}
        </>
      )}
    </div>
  );
};
