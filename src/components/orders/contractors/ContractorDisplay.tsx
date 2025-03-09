
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, DollarSign } from "lucide-react";
import { ContractorDisplayProps } from './types';

export const ContractorDisplay: React.FC<ContractorDisplayProps> = ({ 
  contractor, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" alt={contractor.name} />
          <AvatarFallback>
            {contractor.name.split(' ').map(part => part[0]).join('').slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{contractor.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {contractor.role.replace('_', ' ')}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-lg font-semibold flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            {contractor.payoutAmount?.toFixed(2) || '0.00'}
          </p>
          <p className="text-sm text-muted-foreground">
            {contractor.payoutRate !== undefined ? 
              `${contractor.payoutRate.toFixed(1)}% of total` : 
              'Manual amount'}
          </p>
        </div>
        
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit(contractor)}
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete(contractor.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
};
