
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrderMutations } from '@/hooks/use-order-mutations';
import { Order } from '@/types/orders';
import { useToast } from '@/hooks/use-toast';

interface CreateOrderFormProps {
  onComplete: () => void;
}

export function CreateOrderForm({ onComplete }: CreateOrderFormProps) {
  const { createOrder, isSubmitting } = useOrderMutations();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    order_number: `ORD-${Date.now().toString().slice(-6)}`,
    client: '',
    client_email: '',
    client_phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    property_type: 'residential',
    scheduled_date: '',
    scheduled_time: '10:00 AM',
    square_feet: 0,
    price: 149,
    package: 'standard',
    status: 'pending',
    notes: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client || !formData.client_email || !formData.address || !formData.scheduled_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Format the data for creating a new order
    const orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'> = {
      ...formData,
      square_feet: Number(formData.square_feet),
      price: Number(formData.price),
      status: formData.status as 'pending' | 'scheduled' | 'completed',
      additionalAppointments: [],
      customFields: {}
    };
    
    const result = await createOrder(orderData);
    if (result) {
      onComplete();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-3">Customer Information</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="client" className="block text-sm font-medium mb-1">Client Name*</label>
              <Input 
                id="client" 
                name="client" 
                value={formData.client} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="client_email" className="block text-sm font-medium mb-1">Client Email*</label>
              <Input 
                id="client_email" 
                name="client_email" 
                type="email" 
                value={formData.client_email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="client_phone" className="block text-sm font-medium mb-1">Client Phone</label>
              <Input 
                id="client_phone" 
                name="client_phone" 
                value={formData.client_phone} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Property Details</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">Property Address*</label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">City*</label>
                <Input 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium mb-1">State*</label>
                <Input 
                  id="state" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="zip" className="block text-sm font-medium mb-1">ZIP Code*</label>
              <Input 
                id="zip" 
                name="zip" 
                value={formData.zip} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="property_type" className="block text-sm font-medium mb-1">Property Type*</label>
              <Select 
                value={formData.property_type} 
                onValueChange={(value) => handleSelectChange('property_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="square_feet" className="block text-sm font-medium mb-1">Square Feet*</label>
              <Input 
                id="square_feet" 
                name="square_feet" 
                type="number" 
                value={formData.square_feet} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-3">Appointment Details</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="scheduled_date" className="block text-sm font-medium mb-1">Date*</label>
              <Input 
                id="scheduled_date" 
                name="scheduled_date" 
                type="date" 
                value={formData.scheduled_date} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="scheduled_time" className="block text-sm font-medium mb-1">Time*</label>
              <Select 
                value={formData.scheduled_time} 
                onValueChange={(value) => handleSelectChange('scheduled_time', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                  <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                  <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                  <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                  <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                  <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                  <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Package Details</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="package" className="block text-sm font-medium mb-1">Package*</label>
              <Select 
                value={formData.package} 
                onValueChange={(value) => handleSelectChange('package', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic ($99)</SelectItem>
                  <SelectItem value="standard">Standard ($149)</SelectItem>
                  <SelectItem value="premium">Premium ($249)</SelectItem>
                  <SelectItem value="luxury">Luxury ($349)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">Price*</label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                value={formData.price} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">Status*</label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes</label>
        <Textarea 
          id="notes" 
          name="notes" 
          rows={4} 
          value={formData.notes} 
          onChange={handleChange} 
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Order"}
        </Button>
      </div>
    </form>
  );
}
