
import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface OrderTabsContainerProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: ReactNode;
}

export function OrderTabsContainer({
  activeTab,
  onTabChange,
  children
}: OrderTabsContainerProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-4 md:max-w-3xl">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
        <TabsTrigger value="production">Production</TabsTrigger>
        <TabsTrigger value="communication">Communication</TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
}
