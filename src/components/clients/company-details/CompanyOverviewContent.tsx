
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CompanyOverviewContentProps {
  company: any;
}

export function CompanyOverviewContent({ company }: CompanyOverviewContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Details</CardTitle>
        <CardDescription>
          Additional information about {company.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Status</h3>
            <p className="mt-1">
              <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                {company.status}
              </Badge>
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Created</h3>
            <p className="mt-1 text-muted-foreground">
              {new Date(company.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium">About</h3>
            <p className="mt-1 text-muted-foreground">
              {company.description || 'No company description available.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
