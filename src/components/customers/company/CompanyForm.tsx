
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { CompanyInfoFields } from './CompanyInfoFields';
import { ContactInfoFields } from './ContactInfoFields';
import { AddressFields } from './AddressFields';
import { companyFormSchema, CompanyFormData } from './CompanyFormSchema';
import { useCompanies } from '@/hooks/use-companies';
import { toast } from 'sonner';

interface CompanyFormProps {
  onClose: () => void;
  onCompanyCreated: (company: any) => void;
}

export function CompanyForm({ onClose, onCompanyCreated }: CompanyFormProps) {
  const { addCompany } = useCompanies();
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      industry: 'real estate',
      website: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    }
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      // Use the hook function to add a new company
      const newCompany = await addCompany({
        name: data.name,
        email: data.email || '',
        phone: data.phone,
        industry: data.industry,
        website: data.website,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        status: 'active',
        total_jobs: 0,
        open_jobs: 0,
        total_revenue: 0,
        outstanding_amount: 0
      });
      
      toast.success('Company created successfully');
      onCompanyCreated(newCompany);
      onClose();
      form.reset();
    } catch (error: any) {
      console.error('Error creating company:', error);
      toast.error(`Failed to create company: ${error.message}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CompanyInfoFields form={form} />
        <ContactInfoFields form={form} />
        <AddressFields form={form} />
        
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Company</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
