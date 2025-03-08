
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
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
  };

  const saveProduct = async (product: Partial<Product>) => {
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
      await fetchProducts();
      
      toast.success(`Product ${product.id ? 'updated' : 'created'} successfully`);
      return data;
    } catch (err: any) {
      console.error("Error saving product:", err);
      toast.error(`Failed to save product: ${err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createProductOverride = async (
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
  };

  // Initialize by fetching products
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    saveProduct,
    createProductOverride
  };
}
