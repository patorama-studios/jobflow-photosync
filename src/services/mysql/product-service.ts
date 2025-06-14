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

// Simulated MySQL database storage using localStorage for persistence
class ProductService {
  private getStorageKey(): string {
    return 'mysql_products';
  }

  private getProductDetailsKey(productId: string): string {
    return `mysql_product_details_${productId}`;
  }

  private getSampleProducts(): Product[] {
    return [
      {
        id: 'product-1',
        name: 'Real Estate Photography',
        description: 'Professional real estate photography package',
        price: 250,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'product-2',
        name: 'Virtual Tour',
        description: '360-degree virtual tour add-on',
        price: 150,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'product-3',
        name: 'Drone Photography',
        description: 'Aerial drone photography add-on',
        price: 200,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'product-4',
        name: 'Floor Plan',
        description: 'Professional floor plan creation',
        price: 100,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'product-5',
        name: 'Twilight Photography',
        description: 'Beautiful twilight exterior shots',
        price: 175,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      console.log('🔧 ProductService: Fetching all products from MySQL');
      
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        const products = JSON.parse(stored);
        console.log('🔧 ProductService: Found stored products:', products.length);
        return products.filter((p: Product) => p.is_active);
      }
      
      console.log('🔧 ProductService: No stored products, creating sample data');
      const sampleProducts = this.getSampleProducts();
      await this.saveProducts(sampleProducts);
      return sampleProducts;
    } catch (error) {
      console.error('🔧 ProductService: Error fetching products:', error);
      return this.getSampleProducts();
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      console.log('🔧 ProductService: Fetching product by ID:', id);
      const products = await this.getAllProducts();
      const product = products.find(p => p.id === id);
      return product || null;
    } catch (error) {
      console.error('🔧 ProductService: Error fetching product by ID:', error);
      return null;
    }
  }

  async getAddOns(): Promise<Product[]> {
    try {
      console.log('🔧 ProductService: Fetching add-ons');
      const products = await this.getAllProducts();
      
      // Look for products that are marked as add-ons or have typical add-on names
      const addOns = products.filter(product => 
        product.description?.toLowerCase().includes('add-on') ||
        product.description?.toLowerCase().includes('addon') ||
        ['virtual tour', 'drone photography', 'floor plan', 'twilight photography'].some(addon => 
          product.name.toLowerCase().includes(addon.toLowerCase())
        )
      );
      
      console.log('🔧 ProductService: Found add-ons:', addOns.length);
      return addOns;
    } catch (error) {
      console.error('🔧 ProductService: Error fetching add-ons:', error);
      return [];
    }
  }

  async saveProduct(product: Partial<Product>): Promise<Product | null> {
    try {
      console.log('🔧 ProductService: Saving product:', product);
      
      const products = await this.getAllProducts();
      let savedProduct: Product;

      if (product.id) {
        // Update existing product
        const index = products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          savedProduct = {
            ...products[index],
            ...product,
            updated_at: new Date().toISOString()
          };
          products[index] = savedProduct;
        } else {
          // Product not found, create new one
          savedProduct = {
            id: product.id,
            name: product.name || '',
            description: product.description || null,
            price: product.price || 0,
            is_active: product.is_active !== undefined ? product.is_active : true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          products.push(savedProduct);
        }
      } else {
        // Create new product
        savedProduct = {
          id: `product-${Date.now()}`,
          name: product.name || '',
          description: product.description || null,
          price: product.price || 0,
          is_active: product.is_active !== undefined ? product.is_active : true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        products.push(savedProduct);
      }

      const success = await this.saveProducts(products);
      if (success) {
        console.log('🔧 ProductService: Product saved successfully:', savedProduct.id);
        return savedProduct;
      }
      
      return null;
    } catch (error) {
      console.error('🔧 ProductService: Error saving product:', error);
      return null;
    }
  }

  async saveUIProduct(uiProduct: UIProduct): Promise<Product | null> {
    try {
      console.log('🔧 ProductService: Saving UI product:', uiProduct);
      
      // Generate ID if not provided
      let productId = uiProduct.id;
      if (!productId) {
        productId = `product-${Date.now()}`;
        uiProduct.id = productId;
      }

      // Convert UI product to database product
      const dbProduct: Partial<Product> = {
        id: productId,
        name: uiProduct.title,
        description: uiProduct.description || null,
        price: uiProduct.hasVariants ? 
          uiProduct.variants?.reduce((max, v) => Math.max(max, v.price), 0) || 0 : 
          uiProduct.price || 0,
        is_active: uiProduct.isActive !== undefined ? uiProduct.isActive : true
      };

      // Save the basic product
      const savedProduct = await this.saveProduct(dbProduct);

      if (savedProduct) {
        // Store detailed product information separately
        localStorage.setItem(
          this.getProductDetailsKey(productId), 
          JSON.stringify(uiProduct)
        );
        console.log('🔧 ProductService: UI product saved with details');
      }

      return savedProduct;
    } catch (error) {
      console.error('🔧 ProductService: Error saving UI product:', error);
      return null;
    }
  }

  async getProductDetails(productId: string): Promise<UIProduct | null> {
    try {
      const stored = localStorage.getItem(this.getProductDetailsKey(productId));
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error('🔧 ProductService: Error fetching product details:', error);
      return null;
    }
  }

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      console.log('🔧 ProductService: Deleting product:', productId);
      
      const products = await this.getAllProducts();
      const index = products.findIndex(p => p.id === productId);
      
      if (index !== -1) {
        // Soft delete by marking as inactive
        products[index].is_active = false;
        products[index].updated_at = new Date().toISOString();
        
        const success = await this.saveProducts(products);
        
        if (success) {
          // Also remove the detailed product information
          localStorage.removeItem(this.getProductDetailsKey(productId));
          console.log('🔧 ProductService: Product deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('🔧 ProductService: Error deleting product:', error);
      return false;
    }
  }

  async createProductOverride(clientId: string, productId: string, overridePrice: number): Promise<any> {
    try {
      console.log('🔧 ProductService: Creating product override:', { clientId, productId, overridePrice });
      
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const standardPrice = product.price;
      const discountPercentage = ((standardPrice - overridePrice) / standardPrice * 100).toFixed(2) + '%';

      const override = {
        id: `override-${Date.now()}`,
        client_id: clientId,
        product_id: productId,
        name: product.name,
        standard_price: standardPrice,
        override_price: overridePrice,
        discount: discountPercentage,
        created_at: new Date().toISOString()
      };

      // Store the override
      const overridesKey = `mysql_product_overrides_${clientId}`;
      const stored = localStorage.getItem(overridesKey);
      const overrides = stored ? JSON.parse(stored) : [];
      overrides.push(override);
      localStorage.setItem(overridesKey, JSON.stringify(overrides));

      console.log('🔧 ProductService: Product override created');
      return override;
    } catch (error) {
      console.error('🔧 ProductService: Error creating product override:', error);
      throw error;
    }
  }

  private async saveProducts(products: Product[]): Promise<boolean> {
    try {
      // Simulate database save with a delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      localStorage.setItem(this.getStorageKey(), JSON.stringify(products));
      return true;
    } catch (error) {
      console.error('🔧 ProductService: Error saving products:', error);
      return false;
    }
  }
}

export const productService = new ProductService();