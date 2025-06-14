
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { Product as UIProduct } from '@/components/settings/products/types/product-types';
import { productService, Product } from '@/services/mysql/product-service';

// Re-export Product interface from service
export type { Product } from '@/services/mysql/product-service';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    console.log('🔧 useProducts: Fetching products from MySQL...');
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.getAllProducts();
      console.log('🔧 useProducts: Products fetched:', data.length);
      setProducts(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      console.error('🔧 useProducts: Error fetching products:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch add-ons specifically
  const fetchAddOns = useCallback(async () => {
    console.log('🔧 useProducts: Fetching add-ons from MySQL...');
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.getAddOns();
      console.log('🔧 useProducts: Add-ons fetched:', data.length);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch add-ons');
      console.error('🔧 useProducts: Error fetching add-ons:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProduct = useCallback(async (product: Partial<Product>) => {
    console.log('🔧 useProducts: Saving product:', product);
    try {
      setIsLoading(true);
      
      const savedProduct = await productService.saveProduct(product);
      
      if (savedProduct) {
        console.log('🔧 useProducts: Product saved successfully:', savedProduct);
        
        // Refresh the products list
        await fetchProducts();
        
        toast.success(`Product ${product.id ? 'updated' : 'created'} successfully`);
        return savedProduct;
      } else {
        throw new Error('Failed to save product');
      }
    } catch (err: any) {
      console.error('🔧 useProducts: Error saving product:', err);
      toast.error(`Failed to save product: ${err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProducts]);

  // Delete product (soft delete by setting is_active to false)
  const deleteProduct = useCallback(async (productId: string) => {
    console.log('🔧 useProducts: Deleting product:', productId);
    try {
      setIsLoading(true);
      
      const success = await productService.deleteProduct(productId);
      
      if (success) {
        console.log('🔧 useProducts: Product deleted successfully');
        
        // Remove from local state to update UI immediately
        setProducts(prev => prev.filter(p => p.id !== productId));
        
        toast.success('Product deleted successfully');
        return true;
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err: any) {
      console.error('🔧 useProducts: Error deleting product:', err);
      toast.error(`Failed to delete product: ${err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to map UI product model to database model
  const saveUIProduct = useCallback(async (uiProduct: UIProduct) => {
    console.log('🔧 useProducts: Saving UI product:', uiProduct);
    try {
      const savedProduct = await productService.saveUIProduct(uiProduct);
      
      if (savedProduct) {
        console.log('🔧 useProducts: UI product saved successfully');
        
        // Refresh the products list
        await fetchProducts();
        
        return savedProduct;
      } else {
        throw new Error('Failed to save UI product');
      }
    } catch (err: any) {
      console.error('🔧 useProducts: Error saving UI product:', err);
      toast.error(`Failed to save product: ${err.message || 'Unknown error'}`);
      throw err;
    }
  }, [fetchProducts]);

  const createProductOverride = useCallback(async (
    clientId: string, 
    productId: string, 
    overridePrice: number
  ) => {
    console.log('🔧 useProducts: Creating product override:', { clientId, productId, overridePrice });
    try {
      const override = await productService.createProductOverride(clientId, productId, overridePrice);
      
      console.log('🔧 useProducts: Product override created:', override);
      
      toast.success(`Price override created for ${override.name}`);
      return override;
    } catch (err: any) {
      console.error('🔧 useProducts: Error creating product override:', err);
      toast.error(`Failed to create override: ${err.message || 'Unknown error'}`);
      throw err;
    }
  }, []);

  // Initialize by fetching products
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    fetchAddOns,
    saveProduct,
    deleteProduct,
    saveUIProduct,
    createProductOverride
  };
}
