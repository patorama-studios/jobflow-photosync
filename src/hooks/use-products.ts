
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Product as UIProduct } from '@/components/settings/products/types/product-types';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      
      setProducts(data || []);
      return data || [];
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      console.error("Error fetching products:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProduct = useCallback(async (product: Partial<Product>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .upsert({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          is_active: product.is_active !== undefined ? product.is_active : true,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh the products list
      fetchProducts();
      
      toast.success(`Product ${product.id ? 'updated' : 'created'} successfully`);
      return data;
    } catch (err: any) {
      console.error("Error saving product:", err);
      toast.error(`Failed to save product: ${err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProducts]);

  // Delete product (soft delete by setting is_active to false)
  const deleteProduct = useCallback(async (productId: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('products')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);
      
      if (error) throw error;
      
      // Remove from local state to update UI immediately
      setProducts(prev => prev.filter(p => p.id !== productId));
      
      toast.success('Product deleted successfully');
      return true;
    } catch (err: any) {
      console.error("Error deleting product:", err);
      toast.error(`Failed to delete product: ${err.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to map UI product model to database model
  const saveUIProduct = useCallback(async (uiProduct: UIProduct) => {
    try {
      const dbProduct: Partial<Product> = {
        id: uiProduct.id,
        name: uiProduct.title,
        description: uiProduct.description || null,
        price: uiProduct.hasVariants ? 
          uiProduct.variants?.reduce((max, v) => Math.max(max, v.price), 0) || 0 : 
          uiProduct.price || 0,
        is_active: true
      };
      
      // Convert the UI product to a JSON-safe format before storing
      const jsonSafeProduct = JSON.parse(JSON.stringify(uiProduct));
      
      // Store the detailed product data in app_settings as a JSON object
      const { error: settingsError } = await supabase
        .from('app_settings')
        .upsert({
          key: `product_details_${uiProduct.id}`,
          value: jsonSafeProduct,
          is_global: true
        });
      
      if (settingsError) throw settingsError;
      
      // Save the simplified version in the products table
      return await saveProduct(dbProduct);
    } catch (err: any) {
      console.error("Error saving UI product:", err);
      toast.error(`Failed to save product: ${err.message || 'Unknown error'}`);
      throw err;
    }
  }, [saveProduct]);

  const createProductOverride = useCallback(async (
    clientId: string, 
    productId: string, 
    overridePrice: number
  ) => {
    try {
      // First get the product details
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error("Product not found");
      }
      
      const standardPrice = product.price;
      
      // Calculate discount percentage
      const discountPercentage = ((standardPrice - overridePrice) / standardPrice * 100).toFixed(2) + '%';
      
      // Create the override
      const { data, error } = await supabase
        .from('product_overrides')
        .insert([{
          client_id: clientId,
          name: product.name,
          standard_price: standardPrice,
          override_price: overridePrice,
          discount: discountPercentage
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success(`Price override created for ${product.name}`);
      return data;
    } catch (err: any) {
      console.error("Error creating product override:", err);
      toast.error(`Failed to create override: ${err.message || 'Unknown error'}`);
      throw err;
    }
  }, [products]);

  // Initialize by fetching products
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    saveProduct,
    deleteProduct,
    saveUIProduct,
    createProductOverride
  };
}
