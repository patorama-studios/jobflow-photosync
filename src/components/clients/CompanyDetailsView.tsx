
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CompanyHeader } from "./company-details/CompanyHeader";
import { CompanyOverviewCard } from "./company-details/CompanyOverviewCard";
import { CompanyTabsContainer } from "./company-details/CompanyTabsContainer";
import { CompanyDetailsLoading } from "./company-details/CompanyDetailsLoading";

interface CompanyDetailsViewProps {
  companyId?: string;
}

export function CompanyDetailsView({ companyId }: CompanyDetailsViewProps) {
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [companyClients, setCompanyClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientsLoading, setClientsLoading] = useState(true);
  
  // Fetch company data from Supabase
  const fetchCompanyData = async () => {
    if (!companyId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .single();

      if (error) {
        console.error("Error fetching company:", error);
        toast.error("Failed to load company data");
        navigate("/customers");
        return;
      }

      if (data) {
        setCompany(data);
      } else {
        navigate("/customers");
      }
    } catch (err) {
      console.error("Error in fetchCompanyData:", err);
      toast.error("An error occurred while loading company data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients belonging to this company
  const fetchCompanyClients = async () => {
    if (!companyId) return;
    
    try {
      setClientsLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("company_id", companyId);

      if (error) {
        throw error;
      }

      setCompanyClients(data || []);
    } catch (err) {
      console.error("Error fetching company clients:", err);
    } finally {
      setClientsLoading(false);
    }
  };

  // Fetch data when companyId changes
  useEffect(() => {
    fetchCompanyData();
    fetchCompanyClients();
  }, [companyId]);

  if (loading) {
    return <CompanyDetailsLoading />;
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-40">
        <p>Company not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CompanyHeader company={company} />
      <CompanyOverviewCard company={company} />
      <CompanyTabsContainer 
        company={company}
        companyClients={companyClients}
        clientsLoading={clientsLoading}
      />
    </div>
  );
}
