
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Invoice, ProductOverride, PaymentMethod, BillingSummary } from "../types";
import { toast } from "sonner";

export const useBillingData = (clientId: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [productOverrides, setProductOverrides] = useState<ProductOverride[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBillingData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', clientId)
        .order('date', { ascending: false });

      if (invoicesError) throw invoicesError;
      // Ensure the status is one of the allowed values
      const typedInvoices = (invoicesData || []).map(invoice => ({
        ...invoice,
        status: invoice.status as 'Paid' | 'Pending' | 'Overdue'
      }));
      setInvoices(typedInvoices);

      // Fetch product overrides
      const { data: overridesData, error: overridesError } = await supabase
        .from('product_overrides')
        .select('*')
        .eq('client_id', clientId);

      if (overridesError) throw overridesError;
      setProductOverrides(overridesData || []);

      // Fetch payment methods
      const { data: paymentMethodsData, error: paymentMethodsError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('client_id', clientId)
        .order('is_default', { ascending: false });

      if (paymentMethodsError) throw paymentMethodsError;
      setPaymentMethods(paymentMethodsData || []);

      // Fetch billing summary
      const { data: summaryData, error: summaryError } = await supabase
        .from('billing_summary')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      if (summaryError) throw summaryError;
      setBillingSummary(summaryData || {
        client_id: clientId,
        client_name: '',
        total_billed: 0,
        last_payment_amount: 0,
        last_payment_date: null,
        outstanding_payment: 0
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch billing data');
      console.error("Error fetching billing data:", err);
      toast.error(`Failed to fetch billing data: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([{ ...invoice, client_id: clientId }])
        .select()
        .single();

      if (error) throw error;
      
      // Ensure the status is typed correctly
      const typedInvoice = {
        ...data,
        status: data.status as 'Paid' | 'Pending' | 'Overdue'
      };
      
      setInvoices(prev => [typedInvoice, ...prev]);
      toast.success("Invoice added successfully");
      fetchBillingData(); // Refresh all data to update summary
      
      return typedInvoice;
    } catch (err: any) {
      console.error("Error adding invoice:", err);
      toast.error(`Failed to add invoice: ${err.message || 'Unknown error'}`);
      throw err;
    }
  };

  const addProductOverride = async (override: Omit<ProductOverride, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('product_overrides')
        .insert([{ ...override, client_id: clientId }])
        .select()
        .single();

      if (error) throw error;
      
      setProductOverrides(prev => [...prev, data]);
      toast.success("Product override added successfully");
      
      return data;
    } catch (err: any) {
      console.error("Error adding product override:", err);
      toast.error(`Failed to add product override: ${err.message || 'Unknown error'}`);
      throw err;
    }
  };

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'created_at'>) => {
    try {
      // If this is set as default, update all existing cards to not default
      if (method.is_default) {
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('client_id', clientId);
      }

      const { data, error } = await supabase
        .from('payment_methods')
        .insert([{ ...method, client_id: clientId }])
        .select()
        .single();

      if (error) throw error;
      
      if (method.is_default) {
        setPaymentMethods(prev => [data, ...prev.map(m => ({ ...m, is_default: false }))]);
      } else {
        setPaymentMethods(prev => [...prev, data]);
      }
      
      toast.success("Payment method added successfully");
      
      return data;
    } catch (err: any) {
      console.error("Error adding payment method:", err);
      toast.error(`Failed to add payment method: ${err.message || 'Unknown error'}`);
      throw err;
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchBillingData();
    }
  }, [clientId]);

  return {
    invoices,
    productOverrides,
    paymentMethods,
    billingSummary,
    isLoading,
    error,
    refetch: fetchBillingData,
    addInvoice,
    addProductOverride,
    addPaymentMethod
  };
};
