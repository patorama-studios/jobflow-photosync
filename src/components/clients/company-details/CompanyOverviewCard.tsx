
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Globe, MapPin } from "lucide-react";

interface CompanyOverviewCardProps {
  company: any;
}

export function CompanyOverviewCard({ company }: CompanyOverviewCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Company Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Contact</div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{company.email || 'No email provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{company.phone || 'No phone provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{company.website || 'No website provided'}</span>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Location</div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <span>
                {company.address ? (
                  <>
                    {company.address}<br />
                    {company.city && company.state ? 
                      `${company.city}, ${company.state} ${company.zip || ''}` : 
                      (company.city || company.state || 'No city/state provided')}
                  </>
                ) : (
                  'No address provided'
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Stats</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">{company.total_jobs || 0}</div>
                <div className="text-sm text-muted-foreground">Total Jobs</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{company.open_jobs || 0}</div>
                <div className="text-sm text-muted-foreground">Open Jobs</div>
              </div>
              <div>
                <div className="text-2xl font-bold">${company.total_revenue?.toFixed(2) || '0.00'}</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
              <div>
                <div className="text-2xl font-bold">${company.outstanding_amount?.toFixed(2) || '0.00'}</div>
                <div className="text-sm text-muted-foreground">Outstanding</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
