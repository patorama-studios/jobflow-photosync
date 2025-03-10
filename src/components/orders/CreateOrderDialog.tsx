
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createOrder } from '@/services/order-service';

interface CreateOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: () => void;
}

export function CreateOrderDialog({ isOpen, onClose, onOrderCreated }: CreateOrderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    clientEmail: '',
    clientPhone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    propertyType: 'Residential',
    squareFeet: 2000,
    price: 199,
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '10:00 AM',
    photographer: '',
    photographerPayoutRate: 100,
    package: 'Standard Photography Package',
    status: 'scheduled',
    customerNotes: '',
    internalNotes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Generate an order number
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      
      const orderData = {
        ...formData,
        orderNumber
      };
      
      const result = await createOrder(orderData);
      
      if (result.success) {
        toast.success('Order created successfully');
        if (onOrderCreated) {
          onOrderCreated();
        }
      } else {
        toast.error(`Failed to create order: ${result.error}`);
      }
    } catch (error: any) {
      toast.error(`Error creating order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new photography order.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client Name*</Label>
                <Input 
                  id="client" 
                  name="client" 
                  value={formData.client} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email*</Label>
                <Input 
                  id="clientEmail" 
                  name="clientEmail" 
                  type="email" 
                  value={formData.clientEmail} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Client Phone</Label>
                <Input 
                  id="clientPhone" 
                  name="clientPhone" 
                  value={formData.clientPhone} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type*</Label>
                <Select 
                  value={formData.propertyType} 
                  onValueChange={(value) => handleSelectChange('propertyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Property Address*</Label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City*</Label>
                <Input 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State*</Label>
                <Input 
                  id="state" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code*</Label>
                <Input 
                  id="zip" 
                  name="zip" 
                  value={formData.zip} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="squareFeet">Square Feet*</Label>
                <Input 
                  id="squareFeet" 
                  name="squareFeet" 
                  type="number" 
                  value={formData.squareFeet.toString()} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Scheduled Date*</Label>
                <Input 
                  id="scheduledDate" 
                  name="scheduledDate" 
                  type="date" 
                  value={formData.scheduledDate} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Scheduled Time*</Label>
                <Input 
                  id="scheduledTime" 
                  name="scheduledTime" 
                  value={formData.scheduledTime} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price*</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  value={formData.price.toString()} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="photographer">Photographer</Label>
                <Input 
                  id="photographer" 
                  name="photographer" 
                  value={formData.photographer} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="package">Package*</Label>
                <Input 
                  id="package" 
                  name="package" 
                  value={formData.package} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerNotes">Customer Notes</Label>
              <Textarea 
                id="customerNotes" 
                name="customerNotes" 
                value={formData.customerNotes} 
                onChange={handleInputChange} 
                className="min-h-[80px]" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="internalNotes">Internal Notes</Label>
              <Textarea 
                id="internalNotes" 
                name="internalNotes" 
                value={formData.internalNotes} 
                onChange={handleInputChange} 
                className="min-h-[80px]" 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
