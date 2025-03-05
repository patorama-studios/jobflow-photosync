
/**
 * Box Integration Utility
 * 
 * This utility provides functions for working with Box API and managing
 * folders in a structured way for the application.
 */

export interface BoxCredentials {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken?: string;
  enterpriseId?: string;
}

export interface BoxFolder {
  id: string;
  name: string;
  parentId?: string;
  type: 'master' | 'order' | 'raw-input' | 'completed' | 'product-type';
  path?: string;
}

// Product types that will have their own subfolders
export type ProductType = 'Photography' | 'Video' | 'Drone' | 'Floor Plans' | 'Print Material';

/**
 * Box Integration class to handle folder creation and management
 */
export class BoxIntegration {
  private credentials: BoxCredentials;
  private masterFolderId: string | null = null;
  private autoFolderId: string | null = null;
  private apiBaseUrl = 'https://api.box.com/2.0';
  
  constructor(credentials: BoxCredentials) {
    this.credentials = credentials;
  }
  
  /**
   * Set the master folder ID where all order folders will be created
   */
  setMasterFolder(folderId: string) {
    this.masterFolderId = folderId;
    return this;
  }
  
  /**
   * Make authenticated requests to Box API
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.apiBaseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.credentials.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Box API error: ${errorData.message || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Box API request failed:', error);
      throw error;
    }
  }
  
  /**
   * Initialize the auto folder structure
   * This creates the top-level folder for storing all order folders
   */
  async initializeAutoFolder(autoFolderName = 'Patorama Auto Folder'): Promise<string | null> {
    if (!this.masterFolderId) {
      console.error('Master folder ID not set');
      return null;
    }
    
    try {
      console.log('Creating auto folder in master folder:', this.masterFolderId);
      
      // Check if folder already exists
      const folders = await this.getFolderItems(this.masterFolderId);
      const existingFolder = folders.entries.find((entry: any) => 
        entry.type === 'folder' && entry.name === autoFolderName
      );
      
      if (existingFolder) {
        this.autoFolderId = existingFolder.id;
        console.log('Auto folder already exists:', existingFolder.id);
        return existingFolder.id;
      }
      
      // Create auto folder
      const data = await this.makeRequest('/folders', {
        method: 'POST',
        body: JSON.stringify({
          name: autoFolderName,
          parent: {
            id: this.masterFolderId
          }
        })
      });
      
      this.autoFolderId = data.id;
      return data.id;
    } catch (error) {
      console.error('Failed to initialize auto folder:', error);
      return null;
    }
  }
  
  /**
   * Get items in a folder
   */
  async getFolderItems(folderId: string): Promise<any> {
    return await this.makeRequest(`/folders/${folderId}/items?limit=1000`);
  }
  
  /**
   * Create an order folder with the proper naming structure
   * [Order Number] - Property Address
   */
  async createOrderFolder(orderNumber: string, propertyAddress: string): Promise<BoxFolder | null> {
    if (!this.autoFolderId) {
      console.error('Auto folder not initialized');
      return null;
    }
    
    try {
      const folderName = `[${orderNumber}] - ${propertyAddress}`;
      console.log('Creating order folder:', folderName);
      
      // Check if folder already exists
      const folders = await this.getFolderItems(this.autoFolderId);
      const existingFolder = folders.entries.find((entry: any) => 
        entry.type === 'folder' && entry.name === folderName
      );
      
      if (existingFolder) {
        console.log('Order folder already exists:', existingFolder.id);
        const orderFolder: BoxFolder = {
          id: existingFolder.id,
          name: folderName,
          parentId: this.autoFolderId,
          type: 'order',
          path: `/${folderName}`
        };
        return orderFolder;
      }
      
      // Create order folder
      const data = await this.makeRequest('/folders', {
        method: 'POST',
        body: JSON.stringify({
          name: folderName,
          parent: {
            id: this.autoFolderId
          }
        })
      });
      
      // Create order-level folder
      const orderFolder: BoxFolder = {
        id: data.id,
        name: folderName,
        parentId: this.autoFolderId,
        type: 'order',
        path: `/${folderName}`
      };
      
      // Create the Raw Input and Completed folders
      await this.createSubfolderStructure(data.id);
      
      return orderFolder;
    } catch (error) {
      console.error('Failed to create order folder:', error);
      return null;
    }
  }
  
  /**
   * Create the subfolder structure for an order
   * - Raw Input folder with product type subfolders
   * - Completed folder with product type subfolders
   */
  private async createSubfolderStructure(orderFolderId: string): Promise<void> {
    try {
      // Create Raw Input folder
      const rawInputData = await this.makeRequest('/folders', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Raw Input',
          parent: {
            id: orderFolderId
          }
        })
      });
      
      const rawInputFolderId = rawInputData.id;
      console.log('Created Raw Input folder:', rawInputFolderId);
      
      // Create Completed folder
      const completedData = await this.makeRequest('/folders', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Completed',
          parent: {
            id: orderFolderId
          }
        })
      });
      
      const completedFolderId = completedData.id;
      console.log('Created Completed folder:', completedFolderId);
      
      // Define product types
      const productTypes: ProductType[] = [
        'Photography', 
        'Video', 
        'Drone', 
        'Floor Plans',
        'Print Material'
      ];
      
      // Create product type subfolders in Raw Input
      for (const productType of productTypes) {
        await this.makeRequest('/folders', {
          method: 'POST',
          body: JSON.stringify({
            name: productType,
            parent: {
              id: rawInputFolderId
            }
          })
        });
        console.log(`Created ${productType} subfolder in Raw Input folder`);
      }
      
      // Create product type subfolders in Completed
      for (const productType of productTypes) {
        await this.makeRequest('/folders', {
          method: 'POST',
          body: JSON.stringify({
            name: productType,
            parent: {
              id: completedFolderId
            }
          })
        });
        console.log(`Created ${productType} subfolder in Completed folder`);
      }
    } catch (error) {
      console.error('Failed to create subfolder structure:', error);
    }
  }
  
  /**
   * Get folder information by ID
   */
  async getFolderInfo(folderId: string): Promise<BoxFolder | null> {
    try {
      // Get folder info from Box API
      const data = await this.makeRequest(`/folders/${folderId}`);
      
      return {
        id: data.id,
        name: data.name,
        parentId: data.parent?.id,
        type: 'order', // Assuming this is an order folder
        path: data.path_collection?.entries?.map((e: any) => e.name).join('/') || null
      };
    } catch (error) {
      console.error('Failed to get folder info:', error);
      return null;
    }
  }
  
  /**
   * Upload a file to a specific folder
   */
  async uploadFile(folderId: string, file: File): Promise<{ id: string, name: string } | null> {
    try {
      // Create upload session for large files
      if (file.size > 50 * 1024 * 1024) {
        // Large file upload requires a more complex flow - not implemented here
        console.error('Files larger than 50MB require chunked upload which is not implemented yet');
        return null;
      }
      
      // For smaller files, we can use a simple upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('attributes', JSON.stringify({
        name: file.name,
        parent: { id: folderId }
      }));
      
      const response = await fetch('https://upload.box.com/api/2.0/files/content', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.accessToken}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Box API error: ${errorData.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Return file info
      return {
        id: data.entries[0].id,
        name: data.entries[0].name
      };
    } catch (error) {
      console.error('Failed to upload file:', error);
      return null;
    }
  }
  
  /**
   * Get the subfolder by product type
   */
  async getProductTypeFolder(
    orderFolderId: string, 
    productType: ProductType, 
    isRawInput: boolean = true
  ): Promise<string | null> {
    try {
      // First, find the Raw Input or Completed folder
      const folders = await this.getFolderItems(orderFolderId);
      const parentFolderName = isRawInput ? 'Raw Input' : 'Completed';
      
      const parentFolder = folders.entries.find((entry: any) => 
        entry.type === 'folder' && entry.name === parentFolderName
      );
      
      if (!parentFolder) {
        console.error(`${parentFolderName} folder not found in order folder`);
        return null;
      }
      
      // Then find the product type subfolder
      const subfolders = await this.getFolderItems(parentFolder.id);
      const productFolder = subfolders.entries.find((entry: any) => 
        entry.type === 'folder' && entry.name === productType
      );
      
      if (!productFolder) {
        console.error(`${productType} folder not found in ${parentFolderName} folder`);
        return null;
      }
      
      return productFolder.id;
    } catch (error) {
      console.error(`Failed to get ${productType} folder:`, error);
      return null;
    }
  }
}

/**
 * Create a Box integration instance with default credentials
 */
export const createBoxIntegration = (credentials?: Partial<BoxCredentials>): BoxIntegration => {
  const defaultCredentials: BoxCredentials = {
    clientId: '',
    clientSecret: '',
    accessToken: '',
    ...credentials
  };
  
  return new BoxIntegration(defaultCredentials);
};

/**
 * Use this hook to get a Box integration instance
 */
export const useBoxIntegration = () => {
  // Initialize the Box integration
  const boxIntegration = createBoxIntegration();
  
  return boxIntegration;
};
