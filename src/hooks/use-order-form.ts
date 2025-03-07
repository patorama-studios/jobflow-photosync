
import { useState } from 'react';
import { useClients } from '@/hooks/use-clients';

interface CustomItem {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

export interface AddressDetails {
  formattedAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
}

export function useOrderForm() {
  const { clients } = useClients();
  
  // Address state
  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    formattedAddress: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    lat: 0,
    lng: 0
  });

  // Customer state
  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    company: ''
  });

  // Photographer state
  const [selectedPhotographer, setSelectedPhotographer] = useState<string | undefined>(undefined);

  // Custom items state
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0
  });

  // Product search state
  const [searchProduct, setSearchProduct] = useState('');
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchCustomer.toLowerCase()))
  );

  const handleAddressSelect = (address: {
    formattedAddress: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
  }) => {
    setAddressDetails({
      formattedAddress: address.formattedAddress,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      lat: address.lat,
      lng: address.lng
    });
    
    console.log('Selected address:', address);
  };

  const handleCustomerSelect = (client: any) => {
    setSelectedCustomer(client);
    setSearchCustomer('');
  };

  const handleCreateCustomer = () => {
    // In a real app, this would create a new customer in the database
    console.log('Creating new customer:', newCustomer);
    setSelectedCustomer({
      id: `new-${Date.now()}`,
      name: newCustomer.name,
      email: newCustomer.email,
      company: newCustomer.company
    });
    setShowNewCustomerDialog(false);
    setNewCustomer({ name: '', email: '', company: '' });
  };

  const handleAddCustomItem = () => {
    if (newItem.name && newItem.price > 0) {
      setCustomItems([...customItems, { 
        id: `item-${Date.now()}`, 
        name: newItem.name, 
        price: newItem.price 
      }]);
      setNewItem({ name: '', price: 0 });
      setShowAddItemDialog(false);
    }
  };

  const handleProductSelect = (product: any) => {
    console.log('Selected product:', product);
    // In a real app, this would add the product to the order
    setSearchProduct('');
  };

  const handleAddProduct = (product: { name: string; price: number }) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: product.name,
      price: product.price
    };
    setProducts([...products, newProduct]);
    console.log('Added new product:', newProduct);
  };

  const handlePhotographerSelect = (photographerId: string) => {
    setSelectedPhotographer(photographerId);
    console.log('Selected photographer:', photographerId);
  };

  return {
    // Address
    addressDetails,
    handleAddressSelect,
    
    // Customer
    searchCustomer,
    setSearchCustomer,
    selectedCustomer,
    filteredClients,
    handleCustomerSelect,
    showNewCustomerDialog,
    setShowNewCustomerDialog,
    newCustomer,
    setNewCustomer,
    handleCreateCustomer,
    
    // Photographer
    selectedPhotographer,
    handlePhotographerSelect,
    
    // Products
    searchProduct,
    setSearchProduct,
    products,
    filteredProducts,
    handleProductSelect,
    showAddProductDialog,
    setShowAddProductDialog,
    handleAddProduct,
    
    // Custom Items
    customItems,
    showAddItemDialog,
    setShowAddItemDialog,
    newItem,
    setNewItem,
    handleAddCustomItem
  };
}
