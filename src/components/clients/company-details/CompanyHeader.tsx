
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

interface CompanyHeaderProps {
  company: any;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
      <div>
        <h1 className="text-3xl font-bold">{company.name}</h1>
        <p className="text-muted-foreground">{company.industry} company</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate("/customers")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Companies
        </Button>
        <Button variant="default" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Company
        </Button>
      </div>
    </div>
  );
}
