import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, Users, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

// Import our form section components
import { DateTimeSection } from './form-sections/DateTimeSection';
import { CustomerSelectionSection } from './form-sections/CustomerSelectionSection';
import { AddressSection } from './form-sections/AddressSection';
import { ProductsSection } from './form-sections/ProductsSection';
import { TeamAssignmentSection } from './form-sections/TeamAssignmentSection';
import { ProductTeamAssignment } from './form-sections/ProductTeamAssignment';

// Import services
import { jobsService, CreateJobData, Job, JobConflict } from '@/services/api/jobs-service';
import { orderService } from '@/services/mysql/order-service';
import { Order } from '@/types/order-types';

// Form validation schema
const orderFormSchema = z.object({
  job_title: z.string().optional(),
  scheduled_date: z.string().min(1, 'Date is required'),
  scheduled_time: z.string().min(1, 'Time is required'),
  customer_type: z.enum(['company', 'team', 'client']),
  company_id: z.string().optional(),
  team_id: z.string().optional(),
  client_id: z.string().optional(),
  primary_contact_name: z.string().optional(),
  primary_contact_email: z.string().email().optional().or(z.literal('')),
  primary_contact_phone: z.string().optional(),
  property_address: z.string().min(1, 'Property address is required'),
  property_latitude: z.number().optional(),
  property_longitude: z.number().optional(),
  access_instructions: z.string().optional(),
  reference_image_url: z.string().url().optional().or(z.literal('')),
  reference_link: z.string().url().optional().or(z.literal('')),
}).refine((data) => {
  // Either company_id, team_id, or client_id must be provided based on customer_type
  if (data.customer_type === 'company') {
    return data.company_id;
  } else if (data.customer_type === 'team') {
    return data.team_id;
  } else if (data.customer_type === 'client') {
    return data.client_id;
  }
  return false;
}, {
  message: "Please select a customer, team, or client",
  path: ["customer_type"],
});

export type OrderFormData = z.infer<typeof orderFormSchema>;

interface SelectedProduct {
  product_id: string;
  product_title: string;
  base_price: number;
  duration_minutes: number;
  override_price?: number;
  override_duration_minutes?: number;
  notes?: string;
}

interface TeamAssignment {
  user_id: string;
  user_name: string;
  role: 'photographer' | 'videographer' | 'drone_operator' | 'assistant' | 'lead';
  is_primary: boolean;
  payout_rate?: number;
  estimated_hours?: number;
  notify_on_confirmation: boolean;
}

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated?: (job: Job) => void;
  editingJob?: Job | null;
  prefilledData?: Partial<OrderFormData>;
}

export function OrderForm({
  isOpen,
  onClose,
  onJobCreated,
  editingJob,
  prefilledData
}: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [teamAssignments, setTeamAssignments] = useState<TeamAssignment[]>([]);
  const [productAssignments, setProductAssignments] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<JobConflict[]>([]);
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [estimatedTotal, setEstimatedTotal] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      job_title: '',
      scheduled_date: '',
      scheduled_time: '',
      customer_type: 'company',
      company_id: '',
      team_id: '',
      client_id: '',
      primary_contact_name: '',
      primary_contact_email: '',
      primary_contact_phone: '',
      property_address: '',
      access_instructions: '',
      reference_image_url: '',
      reference_link: '',
      ...prefilledData,
    },
  });

  // Watch form values for real-time updates
  const watchedDate = form.watch('scheduled_date');
  const watchedTime = form.watch('scheduled_time');
  const watchedCustomerType = form.watch('customer_type');

  // Reset form when dialog opens/closes or editing job changes
  useEffect(() => {
    if (isOpen) {
      if (editingJob) {
        // Populate form with editing job data
        form.reset({
          job_title: editingJob.job_title || '',
          scheduled_date: editingJob.scheduled_date,
          scheduled_time: editingJob.scheduled_time,
          customer_type: editingJob.customer_type,
          company_id: editingJob.company_id || '',
          team_id: editingJob.team_id || '',
          client_id: editingJob.client_id || '',
          primary_contact_name: editingJob.primary_contact_name || '',
          primary_contact_email: editingJob.primary_contact_email || '',
          primary_contact_phone: editingJob.primary_contact_phone || '',
          property_address: editingJob.property_address,
          access_instructions: editingJob.access_instructions || '',
          reference_image_url: editingJob.reference_image_url || '',
          reference_link: editingJob.reference_link || '',
        });
        
        // Load existing products and assignments
        loadEditingJobData();
      } else {
        // Reset for new job
        form.reset({
          job_title: '',
          scheduled_date: prefilledData?.scheduled_date || '',
          scheduled_time: prefilledData?.scheduled_time || '',
          customer_type: 'company',
          company_id: '',
          team_id: '',
          primary_contact_name: '',
          primary_contact_email: '',
          primary_contact_phone: '',
          property_address: '',
          access_instructions: '',
          reference_image_url: '',
          reference_link: '',
          ...prefilledData,
        });
        setSelectedProducts([]);
        setTeamAssignments([]);
      }
    }
  }, [isOpen, editingJob, prefilledData, form]);

  // Load data for editing job
  const loadEditingJobData = async () => {
    if (!editingJob) return;
    
    try {
      // Load products
      const products = await jobsService.getJobProducts(editingJob.id);
      setSelectedProducts(products.map(p => ({
        product_id: p.product_id,
        product_title: p.product_title,
        base_price: p.base_price,
        duration_minutes: p.duration_minutes,
        override_price: p.override_price,
        override_duration_minutes: p.override_duration_minutes,
        notes: p.notes,
      })));
      
      // Load assignments
      const assignments = await jobsService.getJobAssignments(editingJob.id);
      setTeamAssignments(assignments.map(a => ({
        user_id: a.user_id,
        user_name: a.user_name || 'Unknown User',
        role: a.role,
        is_primary: a.is_primary,
        payout_rate: a.payout_rate,
        estimated_hours: a.estimated_hours,
        notify_on_confirmation: a.notify_on_confirmation,
      })));
    } catch (error) {
      console.error('Error loading editing job data:', error);
      toast.error('Failed to load job data');
    }
  };

  // Check for conflicts when date/time or assignments change
  useEffect(() => {
    if (watchedDate && watchedTime && teamAssignments.length > 0) {
      checkSchedulingConflicts();
    }
  }, [watchedDate, watchedTime, teamAssignments]);

  // Update totals when products change
  useEffect(() => {
    const total = selectedProducts.reduce((sum, product) => {
      return sum + (product.override_price || product.base_price);
    }, 0);
    const duration = selectedProducts.reduce((sum, product) => {
      return sum + (product.override_duration_minutes || product.duration_minutes);
    }, 0);
    
    setEstimatedTotal(total);
    setTotalDuration(duration);
  }, [selectedProducts]);

  const checkSchedulingConflicts = async () => {
    try {
      const userIds = teamAssignments.map(a => a.user_id);
      const conflicts = await jobsService.checkConflicts(
        watchedDate,
        watchedTime,
        userIds,
        editingJob?.id
      );
      
      setConflicts(conflicts);
      setShowConflictWarning(conflicts.length > 0);
    } catch (error) {
      console.error('Error checking conflicts:', error);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    try {
      setIsSubmitting(true);

      // Validate required selections
      if (selectedProducts.length === 0) {
        toast.error('Please select at least one product');
        return;
      }

      if (teamAssignments.length === 0) {
        toast.error('Please assign at least one team member');
        return;
      }

      // Check if there's a primary assignment
      const hasPrimary = teamAssignments.some(a => a.is_primary);
      if (!hasPrimary) {
        toast.error('Please designate a primary team member');
        return;
      }

      // Show conflict warning if there are conflicts
      if (conflicts.length > 0 && !showConflictWarning) {
        setShowConflictWarning(true);
        toast.warning('Scheduling conflicts detected. Please review before submitting.');
        return;
      }

      // Prepare job data
      const jobData: CreateJobData = {
        ...data,
        products: selectedProducts.map(p => ({
          product_id: p.product_id,
          override_price: p.override_price,
          override_duration_minutes: p.override_duration_minutes,
          notes: p.notes,
        })),
        assignments: teamAssignments.map(a => ({
          user_id: a.user_id,
          role: a.role,
          is_primary: a.is_primary,
          payout_rate: a.payout_rate,
          estimated_hours: a.estimated_hours,
          notify_on_confirmation: a.notify_on_confirmation,
        })),
      };

      let result: Job;
      if (editingJob) {
        result = await jobsService.updateJob(editingJob.id, jobData);
        toast.success('Job updated successfully!');
      } else {
        result = await jobsService.createJob(jobData, 'current-user-id'); // TODO: Get actual user ID
        
        // Also create an order in the orders system for display on Orders page
        const primaryAssignment = teamAssignments.find(a => a.is_primary);
        const photographer = primaryAssignment ? primaryAssignment.user_name : 'Unassigned';
        const totalCost = selectedProducts.reduce((sum, product) => sum + (product.override_price || product.base_price), 0);
        const totalPayoutCost = teamAssignments.reduce((sum, assignment) => sum + ((assignment.payout_rate || 0) * (assignment.estimated_hours || 0)), 0);
        
        // Debug log the form data
        console.log('🔍 OrderForm: Raw form data for date/time:', {
          scheduled_date: data.scheduled_date,
          scheduled_time: data.scheduled_time
        });

        // Create order data that matches the Order interface
        const orderData: Omit<Order, 'id' | 'orderNumber'> = {
          client: data.primary_contact_name || 'Unknown Client',
          clientEmail: data.primary_contact_email || '',
          clientPhone: data.primary_contact_phone || '',
          address: data.property_address,
          city: '', // Could be extracted from address
          state: '', // Could be extracted from address
          zip: '', // Could be extracted from address
          price: totalCost,
          propertyType: selectedProducts.length > 0 ? selectedProducts[0].product_title : 'Photography',
          squareFeet: 0, // Default value
          package: selectedProducts.map(p => p.product_title).join(', '),
          photographer: photographer,
          // Fix: Use the correct field names from the form schema (snake_case from form, map to camelCase for Order interface)
          scheduledDate: data.scheduled_date,
          scheduledTime: data.scheduled_time,
          // Also pass snake_case versions for the order service compatibility
          scheduled_date: data.scheduled_date,
          scheduled_time: data.scheduled_time,
          status: 'scheduled' as const,
          notes: data.access_instructions || '',
          drivingTimeMin: 30, // Default value
          photographerPayoutRate: primaryAssignment?.payout_rate || 0,
          internalNotes: `Created from job form. Job ID: ${result.id}`,
          customerNotes: data.access_instructions || '',
          total_payout_amount: totalPayoutCost,
          total_order_price: totalCost,
          company_id: data.company_id || undefined
        };

        console.log('🔍 OrderForm: Order data being sent to service:', {
          scheduledDate: orderData.scheduledDate,
          scheduledTime: orderData.scheduledTime,
          scheduled_date: orderData.scheduled_date,
          scheduled_time: orderData.scheduled_time
        });
        
        // Create the order
        const order = await orderService.createOrder(orderData);
        if (order) {
          console.log('Order created successfully:', order.orderNumber);
        } else {
          console.warn('Failed to create order, but job was created successfully');
        }
        
        toast.success('Order created successfully!');
      }

      // Call callback and close
      if (onJobCreated) {
        onJobCreated(result);
      }
      onClose();

    } catch (error) {
      console.error('Error submitting job:', error);
      toast.error('Failed to save job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {editingJob ? 'Edit Job' : 'Create New Job'}
          </DialogTitle>
          <DialogDescription>
            {editingJob 
              ? 'Update the job details below.' 
              : 'Fill out the details below to create a new job.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Job Overview, Property Address, Customer */}
              <div className="space-y-6">
                
                {/* Job Overview Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <h3 className="text-lg font-medium">Job Overview</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="job_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Luxury Home Photography" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DateTimeSection form={form} />
                </div>

                <Separator />

                {/* Property Address */}
                <AddressSection form={form} />

                <Separator />

                {/* Customer Selection */}
                <CustomerSelectionSection 
                  form={form} 
                  watchedCustomerType={watchedCustomerType}
                />
              </div>

              {/* Right Column: Products and Team */}
              <div className="space-y-6">
                
                {/* Products Section */}
                <ProductsSection 
                  selectedProducts={selectedProducts}
                  onProductsChange={setSelectedProducts}
                />

                <Separator />

                {/* Team Assignment */}
                <TeamAssignmentSection 
                  assignments={teamAssignments}
                  onAssignmentsChange={setTeamAssignments}
                  companyId={form.watch('company_id')}
                />

                <Separator />

                {/* Product Team Assignment */}
                <ProductTeamAssignment 
                  products={selectedProducts.map(p => ({ 
                    id: p.product_id, 
                    title: p.product_title, 
                    price: p.base_price,
                    category: 'product'
                  }))}
                  assignments={productAssignments}
                  onAssignmentsChange={setProductAssignments}
                />
              </div>
            </div>

            <Separator />

            {/* Bottom Section: Access Instructions and Job Summary */}
            <div className="space-y-6">
              
              {/* Access Instructions */}
              <FormField
                control={form.control}
                name="access_instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Gate codes, parking instructions, contact information, etc."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reference Attachments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="reference_image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reference_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/listing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Conflicts Warning */}
              {showConflictWarning && conflicts.length > 0 && (
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <h4 className="font-medium text-yellow-800">Scheduling Conflicts Detected</h4>
                  </div>
                  <div className="space-y-1 text-sm text-yellow-700">
                    {conflicts.map((conflict, index) => (
                      <p key={index}>
                        {conflict.user_name} is already assigned to another job at {conflict.conflicting_time} on {conflict.conflicting_date}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Job Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Products:</span>
                    <p className="font-medium">{selectedProducts.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Team Members:</span>
                    <p className="font-medium">{teamAssignments.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <p className="font-medium">{Math.round(totalDuration / 60 * 10) / 10}h</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Estimated Total:</span>
                    <p className="font-medium text-green-600">${estimatedTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  'Saving...'
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {editingJob ? 'Update Job' : 'Create Job'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}