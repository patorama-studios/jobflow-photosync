
import React from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { CompanyDetailsView } from "@/components/customers/CompanyDetailsView";

export default function CompanyDetails() {
  const { id: companyId } = useParams<{ id: string }>();
  
  if (!companyId) {
    return (
      <MainLayout>
        <div className="container py-6">
          <h1>Company ID is required</h1>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-6">
        <CompanyDetailsView companyId={companyId} />
      </div>
    </MainLayout>
  );
}
