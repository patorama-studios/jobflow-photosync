
import { supabase } from "@/integrations/supabase/client";
import { Company, CompanyResponse } from '@/types/company-types';
import { mapCompanyResponse } from '@/utils/company-utils';
import { toast } from "sonner";

export async function fetchCompaniesFromApi() {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Convert database response to Company type
  return (data || []).map((company: CompanyResponse) => mapCompanyResponse(company));
}

export async function addCompanyToApi(newCompany: Omit<Company, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('companies')
    .insert([newCompany])
    .select();

  if (error) {
    toast.error("Failed to add company: " + (error.message || 'Unknown error'));
    throw error;
  }

  if (!data || data.length === 0) {
    const noDataError = new Error('No data returned after insert');
    toast.error("Failed to add company: No data returned");
    throw noDataError;
  }

  // Convert the response to Company type
  const addedCompany = mapCompanyResponse(data[0]);
  toast.success("Company added successfully");
  
  return addedCompany;
}

export async function updateCompanyInApi(id: string, updates: Partial<Company>) {
  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    toast.error("Failed to update company: " + (error.message || 'Unknown error'));
    throw error;
  }

  if (!data || data.length === 0) {
    const noDataError = new Error('No data returned after update');
    toast.error("Failed to update company: No data returned");
    throw noDataError;
  }

  // Convert the response to Company type
  const updatedCompany = mapCompanyResponse(data[0]);
  toast.success("Company updated successfully");
  
  return updatedCompany;
}
