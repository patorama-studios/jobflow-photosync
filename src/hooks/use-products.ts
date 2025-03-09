
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
        .eq('is_active', true)
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
      // Get detailed add-on products from app_settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('app_settings')
        .select('*')
        .like('key', 'product_details_%');
      
      if (settingsError) throw settingsError;
      
      console.log("App settings data for products:", settingsData);
      
      // Filter settings to find add-ons
      const addonSettings = settingsData?.filter(setting => {
        try {
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
              created_at: setting.created_at || new Date().toISOString(),
              updated_at: setting.updated_at || new Date().toISOString()
            };
          } catch (e) {
            console.error("Error mapping addon:", e, setting);
            return null;
          }
        }).filter(addon => addon !== null) as Product[];
        
        console.log("Processed addons:", addons);
        return addons;
      }
      
      // If no add-ons found in settings, look in products table with description containing 'addon'
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('description', '%addon%')
        .order('name', { ascending: true });

      if (error) throw error;
      
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
      
      const productData = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        is_active: product.is_active !== undefined ? product.is_active : true,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('products')
        .upsert(productData)
        .select()
        .single();
      
      if (error) throw error;
      
      console.log("Product saved successfully:", data);
      
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
      
      // Then update the product in the products table to mark as inactive
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
      // Make sure the ID is valid UUID format
      let productId = uiProduct.id;
      if (!productId || productId.length < 36) {
        // Generate a proper UUID
        productId = crypto.randomUUID();
        console.log("Generated new UUID for product:", productId);
        uiProduct.id = productId;
      }
      
      // Create the product object for the products table
      const dbProduct: Partial<Product> = {
        id: productId,
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
      
      // Prepare the product details for app_settings
      // Make sure to convert the entire object to a JSON-safe format
      const jsonSafeProduct = JSON.parse(JSON.stringify({
        ...uiProduct,
        id: productId
      }));
      
      console.log("Storing detailed product data in app_settings:", jsonSafeProduct);
      
      // Store the detailed product data in app_settings
      const { error: settingsError } = await supabase
        .from('app_settings')
        .upsert({
          key: `product_details_${productId}`,
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
