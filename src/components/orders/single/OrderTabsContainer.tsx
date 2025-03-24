
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OrderTabsContainerProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
  isNewOrder?: boolean;
}

export function OrderTabsContainer({ 
  children, 
  activeTab, 
  onTabChange,
  isNewOrder = false 
}: OrderTabsContainerProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        {!isNewOrder && (
          <>
            <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </>
        )}
      </TabsList>
      {children}
    </Tabs>
  );
}
