
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
    console.log("Fetching products...");
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      console.log("Products fetched:", data);
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

  // Fetch add-ons specifically - products with type='addon'
  const fetchAddOns = useCallback(async () => {
    console.log("Fetching add-ons...");
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if we have app_settings with product details
      const { data: settingsData, error: settingsError } = await supabase
        .from('app_settings')
        .select('*')
        .like('key', 'product_details_%');
      
      if (settingsError) throw settingsError;
      
      console.log("Add-ons settings data:", settingsData);
      
      // Filter settings to find add-ons
      const addonSettings = settingsData?.filter(setting => {
        try {
          // Safely cast the value to UIProduct
          const productDetails = setting.value as Record<string, any>;
          return productDetails && productDetails.type === 'addon';
        } catch (e) {
          console.error("Error parsing product details:", e, setting);
          return false;
        }
      });
      
      if (addonSettings && addonSettings.length > 0) {
        // Extract add-ons from settings
        const addons = addonSettings.map(setting => {
          try {
            const productId = setting.key.replace('product_details_', '');
            const productValue = setting.value as Record<string, any>;
            
            return {
              id: productId,
              name: productValue.title,
              description: productValue.description,
              price: productValue.price,
              is_active: productValue.isActive ?? true,
              created_at: setting.created_at,
              updated_at: setting.updated_at
            };
          } catch (e) {
            console.error("Error mapping addon:", e, setting);
            return null;
          }
        }).filter(addon => addon !== null) as Product[];
        
        console.log("Processed addons:", addons);
        return addons;
      }
      
      // If no add-ons found in settings, check the products table
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      
      // For now, we don't have a way to distinguish add-ons in the products table
      // so we'll return all products. In a real app, you'd have a product_type field.
      console.log("Fallback to products table for addons:", data);
      return data || [];
    } catch (err: any) {
      setError(err.message || 'Failed to fetch add-ons');
      console.error("Error fetching add-ons:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProduct = useCallback(async (product: Partial<Product>) => {
    console.log("Saving product:", product);
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
      
      console.log("Product saved successfully:", data);
      
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
    console.log("Deleting product:", productId);
    try {
      setIsLoading(true);
      
      // First, check if we have detailed product data in app_settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', `product_details_${productId}`);
      
      if (settingsError) throw settingsError;
      
      console.log("Settings data for deletion:", settingsData);
      
      // If we have detailed settings, delete them
      if (settingsData && settingsData.length > 0) {
        const { error: deleteSettingsError } = await supabase
          .from('app_settings')
          .delete()
          .eq('key', `product_details_${productId}`);
        
        if (deleteSettingsError) throw deleteSettingsError;
        console.log("Product details deleted from app_settings");
      }
      
      // Then update the product in the products table
      const { error } = await supabase
        .from('products')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);
      
      if (error) throw error;
      
      console.log("Product soft-deleted (marked inactive)");
      
      // Remove from local state to update UI immediately
      setProducts(prev => prev.filter(p => p.id !== productId));
      
      toast.success('Product deleted successfully');
      return true;
    } catch (err: any) {
      console.error("Error deleting product:", err);
      toast.error(`Failed to delete product: ${err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to map UI product model to database model
  const saveUIProduct = useCallback(async (uiProduct: UIProduct) => {
    console.log("Saving UI product:", uiProduct);
    try {
      const dbProduct: Partial<Product> = {
        id: uiProduct.id,
        name: uiProduct.title,
        description: uiProduct.description || null,
        price: uiProduct.hasVariants ? 
          uiProduct.variants?.reduce((max, v) => Math.max(max, v.price), 0) || 0 : 
          uiProduct.price || 0,
        is_active: uiProduct.isActive !== undefined ? uiProduct.isActive : true
      };
      
      console.log("Converted to DB product:", dbProduct);
      
      // Save the simplified version in the products table
      const savedProduct = await saveProduct(dbProduct);
      
      // Convert the UI product to a JSON-safe format before storing
      const jsonSafeProduct = JSON.parse(JSON.stringify(uiProduct));
      
      console.log("Storing detailed product data in app_settings:", jsonSafeProduct);
      
      // Store the detailed product data in app_settings as a JSON object
      const { error: settingsError } = await supabase
        .from('app_settings')
        .upsert({
          key: `product_details_${uiProduct.id}`,
          value: jsonSafeProduct,
          is_global: true,
          updated_at: new Date().toISOString()
        });
      
      if (settingsError) {
        console.error("Error saving product details to app_settings:", settingsError);
        throw settingsError;
      }
      
      console.log("Product successfully saved with details");
      return savedProduct;
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
    console.log("Creating product override:", { clientId, productId, overridePrice });
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
      
      console.log("Product override created:", data);
      
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
    fetchAddOns,
    saveProduct,
    deleteProduct,
    saveUIProduct,
    createProductOverride
  };
}
