
import React from 'react';
import { FormSection, FormInput } from './OrderFormSection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertySectionProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: {
    propertyType: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    squareFeet: number;
    package: string;
    price: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function PropertySection({ 
  isOpen, 
  onToggle, 
  formData, 
  handleInputChange,
  handleSelectChange
}: PropertySectionProps) {
  return (
    <FormSection title="Property Information" isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="propertyType">Property Type*</label>
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
        
        <FormInput
          label="Property Address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormInput
            label="City"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
          
          <FormInput
            label="State"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
          
          <FormInput
            label="ZIP Code"
            name="zip"
            value={formData.zip}
            onChange={handleInputChange}
            required
          />
          
          <FormInput
            label="Square Feet"
            name="squareFeet"
            value={formData.squareFeet}
            onChange={handleInputChange}
            required
            type="number"
          />
        </div>
        
        <FormInput
          label="Package"
          name="package"
          value={formData.package}
          onChange={handleInputChange}
          required
        />
        
        <FormInput
          label="Price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
          type="number"
        />
      </div>
    </FormSection>
  );
}
