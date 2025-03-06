
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface IntegrationHeaderProps {
  name: string;
  icon: React.ElementType;
}

export function IntegrationHeader({ name, icon: Icon }: IntegrationHeaderProps) {
  return (
    <DialogHeader>
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-primary/10 rounded-md">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <DialogTitle>{name} Integration</DialogTitle>
      </div>
      <DialogDescription>
        Configure your connection with {name}
      </DialogDescription>
    </DialogHeader>
  );
}
