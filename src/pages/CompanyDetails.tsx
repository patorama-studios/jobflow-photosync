
import React from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { CompanyDetailsView } from "@/components/customers/CompanyDetailsView";

export default function CompanyDetails() {
  const { companyId } = useParams<{ companyId: string }>();
  
  return (
    <MainLayout>
      <div className="container py-6">
        <CompanyDetailsView />
      </div>
    </MainLayout>
  );
}
