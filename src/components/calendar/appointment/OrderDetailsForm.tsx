
import React, { useState } from 'react';
import { useClients } from '@/hooks/use-clients';
import { useIsMobile } from '@/hooks/use-mobile';

// Import our new component sections
import { AddressSection } from './AddressSection';
import { CustomerSection } from './CustomerSection';
import { PhotographerSection } from './PhotographerSection';
import { OrderNotesSection } from './OrderNotesSection';
import { ProductsSection } from './ProductsSection';
import { CustomItemsSection } from './CustomItemsSection';
import { OrderFormSection } from './OrderFormSection';
import { NewCustomerDialog } from './NewCustomerDialog';
import { AddCustomItemDialog } from './AddCustomItemDialog';

interface CustomItem {
  id: string;
  name: string;
  price: number;
}

export const OrderDetailsForm: React.FC = () => {
  const { clients } = useClients();
  const isMobile = useIsMobile();

  // Address state
  const [addressDetails, setAddressDetails] = useState({
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

  // Custom items state
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0
  });

  // Product search state
  const [searchProduct, setSearchProduct] = useState('');

  // Sample products for demonstration
  const products = [
    { id: 'p1', name: 'Standard Photography Package', price: 149 },
    { id: 'p2', name: 'Premium Photography Package', price: 249 },
    { id: 'p3', name: 'Virtual Tour Package', price: 199 },
    { id: 'p4', name: 'Drone Photography', price: 299 },
    { id: 'p5', name: 'Twilight Photography', price: 179 }
  ];
  
  // Sample photographers for demonstration
  const photographers = [
    { id: 'ph1', name: 'Maria Garcia' },
    { id: 'ph2', name: 'Alex Johnson' },
    { id: 'ph3', name: 'Wei Chen' },
    { id: 'ph4', name: 'David Smith' },
    { id: 'ph5', name: 'Sophia Patel' }
  ];

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

  return (
    <div className={`${isMobile ? 'space-y-4' : 'bg-muted/20 max-h-[calc(100vh-200px)] overflow-y-auto p-6'}`}>
      <h2 className="text-xl font-semibold mb-6">Create New Order</h2>
      
      <div className="space-y-6">
        {/* Address Section */}
        <AddressSection 
          addressDetails={addressDetails}
          onAddressSelect={handleAddressSelect}
        />
        
        {/* Customer Section */}
        <CustomerSection 
          searchCustomer={searchCustomer}
          setSearchCustomer={setSearchCustomer}
          selectedCustomer={selectedCustomer}
          filteredClients={filteredClients}
          handleCustomerSelect={handleCustomerSelect}
          openNewCustomerDialog={() => setShowNewCustomerDialog(true)}
        />

        {/* Photographer Section */}
        <PhotographerSection photographers={photographers} />
        
        {/* Order Notes Section */}
        <OrderNotesSection />
        
        {/* Products Section */}
        <ProductsSection 
          searchProduct={searchProduct}
          setSearchProduct={setSearchProduct}
          filteredProducts={filteredProducts}
          handleProductSelect={handleProductSelect}
        />
        
        {/* Custom Items Section */}
        <CustomItemsSection 
          customItems={customItems}
          openAddItemDialog={() => setShowAddItemDialog(true)}
        />
        
        {/* Order Form Section */}
        <OrderFormSection />
      </div>

      {/* New Customer Dialog */}
      <NewCustomerDialog 
        open={showNewCustomerDialog}
        onOpenChange={setShowNewCustomerDialog}
        newCustomer={newCustomer}
        setNewCustomer={setNewCustomer}
        handleCreateCustomer={handleCreateCustomer}
      />

      {/* Add Custom Item Dialog */}
      <AddCustomItemDialog 
        open={showAddItemDialog}
        onOpenChange={setShowAddItemDialog}
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddCustomItem={handleAddCustomItem}
      />
    </div>
  );
};
