
import React from "react";
import { 
  Phone, 
  AtSign, 
  Building, 
  Calendar 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Customer } from "@/components/clients/mock-data";

interface ClientInfoCardProps {
  client: Customer;
}

export function ClientInfoCard({ client }: ClientInfoCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{client.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AtSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{client.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Building className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Company</p>
              <p className="text-sm text-muted-foreground">{client.company || "Not assigned"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Client Since</p>
              <p className="text-sm text-muted-foreground">{client.createdDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
